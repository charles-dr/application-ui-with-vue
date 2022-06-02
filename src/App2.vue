<script setup>
import { onMounted, watch, watchEffect } from "vue";
import { darkTheme } from "naive-ui";
import MainMenu from "@/components/MainMenu.vue";
import TopBar from '@/components/TopBar.vue';
import CommandPalette from "@/components/global_search/CommandPalette.vue";
import { useGlobalState } from "@/store/global";
import useAuth from "./store/auth";
import { useRoute, useRouter } from "vue-router";
import InitialLoad from "./components/InitialLoad.vue";
import gsap from "gsap";

const global = useGlobalState();
const auth = useAuth();
const route = useRoute();
const router = useRouter();

/**
 * Use this for type hints under js file
 * @type import('naive-ui').GlobalThemeOverrides
 */

const themeOverrides = {
  Button: {
    textColorHover: "#027BFF",
    borderHover: "1px solid #027BFF",
    borderColorHover: "#027BFF",
    textColorGhostFocus: "#027BFF",
    borderColorPressed: "#027BFF",
    textColorPressed: "#027BFF",
    colorPrimary: "rgba(0, 122, 235, 0.44)",
    textColorPrimary: "rgba(0, 122, 255, 1)",
    textColorHoverPrimary: "#FBFBFBFF",
    textColorPressedPrimary: "#FFFFFFFF",
    textColorFocusPrimary: "#FCFCFCFF",
    textColorDisabledPrimary: "rgba(176, 168, 168, 1)",
    colorPressedPrimary: "rgba(0, 122, 255, 1)",
    colorFocusPrimary: "rgba(0, 122, 255, 1)",
    colorDisabledPrimary: "rgba(54, 145, 244, .5)",
    colorHoverPrimary: "rgba(0, 122, 255, 0.68)",
    borderPrimary: "1.5px solid rgb(0 122 255)",
    borderHoverPrimary: "1.5px solid rgb(0 122 255)",
    borderFocus: "1.5px solid rgb(0 122 255)",
    textColorFocus: "#027BFF",
    colorFocus: "#027BFF",
    rippleColor: "#027BFF",
    borderPressedPrimary: "1.5px solid rgb(0 122 255)",
    borderFocusPrimary: "1.5px solid rgb(0 122 255)",
    borderDisabledPrimary: "1.5px solid rgb(0 122 255/0.3)",
  },
  Card: {
    borderRadius: "5px",
    paddingMedium: "24px",
  },
  Input: {
    borderWarning: "1px solid #00821D",
  },
};

/**
 * Use this for type hints under js file
 * @type import('naive-ui').GlobalThemeOverrides
 */
const darkThemeOverride = {
  Button: {
    textColorHover: "#027BFF",
    borderHover: "1px solid #027BFF",
    borderColorHover: "#027BFF",
    textColorGhostFocus: "#027BFF",
    borderColorPressed: "#027BFF",
    textColorPressed: "#027BFF",
    colorPrimary: "rgba(0, 122, 235, 0.44)",
    textColorPrimary: "#FFFFFFFF",
    textColorHoverPrimary: "#FBFBFBFF",
    textColorPressedPrimary: "#FFFFFFFF",
    textColorFocusPrimary: "#FCFCFCFF",
    textColorDisabledPrimary: "rgba(176, 168, 168, 1)",
    colorPressedPrimary: "rgba(0, 122, 255, 1)",
    colorFocusPrimary: "rgba(0, 122, 255, 1)",
    colorDisabledPrimary: "rgba(54, 145, 244, .5)",
    colorHoverPrimary: "rgba(0, 122, 255, 0.68)",
    borderPrimary: "1.5px solid rgb(0 122 255)",
    borderFocus: "1.5px solid rgb(0 122 255)",
    textColorFocus: "#027BFF",
    borderPressed: "#027BFF",
    rippleColor: "#027BFF",
    textColorTextPrimary: "#027BFF",
    textColorTextFocusPrimary: "#027BFF",
    borderHoverPrimary: "1.5px solid rgb(0 122 255)",
    borderPressedPrimary: "1.5px solid rgb(0 122 255)",
    borderFocusPrimary: "1.5px solid rgb(0 122 255)",
    borderDisabledPrimary: "1.5px solid rgb(0 122 255/0.3)",
  },
  Card: {
    colorModal: "rgb(24 24 28)",

    borderRadius: "5px",
    paddingMedium: "24px",
  },
  Table: {
    tdColorModal: "rgb(24 24 28)",
  },
  DataTable: {
    tdColorModal: "rgb(24 24 28)",
  },
  Input: {
    borderWarning: "1px solid #00821D",
  },
};
const dontShowMenu = ["login", "oauth"];
onMounted(() => {
  global.setMobile(window.innerWidth <= 768);
});

watch(
  () => auth.isLoading,
  (isLoading) => {
    if (!isLoading) {
      if (auth.user && route.path === "/login") {console.log('[pass] here')
        router.replace("/");
      }
    }
  }
);
console.log('[isDark] initial', global.isDark);
global.setDark(true);
watch(
  () => global.isDark,
  (isDark) => {
    console.log('[isDark]', isDark);
  }
)

const onEnterTransition = (el, done) => {
  gsap.from(el, {
    opacity: 0,
    duration: 0.3,
    onComplete: done,
    ease: "power1",
  });
};
const onLeaveTransition = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    duration: 0.5,
    onComplete: done,
    ease: "power1",
  });
};
</script>

<template>
  <n-config-provider
    :theme="global.isDark ? darkTheme : null"
    :theme-overrides="global.isDark ? darkThemeOverride : themeOverrides"
  >
    <n-loading-bar-provider>
      <n-message-provider placement="bottom">
        <n-notification-provider>
          <n-dialog-provider>
            <section
              class="fill-screen overflow-y-auto relative overflow-hidden bg-background_light dark:!bg-background_dark"
            >
              <CommandPalette
                v-if="
                  !dontShowMenu.some((path) => $route.path.includes(path)) &&
                  !auth.isLoading
                "
              />
              <TopBar />
              <transition @enter="onEnterTransition" @leave="onLeaveTransition">
                <initial-load v-if="auth.isLoading" />
              </transition>
              <router-view />
            </section>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700;800&family=Open+Sans:wght@300;400;700&display=swap");
</style>
