<script setup>
const props = defineProps({
  username: String,
  time: String,
  content: String,
  link: String,
})
</script>
<template>
  <tr>
    <td>
      <n-avatar round size="medium" src="/images/avatar.png" />
    </td>
    <td>
      <p class="text-sm mb-2">@{{props.username}} <span class="text-xs ml-2">{{props.time}}</span></p>
      <span>{{props.content}}</span>
    </td>
    <td>
      <a class="hover:text-gray-500 transition" :href="props.link" target="_blank">Click here</a>
    </td>
  </tr>
</template>
