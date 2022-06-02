<script setup>
import {
  computed,
  onMounted,
  defineAsyncComponent,
  getCurrentInstance,
  ref,
  watch,
  watchEffect,
  nextTick,
  unref,
} from "vue";
import { TabGroup, TabList, Tab, TabPanels } from "@headlessui/vue";
import { useRouter, useRoute } from "vue-router";
import { useQuery } from "vue-query";
import { useDebounce } from "@vueuse/core";
import { fetchPaginatedData, fetchById } from "@/hooks";
import { useGlobalState } from "@/store/global";
import { useMutation, useQueryClient } from "vue-query";
import { log, utils } from "@/lib/utils";
import { useMessage } from "naive-ui";

import { api, storage } from "@/api/config";
import axios from "axios";

import Card from "@/components/_refactor/Card.vue";
import CustomInput from "@/components/common/CustomInput.vue";
import Input from "@/components/common/Input.vue";
import Readonly from "@/components/common/Readonly.vue";
import { useIntersectionObserver } from "@vueuse/core";
import VehicleSubPage from "@/views/VehicleSubPage.vue";

const instance = getCurrentInstance();

const global = useGlobalState();
const route = useRoute();
const router = useRouter();
const message = useMessage();
const queryClient = useQueryClient();

const currentActiveField = ref(null);
const routeParamId = ref(route.params?.id);

const tabs = ref([
  {
    title: "OVERVIEW",
    value: "#overview",
  },
  {
    title: "FUNDING",
    value: "#funding",
  },
  {
    title: "LOGISTICS",
    value: "#logistics",
  },
  {
    title: "TITLING",
    value: "#titling",
  },
  {
    title: "ACCOUNTING",
    value: "#accounting",
  },
  {
    title: "HISTORY",
    value: "#history",
  },
  {
    title: "REPORTS",
    value: "#reports",
  },
  {
    title: "DOCUMENTS",
    value: "#documents",
  },
]);

const { data: vendor } = fetchById("/deals", routeParamId);

const vendorTab = ref(null);

const { stop } = useIntersectionObserver(
  vendorTab,
  ([e], observerElement) => {
    e.target.toggleAttribute("stuck", e.intersectionRatio < 1);
  },
  { threshold: [1] }
);

const images = ref([]);
const loadingImages = ref(true);

const payload = ref({});

const form = ref({
  vin: null,
  lane: null,
  code: null,
  grade: null,
  year: null,
  make: null,
  model: null, // Numerical ID?
  trim: null, // Numerical ID?
  body: null, //
  ext_color: null,
  int_color: null,
  miles: null,
  notes: null,
  recon: null,
  purchase_price: null,
  market_value: null,
  profit: null,
});

watch(
  () => vendor.value,
  async (val) => {
    if (val) {
      loadingImages.value = true;

      images.value = await axios.get(`images/deal/${val.id}`).then((res) => {
        log.green("images fetched: ", res.data);
        loadingImages.value = false;
        return res.data;
      });

      log(val);

      refreshData(val);
    }
  },
  { immediate: true }
);

const hoverDots = ref(false);
const showModal = ref(false);
const modalContext = ref("");

const imagesReady = computed(() => {
  return !loadingImages.value && images.value && images.value.length > 0;
});

const { isLoading, mutateAsync } = useMutation(
  (data) => api.put(`/deals/${vendor.value.id}`, data),
  {
    onSuccess() {
      log.clear();
      log.green("Deal updated");
      log.cyan("vendor", vendor.value.id);
      message.success("Saved");
      showModal.value = false;
    },
  }
);

watch(
  () => route.params?.id,
  (val) => {
    if (route.params?.id) {
      routeParamId.value = route.params?.id;
    }
  },
  {
    immediate: true,
  }
);

function toggleListSlide() {
  listActive.value = !listActive.value;
}

async function submitValue(key) {
  await mutateAsync({
    [key]: payload.value[key],
  }).catch((err) => {
    log.red("uh oh...", err);
  });
}

