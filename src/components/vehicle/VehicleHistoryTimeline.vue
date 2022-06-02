<script setup>
import axios from "axios";
import { h, ref, reactive, watch, computed } from "vue";
import { useRoute } from "vue-router";
import Card from "@/components/_refactor/Card.vue";
import Input from "@/components/common/Input.vue";
import { toRef } from "vue";
import { format } from "date-fns";
import { NTag } from "naive-ui";

const props = defineProps({
  logEvents: Array,
  currentPage: Number,
  totalPage: Number
});

const $emit = defineEmits(["onPageChange"])

const route = useRoute();
const routeParamId = ref(route.params?.id);

const actionToTagType = (action) => {
  if (action === "create") return "success";
  else if (action === "update") return "warning";
  else if (action === "delete") return "error";
  else return "info";
};

const columns = [
  {
    title: 'action',
    key: 'action',
    align: 'left',
    render (row) {
      if (!row.action)
        return null;

      const actions = h(
        NTag,
        {
          style: {
            marginRight: '0px'
          },
          type: actionToTagType(row.action)
        },
        {
          default: () => row.action
        }
      )

      return actions
    }
  },
  {
    title: 'user',
    key: 'user'
  },
  {
    title: 'table',
    key: 'table'
  },
  {
    title: 'column name',
    key: 'column_name'
  },
  {
    title: 'old value',
    key: 'old_value'
  },
  {
    title: 'new value',
    key: 'new_value'
  },
  {
    title: 'time',
    key: 'time'
  }
];

const data = computed(() =>
  props.logEvents?.map((event, index) =>{
    return {
      action: event.action.name,
      user:event.user_id === 0 ? 'system' : event.user_name,
      table: event.table_name.name,
      time: format(Date.parse(event.updated_at), 'MM/dd/yyyy hh:mm:ss aaa'),
      children: event.columns_touched?.filter(column => {
          if (column.name === 'updated_at'|| column.name === 'created_at') {
            return false;
          } else {
            return true;
          }
        }).map(column => {
          return {
            column_name: column.name,
            new_value: column.new_value,
            old_value: column.old_value,
            time: format(Date.parse(column.updated_at), 'MM/dd/yyyy hh:mm:ss aaa')
          };
        })
    }
  })
);

const rowKey = row => row.index;

const handleUpdatePage = (pageNum) => {
  $emit('onPageChange', pageNum);
}
</script>
<template>
  <Card class="p-[20px]">
    <n-data-table
      :columns="columns"
      :data="data"
      :row-key="rowKey"
    />
    <n-pagination class="mt-[20px]" v-model:page="currentPage" :page-count="totalPage" :on-update:page="handleUpdatePage" />
  </Card>
</template>
<style lang="scss"></style>
