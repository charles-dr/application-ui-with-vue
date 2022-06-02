<script setup>
import { getAllLanes } from "@/hooks/lanes";
import { useMessage } from "naive-ui";
import { computed, h, watch, onMounted, ref, unref } from "vue";
import { useRoute } from "vue-router";
import { useQuery, useQueryClient } from "vue-query";
import axios from "axios";
import Filter from "@/components/lanes/Filter.vue";
import { Lights, ShowOrSelect } from "@/components/lanes/ShowOrEdit.jsx";
import ShowOrInput from "@/components/lanes/ShowOrInput.vue";
import { tableThemeOverrides } from "@/components/lanes/lanes.helper";
import LaneVhr from "@/components/lanes/LaneVhr.vue";
import { useMediaQuery, useToggle } from "@vueuse/core";
import { gsap } from "gsap";
import dayjs from "dayjs";
import { clone, objectFilter } from "@/lib/helper";
import { getAuctions } from "@/hooks/auctions";
import Input from "@/components/common/Input.vue";

const route = useRoute();
const queryClient = useQueryClient();
const isLaptop = useMediaQuery("(min-width: 768px)");
const [sideBarActive, toggleSideBar] = useToggle();
const message = useMessage();

onMounted(() => {
  if (isLaptop.value) {
    sideBarActive.value = true;
  }
});
const pageInfo = () => ({ page: 1, per_page: 50 });
const filter = ref(pageInfo());
const { data: lanes, isFetching: isLanesLoading, refetch: laneRefetch } = getAllLanes(
  filter
);

