<script setup>
import { computed, toRef } from "vue";
const props = defineProps(["row"]);
const autocheck = computed(() => props.row["deal.autocheck"]);
const carfax = computed(() => props.row["deal.carfax"]);
</script>
<template>
  <div class="flex items-center justify-center gap-x-1">
    <n-tooltip trigger="hover">
      <template #trigger>
        <span v-if="autocheck === 'good'">
          <svg
            class="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="8" fill="#4EB233" />
            <circle
              cx="8"
              cy="8"
              r="7.5"
              stroke="white"
              stroke-opacity="0.38"
            />
          </svg>
        </span>
        <span v-else-if="autocheck === 'bad'">
          <svg
            class="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="8" fill="#CA0909" />
            <circle
              cx="8"
              cy="8"
              r="7.5"
              stroke="white"
              stroke-opacity="0.38"
            />
          </svg>
        </span>
        <span v-else-if="autocheck === 'caution'">
          <svg
            class="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="8" fill="#CAC209" />
            <circle
              cx="8"
              cy="8"
              r="7.5"
              stroke="white"
              stroke-opacity="0.38"
            />
          </svg>
        </span>
        <span v-else>
          <svg
            class="h-4 w-4 text-black dark:text-white"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="7.5"
              stroke="currentColor"
              stroke-opacity="0.38"
            />
          </svg>
        </span>
      </template>
      Auto Check
    </n-tooltip>
    <n-tooltip trigger="hover">
      <template #trigger>
        <span v-if="carfax === 'good'">
          <svg
            class="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="8" fill="#4EB233" />
            <circle
              cx="8"
              cy="8"
              r="7.5"
              stroke="white"
              stroke-opacity="0.38"
            />
          </svg>
        </span>
        <span v-else-if="carfax === 'bad'">
          <svg
            class="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="8" fill="#CA0909" />
            <circle
              cx="8"
              cy="8"
              r="7.5"
              stroke="white"
              stroke-opacity="0.38"
            />
          </svg>
        </span>
        <span v-else-if="carfax === 'caution'">
          <svg
            class="h-4 w-4"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="8" cy="8" r="8" fill="#CAC209" />
            <circle
              cx="8"
              cy="8"
              r="7.5"
              stroke="white"
              stroke-opacity="0.38"
            />
          </svg>
        </span>
        <span v-else>
          <svg
            class="h-4 w-4 text-black dark:text-white"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              r="7.5"
              stroke="currentColor"
              stroke-opacity="0.38"
            />
          </svg>
        </span>
      </template>
      Carfax
    </n-tooltip>
  </div>
</template>
