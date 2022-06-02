<script setup>
import { useDebounce } from "@vueuse/core";
import axios from "axios";
import { computed, ref, toRaw, toRef, unref } from "vue";
import { useQuery } from "vue-query";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import { useMessage } from "naive-ui";

const props = defineProps(["expense", "deal_id"]);
const emits = defineEmits(["save:expense"]);
const deal_id = toRef(props, "deal_id");
const message = useMessage();

const initialForm = {
  invoice_number: "",
  description: "",
  amount: 0,
  adjusted_amount: 0,
  reason: "",
  expense_date: null,
  deal_id,
};

const form = ref({ ...initialForm, ...props.expense });
const formRef = ref(null);

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

const submitForm = async () => {
  try {
    await formRef.value.validate();
    const expense = unref(form.value);
   
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
