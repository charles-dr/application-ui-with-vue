<script setup>
import dayjs from "dayjs";
import { h } from "vue";
import { format } from "v-money3";
defineProps(["currentManheim"]);
const invoiceItemsColumns = [
  {
    title: "Invoice Number",
    key: "invoiceNumber",
    width: "140",
  },
  {
    title: "Invoice Date",
    key: "invoiceDate",
    width: "120",
    render(row) {
      return h(
        "span",
        {},
        { default: () => dayjs(row.invoiceDate).format("MM/DD/YYYY") }
      );
    },
  },
  {
    title: "Service Type",
    key: "serviceType",
    width: "120",
  },
  {
    title: "Auction Charge Desc",
    key: "auctionChargeDescription",
    width: "180",
  },
  {
    title: "Description",
    key: "description",
    width: "120",
  },
  {
    title: "Amount",
    key: "amount",
    width: "140",
    fixed: "right",
    render(row) {
      return h(
        "span",
        {
          class:
            "font-semibold bg-gray-800/10 border-2 rounded border-gray-500 px-3 py-2",
        },
        {
          default: () => `$${format(row.amount)}`,
        }
      );
    },
  },
];

const invoicePaymentsColumns = [
  {
    title: "Invoice Number",
    key: "invoiceNumber",
    width: "150",
  },
  {
    title: "Paid Date",
    key: "paidDate",
    width: "120",
  },
  {
    title: "Status",
    key: "paidStatus",
    width: "100",
  },
  {
    title: "Method",
    key: "paymentMethod",
    width: "100",
  },
  {
    title: "Amount",
    key: "amount",
    width: "140",
    fixed: "right",
    render(row) {
      return h(
        "span",
        {
          class:
            "font-semibold bg-gray-800/10 border-2 rounded border-gray-500 px-3 py-2",
        },
        {
          default: () => `$${format(row.amount)}`,
        }
      );
    },
  },
];
</script>

<template>
  <header class="flex content-center justify-between">
    <section class="space-y-4">
      <div>
        <h3 class="text-xs">Invoice ID</h3>
        <strong>
          {{ currentManheim.id }}
        </strong>
      </div>
      <div>
        <h3 class="text-xs">Invoice Date</h3>
        <strong v-if="currentManheim.invoiceDate">
          {{ dayjs(currentManheim.invoiceDate).format("MM/DD/YYYY") }}
        </strong>
      </div>
    </section>
    <section class="space-y-4">
      <div
        class="border border-primary bg-primary/10 px-3 py-1 text-center font-bold uppercase"
      >
        {{ currentManheim.totalPaidStatus }}
      </div>
      <div class="text-right">
        <h3 class="text-xs">Sale Price</h3>
        <strong> ${{ format(currentManheim.salePriceAmount) }} </strong>
      </div>
    </section>
  </header>
  <main class="mt-4">
    <h3 class="text-sm font-bold">Invoice Items</h3>
    <n-data-table
      class="pt-5"
      :bordered="false"
      :data="currentManheim.invoice_items"
      :columns="invoiceItemsColumns"
      :max-height="500"
    />
  </main>
  <footer class="mt-5 flex flex-col justify-between gap-5 lg:flex-row">
    <section class="lg:max-w-[65%]">
      <h3 class="mb-5 text-sm font-bold">Payments</h3>
      <n-data-table
        :max-height="300"
        :data="currentManheim.invoice_payments"
        :columns="invoicePaymentsColumns"
        :bordered="false"
      />
    </section>
    <section
      class="ml-auto w-full max-w-xs rounded bg-gray-100 p-4 dark:bg-dark_border"
    >
      <div class="bg-foreground_light p-4 dark:bg-foreground_dark">
        <h5 class="font-medium uppercase">Total Net Amount</h5>
        <span class="text-lg font-bold"
          >${{ currentManheim.totalNetAmount }}</span
        >
      </div>
      <div class="space-y-2 px-4 pt-5">
        <div>
          <h5 class="font-medium uppercase">Total Tax Amount</h5>
          <span class="text-lg font-bold"
            >${{ currentManheim.totalTaxAmount }}</span
          >
        </div>
        <div>
          <h5 class="font-medium uppercase">Adjustment Amount</h5>
          <span class="text-lg font-bold"
            >${{ currentManheim.totalAdjustmentAmount }}</span
          >
        </div>
        <div>
          <h5 class="font-medium uppercase">Total Paid Amount</h5>
          <span class="text-lg font-bold">
            ${{ currentManheim.totalPaidAmount }}
          </span>
        </div>
        <div>
          <h5 class="font-medium uppercase">Balance Due</h5>
          <span class="text-lg font-bold">
            ${{ currentManheim.balanceDueAmount }}
          </span>
        </div>
      </div>
    </section>
  </footer>
</template>
