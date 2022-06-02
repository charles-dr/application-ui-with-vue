<script setup>
import axios from "axios";
import { h, ref, reactive, watch } from "vue";
import { useRoute } from "vue-router";
import Card from "@/components/_refactor/Card.vue";
import Input from "@/components/common/Input.vue";
import { toRef } from "vue";

const props = defineProps({
  owners: Array,
});
const $emit = defineEmits(["edit", "add"]);

const showModal = ref(false);
const isEditing = ref(false);

const route = useRoute();
const routeParamId = ref(route.params?.id);
const currentIndex = ref(0);
const forceRender = ref(false);
const editingOwner = ref({
  first: "",
  last: "",
  email: "",
  phone: "",
  address_one: "",
  address_two: "",
  city: "",
  state: "",
  zipcode: "",
  notes: "",
  photo_id: null,
});

const handleCurrentIndexUpdate = (currentIdx, lastIdx) => {
  currentIndex.value = currentIdx;
};

const owners = toRef(props, "owners");

watch(owners, () => {
  forceRender.value = !forceRender.value;
});

const handleEdit = () => {
  editingOwner.value = owners.value[currentIndex.value];
  isEditing.value = true;
  showModal.value = true;
};

const handleAdd = () => {
  editingOwner.value = {
    first: "",
    last: "",
    email: "",
    phone: "",
    address_one: "",
    address_two: "",
    city: "",
    state: "",
    zipcode: "",
    notes: "",
    photo_id: null,
  };
  isEditing.value = false;
  showModal.value = true;
};

