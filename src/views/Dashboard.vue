<script setup>
import { ref } from 'vue';
import Toggle from '@/components/_refactor/Toggle.vue';

const options = ref({
  botScanRate: {
    label: 'Bot Scan Rate',
    value: true
  },
  matchKeyword: {
    label: 'Match Keyword',
    value: false,
  },
  qrScan: {
    label: 'QR Scan',
    value: true,
  },
  blacklist: {
    label: 'Blacklist',
    value: true,
  },
});
</script>
<template>
  <div class="dashboard">
    <div class="w-full p-4 ">
      <h3>Dashboard</h3>
      <div class="flex justify-center">
        <Toggle
          v-for="(option, key, index) in options"
          :key="key"
          :class="index === 0 ? 'ml-0' : 'ml-6'"
          v-bind="option"
          @toggle="options[key].value = !options[key].value" />
      </div>
    </div>
  </div>
</template>