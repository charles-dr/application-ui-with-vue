<script setup>
import { ref, onMounted, watch, toRef } from "vue";
import axios from "axios";
import { TabPanel } from "@headlessui/vue";
import Card from "@/components/_refactor/Card.vue";
import Documents from "@/components/vehicle/Documents.vue";
import OwnersCarousel from "@/components/vehicle/OwnersCarousel.vue";
import SellersCarousel from "@/components/vehicle/SellersCarousel.vue";
import VehicleHistoryTimeline from "@/components/vehicle/VehicleHistoryTimeline.vue";
import {
  getOwners,
  getSellers,
  getLogEvents,
  getManheimData,
} from "@/hooks/deals";
import { getDealIdByVin } from "@/hooks/document";
import { useRoute } from "vue-router";
import ExpenseTable from "@/components/vehicle/expense/ExpenseTable.vue";
import ManheimInvoice from "@/components/vehicle/manheim-invoice/ManheimInvoice.vue";
import Input from "@/components/common/Input.vue";
import VendorInvoice from "@/components/vehicle/expense/VendorInvoice.vue";
import CommissionInvoice from "@/components/vehicle/commission/CommissionInvoice.vue";
import DealPayments from "@/components/vehicle/payments/DealPayments.vue";
import VehicleInvoice from "@/components/vehicle/vehicle-invoice/VehicleInvoice.vue";
import ManheimDetails from "@/components/vehicle/ManheimDetails.vue";

const props = defineProps(["deal", "deal_id"]);
const route = useRoute();
const routeParamId = ref(route.params?.id);
const logEventsPage = ref(1);
const dealId = toRef(props, "deal_id");

const {
  data: owners,
  isLoading: isOwnersLoading,
  refetch: refetchOwners,
} = getOwners(dealId);

const {
  data: sellers,
  isLoading: isSellersLoading,
  refetch: refetchSellers,
} = getSellers(dealId);
const { data: logEventsData, isLoading: isLogEventsLoading } = getLogEvents(
  dealId,
  logEventsPage
);

const {
  data: manheimData,
  isLoading: isManheimDataLoading,
  refetch: refetchManheimData,
} = getManheimData(dealId, 1);

watch(
  () => route.params?.id,
  (val) => {
    if (route.params?.id) {
      routeParamId.value = route.params?.id;
    }
  },
  {
    immediate: true,
  }
);

const handleEditOwner = async (owner) => {
  try {
    await axios.put(`/owners/${owner.id}`, owner);
    refetchOwners.value();
  } catch (error) {
    console.log(error);
    refetchOwners.value();
  }
};

const handleAddOwner = async (owner) => {
  try {
    await axios.post(`/owners`, { ...owner, deal_id: dealId.value });
    refetchOwners.value();
  } catch (error) {
    console.log(error);
  }
};

const handleEditSeller = async (seller) => {
  try {
    await axios.put(`/sellers/${seller.id}`, seller);
    refetchSellers.value();
  } catch (error) {
    console.log(error);
    refetchSellers.value();
  }
};

const handleAddSeller = async (seller) => {
  try {
    await axios.post(`/sellers`, { ...seller, deal_id: dealId.value });
    refetchSellers.value();
  } catch (error) {
    console.log(error);
  }
};

const handleHistoryPageChange = (page) => {
  console.log(page);
  logEventsPage.value = page;
};
</script>

<template>
  <div class="Subpage__container">
    <!-- overview, funding, logistics, titling, accounting, history, documents, reports -->
    <TabPanel class="Subpage__content Subpage__content--overview">
      <div class="grid w-full grid-cols-2 gap-[24px]">
        <OwnersCarousel
          :owners="owners"
          @edit="handleEditOwner"
          @add="handleAddOwner"
        />
        <SellersCarousel
          :sellers="sellers"
          @edit="handleEditSeller"
          @add="handleAddSeller"
        />
      </div>
      <ManheimDetails class="mt-[24px]" :data="manheimData" :isLoading="isManheimDataLoading" :workOrderNumber="deal?.manheim_work_order_num" />
    </TabPanel>
    <TabPanel class="Subpage__content Subpage__content--funding">
      <Card class="h-[420px]">hello</Card>
    </TabPanel>
    <TabPanel class="Subpage__content Subpage__content--logistics">
      <Card class="h-[420px] w-full !flex-row gap-[48px] p-[48px]">
        <div class="grid w-full gap-[12px]">
          <h1>&nbsp;</h1>
          <Input label="current status" />
          <Input label="delivery type" />
          <Input label="drop off date" />
          <Input label="expected delivery date" />
          <Input label="carrier" />
        </div>
        <div class="grid w-full gap-[12px]">
          <h1>PICKUP LOCATION</h1>
          <Input label="vehicle location" />
          <Input label="address" />
          <div class="flex gap-[12px]">
            <Input class="flex-[2]" label="city" />
            <Input class="flex-[1]" label="state" />
          </div>
          <div class="flex gap-[12px]">
            <Input class="flex-[1]" label="zip" />
            <Input class="flex-[2]" label="phone" />
          </div>
          <Input label="date" />
        </div>
        <div class="h-[300px] w-[1px] bg-white/[0.1]"></div>
        <div class="grid w-full gap-[12px]">
          <h1>CURRENT LOCATION</h1>
          <Input label="vehicle location" />
          <Input label="address" />
          <div class="flex gap-[12px]">
            <Input class="flex-[2]" label="city" />
            <Input class="flex-[1]" label="state" />
          </div>
          <div class="flex gap-[12px]">
            <Input class="flex-[1]" label="zip" />
            <Input class="flex-[2]" label="phone" />
          </div>
          <Input label="date" />
        </div>
        <div class="h-[300px] w-[1px] bg-white/[0.1]"></div>
        <div class="grid w-full gap-[12px]">
          <h1>AUCTION LOCATION</h1>
          <Input label="vehicle location" />
          <Input label="address" />
          <div class="flex gap-[12px]">
            <Input class="flex-[2]" label="city" />
            <Input class="flex-[1]" label="state" />
          </div>
          <div class="flex gap-[12px]">
            <Input class="flex-[1]" label="zip" />
            <Input class="flex-[2]" label="phone" />
          </div>
          <Input label="date" />
        </div>
      </Card>
    </TabPanel>
    <TabPanel class="Subpage__content Subpage__content--titling">
      <Card class="h-[420px]">hello</Card>
    </TabPanel>
    <TabPanel class="Subpage__content Subpage__content--accounting">
      <n-space vertical :size="24">
        <ExpenseTable />
        <VendorInvoice />
        <VehicleInvoice :deal="deal" />
        <DealPayments :deal_id="deal_id" />
        <CommissionInvoice :deal_id="deal_id" />
        <ManheimInvoice :deal_id="deal_id" />
      </n-space>
    </TabPanel>
    <TabPanel class="Subpage__content Subpage__content--history">
      <VehicleHistoryTimeline
        :logEvents="logEventsData?.data"
        @onPageChange="handleHistoryPageChange"
        :currentPage="logEventsPage"
        :totalPage="logEventsData?.last_page"
      />
    </TabPanel>
    <TabPanel class="Subpage__content Subpage__content--reports">
      <Card class="h-[420px]">hello</Card>
    </TabPanel>
    <TabPanel class="Subpage__content Subpage__content--documents">
      <div id="documents" class="mt-[24px]">
        <Documents />
      </div>
    </TabPanel>
  </div>
</template>

<style lang="scss" scoped>
.Subpage {
  &__container {
    @apply w-full;
  }

  &__content {
    &--logistics {
      h1 {
        opacity: 0.3;
      }
    }
  }
}
</style>
