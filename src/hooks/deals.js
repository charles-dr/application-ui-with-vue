import { useInfiniteQuery, useQuery } from "vue-query";
import axios from "axios";

export const getAllDeals = () =>
  useInfiniteQuery(
    "allDeals",
    ({ pageParam = 1 }) =>
      axios.get("/deals?per_page=10&page=" + pageParam).then((res) => res.data),
    {
      getNextPageParam: (lastPage, pages) =>
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : null,
    }
  );

export const searchDealByVin = (vin) =>
  useQuery(["searchDealByVin", vin], ({ queryKey }) =>
    queryKey[1] === "" || !queryKey[1]
      ? null
      : axios.get("/deals/search_by_vin/" + queryKey[1]).then((res) => res.data)
  );

export const getOwners = (dealId) =>
  useQuery(["owners", dealId], ({ queryKey }) =>
      queryKey[1] ?
      axios.get(`owners/deals/${queryKey[1]}`).then((res) => res.data) :
      []
  );

export const getSellers = (dealId) =>
  useQuery(["sellers", dealId], ({ queryKey }) =>
      queryKey[1] ?
      axios.get(`sellers/deals/${queryKey[1]}`).then((res) => res.data) :
      []
  );

 export const getLogEvents = (dealId, page) =>
  useQuery(["log_events", dealId, "log_events_page", page], ({ queryKey }) =>
      queryKey[1] ?
      axios.get(`log_events/deal/${queryKey[1]}?page=${queryKey[3]}`).then((res) => res.data) :
      []
  );

export const getManheimData = (dealId, page) =>
  useQuery([dealId, page], ({ queryKey }) =>
      queryKey[1] ?
      axios.get(`manheim_data/deal/${queryKey[0]}?page=${queryKey[1]}`).then((res) => res.data) :
      []
  );
