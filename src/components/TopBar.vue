<script setup>
import useCommandPalletStore from "@/store/commandPallet";
import { useGlobalState } from "../store/global";
import { useRoute, useRouter } from "vue-router";

const global = useGlobalState();
const commandPallet = useCommandPalletStore();
const router = useRouter();
const route = useRoute();
</script>
<template>
  <div class="topbar flex items-center justify-between px-6 py-4 bg-background_light dark:!bg-background_dark">
    <div class="w-[100px]">
      <img class="w-[60px]" src="/images/logo.png" />
    </div>
    <div
      class="topbar__menu-wrapper flex justify-start"
      :class="'w-[calc(100vw-300px)]'"
    >
      <div class="topbar__menu-item">
        <n-button quaternary :type="route.path==='/' ? 'success' : 'tertiary'" @click="router.replace('/')">
          Dashboard
        </n-button>
      </div>
      <div class="topbar__menu-item" @click="router.replace('/settings')">
        <n-button quaternary :type="route.path==='/settings' ? 'success' : 'tertiary'">
          Settings
        </n-button>
      </div>
    </div>
    <div class="w-[200px] flex items-center">
      <img
        class="w-[30px] rounded-full border-2 border-solid border-gray-600"
        src="/images/avatar.png"
      />
      <div class="mx-2">
        <p>Bluma^R #0001</p>
        <span class="text-xs text-cyan-400">Renewal License</span>
      </div>
      <div>
        <img class="" src="/images/arrow-bottom.png" />
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.topbar {
  &__menu {
    &-wrapper {
      @apply px-4;
    }
    &-item {
      @apply px-4 py-2;
    }
  }
}
</style>