function save() {
  Object.entries(payload.value).forEach((item, index) => {
    console.log(`item ${index}:`, item);
    submitValue(item[0]).then(() => {
      form.value[item[0]] = item[1];
    });
  });
}

function handleTabClick(e) {
  window.location.hash = e;
}

function handleConditionReportClick() {
  console.log("navigating to CR report...");
  if (vendor.value?.condition_report) {
    window.open(vendor.value?.condition_report, "_blank");
  } else {
    message.error("No condition report found");
  }
}

function handleNav(e) {
  global.pages.inventory.activeTab = e;
}

function hideModal() {
  showModal.value = false;
  modalContext.value = "";
  payload.value = {};
}

function refreshData(val) {
  const incomingData = {
    ...val,
    lane: val.lane_number, // Number
    year: val.vehicle?.vehicle_year, // Number
    make: val.vehicle?.vehicle_make.name, // String
    model: val.vehicle?.vehicle_model_id, // Number <fetch model name string>
    trim: val.vehicle?.vehicle_model_trim_id, // Number <fetch trim string>
    body: val.vehicle?.body, // String
    ext_color: val.vehicle?.exterior_color?.color, // String
    int_color: val.vehicle?.interior_color?.color, // String
    miles: val.mileage, // Number
    notes: val.notes, // String
    recon: val.recon_notes, // String
    market_value: val.market_price, // Number
    profit: 0, // Number
  };

  Object.entries(incomingData).forEach((kv) => {
    incomingData[kv[0]] = kv[1]?.toString();
    if (kv[1] === "") incomingData[kv[0]] = null; // setting blanks as null
  });

  form.value = incomingData;

  log(form.value);
}

const logoPath = computed(
  () =>
    `/src/assets/vehicle_logos/${utils.parseParam(
      vendor.value?.vehicle?.vehicle_make.name || ""
    )}.png`
);
</script>

