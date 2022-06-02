<script setup>

</script>

<template>
  <main class="w-[calc(100vw-60px)] overflow-auto overscroll-contain p-5">
    <section class="mb-12">
      <div class="mt-24 p-4">
        <h2 class="mb-6 text-xl font-bold uppercase">Reports</h2>
      </div>
      <div
        class="mx-6 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <router-link class="single-card h-32 pt-5" to="/reports/after-sale-reports">
          <span class="px-6 pt-6 pb-8 text-lg font-bold">After sale reports</span>
        </router-link>
      </div>
    </section>
  </main>
</template>

<style scoped>
.single-card {
  @apply cursor-pointer rounded-md border-2 border-gray-200 bg-foreground_light shadow-sm transition-shadow hover:shadow-lg dark:border-dark_border dark:bg-foreground_dark dark:shadow-gray-900;
}
</style>
