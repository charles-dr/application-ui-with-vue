<script setup>
import { useMutation, useQuery } from "vue-query";
import axios from "axios";
import { useRoute } from "vue-router";
import { ref, watch, h, computed } from "vue";
import ExpenseTableImage from "@/components/vendor/invoice/ExpenseTableImage.vue";
import dayjs from "dayjs";
import { fetchById } from "@/hooks";

const route = useRoute();

const routeParamId = ref(route.params?.id);

const pageInfo = ref({ page: 1, per_page: 50 });
const { data: current_deal, isLoading: dealLoading } = fetchById("/deals", routeParamId);
const { data: expenses, isFetching: expenseLoading } = useQuery(
  ["expenseByDeal", pageInfo, routeParamId],
  ({ queryKey }) =>
    axios
      .get(
        "/expenses/deal/" +
          current_deal.value?.id +
          "?per_page=50&page=" +
          queryKey[1].page
      )
      .then((res) => res.data),
  {
    enabled: !dealLoading.value,
    keepPreviousData: true,
  }
);

const pagination = computed(() => ({
  pageSize: pageInfo.value.per_page,
  page: pageInfo.value.page,
  itemCount: expenses.value?.total ?? 0,
  pageCount: expenses.value?.last_page ?? 1,
  prefix({ itemCount }) {
    return `Total is ${itemCount}`;
  },
}));
watch(
  () => route.params,
  (toParam) => {
    if (toParam?.id) routeParamId.value = toParam?.id;
  },
  { immediate: true }
);

const columns = [
  {
    title: "",
    key: "files",
    width: "80",
    render(row) {
      return h(ExpenseTableImage, {
        files: row.files,
      });
    },
  },
  {
    title: "Name",
    key: "name",
    width: "130",
  },
  {
    title: "Description",
    key: "description",
    width: "200",
    render(row) {
      return h(
        "span",
        { class: "text-[8px] text-center" },
        { default: () => row.description }
      );
    },
  },
  {
    title: "DOS",
    key: "expense_date",
    render(row) {
      return h(
        "span",
        {},
        {
          default: () => dayjs(row.expense_date).format("MM/DD/YYYY"),
        }
      );
    },
  },
  {
    title: "Amount",
    key: "amount",
    width: "150",
    fixed: "right",
    render(row) {
      return h(
        "span",
        {
          class:
            "font-semibold bg-gray-800/10 border-2 rounded border-gray-500 px-3 py-2",
        },
        {
          default: () => `$${row.amount}`,
        }
      );
    },
  },
  // {
  //   key: "action",
  //   fixed: "right",
  //   width: "140",
  //   render(row, rowIndex) {
  //     return h(VendorExpenseAction, {
  //       onAdd: onAddExpense,
  //       onEdit: () => {
  //         currentExpense.value = toRaw(row);
  //         currentExpense.value.expense_date = dayjs(
  //           currentExpense.value.expense_date
  //         ).valueOf();
  //         showExpenseModal.value = true;
  //         editExpenseIndex.value = rowIndex;
  //       },
  //       onDelete: () => {
  //         form.value.expenses.splice(rowIndex, 1);
  //       },
  //     });
  //   },
  // },
];
const handlePageChange = (current_page) => {
  pageInfo.value.page = current_page;
};
</script>
<template>
  <n-card
    :header-style="{
      '--n-title-font-weight': 'bold',
      '--n-title-font-size': '1.5rem',
    }"
    title="Expense"
  >
    <n-data-table
      remote
      striped
      @update:page="handlePageChange"
      :data="expenses?.data"
      :loading="expenseLoading"
      :pagination="pagination"
      :columns="columns"
      :bordered="false"
      class="pt-2"
      :max-height="500"
      :scroll-x="1300"
      row-class-name="group py-2"
    />
  </n-card>
</template>
