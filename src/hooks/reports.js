import axios from "axios";
import { computed, toRaw } from "vue";
import { useQuery } from "vue-query";
import { objectFilter } from "@/lib/helper";

export const getAfterSaleReports = (filter = { auction_id: 1 }) => {
  return useQuery(
    ["after-sale-reports", filter],
    ({ queryKey }) => {
      return (queryKey[1].auction_id && queryKey[1].from_date && queryKey[1].to_date) ? axios
        .get(
          "/reports/after_sale?" +
            new URLSearchParams(
              objectFilter(queryKey[1], (key, value) =>
                typeof value === "number" ? true : value
              )
            ).toString()
        )
        .then((res) => res.data) : null;
    },
    {
      keepPreviousData: true,
    }
  );
};

