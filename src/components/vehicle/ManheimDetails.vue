<script setup>
import axios from "axios";
import { h, ref, reactive, watch, computed } from "vue";
import { useRoute } from "vue-router";
import Card from "@/components/_refactor/Card.vue";
import Input from "@/components/common/Input.vue";
import { toRef } from "vue";
import { getManheimData } from "@/hooks/deals";
import { getDealIdByVin } from "@/hooks/document";

const props = defineProps({
  data: Object,
  isLoading: Boolean,
  workOrderNumber: Number,
});

const manheimDetails = computed(() => props.data?.data[0]);
</script>
<template>
  <Card class="">
    <div class="flex w-full flex-row items-center gap-[6px]">
      <img src="../../assets/manheim.svg" />
      <span class="text-[10px] font-bold">Manheim Details</span>
      <div
        class="ml-[16px] rounded-[3px] border-[1.5px] border-[#007AFF] px-[10px] py-[4px] text-[8px] font-bold"
        style="background: rgba(0, 122, 255, 0.44)"
        v-if="manheimDetails"
      >
        {{ manheimDetails?.status }}
      </div>
      <div
        class="rounded-[3px] border-[1.5px] border-[#B60000] px-[10px] py-[4px] text-[8px] font-bold"
        style="background: rgba(182, 0, 0, 0.44)"
        v-if="manheimDetails"
        type="error"
      >
        Arbitration: {{ manheimDetails?.arbitration_status }}
      </div>
      <span class="ml-[9px] text-[10px] font-bold">M.WorkOrder#{{ workOrderNumber }}</span>
    </div>
    <div class="mt-[24px] flex flex-col xl:flex-row w-full gap-[36px] justify-between">
      <div class="">
        <div class="flex gap-[3px]">
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">LANE #</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.lane_number
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">RUN #</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.run_number
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">PHYSICAL #</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.physical_lane_number
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">VIRTUAL #</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.virtual_lane_number
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">SALE YEAR #</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.sale_year
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">SALE #</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.sale_number
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">FLOOR PRICE</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.floor_price
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">BUY NOW PRICE</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.buy_now_price
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">SALE PRICE</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.sale_price
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">BIG INCREMENT</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.big_increment
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">CHANNEL</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.channel
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
        </div>

        <div class="mt-[24px] flex gap-[5px]">
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">REGISTRATION DATE</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.registration_date
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">LISTING START DATE</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.listing_start_date
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">LISTING END DATE</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.listing_end_date
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">PURCHASE DATE</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.purchase_date
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--lane">
            <div v-if="!isLoading" class="label">PAID DATE</div>
            <br />
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.paid_date
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--arbitration-reason">
            <div v-if="!isLoading" class="label">ARBITRATION REASON</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.arbitration_reason
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
        </div>

        <div class="mt-[24px] flex gap-[14px]">
          <div class="manheim-details__item manheim-details__item--announcements">
            <div v-if="!isLoading" class="label">ANNOUNCEMENTS</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.announcements
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
          <div class="manheim-details__item manheim-details__item--announcements">
            <div v-if="!isLoading" class="label">REMARKS</div>
            <div v-if="!isLoading" class="value">{{
              manheimDetails?.remarks
            }}</div>
            <n-skeleton v-if="isLoading" class="skeleton h-[14px]"></n-skeleton>
          </div>
        </div>
      </div>

      <div class="w-[400px] bg-[#00000008] dark:bg-[#ffffff08] p-[16px]">
        <div class="text-[8px] font-bold">AUCTION</div>
        <div class="mt-[10px]">
          <div class="text-[5px] font-medium">AUCTION COMPANY</div>
          <div class="text-[10px] font-bold">
            {{ manheimDetails?.auction.auction_company }}
          </div>
        </div>
        <div class="mt-[10px]">
          <div class="text-[5px] font-medium">ADDRESS1</div>
          <div class="text-[10px] font-bold">
            {{ manheimDetails?.auction.address_one }}
          </div>
        </div>
        <div class="mt-[10px]">
          <div class="text-[5px] font-medium">ADDRESS2</div>
          <div class="text-[10px] font-bold">
            {{ manheimDetails?.auction.address_two }}
          </div>
        </div>

        <div class="mt-[10px] flex gap-[20px]">
          <div>
            <div class="text-[5px] font-medium">CITY</div>
            <div class="text-[10px] font-bold">
              {{ manheimDetails?.auction.city }}
            </div>
          </div>
          <div>
            <div class="text-[5px] font-medium">STATE</div>
            <div class="text-[10px] font-bold">
              {{ manheimDetails?.auction.state }}
            </div>
          </div>
          <div>
            <div class="text-[5px] font-medium">zip</div>
            <div class="text-[10px] font-bold">
              {{ manheimDetails?.auction.zip }}
            </div>
          </div>
        </div>
        <div class="mt-[10px]">
          <div class="text-[5px] font-medium">PHONE</div>
          <div class="text-[10px] font-bold">
            {{ manheimDetails?.auction.phone }}
          </div>
        </div>
        <div class="mt-[10px]">
          <div class="text-[5px] font-medium">EMAIL</div>
          <div class="text-[10px] font-bold">
            {{ manheimDetails?.auction.email }}
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>
<style lang="scss">
.manheim-details {
  @apply w-full;
  .skeleton {
    @apply mt-[0px];
  }
  &__header {
    @apply mt-[24px] flex h-[32px] items-center justify-items-stretch pr-[24px];
  }
  &__edit-button {
    @apply flex h-full w-[32px] items-center justify-center;
    svg {
      @apply h-[16px] w-[16px];
    }
  }
  &__item {
    @apply flex-col justify-center px-[6px];
    .label {
      @apply mt-[6px] text-[5px] font-medium;
    }
    .value {
      @apply text-[12px]
    }
    flex: 1;
    &--vin {
      @apply mr-[6px] flex h-[42px] items-center rounded-round bg-[#ffffff08] text-center;
      flex: 8;
    }
    &--lane {
      @apply flex-col justify-center rounded-round bg-[#00000008] dark:bg-[#ffffff08] text-center h-[33px];
      .skeleton {
        @apply translate-y-[-12px];
      }
    }
    &--arbitration-reason {
      @apply flex-col justify-center rounded-round bg-[#00000008] dark:bg-[#ffffff08] h-[33px];
      .skeleton {
        @apply translate-y-[-12px];
      }
    }
    &--announcements {
       @apply flex-col justify-center rounded-round bg-[#00000008] dark:bg-[#ffffff08] h-[53px];
      .skeleton {
        @apply translate-y-[-12px];
      }
    }
    &--make {
      flex: 1;
    }
    &--model {
      flex: 1;
    }
    &--trim {
      border: none;
    }
    &--miles {
      border: none;
    }
  }
}
</style>
