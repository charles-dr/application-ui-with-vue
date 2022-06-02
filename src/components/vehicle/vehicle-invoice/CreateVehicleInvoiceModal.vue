<script setup>
import { getInvoiceStatus } from "@/hooks/common_query";
import dayjs from "dayjs";
import { computed, h, ref, toRaw, toRef, unref, watch } from "vue";
import { format } from "v-money3";
import { themeOverrides } from "../expense/expense.helper";
import { useMutation, useQuery, useQueryClient } from "vue-query";
import { useDebounce } from "@vueuse/core";
import axios from "axios";
import { getBuyers } from "@/hooks/buyer";
import { useMessage } from "naive-ui";
import ExpenseModal from "./ExpenseModal.vue";
import VendorExpenseAction from "@/components/vendor/invoice/VendorExpenseAction.vue";
import { clone, objectFilter, omit } from "@/lib/helper";

const props = defineProps(["deal"]);

const emits = defineEmits(["close:drawer"]);
const message = useMessage();
const queryClient = useQueryClient();

const currentExpense = ref(null);
const formRef = ref(null);
const editExpenseIndex = ref();
const showExpenseModal = ref(false);

const initialForm = {
  amount_due: 0,
  amount_paid: 0,
  balance: 0,
  status: 1,
  due_date: dayjs().add(30, "day").valueOf(),
  invoice_date: dayjs().valueOf(),
  notes: "",
  expenses: [
    // {
    // deal_id: props.deal_id,
    //   expense_date: Date.now(),
    //   deal_id: null,
    //   files: [],
    //   name: "",
    //   description: "",
    //   amount: 0,
    //   showSelect: true,
    //   expense_type_id: null,
    // },
  ],
};
const form = ref({ ...initialForm });
watch(
  () => form.value?.expenses,
  (newFormValue) => {
    if (newFormValue.length > 0) {
      form.value.amount_due = form.value.balance = newFormValue?.reduce(
        (prev, curr) => parseFloat((prev + curr.amount).toFixed(2)),
        0
      );
    } else {
      form.value.amount_due = 0;
    }
  },
  { deep: true }
);
const rules = {
  buyer_id: {
    required: true,
    message: "Please select a buyer",
  },
  amount_due: {
    type: "number",
    required: true,
    validator(rule, value) {
      if (value <= 0.01) {
        return new Error("Invoice Amount can't be less than 0.01");
      }
    },
    trigger: "change",
  },
  due_date: {
    required: true,
    type: "number",
    message: "Date is required",
    trigger: ["blur", "change"],
  },
  invoice_date: {
    required: true,
    type: "number",
    message: "Date is required",
    trigger: ["blur", "change"],
  },
};

const { data: invoice_status } = getInvoiceStatus();
const invoiceStatusOptions = computed(() =>
  invoice_status.value
    ?.filter((status) => status.name.toLowerCase() !== "paid")
    .map((status) => ({
      label: status.name,
      value: status.id,
    }))
);

