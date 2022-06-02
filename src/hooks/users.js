import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const getUsers = () =>
  useQuery(
    "users",
    () => axios.get("/users").then((res) => res.data.data)
  );
