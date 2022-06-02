<script setup>
import { ref, reactive, onMounted, watchEffect } from "vue";
import Card from "@/components/_refactor/Card.vue";

const props = defineProps({
    cols: String,
    span: String,
    data: Object,
});

const state = reactive({
    loading: true,
});

watchEffect(() => {
    if (props.data) {
        state.loading = false;
    }
});

//const parsedSpan = computed(() => {});

onMounted(() => {
    //console.log("cols:", props.cols);
});
</script>

<template>
    <div class="Readonly bordered">
        <div v-if="data" class="Readonly__body">
            <div
                v-for="(item, index) in Object.entries(data)"
                :class="`Readonly__item Readonly__item--${item[0]}`"
            >
                <span v-if="!state.loading" class="label">{{ item[0] }}</span>
                <span v-if="!state.loading" class="value">{{ item[1] || "null" }}</span>
                <n-skeleton class="Readonly__skeleton" v-if="state.loading"></n-skeleton>
            </div>
        </div>
        <div v-else>
            {{ "No data" }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.Readonly {
    @apply bg-transparent p-[12px] pl-[24px];
    &__body {
        @apply grid gap-x-[24px] gap-y-[12px];
        grid-template-columns: repeat(v-bind(cols), 1fr);
    }
    &__item {
        @apply columns-1 flex flex-col items-start justify-center text-center w-full mr-[24px];
        .label {
            @apply text-[9px] font-normal opacity-50;
        }
        .value {
            @apply text-[14px] font-bold;
        }
    }
    &__skeleton {
        @apply mt-[0px];
    }
}
</style>
