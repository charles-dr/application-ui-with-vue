import { createApp } from "vue";
import { createPinia } from "pinia";
import { router } from "@/routes";
import { VueQueryPlugin } from "vue-query";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin.js";
import VueTippy from "vue-tippy";
import axios from "axios";
import App from "./App2.vue";
import naive from "naive-ui";
import { gsap } from "gsap";
import "./scss/index.scss";
import mask from "@/directives/mask";
import ObserveVisibility from "@/directives/observe-visibility";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

axios.defaults.baseURL = import.meta.env.API_URL;

/**
 * @type VueQueryPluginOptions
 */
const vueQueryPluginOptions = {
	queryClientConfig: {
		defaultOptions: {
			queries: {
				refetchOnWindowFocus: false,
			},
		},
	},
};

const app = createApp(App)
	.use(createPinia())
	.use(naive)
	.directive("mask", mask)
	.directive("observe-visibility", ObserveVisibility)
	.use(VueTippy)
	.use(VueQueryPlugin, vueQueryPluginOptions);

// const meta = document.createElement("meta");
// meta.name = "naive-ui-style";
// document.head.appendChild(meta);

app.use(router).mount("#app");
