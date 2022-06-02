<script setup>
import { useQuery } from "vue-query";
import axios from "axios";
import { ref } from "vue";
import CreatePaymentModal from "@/components/vehicle/payments/CreatePaymentModal.vue";
const props = defineProps({
  deal_id: Number,
});
const { data: payment_invoices } = useQuery(
  ["payments", "deal", props.deal_id],
  ({ queryKey }) => axios.get("/payments/deal/" + queryKey[2]).then((res) => res.data)
);

const showCreatePaymentModal = ref(false);

const columns = [
  {
    title: "inv#",
    key: "invoice_number",
  },
];
</script>

<template>
  <n-card
    :header-style="{
      '--n-title-font-weight': 'bold',
      '--n-title-font-size': '1.5rem',
    }"
    title="Payments"
  >
    <template #header-extra>
      <n-button @click="showCreatePaymentModal = true">
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
        Add Payment
      </n-button>
    </template>
    <n-data-table striped :data="[]" :columns="columns" :bordered="false" />
  </n-card>

  <n-modal
    preset="card"
    size="huge"
    class="max-w-screen-lg lg:max-w-[80vw]"
    v-model:show="showCreatePaymentModal"
  >
    <CreatePaymentModal />
  </n-modal>
</template>
