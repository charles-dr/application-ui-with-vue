<script setup>
	defineProps(["files"]);
</script>

<template>
	<n-image-group show-toolbar-tooltip>
		<n-image
			width="40"
			:src="file.url"
			v-for="(file, fileIdx) in files"
			:key="file.id"
			:alt="file.name"
			:class="fileIdx !== 0 && 'hidden'"
		/>
	</n-image-group>
</template>
<style lang="scss">
	.n-image {
		img {
			@apply line-clamp-1;
		}
	}
</style>
