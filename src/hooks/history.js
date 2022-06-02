import { useQuery } from "vue-query";
import axios from "axios";

export const getAllLogEvents = (page) =>
  useQuery(["log_events_page", page], ({ queryKey }) =>
      queryKey[1] ?
      axios.get(`log_events?page=${queryKey[1]}`).then((res) => res.data) :
      []
  );

export const getLogEventsByUser = (userId, page) =>
  useQuery(["log_events", userId, page], ({ queryKey }) =>
      queryKey[2] ?
      axios.get(`log_events/user/${queryKey[1]}?page=${queryKey[2]}`).then((res) => res.data) :
      []
  );