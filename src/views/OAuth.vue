<script setup>
import useAuth from "@/store/auth";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const auth = useAuth();

if (route.query?.token) {
  console.log(route.query?.token);
  localStorage.setItem("token", route.query?.token);
  auth.boot().then(() => {
    router.replace("/");
  });
}
</script>

<template></template>