const expenseColumns = [
  {
    title: "Description",
    key: "description",
    width: "200",
    render(row) {
      return h(
        "span",
        { class: "text-[8px] text-center" },
        { default: () => row.description }
      );
    },
  },
  {
    title: "DOS",
    key: "expense_date",
    render(row) {
      return h(
        "span",
        {},
        {
          default: () => dayjs(row.expense_date).format("MM/DD/YYYY"),
        }
      );
    },
  },
  {
    title: "Amount",
    key: "amount",
    width: "150",
    fixed: "right",
    render(row) {
      return form.value.amount_paid > 0
        ? h("div")
        : h(
            "span",
            {
              class:
                "font-semibold bg-gray-800/10 border-2 rounded border-gray-500 px-3 py-2",
            },
            {
              default: () => `$${row.amount}`,
            }
          );
    },
  },
  {
    key: "action",
    fixed: "right",
    width: "140",
    render(row, rowIndex) {
      return h(VendorExpenseAction, {
        onAdd: onAddExpense,
        onEdit: () => {
          currentExpense.value = toRaw(row);
          currentExpense.value.expense_date = dayjs(
            currentExpense.value.expense_date
          ).valueOf();
          showExpenseModal.value = true;
          editExpenseIndex.value = rowIndex;
        },
        onDelete: () => {
          form.value.expenses.splice(rowIndex, 1);
        },
      });
    },
  },
];
const onAddExpense = () => {
  currentExpense.value = null;
  editExpenseIndex.value = null;
  showExpenseModal.value = true;
};
const onSaveExpense = (expense) => {
  showExpenseModal.value = false;
  if (editExpenseIndex.value !== null) {
    form.value.expenses[editExpenseIndex.value] = expense;
  } else {
    form.value.expenses.push({
      ...expense,
      deal_id: props.deal.id,
    });
  }
};
const { mutateAsync: createInvoice, isLoading: isFormSubmitting } = useMutation(
  (data) => axios.post("/vehicle_invoices", data),
  {
    onSuccess() {
      queryClient.invalidateQueries(["vehicle_invoices"]);
      emits("close:drawer");
    },
  }
);
const submitInvoice = async () => {
  const convertDate = (date) => dayjs(date).format("YYYY-MM-DD");
  try {
    await formRef.value.validate();
    const modifiedForm = clone(unref(form));
    modifiedForm.due_date = convertDate(modifiedForm.due_date);
    modifiedForm.invoice_date = convertDate(modifiedForm.invoice_date);
    modifiedForm.expenses = modifiedForm.expenses.map((item) => ({
      ...item,
      expense_date: convertDate(item.date),
    }));
    await createInvoice(modifiedForm);
  } catch (error) {
    message.error("Invalid data");
  }
};
</script>
<template>
  <n-form
    :model="form"
    :rules="rules"
    size="medium"
    ref="formRef"
    :disabled="isFormSubmitting"
    v-bind="$attrs"
  >
    <n-config-provider inline-theme-disabled :theme-overrides="themeOverrides">
      <header class="flex items-center justify-between">
        <section>
          <div class="text-left">
            <n-form-item
              size="small"
              label-align="left"
              label="Invoice Date"
              path="invoice_date"
            >
              <n-date-picker
                format="MM/dd/yyyy"
                class="custom-date-picker max-w-[130px]"
                v-model:value="form.invoice_date"
                :clearable="false"
              />
            </n-form-item>
          </div>
        </section>
        <section class="flex flex-col items-end gap-y-3">
          <div>
            <n-select
              :options="invoiceStatusOptions"
              :consistent-menu-width="false"
              class="custom-select max-w-[90px]"
              v-model:value="form.status"
              filterable
            />
          </div>

          <div class="text-right">
            <n-form-item
              size="small"
              label-align="right"
              label="Due Date"
              path="due_date"
            >
              <n-date-picker
                format="MM/dd/yyyy"
                class="custom-date-picker max-w-[130px]"
                v-model:value="form.due_date"
                :clearable="false"
              />
            </n-form-item>
          </div>
        </section>
      </header>
    </n-config-provider>
    <main class="mt-4">
      <h3 class="text-sm font-bold">Expenses</h3>
      <n-data-table
        :data="form.expenses"
        :columns="expenseColumns"
        :bordered="false"
        class="pt-2"
        :max-height="500"
        row-class-name="group py-2"
        v-if="form.expenses.length > 0"
      />
      <div v-else class="mt-4">
        <n-button @click="onAddExpense" dashed type="primary" class="w-full">
          + Add Expense
        </n-button>
      </div>
      <section class="mt-5 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div class="w-full">
          <n-input
            placeholder="Notes"
            type="textarea"
            :autosize="{
              minRows: 5,
            }"
            clearable
            v-model:value="form.notes"
          />
        </div>
        <div class="w-full max-w-xs rounded bg-gray-100 p-4 dark:bg-dark_border">
          <div class="bg-foreground_light p-4 dark:bg-foreground_dark">
            <h5 class="font-medium uppercase">Inv Total</h5>
            <span class="text-lg font-bold">${{ format(form.amount_due) }}</span>
            <n-form-item class="hidden" path="amount_due">
              <n-input-number v-model:value="form.amount_due" />
            </n-form-item>
          </div>
          <div class="space-y-2 px-4 pt-5">
            <div>
              <h5 class="font-medium uppercase">Payments</h5>
              <span class="text-lg font-bold">${{ format(form.amount_paid) }}</span>
            </div>
            <div>
              <h5 class="font-medium uppercase">Balance</h5>
              <span class="text-lg font-bold"> ${{ format(form.balance) }} </span>
            </div>
          </div>
        </div>
      </section>
    </main>
    <div class="sticky bottom-2 flex gap-x-5">
      <n-button type="primary" :loading="isFormSubmitting" @click.prevent="submitInvoice">
        CREATE INVOICE
      </n-button>
    </div>
  </n-form>
  <n-modal preset="card" class="max-w-screen-md" v-model:show="showExpenseModal">
    <ExpenseModal
      :expense="currentExpense"
      :deal_id="deal_id"
      @save:expense="onSaveExpense"
    />
  </n-modal>
</template>

<style lang="scss" scoped>
.custom-date-picker {
  :deep(.n-input .n-input-wrapper) {
    --n-padding-left: 0;
    --n-padding-right: 0;
  }
  :deep(.n-input__input-el) {
    @apply font-bold;
  }
  :deep(.n-input__suffix) {
    display: none;
  }
}
.custom-select {
  :deep(.n-base-selection .n-base-selection-label) {
    --n-padding-single: 0 12px;
    background-color: rgb(2 123 255 / 0.1);
    @apply border border-primary text-center font-bold uppercase;
  }
}
.other-select {
  :deep(.n-base-selection .n-base-selection-label) {
    --n-padding-single: 0;
    background-color: transparent;
    font-weight: 700;
  }
  :deep(.n-base-selection-input__content) {
    @apply font-bold;
  }
}
.n-input {
  :deep(textarea) {
    --tw-ring-color: transparent;
  }
}
</style>
