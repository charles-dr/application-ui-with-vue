<script setup>
import { useQuery } from "vue-query";
import axios from "axios";
import { fetchById, useReactiveRouteParams } from "@/hooks";
import ActionButtons from "./ActionButtons.vue";
import { computed, h, ref, toRef } from "vue";
import dayjs from "dayjs";
import SingleManheimInvoice from "@/components/vehicle/manheim-invoice/SingleManheimInvoice.vue";

const props = defineProps(["deal_id"]);
const deal_id = toRef(props, "deal_id");

const pageInfo = ref({ page: 1, per_page: 50 });
const currentManheimInvoice = ref(null);
const singleManheimModel = ref(false);
const { data: manheimInvoices, isFetching: manheimInvoiceFetching } = useQuery(
  ["manheim", "invoices", pageInfo, deal_id],
  ({ queryKey }) =>
    axios
      .get(
        "/manheim_invoices/deal/" + deal_id.value + "?per_page=50&page" + queryKey[2].page
      )
      .then((res) => res.data)
);
const pagination = computed(() => ({
  pageSize: pageInfo.value.per_page,
  page: pageInfo.value.page,
  itemCount: manheimInvoices.value?.total ?? 0,
  pageCount: manheimInvoices.value?.last_page ?? 1,
  prefix({ itemCount }) {
    return `Total is ${itemCount}`;
  },
}));
const columns = [
  {
    key: "salePriceAmount",
    title: "Sale Price",
    width: "100",
  },
  {
    title: "Net",
    key: "totalNetAmount",
    width: "90",
  },
  {
    title: "Fee",
    key: "totalFeeAmount",
    width: "90",
  },
  {
    title: "Invoice Date",
    key: "invoiceDate",
    width: "120",
    render(row) {
      return h(
        "span",
        {},
        { default: () => dayjs(row.invoiceDate).format("MM/DD/YYYY") }
      );
    },
  },
  {
    title: "Total Paid",
    key: "totalPaidAmount",
    width: "90",
  },
  {
    title: "",
    key: "action",
    width: "60",
    render(row) {
      return h(ActionButtons, {
        onView: () => {
          currentManheimInvoice.value = row;
          singleManheimModel.value = true;
        },
      });
    },
  },
];
</script>
<template>
  <n-card
    :header-style="{
      '--n-title-font-weight': 'bold',
      '--n-title-font-size': '1.5rem',
    }"
    title="Manheim Invoice"
  >
    <n-data-table
      :columns="columns"
      :pagination="pagination"
      :data="manheimInvoices?.data"
      :loading="manheimInvoiceFetching"
      row-class-name="group"
      striped
      :bordered="false"
    />
  </n-card>
  <n-modal
    preset="card"
    title="Manheim Invoice"
    size="huge"
    class="max-w-screen-lg print:shadow-none lg:max-w-[80vw]"
    v-model:show="singleManheimModel"
  >
    <SingleManheimInvoice :current-manheim="currentManheimInvoice" />
  </n-modal>
</template>