const pagination = computed(() => ({
  pageSize: filter.value.per_page,
  page: filter.value.page,
  itemCount: lanes.value?.total ?? 1,
  pageCount: lanes.value?.last_page ?? 1,
  prefix({ itemCount }) {
    return `Total is ${itemCount}`;
  },
}));
const { data: laneLookups } = useQuery(["lane_lookups"], () =>
  axios.get("/lane_lookups").then((res) => res.data)
);
const laneLookUpOptions = computed(() =>
  laneLookups.value?.map((lane) => ({
    label: `${lane.lane} | ${lane.code}`,
    value: `${lane.lane}|${lane.code}`,
  }))
);
const sortStatesRef = ref([]);
const sortKeyMapOrderRef = computed(() =>
  sortStatesRef.value.reduce((result, { columnKey, order }) => {
    result[columnKey] = order;
    return result;
  }, {})
);
const columns = [
  {
    title: "Auction Code",
    key: "auction_code",
    width: 120,
  },
  {
    title: "VHR",
    key: "yellow_light",
    width: 100,
    render(row) {
      return h(LaneVhr, { row });
    },
  },
  {
    title: "Year",
    key: "vehicle_make.vehicle_make_year",
    width: 100,
    // sorter: "default",
    // fixed: "left",
  },
  {
    title: "Make",
    key: "vehicle_make.name",
    width: 100,
  },
  {
    title: "Model",
    key: "vehicle_model.name",
    width: 100,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "Trim",
    key: "vehicle_model_trim.name",
    width: 200,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: "Mileage",
    key: "deal.mileage",
    width: 100,
  },
  {
    title: "Lane #",
    width: 100,
    key: "lane_number",
    render(row) {
      return h(ShowOrSelect, {
        value: row.lane_number,
        options: laneLookUpOptions.value,
        onUpdateValue: async (val) => {
          if (val) {
            const [lane_number, run_number] = val.split("|");

            await axios.put("/lanes/" + row.id, { lane_number, run_number });
            await queryClient.invalidateQueries(["lanes"]);
          }
        },
      });
    },
    // sortOrder: sortKeyMapOrderRef.value.lane_number || false,
    // sorter: {
    //   compare: (a, b) => a.lane_number - b.lane_number,
    //   multiple: 1,
    // },
  },
  {
    title: "Run #",
    key: "run_number",
    width: 100,
    render(row) {
      return h(ShowOrInput, {
        value: row.run_number ?? "",
        onUpdateValue: async (val) => {
          if (val && row.run_number !== val) {
            await axios.put("/lanes/" + row.id, { run_number: val });
            await queryClient.invalidateQueries(["lanes"]);
          }
        },
      });
    },
  },
  {
    title: "C. Cost",
    key: "floor_price",
    width: 100,
  },
  {
    title: "T. Price",
    key: "deal.trade_in_price",
    width: 100,
  },
  {
    title: "M. Ready",
    key: "deal.market_ready",
    width: 100,
  },
  {
    title: "M. Price",
    key: "deal.market_price",
    width: 100,
  },
  {
    title: "I. Color",
    key: "interior_color.color",
    width: 100,
  },
  {
    title: "E. Color",
    key: "exterior_color.color",
    width: 100,
  },
  {
    title: "Light",
    key: "green_light",
    width: 200,
    render(row) {
      return h(Lights, { row });
    },
  },
  // {
  //   title: "Title Status",
  //   key: "vehicle_titles.title_status",
  // },
  {
    title: "DOP", // Date of purchase
    key: "deal.date_purchased",
    width: 120,
    render(row) {
      return h(
        "span",
        {},
        row["deal.date_purchased"]
          ? dayjs(row["deal.date_purchased"]).format("MM/DD/YYYY")
          : ""
      );
    },
  },
  {
    title: "VIN",
    key: "deal.vin",
    width: 220,
  },
  {
    title: "Grade",
    key: "deal.grade",
    width: 100,
  },
  // {
  //   title: "Dealer",
  //   key: "deal.dealer.name",
  // },
  // {
  //   title: "Auction Company",
  //   key: "auction.auction_company",
  // },
  {
    title: "Car Notes",
    key: "deal.notes",
    width: 300,
    render(row) {
      return h(ShowOrInput, {
        value: row["deal.notes"] ?? "",
        inputType: "textarea",
        onUpdateValue: async (val) => {
          if (val && row["deal.notes"] !== val) {
            await axios.put("/deals/" + row["deal.id"], { notes: val });
            await queryClient.invalidateQueries(["lanes"]);
          }
        },
      });
    },
  },
  {
    title: "Announcements",
    key: "announcements",
    width: 300,
    render(row) {
      return h(ShowOrInput, {
        inputType: "textarea",
        value: row["announcements"] ?? "",
        onUpdateValue: async (val) => {
          if (val && row["announcements"] !== val) {
            await axios.put("/lanes/" + row.id, { announcements: val });
            await queryClient.invalidateQueries(["lanes"]);
          }
        },
      });
    },
  },
];
const filteredColumns = ref(columns);

const handleSortChange = (sorters) => {
  console.log({ sorters });
  sortStatesRef.value = [].concat(sorters);
};
const handlePageChange = (current_page) => {
  filter.value.page = current_page;
};
const OnFilterTrigger = (obj) => {
  if (isLanesLoading.value) queryClient.cancelQueries(["lanes"]);
  queryClient.invalidateQueries(["lanes"]);

  filter.value = {
    ...pageInfo(),
    ...obj,
  };
};

const beforeSideBarLeave = (el, done) => {
  gsap.to(el, {
    opacity: 0,
    marginLeft: -el.clientWidth,
    marginRight: 0,
    padding: 0,
    duration: 0.7,
    onComplete: done,
  });
};
const sideBarEnter = (el, done) => {
  gsap.fromTo(
    el,
    { marginLeft: -el.clientWidth, xPercent: -100, opacity: 0 },
    {
      marginLeft: 0,
      opacity: 1,
      xPercent: 0,
      duration: 0.7,
      onComplete: done,
    }
  );
};
const filterRef = ref(null);
const onClearFilter = () => {
  filterRef.value.clearFilter();
  filter.value = pageInfo();
};
const exportCSV = () => {
  const dummy = document.createElement("a");
  dummy.href =
    "https://gmtvinventory.com/api/lanes/csv?" +
    new URLSearchParams(
      objectFilter(unref(filter), (key, value) =>
        typeof value === "number" ? true : value
      )
    ).toString();
  document.body.appendChild(dummy);
  dummy.click();
  document.body.removeChild(dummy);
};
const {
  data: auctions,
  hasNextPage: hasNextAuctionPage,
  fetchNextPage: fetchNextAuctionPage,
} = getAuctions();

