<script setup>
import TweetItem from './TweetItem.vue';
const tweets = [
  {
    username: 'firstuser',
    time: '11:33:22 AM',
    content: 'Hello vue',
    link: 'https://tweeter.com/someid',
  },
  {
    username: 'secondtuser',
    time: '11:33:22 AM',
    content: 'How are you doing?',
    link: 'https://tweeter.com/someid',
  },
  {
    username: 'third',
    time: '06:23:22 AM',
    content: 'What is the top news today?',
    link: 'https://tweeter.com/someid',
  },
];
</script>
<template>
  <n-table
    :bordered="false"
    :bottom-bordered="false"
  >
    <thead>
      <tr>
        <th>User</th>
        <th>Tweet</th>
        <th>Tweet Link</th>
      </tr>
    </thead>
    <tbody>
      <TweetItem
        v-for="tweet in tweets"
        :key="tweet.username + tweet.time"
        v-bind="tweet"
      />
      <tr>
        <td>
          <n-avatar round size="medium" src="/images/avatar.png" />
        </td>
        <td>
          <p class="text-sm mb-2">@username <span class="text-xs ml-2">11:52:12 PM</span></p>
          <span>tweet content</span>
        </td>
        <td>
          <n-anchor style="z-index: 1" type="block">
            <n-anchor-link title="Click to view tweet" href="#tweet" />
          </n-anchor>
        </td>
      </tr>
    </tbody>
  </n-table>
</template>