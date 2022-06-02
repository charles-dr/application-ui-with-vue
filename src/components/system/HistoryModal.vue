<script setup>
import axios from "axios";
import { h, ref, reactive, watch, unref, computed } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import { NButton } from "naive-ui";
import { getAllLogEvents, getLogEventsByUser } from "@/hooks/history.js";
import { getUsers } from "@/hooks/users.js";
import ActionButtons from "@/components/common/ActionButtons.vue";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import dayjs from "dayjs";
import { objectFilter } from "@/lib/helper.js";
import { useQueryClient } from "vue-query";
import { format } from "date-fns";
import { NTag } from "naive-ui";

const queryClient = useQueryClient();

const showModal = ref(false);
const currentPage = ref(1);
const currentUserId = ref(0);
const { data: logEventsData, isLoading } = getLogEventsByUser(
  currentUserId,
  currentPage
);
const { data: users, isUsersLoading } = getUsers();

const actionToTagType = (action) => {
  if (action === "create") return "success";
  else if (action === "update") return "warning";
  else if (action === "delete") return "error";
  else return "info";
};

const columns = [
  {
    title: "action",
    key: "action",
    align: "left",
    render(row) {
      if (!row.action) return null;

      const actions = h(
        NTag,
        {
          style: {
            marginRight: "0px",
          },
          type: actionToTagType(row.action),
        },
        {
          default: () => row.action,
        }
      );

      return actions;
    },
  },
  {
    title: "user",
    key: "user",
  },
  {
    title: "table",
    key: "table",
  },
  {
    title: "column name",
    key: "column_name",
  },
  {
    title: "old value",
    key: "old_value",
  },
  {
    title: "new value",
    key: "new_value",
  },
  {
    title: "time",
    key: "time",
  },
];

console.log(logEventsData);

const data = computed(() =>
  logEventsData.value?.data?.map((event) => {
    return {
      action: event.action.name,
      user: event.user_id === 0 ? "system" : event.user_name,
      table: event.table_name.name,
      time: format(Date.parse(event.updated_at), "MM/dd/yyyy hh:mm:ss aaa"),
      children: event.columns_touched
        ?.filter((column) => {
          if (column.name === "updated_at" || column.name === "created_at") {
            return false;
          } else {
            return true;
          }
        })
        .map((column) => {
          return {
            column_name: column.name,
            new_value: column.new_value,
            old_value: column.old_value,
            time: format(
              Date.parse(column.updated_at),
              "MM/dd/yyyy hh:mm:ss aaa"
            ),
          };
        }),
    };
  })
);

const totalPage = computed(() => logEventsData.value?.last_page);

const handleUpdatePage = (pageNum) => {
  currentPage.value = pageNum;
};

const userNames = computed(() => [
  { label: "SYSTEM", value: 0 },
  ...users.value?.map((user, userIndex) => {
    return {
      label: user.first_name + " " + user.last_name,
      value: user.id,
    };
  }),
]);

const handleSelectUser = (value) => {
  currentUserId.value = value;
};
</script>
<template>
  <article>
    <div class="px-6 pt-6 pb-8" @click="showModal = true">
      <div class="mb-2 text-lg font-bold">History</div>
      <div class="pb-2 text-sm">Click to see history.</div>
    </div>

    <n-modal
      v-model:show="showModal"
      size="huge"
      title="History"
      class="max-w-screen-lg"
      preset="card"
    >
      <n-select class="w-[200px] mb-[10px] float-right" filterable v-model:value="currentUserId" :options="userNames" :on-update:value="handleSelectUser" />
      <n-data-table
        class="rounded-md"
        striped
        :columns="columns"
        :data="data"
        :bordered="false"
        :loading="isLoading"
        virtual-scroll
        :max-height="500"
      />
      <n-pagination
        class="mt-[20px]"
        v-model:page="currentPage"
        :page-count="totalPage"
        :on-update:page="handleUpdatePage"
      />
    </n-modal>
  </article>
</template>
