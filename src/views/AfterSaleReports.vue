<script setup>
	import { getAfterSaleReports } from "@/hooks/reports";
	import { useMessage } from "naive-ui";
	import {
		computed,
		defineComponent,
		h,
		watch,
		onMounted,
		ref,
		unref,
	} from "vue";
	import { useRoute } from "vue-router";
	import { useQuery, useQueryClient } from "vue-query";
	import { useMediaQuery, useToggle } from "@vueuse/core";
	import dayjs from "dayjs";
	import { clone, objectFilter } from "@/lib/helper";
	import { getAuctions } from "@/hooks/auctions";
	import Input from "@/components/common/Input.vue";
	import { format, subDays } from "date-fns";

	const route = useRoute();
	const queryClient = useQueryClient();
	const isLaptop = useMediaQuery("(min-width: 768px)");
	// const [sideBarActive, toggleSideBar] = useToggle();
	const message = useMessage();

	const selectedAuction = ref(null);
	const selectAuctionModal = ref(false);

	const {
		data: auctions,
		hasNextPage: hasNextAuctionPage,
		fetchNextPage: fetchNextAuctionPage,
	} = getAuctions();

	const auctionOptions = computed(() =>
		auctions.value?.pages.reduce(
			(prev, current) =>
				prev.concat(
					current?.data.map((auction) => ({
						label: auction.code,
						value: auction.id,
					})) ?? []
				),
			[]
		)
	);

	const dateRange = ref([subDays(Date.now(), 30), Date.now()]);

	const urlParams = () => ({
		auction_id: selectedAuction.value,
		from_date: format(dateRange.value[0], "yy-mm-dd"),
		to_date: format(dateRange.value[1], "yy-mm-dd"),
	});

	const filter = computed(() => {
		return {
			auction_id: selectedAuction.value,
			from_date: format(dateRange.value[0], "yy-mm-dd"),
			to_date: format(dateRange.value[1], "yy-mm-dd"),
		};
	});

	const {
		data: reports,
		isFetching: isLanesLoading,
		refetch: reportsRefetch,
	} = getAfterSaleReports(filter);

	const columns = [
		{
			title: "TH",
			key: "th",
			width: 120,
		},
		{
			title: "Run #",
			key: "run",
			width: 120,
		},
		{
			title: "Make",
			key: "make",
			width: 120,
		},
		{
			title: "Model",
			key: "model",
			width: 120,
		},
		{
			title: "Trim",
			key: "trim",
			width: 120,
		},
		{
			title: "Body",
			key: "body",
			width: 120,
		},
		{
			title: "Color",
			key: "color",
			width: 120,
		},
		{
			title: "VIN",
			key: "vin",
			width: 120,
		},
		{
			title: "Source",
			key: "source",
			width: 120,
		},
		{
			title: "Unwind",
			key: "unwind",
			width: 120,
		},
		{
			title: "Buyer",
			key: "buyer",
			width: 120,
		},
		{
			title: "DP",
			key: "dp",
			width: 120,
		},
		{
			title: "Miles",
			key: "miles",
			width: 120,
		},
		{
			title: "Exp",
			key: "exp",
			width: 120,
		},
		{
			title: "True Cost",
			key: "true_cost",
			width: 120,
		},
		{
			title: "Total Cost",
			key: "total_cost",
			width: 120,
		},
		{
			title: "Mod Cost",
			key: "mod_cost",
			width: 120,
		},
		{
			title: "Sold Price",
			key: "sold_price",
			width: 120,
		},
		{
			title: "Market Value",
			key: "market_value",
			width: 120,
		},
		{
			title: "Profit/Loss",
			key: "profit_loss",
			width: 120,
		},
		{
			title: "Vehicle Notes",
			key: "vehicle_notes",
			width: 150,
		},
	];

	const filteredColumns = ref(columns);

	const exportCSV = () => {
		if (
			!filter.value.auction_id ||
			!filter.value.from_date ||
			!filter.value.to_date
		) {
			return;
		}

		const dummy = document.createElement("a");
		dummy.href =
			"https://gmtvinventory.com/api/reports/after_sale/csv?" +
			new URLSearchParams(
				objectFilter(unref(filter), (key, value) =>
					typeof value === "number" ? true : value
				)
			).toString();
		document.body.appendChild(dummy);
		dummy.click();
		document.body.removeChild(dummy);
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

	const handleUpdateDateRange = (value) => {
		console.log(value);
		dateRange.value = value;
	};
</script>

<template>
	<div
		class="flex h-screen w-[calc(100vw-60px)] overflow-auto bg-background_light transition-all duration-300 dark:bg-background_dark"
	>
		<main
			class="h-full overflow-y-auto overflow-x-hidden overscroll-contain px-5 pt-5 transition-all duration-300"
			:class="sideBarActive ? 'w-[calc(100vw-335px)]' : 'w-[calc(100vw-60px)]'"
		>
			<div
				class="rounded-round border bg-white p-[24px] dark:border-dark_border dark:bg-foreground_dark"
			>
				<div class="mb-3 flex items-center justify-between gap-2">
					<h1
						class="flex-shrink-0 flex-grow text-sm font-bold uppercase lg:text-xl"
					>
						Aftersale Reports
					</h1>
					<div class="flex flex-wrap items-center justify-end gap-y-2 gap-x-1">
						<Input
							class="mr-2"
							type="select"
							size="small"
							label="Select Auction"
							placeholder="Select"
							:options="auctionOptions"
							v-model:value="selectedAuction"
							@scroll="handleAuctionSelectScroll"
							filterable
						/>
						<div class="mr-6 w-[250px]">
							<n-date-picker
								clearable
								:format="'MM/dd/yy'"
								v-model:value="dateRange"
								type="datetimerange"
								@update:value="handleUpdateDateRange"
							/>
							<!--pre>{{ JSON.stringify(range) }}</pre-->
						</div>
						<n-tooltip trigger="hover">
							<template #trigger>
								<n-button size="small" @click="reportsRefetch">
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
						<n-button size="small" @click="showSelectColumns = true"
							>Manage Columns</n-button
						>
					</div>
				</div>
				<div class="overflow-x-auto">
					<n-data-table
            class="w-[2550px]"
						remote
						ref="table"
						:columns="filteredColumns"
						:data="reports?.data"
						:pagination="pagination"
						max-height="75vh"
						:scroll-x="800"
						striped
						:loading="isLanesLoading"
						@update:page="handlePageChange"
					/>
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
			<n-select
				v-model:value="selectColumn[index]"
				filterable
				:options="columnOptions"
			/>
		</n-dynamic-input>
		<template #action>
			<div class="flex justify-end gap-2">
				<n-button @click="onResetColumn"> Reset </n-button>
				<n-button type="primary" @click="onSubmitSelectColumn">Save</n-button>
			</div>
		</template>
	</n-modal>
</template>
