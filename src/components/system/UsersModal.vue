<script setup>
import axios from "axios";
import { h, ref, reactive, watch, unref } from "vue";
import CustomInput from "@/components/common/CustomInput.vue";
import { NButton } from "naive-ui";
import { getUsers } from "@/hooks/users.js";
import ActionButtons from "@/components/common/ActionButtons.vue";
import CurrencyInput from "@/components/common/CurrencyInput.vue";
import dayjs from "dayjs";
import { objectFilter } from "@/lib/helper.js";
import { useQueryClient } from "vue-query";

const queryClient = useQueryClient();

const showEditModal = ref(false);
const formRef = ref(null);
const initialFormValue = {
  first_name: '',
  last_name: '',
  email: '',
  signature: {}
};
const editingUser = ref({ ...initialFormValue });
const isEditing = ref(false);
const showModal = ref(false);

const { data: users, isLoading } = getUsers();

const columns = [
  {
    title: "first name",
    key: "first_name",
    width: 100,
    // fixed: "left",
  },
  {
    title: "last name",
    key: "last_name",
    width: 100,
    //fixed: 'left'
  },
  {
    title: "email",
    key: "email",
    width: 110,
    //fixed: 'left'
  },
  {
    title: "Action",
    key: "actions",
    width: 100,
    fixed: "right",
    render(row) {
      return h(ActionButtons, {
        deleteTitle: "Delete User",
        showDeleteButton: true,
        onEdit: () => {
          isEditing.value = true;
          showEditModal.value = true;
          editingUser.value = {
            ...row,
            active: Boolean(row.active),
          };
        },
        onDelete: async () => {
          await axios.delete("/users/" + row.id);
          await queryClient.invalidateQueries("users");
        },
      });
    },
  },
];

const rules = {
  name: {
    required: true,
    message: "Required",
    trigger: "input",
  },
  amount: {
    required: true,
    type: "number",
    trigger: "input",
    validator(rules, value) {
      if (value < 0.01) {
        return new Error("should be greater than $0.01");
      }
    },
  },
  effective_date: {
    required: true,
    message: "Date is required",
    trigger: "blur",
  },
  percentage: {
    type: "number",
    trigger: "input",
    validator(rules, value) {
      if (value < 0 || value > 100) {
        return new Error("should be between 0 and 100");
      }
    },
  },
};

const addRow = () => {
  showEditModal.value = true;
  isEditing.value = false;
  editingUser.value = { ...initialFormValue };
};

const onCancelEditingModal = () => {
  showEditModal.value = false;
};

const onOkEditingModal = async () => {
  try {
    await formRef.value.validate();

    const obj = unref(editingUser);
    // obj.active = Number(obj.active);
    // if (!obj.description) delete obj.description;

    if (isEditing.value) {
      await axios.put(`/users/${editingUser.value.id}`, obj);
    } else {
      await axios.post("/users", obj);
    }
    await queryClient.invalidateQueries("users");
    showEditModal.value = false;
  } catch {}
};
</script>
<template>
  <article>
    <div class="px-6 pt-6 pb-8" @click="showModal = true">
      <div class="mb-2 text-lg font-bold">Users</div>
      <div class="pb-2 text-sm">Click to edit users.</div>
    </div>

    <n-modal
      v-model:show="showModal"
      size="huge"
      title="Users"
      class="max-w-screen-lg"
      preset="card"
    >
      <div class="mb-5">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button @click="addRow">+</n-button>
          </template>
          Create a User
        </n-tooltip>
      </div>
      <n-data-table
        class="rounded-md"
        striped
        :columns="columns"
        :data="users"
        :bordered="false"
        :loading="isLoading"
        virtual-scroll
        :max-height="500"
      />
    </n-modal>
    <n-modal
      :title="isEditing ? 'Edit User' : 'Add User'"
      preset="card"
      class="max-w-[600px]"
      v-model:show="showEditModal"
    >
      <n-form
        ref="formRef"
        :model="editingUser"
        :rules="rules"
        class="grid grid-cols-12 gap-x-5"
      >
        <div class="col-span-4">
          <n-form-item label="First Name" path="first name">
            <n-input v-model:value="editingUser.first_name" />
          </n-form-item>
        </div>
        <div class="col-span-4">
          <n-form-item label="Last Name" path="last name">
            <n-input v-model:value="editingUser.last_name" />
          </n-form-item>
        </div>
        <div class="col-span-4">
          <n-form-item label="Email" path="Email">
            <n-input v-model:value="editingUser.email" />
          </n-form-item>
        </div>
      </n-form>

      <template #footer>
        <div class="flex flex-row gap-[10px]">
          <n-button size="large" @click="onOkEditingModal">OK</n-button>
          <n-button size="large" @click="onCancelEditingModal">Cancel</n-button>
        </div>
      </template>
    </n-modal>
  </article>
</template>
