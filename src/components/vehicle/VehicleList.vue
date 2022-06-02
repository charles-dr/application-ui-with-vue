<script setup>
import axios from "axios";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { utils, log } from "@/lib/utils";
import { fetchById } from "@/hooks";
import { useGlobalState } from "@/store/global";

const global = useGlobalState();
const route = useRoute();

const props = defineProps(["vendors"]);

defineEmits(["click:tab"]);

function filterVehicles(data) {
  return data.filter((v) => {
    return (
      v.vehicle?.vehicle_make?.vehicle_make_year &&
      v.vehicle?.vehicle_make?.description &&
      v.vehicle?.exterior_color?.color
    );
  });
}
</script>

<template>
  <li
    v-for="(vendor, index) in vendors"
    :key="index"
    class="relative mb-[12px] ml-[13px] mr-[13px] rounded-round border-b-[1px] border-b-transparent px-3 py-2 duration-100 odd:bg-[#ffffff] hover:bg-background_light dark:border-b-transparent dark:odd:bg-foreground_dark dark:even:bg-foreground_dark dark:hover:bg-background_dark"
    @click="$emit('click:tab', vendor)"
  >
    <!-- v-if router-links with param options -->
    <router-link
      v-if="vendor?.vin"
      :to="{ name: 'Vehicle', params: { id: vendor?.vin } }"
      active-class="text-primary dark:text-white"
      class="block"
    >
      <div>
        <h2
          class="mb-1 max-w-[250px] truncate whitespace-nowrap text-sm font-bold"
          :class="
            vendor?.vin === route.params?.id
              ? '!font-bold text-primary'
              : 'text-black dark:text-white'
          "
        >
          {{ vendor?.vin }}
        </h2>
      </div>
      <div class="__subtext mb-1 flex text-[10px]">
        <span
          v-if="
            vendor?.vehicle?.vehicle_make?.vehicle_make_year &&
            vendor?.vehicle?.vehicle_make?.description &&
            vendor?.vehicle?.exterior_color?.color
          "
        >
          {{
            `${vendor?.vehicle?.vehicle_make?.vehicle_make_year} - ${vendor?.vehicle?.vehicle_make?.description} (${vendor?.vehicle?.exterior_color?.color})`
          }}
        </span>
      </div>
    </router-link>
    <div
      id="mask"
      class="absolute inset-0 cursor-pointer rounded-round"
      :class="
        vendor?.vin == route.params?.id
          ? 'bg-accent dark:border-[0px] dark:border-primary'
          : 'bg-transparent'
      "
    ></div>
  </li>
</template>

<style scoped>
.__subtext {
  @apply flex uppercase text-black/[0.6] dark:text-white/[0.4];
}
.__subtext-icon {
  @apply opacity-50;
}
</style>
