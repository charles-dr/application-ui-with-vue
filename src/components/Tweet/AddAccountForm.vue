<script setup>
import { ref } from 'vue';
import { useMutation, useQueryClient } from "vue-query";
import axios from 'axios';
import { useMessage } from "naive-ui";

const message = useMessage();
const queryClient = useQueryClient();
const formRef = ref(null);
const model = ref({
  username: '',
  url: '',
  avatar: '',
  webhook: '',
  keywords: '',
  blacklist: '',
});
const rules = ref({
  username: [{ required: true }],
  // url: [{ required: true }],
  // webhook: [{ required: true }],
})
const { mutate: addUserReq } = useMutation(
  (data) => axios.post("https://jsonplaceholder.typicode.com/postss", data),
  {
    onSuccess() {
      message.success("User Created Successfully");
      queryClient.invalidateQueries("tweets");
    },
    onError(error, variables, context) {
      message.error('Failed to create user!');
      console.log('[Create User] error', error);
    }
  }
);
const handleOnSubmit = () => {
  formRef.value?.validate(errors => {
    if (errors) return;
    addUserReq(model.value);
  });
}
</script>
<template>
  <n-form class="bg-[#18181c] p-4" ref="formRef" :model="model" :rules="rules">
    <n-form-item path="username" label="Username">
      <n-input v-model:value="model.username" @keydown.enter.prevent placeholder="@tweetuser" />
    </n-form-item>
    <n-form-item path="url" label="url">
      <n-input v-model:value="model.url" @keydown.enter.prevent placeholder="https://tweeter.com/tweeteruser" />
    </n-form-item>
    <n-form-item path="avatar" label="avatar">
      <n-input v-model:value="model.avatar" @keydown.enter.prevent placeholder="https://website.com/image.png" />
    </n-form-item>
    <n-form-item path="webhook" label="webhook">
      <n-input v-model:value="model.webhook" @keydown.enter.prevent placeholder="https://discord.com/webhooks/:id" />
    </n-form-item>
    <n-form-item path="keywords" label="keywords">
      <n-input v-model:value="model.keywords" @keydown.enter.prevent />
    </n-form-item>
    <n-form-item path="blacklist" label="blacklist">
      <n-input type="textarea" v-model:value="model.blacklist" @keydown.enter.prevent />
    </n-form-item>
    <div class="flex justify-center">
      <n-button class="mr-4 bg-[#242424]" tertiary type="success" attr-type="submit" @click.prevent="handleOnSubmit">Submit</n-button>
      <n-button class="ml-4" tertiary type="error">Cancel</n-button>
    </div>
  </n-form>
</template>