import { createRouter, createWebHistory } from "vue-router";
import useAuth from "@/store/auth";
//App Pages
const Dashboard = () => import("@/views/Dashboard.vue");
import Login from "@/views/Login.vue";
const Auctions = () => import("@/views/Auctions.vue");
const Auction = () => import("@/views/Auction.vue");
const AuctionHome = () => import("@/components/auction/AuctionHome.vue");
const Buyers = () => import("@/views/Buyers.vue");
const Buyer = () => import("@/views/Buyer.vue");
const Lenders = () => import("@/views/Lenders.vue");
const Lender = () => import("@/views/Lender.vue");
const LenderHome = () => import("@/components/lender/LenderHome.vue");
import Vehicles from "@/views/Vehicles.vue";
const VehiclesHome = () => import("@/views/VehiclesHome.vue");
import Vehicle from "@/views/Vehicle.vue";
const Vendors = () => import("@/views/Vendors.vue");
const Vendor = () => import("@/views/Vendor.vue");
const VendorHome = () => import("@/components/vendor/VendorHome.vue");
const Dealers = () => import("@/views/Dealers.vue");
const Dealer = () => import("@/views/Dealer.vue");
const DealerHome = () => import("@/components/dealer/DealerHome.vue");
const Lanes = () => import("@/views/Lanes.vue");
const Reports = () => import("@/views/Reports.vue");
const AfterSaleReports = () => import("@/views/AfterSaleReports.vue");
import LanesHistory from "@/views/LanesHistory.vue";
import LanesManage from "@/views/LanesManage.vue";
import Deals from "@/views/Deals.vue";
import Deal from "@/views/Deal.vue";
const OtherSystemMenus = () => import("@/views/OtherSystemMenus.vue");
const BuyerHome = () => import("@/components/buyer/BuyerHome.vue");
const NotFound = () => import("@/views/NotFound.vue");
const OAuth = () => import("@/views/OAuth.vue");
import Components from "@/views/_refactor/Components.vue";
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
    {
      path: "/login",
      name: "Login",
      component: Login,
    },
    {
      path: "/oauth",
      name: "OAuth",
      component: OAuth,
    },
    {
      path: "/auctions",
      name: "Auctions",
      component: Auctions,
      children: [
        {
          path: "",
          name: "AuctionHome",
          component: AuctionHome,
        },
        {
          path: ":id",
          name: "SingleAuction",
          component: Auction,
        },
      ],
    },
    {
      path: "/buyers",
      name: "Buyers",
      component: Buyers,
      children: [
        {
          path: "",
          name: "Buyers Overview",
          component: BuyerHome,
        },
        {
          path: ":id",
          name: "SingleBuyer",
          component: Buyer,
        },
      ],
    },
    {
      path: "/lenders",
      name: "Lenders",
      component: Lenders,
      children: [
        {
          path: "",
          name: "LenderHome",
          components: LenderHome,
        },
        {
          path: ":id",
          name: "Lender",
          component: Lender,
        },
      ],
    },
    {
      path: "/inventory",
      name: "Vehicles",
      component: Vehicles,
      children: [
        {
          path: "",
          name: "Inventory",
          component: VehiclesHome,
        },
        {
          path: ":id",
          name: "Vehicle",
          component: Vehicle,
        },
      ],
    },
    {
      path: "/vendors",
      name: "Vendors",
      component: Vendors,
      children: [
        {
          path: "/vendors",
          name: "Vendors Overview",
          component: VendorHome,
        },
        {
          path: "/vendors/:id",
          name: "Vendor",
          component: Vendor,
        },
      ],
    },
    {
      path: "/dealers",
      name: "Dealers",
      component: Dealers,
      children: [
        {
          path: "",
          name: "DealerHome",
          components: DealerHome,
        },
        {
          path: ":id",
          name: "SingleDealer",
          component: Dealer,
        },
      ],
    },
    {
      path: "/lanes",
      name: "Lanes",
      component: Lanes,
    },
    {
      path: "/lanes-history",
      name: "Lanes history",
      component: LanesHistory,
    },
    {
      path: "/lanes-manage",
      name: "Lanes Manage",
      component: LanesManage,
    },
    {
      path: "/deals",
      name: "Deals",
      component: Deals,
    },
    {
      path: "/deal",
      name: "Deal",
      component: Deal,
    },
    {
      path: "/system",
      name: "System",
      component: OtherSystemMenus,
    },
    {
      path: "/components",
      name: "Components",
      component: Components,
    },
    {
      path: "/reports",
      name: "Reports",
      component: Reports,
    },
    {
      path: "/reports/after-sale-reports",
      name: "After Sale Reports",
      component: AfterSaleReports,
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
