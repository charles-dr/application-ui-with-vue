<script setup>
import { computed, h, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getCommissions, COMMISSION_STATUS } from "@/hooks/commission";
import { BUYER_TYPE } from "@/hooks/buyer";
import { useQuery } from "vue-query";
import axios from "axios";

const route = useRoute();

const routeParamId = ref(route.params?.id);

watch(
  () => route.params?.id,
  () => {
    if (route.params?.id) routeParamId.value = route.params?.id;
  }
);

const { data: commissionPaidData, isLoading } = useQuery(
  ["commission", "paid/buyer", routeParamId],
  ({ queryKey }) =>
    axios
      .get("/commission/paid/buyer/" + queryKey[2])
      .then((res) => (Array.isArray(res.data) ? res.data : []))
);
const columns = [
  {
    title: "First Name",
    key: "buyer_first_name",
    //fixed: 'left'
  },
  {
    title: "Buyer Last Name",
    key: "buyer_last_name",
    //fixed: 'left'
  },
  {
    title: "Amount",
    key: "commission_amount",
    //fixed: 'left'
  },
  {
    title: "Lane Number",
    key: "lane_number",
    //fixed: 'left'
  },
  {
    title: "Market Price",
    key: "market_price",
    //fixed: 'left'
  },
  {
    title: "Purchase Price",
    key: "purchase_price",
    //fixed: 'left'
  },
  {
    title: "Sale Price",
    key: "sale_price",
    //fixed: 'left'
  },
  {
    title: "Trade In Price",
    key: "trade_in_price",
    //fixed: 'left'
  },
  {
    title: "VIN",
    key: "vin",
    //fixed: 'left'
  },
  {
    title: "Status",
    key: "status_text",
    //fixed: 'left'
  },
];
</script>

<template>
  <div id="commissions-payed">
    <n-card
      class="font-sans"
      :header-style="{
        '--n-title-font-weight': 'bold',
        '--n-title-font-size': '1.5rem',
      }"
      title="Commission Paid"
    >
      <n-data-table
        class="rounded-round"
        striped
        :columns="columns"
        :data="commissionPaidData"
        :bordered="false"
        :loading="isLoading"
        :scroll-x="1500"
        :max-height="800"
      />
    </n-card>
  </div>
</template>