<template>
  <main id="container" class="min-h-full p-[24px]">
    <Card>
      <!-- left side -->
      <div class="col-span-12 flex w-full flex-col justify-between">
        <div class="flex">
          <div class="Carousel">
            <div class="h-[200px] w-[250px] rounded-round">
              <div class="relative">
                <div class="Carousel__logo">
                  <img :src="logoPath" alt="Logo" />
                </div>
              </div>

              <n-image-group>
                <n-carousel class="rounded-round" show-arrow>
                  <div
                    v-if="!imagesReady"
                    class="Carousel__fallback-image"
                    :class="loadingImages && 'loading-spinner'"
                    rel="No images available"
                  >
                    <p>No images available</p>
                  </div>
                  <n-image
                    v-show="imagesReady"
                    v-for="(image, index) in images"
                    :key="index"
                    class="Carousel__image"
                    object-fit="cover"
                    :src="image?.storage"
                  />
                  <template #arrow="{ prev, next }">
                    <div
                      v-show="imagesReady"
                      class="Carousel__custom-arrow"
                      :style="hoverDots && 'transform: translateY(-12px)'"
                    >
                      <button
                        type="button"
                        class="Carousel__custom-arrow--left"
                        @click="prev"
                      >
                        <n-icon>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </n-icon>
                      </button>
                      <button
                        type="button"
                        class="Carousel__custom-arrow--right"
                        @click="next"
                      >
                        <n-icon>
                          <svg
                            class="rotate-180"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 24 24"
                          >
                            <path
                              d="M20 11H7.83l5.59-5.59L12 4l-8 8l8 8l1.41-1.41L7.83 13H20v-2z"
                              fill="currentColor"
                            ></path>
                          </svg>
                        </n-icon>
                      </button>
                    </div>
                  </template>
                  <template #dots="{ total, currentIndex, to }">
                    <ul
                      v-show="imagesReady"
                      class="Carousel__custom-dots"
                      @mouseenter="hoverDots = true"
                      @mouseleave="hoverDots = false"
                    >
                      <li
                        v-for="index of total"
                        :key="index"
                        :class="{
                          ['is-active']: currentIndex === index - 1,
                          ['is-active-adjacent']:
                            currentIndex === index || currentIndex === index - 2,
                        }"
                        @click="to(index - 1)"
                      />
                    </ul>
                  </template>
                </n-carousel>
              </n-image-group>

              <div class="Carousel__vignette">
                <div
                  v-if="imagesReady"
                  style="background: linear-gradient(transparent, #00000044)"
                  class="absolute bottom-0 h-[80px] w-full rounded-b-[5px]"
                ></div>
              </div>
            </div>

            <div class="Lights">
              <div class="Lights__item">
                <div class="Lights__icon"></div>
                <span>Carfax</span>
              </div>
              <div class="Lights__item">
                <div class="Lights__icon"></div>
                <span>AutoCheck</span>
              </div>
              <div class="Lights__item">
                <div class="Lights__icon"></div>
                <span>Light</span>
              </div>
            </div>
          </div>

          <div class="Vehicle-details">
            <div class="Vehicle-details__header">
              <div class="Vehicle-details__item Vehicle-details__item--vin">
                <h1 v-if="!loadingImages" class="value">
                  <span class="opacity-30">VIN </span><span>{{ form.vin }}</span>
                </h1>
                <n-skeleton class="skeleton h-[14px]" v-if="loadingImages"></n-skeleton>
              </div>
              <div class="Vehicle-details__item Vehicle-details__item--lane">
                <span v-if="!loadingImages" class="label">LANE</span>
                <br />
                <span v-if="!loadingImages" class="value">{{ form.lane || "null" }}</span>
                <n-skeleton v-if="loadingImages" class="skeleton h-[14px]"></n-skeleton>
              </div>
              <div class="Vehicle-details__item Vehicle-details__item--code">
                <span v-if="!loadingImages" class="label">CODE</span><br />
                <span v-if="!loadingImages" class="value">{{ form.code || "null" }}</span>
                <n-skeleton v-if="loadingImages" class="skeleton"></n-skeleton>
              </div>
              <div class="Vehicle-details__item Vehicle-details__item--grade">
                <span v-if="!loadingImages" class="label">GRADE</span><br />
                <span v-if="!loadingImages" class="value">{{
                  form.grade || "null"
                }}</span>
                <n-skeleton v-if="loadingImages" class="skeleton"></n-skeleton>
              </div>
              <n-button
                @click="
                  () => {
                    showModal = true;
                    modalContext = 'vehicle';
                  }
                "
                class="Vehicle-details__edit-button"
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32"
                >
                  <g>
                    <path
                      d="M27.314 10.344a4 4 0 0 0-5.657-5.657L20.254 6.09l5.656 5.657l1.404-1.403zm-2.818 2.818L12.541 25.117a4.999 4.999 0 0 1-2.323 1.315l-4.582 1.146a1 1 0 0 1-1.213-1.213l1.146-4.582a5 5 0 0 1 1.315-2.323L18.839 7.505l5.657 5.657z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </n-button>
            </div>

            <div class="bordered mx-[24px] mt-[24px] bg-[#fafafc] dark:bg-[#262629]">
              <div class="Vehicle-details__body">
                <Readonly
                  cols="4"
                  :data="{
                    year: form.year,
                    make: form.make,
                    model: form.model,
                    trim: form.trim,
                    body: form.body,
                    int_color: form.int_color,
                    ext_color: form.ext_color,
                    miles: form.mileage,
                  }"
                />
              </div>
            </div>
            <div class="mx-[24px] mt-[24px] flex justify-items-stretch">
              <div class="mr-[12px] flex-1">
                <Input
                  class="w-full"
                  type="textarea"
                  label="notes"
                  placeholder=""
                  v-model:value="payload.notes"
                  editable
                />
              </div>
              <div class="ml-[12px] flex-1">
                <Input
                  class="w-full"
                  type="textarea"
                  label="recon"
                  placeholder=""
                  v-model:value="payload.recon"
                  editable
                />
              </div>
            </div>
          </div>

          <div class="Purchase-details">
            <div class="relative">
              <n-button
                class="Purchase-details__edit-button"
                @click="
                  () => {
                    showModal = true;
                    modalContext = 'purchase';
                  }
                "
                ><svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 32 32"
                >
                  <g>
                    <path
                      d="M27.314 10.344a4 4 0 0 0-5.657-5.657L20.254 6.09l5.656 5.657l1.404-1.403zm-2.818 2.818L12.541 25.117a4.999 4.999 0 0 1-2.323 1.315l-4.582 1.146a1 1 0 0 1-1.213-1.213l1.146-4.582a5 5 0 0 1 1.315-2.323L18.839 7.505l5.657 5.657z"
                      fill="currentColor"
                    ></path>
                  </g>
                </svg>
              </n-button>
            </div>
            <div class="Purchase-details__header">
              <p class="label">SOLD FOR</p>
              <h1 class="value">$0</h1>
              <p class="label">DOS - {{ form.dos || "NOT SOLD" }}</p>
              <p class="label">DOP - {{ form.dop || "UNAVAILABLE" }}</p>
            </div>
            <div
              class="Purchase-details__cr-report !opacity-100"
              @click="handleConditionReportClick"
            >
              <div>
                <svg
                  width="12"
                  height="13"
                  viewBox="0 0 12 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.65298 0.70813C4.53493 0.70813 3.44198 1.03967 2.51235 1.66083C1.58273 2.28199 0.85817 3.16486 0.43031 4.19781C0.00244934 5.23075 -0.109498 6.36738 0.108623 7.46395C0.326744 8.56052 0.865138 9.56778 1.65572 10.3584C2.4463 11.149 3.45357 11.6873 4.55014 11.9055C5.64671 12.1236 6.78334 12.0116 7.81628 11.5838C8.84923 11.1559 9.7321 10.4314 10.3533 9.50173C10.9744 8.57211 11.306 7.47916 11.306 6.36111C11.3054 3.35337 8.54591 0.70813 5.65298 0.70813ZM10.412 6.36111C10.412 7.20323 10.004 8.13393 9.61822 8.8187C9.61822 8.78548 9.57568 8.94225 9.57277 8.90961C9.38686 6.72884 9.00864 4.09584 8.81515 2.99613C8.80524 2.93785 8.91422 3.129 8.90432 3.07597C9.75634 3.92683 10.412 5.05976 10.412 6.35878V6.36111ZM6.97065 1.83115L7.09362 1.87428C6.32434 4.38431 5.68562 6.62103 5.68562 6.62103C5.68562 6.62103 5.00842 4.46474 4.33589 1.83115C5.19644 1.58173 6.11011 1.58173 6.97065 1.83115ZM2.31364 3.0311L2.44535 2.93785C2.25595 4.0597 1.82994 6.67231 1.64228 8.89504C1.25648 8.21086 0.93828 7.2009 0.93828 6.35878C0.937595 5.74094 1.05871 5.12902 1.29471 4.55803C1.53071 3.98703 1.87695 3.46816 2.31364 3.0311ZM3.03221 10.278C3.08292 9.44519 3.24551 7.20323 3.52525 4.625C3.52525 4.625 4.59057 8.24291 5.2934 10.31H6.1093C7.00678 7.49811 7.81102 4.67454 7.81102 4.67454C8.06977 7.04879 8.08901 9.0454 8.14903 9.97785C8.15253 10.0251 8.31804 10.2657 8.31804 10.2657C8.31804 10.2657 8.17409 10.3508 8.17642 10.3788C7.42522 10.8817 6.62389 11.0781 5.65298 11.0781C4.71927 11.0779 3.80683 10.7993 3.03221 10.278Z"
                    fill="#FFC20D"
                  />
                </svg>
              </div>
              <span>CR Report</span>
            </div>
            <div class="Purchase-details__inputs">
              <div
                class="Purchase-details__input Purchase-details__input--price pointer-events-none"
              >
                <Input label="Purchase Price" :value="`$${form.purchase_price}`" />
              </div>
              <div
                class="Purchase-details__input Purchase-details__input--value pointer-events-none"
              >
                <Input label="Market Value" :value="`$${form.market_value}`" />
              </div>
              <div
                class="Purchase-details__input Purchase-details__input--profit pointer-events-none"
              >
                <Input
                  class="pointer-events-none"
                  label="net profit/loss"
                  v-model:value="form.profit"
                  :status="form.profit >= 0 ? 'warning' : 'error'"
                  :prefix="form.profit >= 0 ? '+ $' : '- $'"
                />
              </div>
            </div>
          </div>

          <n-modal class="Modal" v-model:show="showModal" :mask-closable="false">
            <n-card
              style="width: 60vw"
              :title="
                modalContext === 'purchase'
                  ? 'Edit purchase details'
                  : 'Edit vehicle details'
              "
              :bordered="true"
              role="dialog"
              aria-modal="true"
            >
              <div v-if="modalContext === 'purchase'" class="grid gap-[24px]">
                <Input
                  label="Purchase Price"
                  :default-value="form.purchase_price"
                  v-model:value="payload.purchase_price"
                  copyable
                />
                <Input
                  label="Market Value"
                  :default-value="form.market_value"
                  v-model:value="payload.market_value"
                  copyable
                />
                <Input
                  label="Net Profit/Loss"
                  :default-value="form.profit"
                  v-model:value="payload.profit"
                  copyable
                />
              </div>
              <div v-else class="Modal__form grid grid-cols-12 gap-4">
                <div class="col-span-12 md:col-span-6">
                  <Input
                    label="Vin"
                    :default-value="form.vin"
                    v-model:value="payload.vin"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-2">
                  <Input
                    label="Lane"
                    :default-value="form.lane"
                    v-model:value="payload.lane"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-2">
                  <Input
                    label="Code"
                    :default-value="form.code"
                    v-model:value="payload.code"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-2">
                  <Input
                    label="Grade"
                    :default-value="form.grade"
                    v-model:value="payload.grade"
                    copyable
                  />
                </div>
                <hr class="col-span-12 border-background_light dark:border-dark_border" />
                <div class="col-span-12 md:col-span-3">
                  <Input
                    label="Year"
                    :default-value="form.year"
                    v-model:value="payload.year"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-3">
                  <Input
                    label="Make"
                    :default-value="form.make"
                    v-model:value="payload.make"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-3">
                  <Input
                    label="Model"
                    :default-value="form.model"
                    v-model:value="payload.model"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-3">
                  <Input
                    label="Trim"
                    :default-value="form.trim"
                    v-model:value="payload.trim"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-3">
                  <Input
                    label="Body"
                    :default-value="form.body"
                    v-model:value="payload.body"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-3">
                  <Input
                    label="Ext. Color"
                    :default-value="form.ext_color"
                    v-model:value="payload.ext_color"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-3">
                  <Input
                    label="Int. Color"
                    :default-value="form.int_color"
                    v-model:value="payload.int_color"
                    copyable
                  />
                </div>
                <div class="col-span-12 md:col-span-3">
                  <Input
                    label="Miles"
                    :default-value="form.miles"
                    v-model:value="payload.miles"
                    copyable
                  />
                </div>
              </div>
              <div class="Modal__buttons float-right mt-[24px]">
                <n-button
                  class="Modal__button"
                  type="primary"
                  @click="save"
                  :disabled="
                    Object.entries(payload).toString() === Object.entries(form).toString()
                  "
                >
                  Save
                </n-button>
                <n-button class="Modal__button ml-[12px]" @click="hideModal">
                  Cancel
                </n-button>
              </div>
            </n-card>
          </n-modal>
          <!-- vehicle information -->
        </div>
        <!-- right side -->
      </div>
    </Card>

    <TabGroup>
      <TabList
        id="__subtabs"
        ref="vendorTab"
        class="Tabs subTabList bg-foreground_light flex h-[60px] overflow-x-auto overflow-y-hidden px-4 dark:bg-foreground_dark sticky top-[-2px] left-0 z-40 mt-[24px] w-full rounded-round duration-300"
      >
        <Tab
          v-for="(item, index) in tabs"
          :key="index"
          class="__tab-item flex h-full max-w-lg cursor-pointer flex-col items-center justify-center whitespace-nowrap px-1 text-center mx-4 focus:outline-none focus:ring-0"
          v-slot="{ selected }"
        >
          <span
            class="__tab-title flex text-xs font-bold tracking-widest hover:!opacity-100"
          >
            <span :class="`${!selected && 'font-medium opacity-30'}`">
              {{ item.title }}
            </span>
          </span>
          <span
            class="__indicator h-1 translate-y-[19px] duration-200"
            :class="`${selected ? 'w-12 bg-primary' : 'w-0 bg-gray-300 dark:bg-primary'}`"
          ></span>
        </Tab>
      </TabList>
      <TabPanels class="mt-[24px]">
        <VehicleSubPage :deal="vendor" :deal_id="vendor?.id" />
      </TabPanels>
    </TabGroup>
  </main>
