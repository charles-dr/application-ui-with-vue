<script setup>
import axios from "axios";
import { useQuery } from "vue-query";
import TweetItem from './TweetItem.vue';

const dummyTweets = [
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
const { data: tweets, isLoading: isLoadingTweets } = useQuery(
  ["tweets"],
  ({ queryKey }) => axios.get("https://jsonplaceholder.typicode.com/todos/1").then((res) => dummyTweets)
);
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
      <tr v-if="isLoadingTweets">
        <td span="3">Loading Data...</td>
      </tr>
      <TweetItem
        v-if="!isLoadingTweets"
        v-for="tweet in tweets"
        :key="tweet.username + tweet.time"
        v-bind="tweet"
      />
      <tr v-if="!isLoadingTweets">
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