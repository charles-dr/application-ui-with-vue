<script setup>
import { useQuery } from "vue-query";
import axios from "axios";
import { h, ref, toRaw, toRef } from "vue";
import CreateCommissionModal from "./CreateCommissionModal.vue";
import { clone, pick } from "@/lib/helper";
import ActionButtons from "@/components/common/ActionButtons.vue";
import EditCommissionModal from "./EditCommissionModal.vue";

const props = defineProps({
  deal_id: Number,
});
const deal_id = toRef(props, "deal_id");
const showEditForm = ref(false);
const formRow = ref(null);

const showEditInvoice = (row) => {
  let obj = clone(toRaw(row));
  console.log(obj);
  formRow.value = obj;
  showEditForm.value = true;
};
const { data: commission_invoices, isFetching: isInvoiceFetching } = useQuery(
  ["commission_invoice", "deal", deal_id],
  ({ queryKey }) =>
    axios.get("/commission_invoices/deal/" + queryKey[2]).then((res) => res.data)
);

const columns = [
  {
    title: "Invoice Number",
    key: "invoice_number",
    width: "150",
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
    title: "Balance",
    key: "balance",
    width: "120",
  },
  {
    title: "Invoice Date",
    key: "invoice_date",
    width: "120",
  },
  // {
  //   title: "Status",
  //   key: "status_detail.name",
  //   width: "80",
  // },
  {
    title: "Buyer",
    key: "buyer.first_name",
    width: "130",
    render(row) {
      return h(
        "div",
        { class: "flex gap-1 flex-col" },
        {
          default: () => [
            h(
              "span",
              { class: "font-bold " },
              {
                default: () =>
                  (row?.buyer?.first_name ?? "") + " " + (row?.buyer?.last_name ?? ""),
              }
            ),
            h("span", {}, { default: () => row?.buyer?.email }),
          ],
        }
      );
    },
  },
  {
    title: "",
    key: "edit",
    width: "60",
    fixed: "right",
    render(row) {
      return h(ActionButtons, {
        onEdit: () => showEditInvoice(row),
      });
    },
  },
];
const createCommissionInvoiceModal = ref(false);
</script>
<template>
  <n-card
    :header-style="{
      '--n-title-font-weight': 'bold',
      '--n-title-font-size': '1.5rem',
    }"
    title="Commission Invoice"
  >
    <n-data-table
      :data="commission_invoices"
      :columns="columns"
      :bordered="false"
      :loading="isInvoiceFetching"
      row-class-name="group"
      striped
    />
    <template #header-extra>
      <n-button @click="createCommissionInvoiceModal = true">+ Create Invoice </n-button>
    </template>
  </n-card>
  <n-modal
    v-model:show="createCommissionInvoiceModal"
    title="Create Commission Invoice"
    preset="card"
    size="huge"
    class="max-w-screen-lg lg:max-w-[80vw]"
  >
    <create-commission-modal
      :deal_id="deal_id"
      @close:drawer="createCommissionInvoiceModal = false"
    />
  </n-modal>
  <n-modal
    preset="card"
    size="huge"
    class="max-w-screen-lg lg:max-w-[80vw]"
    v-model:show="showEditForm"
  >
    <edit-commission-modal :form-row="formRow" @close:drawer="showEditForm = false" />
  </n-modal>
</template>