</template>

<style lang="scss">
#__subtabs[stuck] {
  @apply rounded-none bg-[#F4F6F8] shadow-lg shadow-[#00000011] dark:bg-dark_border;
}
.Vehicle-details {
  @apply w-full;
  .skeleton {
    @apply mt-[0px];
  }
  &__header {
    @apply mt-[24px] flex h-[32px] items-center justify-items-stretch pr-[24px];
  }
  &__edit-button {
    @apply flex h-full w-[32px] items-center justify-center;
    svg {
      @apply h-[16px] w-[16px];
    }
  }
  &__item {
    @apply flex-col justify-center px-[24px];
    .label {
      @apply mt-[-6px];
    }
    flex: 1;
    &--vin {
      @apply mr-[6px] flex h-[42px] items-center rounded-round bg-[#ffffff08] text-center;
      flex: 8;
    }
    &--lane {
      @apply mx-[6px] flex-col justify-center rounded-round bg-[#ffffff08] text-center;
      .skeleton {
        @apply translate-y-[-12px];
      }
    }
    &--code {
      @apply mx-[6px] rounded-round bg-[#ffffff08] text-center;
      .skeleton {
        @apply translate-y-[-12px];
      }
    }
    &--grade {
      @apply ml-[6px] mr-[12px] rounded-round bg-[#ffffff08] text-center;
      .skeleton {
        @apply translate-y-[-12px];
      }
    }
    &--make {
      flex: 1;
    }
    &--model {
      flex: 1;
    }
    &--trim {
      border: none;
    }
    &--miles {
      border: none;
    }
  }
}

.Purchase-details {
  @apply relative flex w-[40%] flex-col items-center justify-between rounded-round border-0 border-l-[1px] border-light_border bg-[#fafafc] p-[12px] dark:border-dark_border dark:bg-dark_border;
  &__edit-button {
    @apply absolute flex h-[32px] w-[32px] translate-x-[80px] items-center justify-center;
    svg {
      @apply h-[16px] w-[16px];
    }
  }
  &__header {
    & > p,
    & > h1,
    & > div {
      @apply flex justify-center text-center;
    }
  }
  &__cr-report {
    @apply label mt-[12px] flex w-full cursor-pointer items-center justify-center text-center underline opacity-100 hover:opacity-50;
  }
  &__inputs {
    @apply flex w-full flex-col items-center justify-center;
  }
  &__input {
    @apply mt-[16px] w-full;
    &--profit {
      // TODO : deeply styled borders (green for profit, red for loss)
    }
  }
}

.Carousel {
  @apply block;
  &__fallback-image {
    @apply flex min-h-full min-w-full items-center justify-center rounded-round border-[1px] border-[rgba(0,0,0,0.5)] bg-cover bg-center bg-no-repeat dark:border-transparent;
    background-image: url(../assets/image-not-found.png);
    p {
      @apply pointer-events-none text-transparent duration-[300ms];
    }
    &::after {
      @apply absolute top-0 left-0 h-full w-full rounded-round border-0 bg-transparent duration-[300ms];
      content: "";
    }
    &:hover {
      p {
        @apply z-50 text-white;
      }
      &::after {
        @apply bg-[rgba(0,0,0,0.8)];
        content: "";
      }
    }
  }
  &__logo {
    @apply absolute z-50 m-[12px] w-[80px] rounded-round bg-transparent text-[9px];
  }
  &__image {
    @apply z-0 min-h-[210px] rounded-round;
  }
  &__vignette {
    @apply pointer-events-none relative;
  }
  &__custom-dots {
    @apply absolute bottom-[10px] z-50 m-0 flex h-[8px] w-[100%] items-center justify-center px-[10px] duration-[250ms];
    &:hover {
      @apply h-[16px];
    }
    & li {
      @apply mx-[1px] h-full w-full min-w-[4px] cursor-pointer bg-white opacity-[0.2] duration-[300ms];
      backdrop-filter: blur(24px) saturate(180%);
      &:hover {
        @apply opacity-[0.5];
      }
      &:active {
        @apply scale-[0.8] opacity-[0.7];
      }
      &.is-active {
        @apply h-full w-[300%] opacity-100;
      }
      &.is-active-adjacent {
        @apply w-[200%];
      }
    }
  }
  &__custom-arrow {
    @apply absolute bottom-[24px] z-50 ml-[6px] flex translate-y-[-6px] px-[6px] duration-[250ms];
    & button {
      backdrop-filter: blur(24px) saturate(180%);
      @apply flex h-[24px] cursor-pointer items-center justify-center bg-white px-[8px] text-black duration-[100ms];
      &:hover {
        background: rgba(white, 0.8);
      }
    }
    &--left {
      border-radius: 3px 0px 0px 3px !important;
      svg {
        @apply duration-[150ms];
      }
      &:active {
        svg {
          @apply scale-[0.8];
        }
      }
      &::after {
        @apply absolute right-[-1px] h-[24px] w-[2px] bg-[rgba(0,0,0,0.05)];
        content: "";
      }
    }
    &--right {
      border-radius: 0px 3px 3px 0px !important;
      svg {
        @apply duration-[0ms];
      }
      &:active {
        svg {
          transform: scale(0.8) rotate(180deg);
        }
      }
    }
  }
}

.Lights {
  @apply mt-[36px] flex w-full justify-between;
  &__item {
    @apply mt-[12px] flex w-full items-center justify-center text-[12px];
  }
  &__icon {
    @apply mr-[8px] h-[10px] w-[10px] rounded-full bg-success;
  }
}

.Modal {
  @apply bg-transparent;
  &__form {
  }
}

/* lightbox */

.n-image-preview {
  max-height: 75vh !important;
  margin-bottom: 130px;
  border-radius: 5px;
}

.n-image-preview-toolbar {
  display: flex;
  backdrop-filter: blur(24px) invert(1) brightness(1.5);
  color: black;
  background: rgba(white, 0.6);
  border: solid 1px #0000001a;

  .n-base-icon {
    //margin: 0px 6px;
    transition: 150ms ease;
    display: flex;
    min-height: 36px;
    min-width: 36px;
    justify-content: center;
    align-items: center;
    &:hover {
      transform: scale(1.1);
      color: #027bff;
    }
    &:active {
      transform: scale(0.8);
    }
  }
}

h1 {
  font-size: 14px !important;
}

.label {
  @apply m-0 p-0 text-[9px] uppercase opacity-[0.4];
}

.value {
  @apply text-[14px] font-bold;
}

.divider-h {
  @apply m-[12px] mt-[16px] border-light_border dark:border-dark_border;
}

.divider-v {
  @apply border-r-[1px] border-light_border dark:border-dark_border;
}

.skeleton {
  @apply mt-[0px] w-full rounded;
}
</style>
