<script setup>
import { computed, h, ref, toRef, watch } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "vue-query";
import axios from "axios";

const props = defineProps(["buyer_id"]);
const buyer_id = toRef(props, "buyer_id");

const { data: vehicleData, isLoading: vehicleDataLoading } = useQuery(
  ["vehicle", "sold/buyer", buyer_id],
  ({ queryKey }) => axios.get("/deals/sold/buyer/" + queryKey[2]).then((res) => res.data)
);

const columns = [
  {
    title: "Vin",
    key: "vin",
    width: "200",
  },
  {
    title: "Year",
    key: "year",
    width: "140",
  },
  {
    title: "Make",
    key: "make",
    width: "140",
  },
  {
    title: "Model",
    key: "model",
    width: "140",
  },
];
</script>

<template>
  <div id="vehicles-sold">
    <n-card
      class="font-sans"
      title="Vehicles Sold"
      :header-style="{
        '--n-title-font-weight': 'bold',
        '--n-title-font-size': '1.5rem',
      }"
    >
      <n-data-table
        class="rounded-round"
        striped
        :columns="columns"
        :data="vehicleData?.data"
        :bordered="false"
        :loading="vehicleDataLoading"
        :max-height="800"
      />
    </n-card>
  </div>
</template>
n-card
