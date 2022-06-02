<script setup>
import { ref, reactive, onMounted } from "vue";
import { utils, log } from "@/lib/utils";

import axios from "axios";

import Input from "@/components/common/Input.vue";
import Readonly from "@/components/common/Readonly.vue";
import Card from "@/components/_refactor/Card.vue";

const options = [
    {
        label: "Option 1",
        value: "option-1",
    },
    {
        label: "Option 2",
        value: "option-2",
    },
    {
        label: "Option 3",
        value: "option-3",
    },
];

const songs = [
    {
        label: "Everybody's Got Something to Hide Except Me and My Monkey",
        value: "song0",
        disabled: true,
    },
    {
        label: "Drive My Car",
        value: "song1",
    },
    {
        label: "Norwegian Wood",
        value: "song2",
    },
    {
        label: "You Won't See",
        value: "song3",
        disabled: true,
    },
    {
        label: "Nowhere Man",
        value: "song4",
    },
    {
        label: "Think For Yourself",
        value: "song5",
    },
    {
        label: "The Word",
        value: "song6",
    },
    {
        label: "Michelle",
        value: "song7",
        disabled: true,
    },
    {
        label: "What goes on",
        value: "song8",
    },
    {
        label: "Girl",
        value: "song9",
    },
    {
        label: "I'm looking through you",
        value: "song10",
    },
    {
        label: "In My Life",
        value: "song11",
    },
    {
        label: "Wait",
        value: "song12",
    },
];

const dealer = ref({});

const form = reactive({
    basic: "",
    phone: "",
    disabled: "",
    warning: "",
    error: "",
    textarea: "",
    resize: "",
    editable: "",
    select: null,
    multiselect: null,
    tags: null,
    labeless: "",
    song: "",
    vin: "4S4BP66C297321580",
    profit: 24094.67,
});

const query = ref("");
const searchStatus = ref("Ready to search");

const view = ref(0);

onMounted(() => {
    dealer.value = axios.get(`deals/152`).then((res) => res.dealer);
});

function fetchStuff() {
    searchStatus.value = "Fetched data: { ... }";
}
</script>

<template>
    <main class="flex flex-col items-center justify-center w-full">
        <div class="nav">
            <div :class="view === 0 && 'active'" class="nav-item" @click="view = 0">
                Input.vue
            </div>
            <div :class="view === 1 && 'active'" class="nav-item" @click="view = 1">
                Readonly.vue
            </div>
        </div>
        <Card v-show="view === 0" class="Inputs">
            <Input
                label="Required input"
                placeholder="Type here"
                v-model:value="form.basic"
                :rules="['required']"
            />
            <Input
                label="Editable Input"
                placeholder="Edit me"
                :value="form.editable"
                v-model:value="form.editable"
                editable
            />
            <Input
                label="phone (masked input)"
                v-model:value="form.phone"
                :rules="['required', 'phone']"
                :mask="'(###) ###-####'"
            />
            <Input
                type="select"
                label="Editable filter search"
                placeholder="Input, press enter to create tag"
                :value="form.tags"
                v-model:value="form.tags"
                filterable
                multiple
                tag
                :show-arrow="false"
                :show="false"
            />
            <!-- TODO : Fix bounding box issue for multi-select -->
            <!--Input
              type="select"
              class=""
              label="Multi-select"
              :value="form.multiselect"
              v-model:value="form.multiselect"
              :options="songs"
              multiple
            /-->
            <Input
                type="textarea"
                label="basic textarea"
                placeholder="Notes"
                v-model:value="form.textarea"
            />
            <Input
                type="textarea"
                label="Editable textarea"
                placeholder="Notes"
                v-model:value="form.textarea"
                editable
            />
            <div class="relative">
                <Input
                    label="Debounce (1500ms)"
                    placeholder="Search"
                    v-model:value="query"
                    :debounce="1500"
                    @debounced="fetchStuff"
                    @typing="searchStatus = 'Typing...'"
                />
                <Card class="w-[250px] rounded-t-none !p-[12px] border-t-0">
                    <div class="flex">
                        <span class="opacity-[0.3]">Status</span>
                        <span class="ml-[6px]">{{
                            query.length > 0 ? searchStatus : "Ready to search"
                        }}</span>
                    </div>
                </Card>
            </div>
            <Input
                type="select"
                label="basic selector"
                placeholder="Select an option"
                :value="form.select"
                v-model:value="form.select"
                :options="options"
            />
            <Input
                type="select"
                label="Editable selector"
                placeholder="Select an option"
                :value="form.select"
                v-model:value="form.select"
                :options="options"
                editable
                filterable
            />
            <Input
                type="select"
                label="filterable / clearable"
                placeholder="Select a song"
                :value="form.song"
                v-model:value="form.song"
                :options="songs"
                filterable
                clearable
            />
            <Input label="readonly" v-model:value="form.vin" disabled />
            <Input label="copyable" v-model:value="form.vin" copyable />
            <Input
                class="pointer-events-none"
                label="profit/loss"
                v-model:value="form.profit"
                :status="form.profit >= 0 ? 'warning' : 'error'"
                :prefix="form.profit >= 0 ? '+ $' : '- $'"
            />
        </Card>
        <Card v-show="view === 1" class="ml-[24px]">
            <Readonly
                :data="form"
                cols="4"
            ></Readonly>
        </Card>
    </main>
</template>

<style lang="scss" scoped>
main {
    @apply p-[60px];
}

.nav {
    @apply flex w-full justify-center text-center m-[24px] absolute top-[24px];
}

.nav-item {
    margin-left: 12px;
    margin-right: 12px;
    cursor: pointer;
    padding-bottom: 12px;
    opacity: 0.3;
    //transition: 200ms;

    &:hover {
        opacity: 0.5;
    }
}

.active {
    opacity: 1 !important;
}

.Inputs {
    @apply grid grid-cols-3 gap-[24px] p-[24px] h-[60vh];

    & > div {
        @apply max-w-[250px];
    }
}
</style>