const selectedAuction = ref(null);
const selectAuctionModal = ref(false);

const auctionOptions = computed(() =>
  auctions.value?.pages.reduce(
    (prev, current) =>
      prev.concat(
        current?.data.map((auction) => ({
          label: auction.code,
          value: auction.code,
        })) ?? []
      ),
    []
  )
);
const isSendingToMenheim = ref(false);
const sendToMenheim = async () => {
  isSendingToMenheim.value = true;
  const msg = message.loading("Sending to  " + selectedAuction.value, {
    duration: 10000,
  });
  try {
    await axios.get("/lanes/send_csv/" + selectedAuction.value);
    msg.type = "success";
    msg.content = "Sent to Menheim";
    msg.duration = 3000;
  } catch {
    msg.type = "error";
    msg.content = "Something went wrong";
    msg.duration = 3000;
  }
  isSendingToMenheim.value = false;
  selectAuctionModal.value = false;
  selectedAuction.value = null;
};
/**
 *
 * @param {Event} e Event
 * @param {String} id
 */
const handleAuctionSelectScroll = (e, id) => {
  const currentTarget = e.currentTarget;
  if (
    currentTarget.scrollTop + currentTarget.offsetHeight >=
    currentTarget.scrollHeight
  ) {
    if (hasNextAuctionPage.value) {
      fetchNextAuctionPage.value();
    }
  }
};
const selectColumn = ref(columns.map((col) => col.key));
const showSelectColumns = ref(false);
watch(showSelectColumns, (newValue) => {
  if (newValue) {
    selectColumn.value = filteredColumns.value
      .filter((col) => col !== null)
      .map((col) => (col ? col.key : undefined));
  }
});
const columnOptions = computed(() =>
  columns.map((column) => ({
    label: column.title,
    value: column.key,
    disabled: selectColumn.value?.some((col) => col === column.key),
  }))
);
const onSubmitSelectColumn = () => {
  filteredColumns.value = selectColumn.value
    .filter((col) => col)
    .map((col) => col && columns.find((column) => column.key === col));
  showSelectColumns.value = false;
};

const onResetColumn = () => {
  selectColumn.value = columns.map((col) => col.key);
};
</script>

