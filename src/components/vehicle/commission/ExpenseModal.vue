<script setup>
import { useDebounce } from "@vueuse/core";
import axios from "axios";
import { computed, ref, toRaw, toRef, unref } from "vue";
import { useQuery } from "vue-query";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { useMessage } from "naive-ui";

const props = defineProps(["expense", "buyer_id"]);
const emits = defineEmits(["save:expense"]);
const buyer_id = toRef(props, "buyer_id");
const message = useMessage();

const initialForm = {
  invoice_number: "",
  description: "",
  amount: 0,
  adjusted_amount: 0,
  reason: "",
  expense_date: null,
  deal_id: null,
};

const form = ref({ ...initialForm, ...props.expense });
const formRef = ref(null);
const searchDeal = ref("");
const debounceSearchDeal = useDebounce(searchDeal, 500);

const { data: deals, isLoading: isDealLoading } = useQuery(
  ["deals", "by_buyer", buyer_id],
  ({ queryKey }) =>
    axios.get("/deals/by_buyer/" + queryKey[2]).then((res) => res.data.data)
);

const { data: dealSearchResults, isFetching: isDealSearchFetching } = useQuery(
  ["vehicleSearch", debounceSearchDeal],
  ({ queryKey }) => {
    if (queryKey[1] === "") {
      return null;
    } else {
      return axios.get(`/deals/search_by_vin/${queryKey[1]}`).then((res) => {
        if (res.data?.debug) {
          return [];
        }
        return res.data;
      });
    }
  },
  { refetchOnMount: false }
);

const rules = {
  expense_date: {
    required: true,
    type: "number",
    message: "Date is required",
    trigger: ["blur", "change"],
  },
  deal_id: {
    type: "number",
    required: true,
    trigger: ["blur", "change"],
    message: "Please select a VIN",
  },
  name: {
    required: true,
    message: "Name is required",
    trigger: "input",
  },
  adjusted_amount: {
    type: "number",
  },
  amount: {
    required: true,
    validator(rule, value) {
      if (value === 0) {
        return new Error("Please enter an amount");
      }
    },
    trigger: "input",
  },
  reason: {
    trigger: "input",
    validator(rule, value) {
      if (form.value?.adjusted_amount === 0) {
        return;
      } else if (value === "") {
        return new Error("Reason is required");
      }
    },
  },
};

const dealOptions = computed(() =>
  dealSearchResults.value
    ? dealSearchResults.value
        ?.filter((deal) => deal.buyer_id === parseInt(buyer_id.value))
        .map((deal) => ({
          label: deal.vin,
          value: deal.id,
        }))
    : deals.value?.map((deal) => ({ label: deal.vin, value: deal.id }))
);
const submitForm = async () => {
  try {
    await formRef.value.validate();
    const expense = unref(form.value);
    expense.deal = {
      id: expense.deal_id,
      vin: unref(dealOptions)?.find((val) => val.value === expense.deal_id).label,
    };

    emits("save:expense", toRaw(expense));
  } catch (error) {
    message.error("Something went wrong");
  }
};
</script>

<template>
  <n-form :model="form" ref="formRef" :rules="rules" @submit.prevent="submitForm">
    <div class="sm:grid sm:grid-cols-2 sm:justify-between sm:gap-x-5">
      <n-form-item label="Expense Date" path="expense_date">
        <n-date-picker v-model:value="form.expense_date" format="MM/dd/yyyy" />
      </n-form-item>
    </div>
    <div class="sm:grid sm:grid-cols-2 sm:justify-between sm:gap-x-5">
      <n-form-item label="VIN" path="deal_id">
        <n-select
          filterable
          remote
          @search="(query) => (searchDeal = query)"
          v-model:value="form.deal_id"
          :options="dealOptions"
          :loading="isDealSearchFetching || isDealLoading"
        />
      </n-form-item>
      <n-form-item label="Name" path="name">
        <n-input v-model:value="form.name" />
      </n-form-item>
    </div>
    <n-form-item label="Description">
      <n-input
        type="textarea"
        v-model:value="form.description"
        placeholder="Please enter description"
      />
    </n-form-item>
    <div class="sm:flex sm:gap-x-5">
      <n-form-item path="amount" label="Amount">
        <CurrencyInput v-model="form.amount" />
      </n-form-item>
      <n-form-item path="adjusted_amount" label="Adjusted Amount">
        <CurrencyInput v-model="form.adjusted_amount" />
      </n-form-item>
    </div>
    <n-form-item label="Reason" path="reason" required v-if="form.adjusted_amount !== 0">
      <n-input v-model:value="form.reason" type="textarea" placeholder="Reason" />
    </n-form-item>
    <span class="block h-5"></span>
    <n-space>
      <n-button attr-type="submit">Save</n-button>
    </n-space>
  </n-form>
</template>