const handleAddOrSave = () => {
  if (isEditing.value) {
    $emit("edit", editingOwner.value);
  } else {
    $emit("add", editingOwner.value);
  }
  showModal.value = false;
};
</script>
<template>
  <Card class="p-0">
    <div
      class="
        flex
        w-full
        items-center
        gap-[6px]
        rounded-[6px]
        bg-white
        py-[15px]
        pl-[30px]
        dark:bg-[#26262A]
      "
    >
      <span>OWNERS</span>
      <span>
        <button
          v-if="owners?.length > 0"
          @click="handleEdit"
          class="flex h-full w-[32px] items-center justify-center border-0"
        >
          <svg
            class="h-[16px] w-[16px]"
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
        </button>
      </span>
      <span>
        <button
          @click="handleAdd"
          class="flex h-full w-[32px] items-center justify-center border-0"
        >
          <svg
            class="h-[16px] w-[16px]"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 24 24"
          >
            <g>
              <path
                d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2z"
                fill="currentColor"
              ></path>
            </g>
          </svg>
        </button>
      </span>
    </div>
    <n-carousel
      show-arrow
      :current-index="currentIndex"
      :default-index="currentIndex"
      :on-update:current-index="handleCurrentIndexUpdate"
      :key="forceRender"
    >
      <div
        v-for="(owner, ownerIdx) in owners"
        class="mx-[20px] my-[22px] grid grid-cols-12 gap-4 pb-[30px]"
        :key="ownerIdx"
      >
        <div class="col-span-8 grid grid-cols-12 gap-4">
          <!-- First Name, Last Name -->
          <div class="owner-details__item owner-details__item--lane col-span-4">
            <span class="label">FIRST NAME</span><br />
            <span class="value">{{ owner.first }}</span>
          </div>
          <div class="owner-details__item owner-details__item--lane col-span-4">
            <span class="label">LAST NAME</span><br />
            <span class="value">{{ owner.last }}</span>
          </div>
          <!-- Address1 -->
          <div
            class="owner-details__item owner-details__item--lane col-span-12"
          >
            <span class="label">ADDRESS1</span><br />
            <span class="value">{{ owner.address_one }}</span>
          </div>
          <!-- Address2 -->
          <div
            class="owner-details__item owner-details__item--lane col-span-12"
          >
            <span class="label">ADDRESS2</span><br />
            <span class="value">{{ owner.address_two }}</span>
          </div>
          <!-- CITY, STATE, ZIPCODE, DEC. -->
          <div class="owner-details__item owner-details__item--lane col-span-3">
            <span class="label">CITY</span><br />
            <span class="value">{{ owner.city }}</span>
          </div>
          <div class="owner-details__item owner-details__item--lane col-span-3">
            <span class="label">STATE</span><br />
            <span class="value">{{ owner.state }}</span>
          </div>
          <div class="owner-details__item owner-details__item--lane col-span-3">
            <span class="label">ZIPCODE</span><br />
            <span class="value">{{ owner.zipcode }}</span>
          </div>
          <div class="owner-details__item owner-details__item--lane col-span-3">
            <span class="label">DEC.</span><br />
            <span class="value">{{ owner.notes }}</span>
          </div>
          <!-- Phone, Email -->
          <div class="owner-details__item owner-details__item--lane col-span-4">
            <span class="label">PHONE.</span><br />
            <span class="value">{{ owner.phone }}</span>
          </div>
          <div class="owner-details__item owner-details__item--lane col-span-8">
            <span class="label">EMAIL</span><br />
            <span class="value">{{ owner.email }}</span>
          </div>
        </div>
        <div class="col-span-4">
          <div class="rounded-[4px]">
            <img src="../../assets/driver_license_test.png" />
          </div>
        </div>
      </div>
    </n-carousel>
  </Card>

  <n-modal
    class="Modal w-[90vw] lg:w-[60vw] bg-transparent"
    v-model:show="showModal"
    preset="card"
    :title="isEditing ? 'Edit owner details' : 'Add owner'"
  >
    <div class="Modal__form grid grid-cols-12 gap-4">
      <div class="col-span-12 md:col-span-3">
        <Input
          label="First Name"
          :default-value="editingOwner.first"
          v-model:value="editingOwner.first"
          copyable
        />
      </div>
      <div class="col-span-12 md:col-span-3">
        <Input
          label="Last Name"
          :default-value="editingOwner.last"
          v-model:value="editingOwner.last"
          copyable
        />
      </div>
      <div class="col-span-12 md:col-span-12">
        <Input
          label="Address1"
          :default-value="editingOwner.address_one"
          v-model:value="editingOwner.address_one"
          copyable
        />
      </div>
      <div class="col-span-12 md:col-span-12">
        <Input
          label="Address2"
          :default-value="editingOwner.address_two"
          v-model:value="editingOwner.address_two"
          copyable
        />
      </div>
      <div class="col-span-12 md:col-span-3">
        <Input
          label="City"
          :default-value="editingOwner.city"
          v-model:value="editingOwner.city"
          copyable
        />
      </div>
      <div class="col-span-12 md:col-span-3">
        <Input
          label="State"
          :default-value="editingOwner.state"
          v-model:value="editingOwner.state"
          copyable
        />
      </div>
      <div class="col-span-12 md:col-span-3">
        <Input
          label="Zipcode"
          :default-value="editingOwner.zipcode"
          v-model:value="editingOwner.zipcode"
          copyable
        />
      </div>
      <div class="col-span-12 md:col-span-3">
        <Input
          label="Dec"
          :default-value="editingOwner.notes"
          v-model:value="editingOwner.notes"
          copyable
        />
      </div>
      <div class="col-span-12 md:col-span-4">
        <Input
          label="Phone"
          :default-value="editingOwner.phone"
          v-model:value="editingOwner.phone"
          copyable
        />
      </div>
      <div class="col-span-12 md:col-span-8">
        <Input
          label="Email"
          :default-value="editingOwner.email"
          v-model:value="editingOwner.email"
          copyable
        />
      </div>
    </div>
    <div class="Modal__buttons float-right mt-[24px]">
      <n-button class="Modal__button" @click="handleAddOrSave">
        {{ isEditing ? "Save" : "Add" }}
      </n-button>
      <n-button class="Modal__button ml-[12px]" @click="showModal = false">
        Cancel
      </n-button>
    </div>
  </n-modal>
</template>
<style lang="scss">
.owner-details {
  .skeleton {
    @apply mt-[0px];
  }
  &__header {
    @apply flex h-[32px] items-center justify-items-stretch pr-[24px];
  }
  &__edit-button {
    @apply flex h-full w-[32px] items-center justify-center;
    svg {
      @apply h-[16px] w-[16px];
    }
  }
  &__item {
    @apply flex-col justify-center px-[24px];
    flex: 1;
    &--vin {
      flex: 3;
    }
    &--lane {
    }
    &--code {
    }
    &--grade {
      @apply mt-[0px] border-0;
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

.label {
  @apply m-0 whitespace-nowrap p-0 text-[9px] uppercase opacity-[0.4];
}
.value {
  @apply whitespace-nowrap text-[14px];
}
</style>
