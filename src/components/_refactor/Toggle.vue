<script setup>
const props = defineProps({
  label: String,
  value: Boolean,
  class: String,
});
defineEmits(['toggle']);
</script>
<template>
  <div class="flex items-center" :class="props.class">
    <label class="mr-3">{{ props.label }}</label>
    <n-switch :value="props.value" @click="$emit('toggle')" />
  </div>
</template>