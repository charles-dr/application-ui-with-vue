import axios from "axios";
import { defineStore } from "pinia";
import { useLocalStorage } from "@vueuse/core";
import { ref } from "vue";

export default defineStore("auth", () => {
	const token = ref(localStorage.getItem("token"));
	const user = ref(null);
	const isLoading = ref(false);
	const isFetched = ref(false);

	let timeout;
	const boot = async () => {
		if (timeout) clearTimeout(timeout);
		isLoading.value = true;
		token.value = localStorage.getItem("token");
		try {
			if (token.value) {
				const { data } = await axios.get("/me", {
					headers: {
						Authorization: `Bearer ${token.value}`,
					},
				});
				axios.defaults.headers["X-Authorization"] =
					import.meta.env.API_TOKEN;
				user.value = data;
			}
			timeout = setTimeout(() => {
				isLoading.value = false;
			}, 3000);
			isFetched.value = true;
		} catch (error) {
			timeout = setTimeout(() => {
				isLoading.value = false;
			}, 3000);
			isFetched.value = true;
		}
	};

	const logout = async () => {
		if (timeout) clearTimeout(timeout);
		isLoading.value = true;

		try {
			await axios.post(
				"/logout",
				{},
				{
					headers: {
						Authorization: `Bearer ${token.value}`,
					},
				}
			);
			user.value = null;
			token.value = null;
			localStorage.removeItem("token");
			timeout = setTimeout(() => {
				isLoading.value = false;
			}, 3000);
		} catch (error) {
			timeout = setTimeout(() => {
				isLoading.value = false;
			}, 3000);
		}
	};
	return { user, isLoading, boot, isFetched, logout };
});
