import axios from "axios";

export const storage = axios.create({
	baseURL: "https://myapi.com/storage",
	headers: {
		Accept: "*",
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "*",
	},
});

export const api = axios.create({
	baseURL: "https://myapi.com/api",
	headers: {
		Accept: "application/json",
		"Access-Control-Allow-Origin": "*",
		"Content-Type": "application/json",
		"X-Authorization": import.meta.env.API_TOKEN,
	},
});
