<script setup>
import useAuth from "@/store/auth";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { useDark, useToggle } from "@vueuse/core";
import { watchEffect } from "vue";
import { useGlobalState } from "@/store/global";
import { useRouter } from "vue-router";

const auth = useAuth();
const global = useGlobalState();
const isDark = useDark();
const toggleDark = useToggle(isDark);
const router = useRouter();

watchEffect(() => {
  global.setDark(true); //isDark.value);
});

const logout = () => {
  auth.logout().then(() => {
    router.replace("/login");
  });
};
</script>
<template>
  <Menu as="div" class="relative inline-block rounded-full p-3 text-left">
    <div>
      <MenuButton
        class="inline-flex w-full justify-center rounded-full text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-black"
      >
        <n-avatar
          round
          size="large"
          :src="`https://ui-avatars.com/api/?name=${auth.user?.first_name}+${auth.user?.last_name}&rounded=true`"
        />
      </MenuButton>
    </div>

    <transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <MenuItems
        class="absolute right-0 bottom-4 mt-2 w-56 translate-x-full divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-slate-800 dark:bg-foreground_dark"
      >
        <div class="px-4 py-3">
          <p class="font-bold">{{ auth.user?.first_name }} {{ auth.user?.last_name }}</p>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <a
              href="https://myapi.somewhere.com/"
              :class="[
                active ? 'bg-primary text-white ' : 'text-gray-700 dark:text-white',
                'flex items-center gap-x-1 rounded px-4 py-2 text-sm',
              ]"
            >
              <span> Switch to CRM </span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-3 w-7"
                  viewBox="0 0 13 9"
                  fill="none"
                >
                  <path
                    d="M4.4893 5.45587H0.39624V6.62532H4.4893V8.37949L6.8282 6.04059L4.4893 3.7017V5.45587ZM7.99764 4.87115V3.11698H12.0907V1.94753H7.99764V0.193359L5.65875 2.53225L7.99764 4.87115Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
            </a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <button
              :class="[
                active ? 'bg-primary text-white ' : 'text-gray-700 dark:text-white',
                'block w-full rounded px-4 py-2 text-left text-sm',
              ]"
              @click="toggleDark()"
            >
              Switch to {{ isDark ? "Light" : "Dark" }} Mode
            </button>
          </MenuItem>
        </div>
        <div class="py-1">
          <MenuItem v-slot="{ active }">
            <button
              @click="logout"
              :class="[
                active ? 'bg-primary text-white ' : 'text-gray-700 dark:text-white',
                'block w-full rounded px-4 py-2 text-left text-sm',
              ]"
            >
              Sign out
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </transition>
  </Menu>
</template>
