import { useQuery } from "vue-query";
import axios from "axios";

export const getPaymentTypes = () =>
	useQuery("payment_type", () =>
		axios.get("/payment_type").then((res) => res.data)
	);
