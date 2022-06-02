import { createRouter, createWebHistory } from "vue-router";
import useAuth from "@/store/auth";
//App Pages
const NotFound = () => import("@/views/NotFound.vue");
const Dashboard = () => import("@/views/Dashboard.vue");
const Settings = () => import('@/views/Settings.vue');

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings,
    },
    { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
  ],
});

router.beforeEach(async (to, from, next) => {
  const loading = window["$loading"] || null;
  loading && loading.start();
  const auth = useAuth();

  if (!auth.user) {
    if (!auth.isFetched) {
      await auth.boot();
    }
  }
  if (!auth.user && to.name === "OAuth") next();
  // else if (!auth.user && to.name !== "Login") {
  //   next("/login");}
  else if (auth.user && to.name === "Login") next("/");
  else {
    next();
  }
  loading && loading.finish();
  document.title =
    window.innerWidth <= 768
      ? `${to.name} – VueNaive (Mobile)`
      : `${to.name} – VueNaive`;
});

router.afterEach(() => {
  const loading = window["$loading"] || null;
  loading && loading.finish();
});
