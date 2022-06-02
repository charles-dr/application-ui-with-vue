<script setup>
import axios from "axios";
import { h, ref, toRef } from "vue";
import { useQuery } from "vue-query";
import ActionButtons from "@/components/common/ActionButtons.vue";
import dayjs from "dayjs";
import CreateVehicleInvoiceModal from "./CreateVehicleInvoiceModal.vue";

const props = defineProps(["deal"]);
const deal = toRef(props, "deal");

const { data: vehicleInvoices, isLoading: isInvoiceLoading } = useQuery(
  ["vehicle_invoices", "deal", deal],
  ({ queryKey }) =>
    axios.get("/vehicle_invoices/deal/" + deal.value?.id).then((res) => res.data)
);

const createVehicleInvoiceModal = ref(false);
const showEditForm = ref(false);
const formRow = ref(null);

const columns = [
  {
    title: "Invoice Number",
    key: "invoice_number",
    width: "120",
  },
  {
    title: "Amount Due",
    key: "amount_due",
    width: "120",
  },
  {
    title: "Amount Paid",
    key: "amount_paid",
    width: "120",
  },
  {
    title: "Due Date",
    key: "due_date",
    width: "120",
    render(row) {
      return h("span", {}, { default: () => dayjs(row.due_date).format("MM/DD/YYYY") });
    },
  },
  {
    title: "",
    key: "edit",
    width: "120",
    render(row) {
      return h(ActionButtons, {
        // onEdit: () => showViewExpense(row),
      });
    },
  },
];
</script>

<template>
  <n-card
    title="Vehicle Invoice"
    :header-style="{
      '--n-title-font-weight': 'bold',
      '--n-title-font-size': '1.5rem',
    }"
    v-bind="$attrs"
  >
    <template #header-extra>
      <n-button @click="createVehicleInvoiceModal = true">
        <n-icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
          >
            <path
              d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
              fill="currentColor"
            ></path>
          </svg>
        </n-icon>
        Add Invoice
      </n-button>
    </template>
    <n-data-table
      :columns="columns"
      :data="vehicleInvoices"
      :loading="isInvoiceLoading"
      :bordered="false"
      striped
    />
  </n-card>
  <n-modal
    preset="card"
    size="huge"
    class="max-w-screen-lg lg:max-w-[80vw]"
    v-model:show="createVehicleInvoiceModal"
  >
    <create-vehicle-invoice-modal
      :deal="deal"
      @close:drawer="createVehicleInvoiceModal = false"
    />
  </n-modal>
</template>
