<script setup>
	import { useGlobalState } from "@/store/global";
	import { Tab, TabGroup, TabList, TabPanels } from "@headlessui/vue";
	import { useDebounceFn } from "@vueuse/core";
	import { gsap } from "gsap";
	import { ScrollTrigger } from "gsap/ScrollTrigger";
	import { computed, onMounted, onUpdated, ref, toRaw } from "vue";

	defineEmits(["tab-click"]);

	const global = useGlobalState();

	const props = defineProps({
		items: {
			type: Array,
			default: () => [],
		},
		type: {
			type: String,
			default: "basic",
		},
		scroll: {
			type: Boolean,
			default: false,
		},
	});

	const active = ref(0);
	const shouldDisableScroll = ref(false);

	const exampleItems = ref([
		{
			title: "Tab 1",
			value: "1",
		},
		{
			title: "Tab 2",
			value: "2",
		},
		{
			title: "Tab 3",
			value: "3",
		},
		{
			title: "Tab 4",
			value: "4",
		},
	]);

	onMounted(() => {
		if (props.scroll) {
			props.items.forEach((item, index) => {
				const itemSelector = document.querySelector(item.value);
				ScrollTrigger?.create({
					// INFO: please make sure there is a wrapper with ID 'main'
					scroller: "#main",
					trigger: itemSelector,
					start: () => "top 60px",
					end: () => "bottom 60px",
					onEnter: () => {
						if (!shouldDisableScroll.value) active.value = index;
					},
					onEnterBack: () => {
						if (!shouldDisableScroll.value) active.value = index;
					},
				});
			});
		}
	});

	onUpdated(() => {
		if (props.scroll) ScrollTrigger.refresh();
	});

	const tabItems = computed(() => props.items || exampleItems.value);

	const delay = useDebounceFn(() => {
		shouldDisableScroll.value = false;
	}, 1000);

	const scrollToSection = (item, index) => {
		shouldDisableScroll.value = true;
		gsap.to("#main", {
			scrollTo: {
				y: toRaw(item).value,
				offsetY: 60,
			},
			onComplete() {
				delay();
			},
		});
	};
</script>

<template>
	<TabGroup :selected-index="active">
		<TabList
			class="Tabs subTabList flex h-[60px] w-full overflow-x-auto overflow-y-hidden px-4"
		>
			<Tab
				v-for="(item, index) in tabItems"
				:key="index"
				class="__tab-item flex h-full max-w-lg cursor-pointer flex-col items-center justify-center whitespace-nowrap px-1 text-center"
				:class="type === 'basic' ? 'mx-4' : 'pl-0'"
				v-slot="{ selected }"
				@click="
					scroll ? scrollToSection(item, index) : $emit('tab-click', item.value)
				"
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
					:class="`${
						selected ? 'w-12 bg-primary' : 'w-0 bg-gray-300 dark:bg-primary'
					}`"
				></span>
			</Tab>
		</TabList>
	</TabGroup>
</template>

<style scoped>
	.__indicator {
		border-radius: 24px 24px 0 0;
		transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
	}
	.__tab-item:hover .__indicator {
		@apply w-12;
	}
</style>
