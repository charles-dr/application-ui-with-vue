import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const getRoles = () =>
  useQuery(
    "roles",
    () => axios.get("/roles").then((res) => res.data)
  );
