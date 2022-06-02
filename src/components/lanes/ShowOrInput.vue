<script setup>
import { ref, nextTick, watch } from "vue";

const props = defineProps({
  value: [String, Number],
  onUpdateValue: [Function, Array],
  inputType: {
    type: String,
    default: "text",
  },
});
const isEdit = ref(false);
const inputRef = ref(null);
const inputValue = ref(props.value);

watch(
  () => props.value,
  () => {
    inputValue.value = props.value ?? "";
  }
);
function handleOnClick() {
  isEdit.value = true;
  nextTick(() => {
    inputRef.value.focus();
  });
}
function handleChange() {
  if (props.value !== inputValue.value.trim())
    props.onUpdateValue(inputValue.value);
  isEdit.value = false;
  inputValue.value = props.value;
}
</script>

<template>
  <div @click="handleOnClick">
    <n-input
      ref="inputRef"
      :type="inputType"
      @blur="handleChange"
      @keyup.enter="handleChange"
      v-model:value="inputValue"
      v-if="isEdit"
    />
    <n-ellipsis v-else-if="value" :tooltip="{ style: { maxWidth: '400px' } }">
      {{ value }}
    </n-ellipsis>
    <span v-else class="block p-4"></span>
  </div>
</template>
