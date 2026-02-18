// api/lookups.ts
import { axiosInstance } from "@/utils/axiosInstance";

export const fetchLookup = async (
  entity,
  search = "",
  page = 1,
  limit = 20
) => {
  const { data } = await axiosInstance.get(`/lookups/${entity}`, {
    params: { search, page, limit },
  });

  return data.data;
};
