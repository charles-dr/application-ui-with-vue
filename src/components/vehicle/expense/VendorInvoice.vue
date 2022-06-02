<script setup>
import { fetchById, useReactiveRouteParams } from "@/hooks";
import { useQuery } from "vue-query";
import axios from "axios";
import CreateVendorInvoice from "@/components/vehicle/expense/CreateVendorInvoice.vue";
import ActionButtons from "@/components/common/ActionButtons.vue";
import { ref, h } from "vue";
import { clone } from "@/lib/helper";
import EditVendorInvoice from "./EditVendorInvoice.vue";
import dayjs from "dayjs";

const { routeParamId } = useReactiveRouteParams("id");
const editInvoiceModal = ref(false);
const currentVendorInvoice = ref(null);
const { data: current_deal, isLoading: dealLoading } = fetchById("/deals", routeParamId);

const { data: vendor_invoices, isFetching: vendorInvoiceLoading } = useQuery(
  ["vendorInvoices", "deal", routeParamId],
  () =>
    axios.get("/vendor_invoices/deal/" + current_deal.value?.id).then((res) => res.data),
  {
    enabled: !dealLoading.value,
  }
);

const columns = [
  {
    title: "Invoice Number",
    key: "invoice_number",
  },
  {
    title: "Amount Due",
    key: "amount_due",
  },
  {
    title: "Amount Paid",
    key: "amount_paid",
  },
  {
    title: "Due Date",
    key: "due_date",
    render(row) {
      return h("span", {}, { default: () => dayjs(row.due_date).format("MM/DD/YYYY") });
    },
  },
  {
    title: "Vendor",
    key: "vendor[0].name",
  },
  {
    title: "",
    key: "edit",
    render(row) {
      return h(ActionButtons, {
        onEdit: () => showViewExpense(row),
      });
    },
  },
];

const showViewExpense = (row) => {
  editInvoiceModal.value = true;
  currentVendorInvoice.value = clone(row);
};
</script>
<template>
  <div>
    <n-modal
      preset="card"
      class="relative max-w-screen-lg lg:max-w-[80vw]"
      v-model:show="editInvoiceModal"
    >
      <EditVendorInvoice
        :initial-data="currentVendorInvoice"
        v-model:show="editInvoiceModal"
      />
    </n-modal>
    <n-card
      title="Vendor Invoice"
      :header-style="{
        '--n-title-font-weight': 'bold',
        '--n-title-font-size': '1.5rem',
      }"
    >
      <template #header-extra>
        <CreateVendorInvoice :deal="current_deal" />
      </template>
      <n-data-table
        :data="vendor_invoices"
        :columns="columns"
        :loading="vendorInvoiceLoading"
        striped
        :bordered="false"
      />
    </n-card>
  </div>
</template>
