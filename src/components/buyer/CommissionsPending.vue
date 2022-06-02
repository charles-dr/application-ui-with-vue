<script setup>
import { useReactiveRouteParams } from "@/hooks";
import axios from "axios";
import { toRef } from "vue";
import { useQuery } from "vue-query";

const props = defineProps(["buyer_id"]);
const buyer_id = toRef(props, "buyer_id");

const { data: commissionPendingData, isLoading } = useQuery(
  ["commission", "pending/buyer", buyer_id],
  ({ queryKey }) =>
    axios
      .get("/commission/pending/buyer/" + queryKey[2])
      .then((res) => (Array.isArray(res.data) ? res.data : []))
);

const columns = [
  {
    title: "VIN",
    key: "vin",
    width: "200",
  },
  {
    title: "Date Sold",
    key: "date_sold",
    width: "120",
  },
  {
    title: "Payment Date",
    key: "payment_date",
    width: "140",
  },
  {
    title: "Amount",
    key: "amount",
    width: "140",
    //fixed: 'left'
  },
  {
    title: "Status",
    key: "payment_status_name",
    width: "140",
  },
];
</script>

<template>
  <div id="commissions-pending">
    <n-card
      class="font-sans"
      title="Commissions Pending"
      :header-style="{
        '--n-title-font-weight': 'bold',
        '--n-title-font-size': '1.5rem',
      }"
    >
      <n-data-table
        class="rounded-round"
        striped
        :columns="columns"
        :data="commissionPendingData"
        :bordered="false"
        :loading="isLoading"
        :max-height="800"
      />
    </n-card>
  </div>
</template>
n-card
