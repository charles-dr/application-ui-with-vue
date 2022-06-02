import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const getPermissions = () =>
  useQuery(
    "permissions",
    () => axios.get("/permissions").then((res) => res.data.data)
  );
