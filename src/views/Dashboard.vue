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
      <div class="stats">
        <div class="stats__item">
          <h4 class="stats__item-title mb-6">Accounts</h4>
          <span class="stats__item-number mr-2">4</span><span class="text-sm">Active accounts</span>
        </div>
        <div class="stats__item">
          <h4 class="stats__item-title mb-6">Tweets</h4>
          <span class="stats__item-number">19</span>
        </div>
        <div class="stats__item">
          <div class="flex items-center justify-between mb-6">
            <h4 class="stats__item-title">Monitored Acccounts</h4>
            <button class="bg-background_dark px-4 py-1 rounded-sm text-xs">Edit</button>
          </div>
          <span class="stats__item-number">11</span>
        </div>
      </div>      
    </div>
  </div>
</template>
<style lang="scss" scoped>
.stats {
  @apply flex items-center gap-[1rem] mt-8;
  &__item {
    @apply bg-gray-800 p-4 rounded-md flex-1;
    &-title {
      @apply font-bold;
    }
    &-number {
      @apply text-cyan-400 text-2xl;
    }
  }
}
</style>