<template>
  <!-- Main Tabs App Content -->
  <div
    class="flex h-screen w-[calc(100vw-60px)] overflow-auto bg-background_light transition-all duration-300 dark:bg-background_dark"
  >
    <!-- Main Body Content-->

    <!-- Body Content -->
    <button
      class="absolute bottom-0 left-0 z-[41] grid h-[48px] w-[60px] place-content-center bg-dark_border dark:bg-dark_border/50"
      @click.prevent="toggleSideBar()"
    >
      <svg
        class="h-4 w-4 transition-transform duration-[350ms]"
        :class="sideBarActive ? 'rotate-0' : 'rotate-180'"
        viewBox="0 0 24 24"
      >
        <path
          d="M16.88 2.88a1.25 1.25 0 0 0-1.77 0L6.7 11.29a.996.996 0 0 0 0 1.41l8.41 8.41c.49.49 1.28.49 1.77 0s.49-1.28 0-1.77L9.54 12l7.35-7.35c.48-.49.48-1.28-.01-1.77z"
          fill="white"
        ></path>
      </svg>
    </button>
    <transition @enter="sideBarEnter" @leave="beforeSideBarLeave">
      <aside
        v-if="sideBarActive"
        class="pageItemsList relative flex h-full w-full max-w-[275px] flex-col pt-5 dark:bg-foreground_dark"
      >
        <Filter @filter="OnFilterTrigger" ref="filterRef" />
      </aside>
    </transition>
    <main
      class="h-full overflow-y-auto overflow-x-hidden overscroll-contain px-5 pt-5 transition-all duration-300"
      :class="sideBarActive ? 'w-[calc(100vw-335px)]' : 'w-[calc(100vw-60px)]'"
    >
      <div
        class="rounded-round border bg-white p-[24px] dark:border-dark_border dark:bg-foreground_dark"
      >
        <div class="mb-3 flex items-center justify-between gap-2">
          <h1 class="flex-shrink-0 flex-grow text-sm font-bold uppercase lg:text-xl">
            Lane Numberings
          </h1>
          <div class="flex flex-wrap items-center justify-end gap-y-2 gap-x-1">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button size="small" @click="laneRefetch">
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-5 w-5"
                      :class="isLanesLoading ? 'animate-spin' : ''"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path
                        d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
                      />
                    </svg>
                  </n-icon>
                </n-button>
              </template>
              Refresh
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button size="small" @click="onClearFilter">
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="21"
                      height="18"
                      viewBox="0 0 21 18"
                      fill="none"
                    >
                      <path
                        d="M13.8544 6.26063e-05H0.963544C0.726286 0.000567738 0.497468 0.0884671 0.320814 0.246921C0.144173 0.405543 0.0320293 0.623437 0.00592778 0.859346C-0.020341 1.09526 0.0412892 1.33254 0.17903 1.52583L4.91308 8.1691C5.03835 8.33631 5.10605 8.53955 5.10605 8.7485V16.2177C5.10571 16.5356 5.26215 16.8335 5.52399 17.0139C5.786 17.1944 6.1199 17.2343 6.41696 17.1204L9.08926 16.0993C9.27197 16.0294 9.42907 15.9057 9.53987 15.7444C9.65066 15.5832 9.70994 15.3921 9.7096 15.1966V8.7486C9.71061 8.53391 9.78184 8.32528 9.91234 8.15471L14.6391 1.53774C14.7813 1.34443 14.8465 1.10498 14.8218 0.866213C14.797 0.627438 14.6844 0.406517 14.5055 0.246373C14.3267 0.0862384 14.0947 -0.0016617 13.8545 2.37981e-05L13.8544 6.26063e-05ZM8.74398 7.29986C8.43146 7.7183 8.26222 8.22615 8.26122 8.74835V14.8631L6.55443 15.5173V8.75809C6.5514 8.2408 6.382 7.73817 6.07167 7.32425L1.90018 1.44873H12.9154L8.74398 7.29986Z"
                        fill="currentColor"
                      />
                      <path
                        d="M15.3751 7.75861C14.0995 7.7581 12.876 8.26443 11.9741 9.16632C11.0721 10.0684 10.5657 11.2919 10.5664 12.5674C10.5669 13.8429 11.0746 15.0659 11.9775 15.967C12.8804 16.8678 14.1044 17.3732 15.3799 17.3712C16.6555 17.3693 17.8778 16.8604 18.778 15.9567C19.6782 15.053 20.1822 13.8285 20.1788 12.5529C20.1744 11.2811 19.6666 10.0628 18.7664 9.16429C17.8662 8.26594 16.6469 7.76063 15.375 7.75861H15.3751ZM15.3751 15.9326C14.4856 15.9333 13.6322 15.581 13.0023 14.9531C12.3722 14.3252 12.0171 13.473 12.0149 12.5835C12.0125 11.6941 12.3631 10.84 12.9899 10.2089C13.6164 9.5776 14.468 9.22081 15.3574 9.21675C16.2468 9.21271 17.1016 9.56178 17.734 10.1872C18.3663 10.8128 18.7248 11.6636 18.7305 12.553C18.7356 13.4467 18.3845 14.3056 17.7549 14.9398C17.1251 15.5741 16.2687 15.9312 15.3751 15.9326V15.9326Z"
                        fill="CurrentColor"
                      />
                      <path
                        d="M13.2554 11.8409H17.4944V13.2894H13.2554V11.8409Z"
                        fill="currentColor"
                      />
                    </svg>
                  </n-icon>
                </n-button>
              </template>
              Clear Filter
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button @click="exportCSV" size="small">
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M11.0001 2.62144e-05C10.5293 2.62144e-05 10.1464 0.382857 10.1464 0.853225V9.81471L7.96711 7.1619C7.67995 6.81325 7.11687 6.75674 6.76604 7.04485C6.58921 7.18937 6.48013 7.39475 6.45796 7.62213C6.43658 7.8489 6.50447 8.07037 6.64899 8.24468L10.3423 12.7414C10.3423 12.7414 10.9823 13.2695 11.6592 12.74L15.3503 8.24608C15.4952 8.0705 15.5626 7.84904 15.5411 7.62165C15.5189 7.39426 15.409 7.18888 15.2338 7.04561C14.8839 6.75672 14.3192 6.81275 14.032 7.16188L11.8532 9.81468L11.8534 0.853199C11.8534 0.382831 11.4713 0 11.0002 0L11.0001 2.62144e-05Z"
                        fill="currentColor"
                      />
                      <path
                        d="M21.6292 13.174L16.7565 9.82995C16.6138 9.73303 16.4471 9.68137 16.2746 9.68137H15.6217C15.1516 9.68137 14.7685 10.0639 14.7685 10.5346C14.7685 11.0049 15.1515 11.3882 15.6217 11.3882H16.0094L18.395 13.0243L15.0263 13.0241C14.5558 13.0241 14.1731 13.407 14.1731 13.8771V15.8425H7.82659V13.8771C7.82659 13.407 7.44454 13.0241 6.97415 13.0241H3.56735L5.91288 11.3881H6.49859C6.9696 11.3881 7.35179 11.0048 7.35179 10.5344C7.35179 10.0639 6.96974 9.68121 6.49859 9.68121L5.64411 9.68137C5.4715 9.68137 5.30342 9.73396 5.15624 9.83478L0.365066 13.1774C-0.0288483 13.4526 0.000493272 13.8772 0.000493272 13.8772V20.8431C0.000493272 21.3133 0.383012 21.6961 0.853413 21.6961H21.1468C21.6173 21.6961 22 21.3133 22 20.8428L21.9998 13.877C21.9998 13.4356 21.6292 13.174 21.6292 13.174L21.6292 13.174ZM20.2931 19.9896H1.70649V14.7302H6.11971V16.6951C6.11971 17.1656 6.50301 17.5489 6.97387 17.5489L15.026 17.549C15.497 17.549 15.8792 17.1657 15.8792 16.6952V14.7303H20.2928L20.2931 19.9896Z"
                        fill="currentColor"
                      />
                    </svg>
                  </n-icon>
                </n-button>
              </template>
              Export CSV
            </n-tooltip>

            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button size="small" @click="selectAuctionModal = true">
                  <n-icon>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                    >
                      <path
                        d="M11 0C8.82441 0 6.69767 0.645139 4.88873 1.85383C3.07979 3.06253 1.66989 4.78049 0.83733 6.79048C0.00476611 8.80047 -0.213071 11.0122 0.211367 13.146C0.635804 15.2798 1.68345 17.2398 3.22183 18.7782C4.76021 20.3165 6.72022 21.3642 8.85401 21.7886C10.9878 22.2131 13.1995 21.9952 15.2095 21.1627C17.2195 20.3301 18.9375 18.9202 20.1462 17.1113C21.3549 15.3023 22 13.1756 22 11C21.9989 5.14732 16.6293 0 11 0ZM20.2604 11C20.2604 12.6387 19.4666 14.4497 18.7159 15.7822C18.7159 15.7175 18.6331 16.0226 18.6274 15.9591C18.2657 11.7156 17.5297 6.59206 17.1532 4.45216C17.1339 4.33876 17.346 4.71072 17.3267 4.60752C18.9846 6.26319 20.2604 8.46773 20.2604 10.9955V11ZM13.564 2.18526L13.8033 2.26917C12.3064 7.1534 11.0635 11.5058 11.0635 11.5058C11.0635 11.5058 9.74578 7.3099 8.43712 2.18526C10.1116 1.69991 11.8895 1.69991 13.564 2.18526V2.18526ZM4.50207 4.52021L4.75835 4.33876C4.3898 6.52175 3.56083 11.6056 3.19567 15.9307C2.44495 14.5994 1.82578 12.6341 1.82578 10.9955C1.82444 9.79322 2.06013 8.60251 2.51935 7.49142C2.97857 6.38034 3.65232 5.37069 4.50207 4.52021V4.52021ZM5.90031 18.6217C5.99897 17.0012 6.31536 12.6387 6.85969 7.62175C6.85969 7.62175 8.93268 14.6618 10.3003 18.6841H11.8879C13.6343 13.2125 15.1993 7.71814 15.1993 7.71814C15.7028 12.3381 15.7402 16.2233 15.857 18.0377C15.8638 18.1296 16.1859 18.5979 16.1859 18.5979C16.1859 18.5979 15.9058 18.7635 15.9103 18.8179C14.4486 19.7966 12.8893 20.1788 11 20.1788C9.18312 20.1783 7.40762 19.6362 5.90031 18.6217V18.6217Z"
                        fill="#FFC20D"
                      />
                    </svg>
                  </n-icon>
                </n-button>
              </template>
              Send to Menheim
            </n-tooltip>
            <n-button size="small" @click="showSelectColumns = true"
              >Manage Columns</n-button
            >
            <n-modal
              v-model:show="selectAuctionModal"
              preset="card"
              title="Send to Menheim"
              class="max-w-[400px]"
            >
              <Input
                type="select"
                size="small"
                label="Select Auction"
                placeholder="Select"
                :options="auctionOptions"
                v-model:value="selectedAuction"
                @scroll="handleAuctionSelectScroll"
                filterable
              />
              <template #action>
                <n-space justify="end">
                  <n-button @click="selectAuctionModal = false"> Cancel </n-button>
                  <n-button
                    @click="sendToMenheim"
                    type="primary"
                    :disabled="!selectedAuction || isSendingToMenheim"
                    :loading="isSendingToMenheim"
                  >
                    Submit
                  </n-button>
                </n-space>
              </template>
            </n-modal>
          </div>
        </div>
        <div>
          <n-config-provider :theme-overrides="tableThemeOverrides">
            <n-data-table
              remote
              ref="table"
              :columns="filteredColumns"
              :data="lanes?.data"
              :pagination="pagination"
              max-height="75vh"
              striped
              :loading="isLanesLoading"
              @update:page="handlePageChange"
              @update:sorter="handleSortChange"
            />
          </n-config-provider>
        </div>
      </div>
    </main>
  </div>
  <n-modal
    preset="card"
    title="Manage Columns"
    content-style="max-height:80vh;overflow-y: auto;"
    v-model:show="showSelectColumns"
    class="max-w-md"
  >
    <n-dynamic-input
      show-sort-button
      v-model:value="selectColumn"
      #="{ value, index }"
      :min="1"
      :max="columns.length"
    >
      <n-select v-model:value="selectColumn[index]" filterable :options="columnOptions" />
    </n-dynamic-input>
    <template #action>
      <div class="flex justify-end gap-2">
        <n-button @click="onResetColumn"> Reset </n-button>
        <n-button type="primary" @click="onSubmitSelectColumn">Save</n-button>
      </div>
    </template>
  </n-modal>
</template>
