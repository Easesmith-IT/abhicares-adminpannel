import { axiosInstance } from "@/utils/axiosInstance";
import { buildQuery } from "@/utils/buildQuery";

const HOMEPAGE_TRENDING_BASE = "/admin/homepage-trending";

function buildUrl(path, params = {}) {
  const query = buildQuery(params);
  return query ? `${path}?${query}` : path;
}

export function fetchHomepageTrendingCities() {
  return axiosInstance.get("/admin/get-availabe-city?limit=100");
}

export function fetchHomepageTrendingServices(params) {
  return axiosInstance.get(
    buildUrl(`${HOMEPAGE_TRENDING_BASE}/services`, params),
  );
}

export function fetchHomepageTrendingProducts(params) {
  return axiosInstance.get(
    buildUrl(`${HOMEPAGE_TRENDING_BASE}/products`, params),
  );
}

export function fetchHomepageTrendingPackages(params) {
  return axiosInstance.get(
    buildUrl(`${HOMEPAGE_TRENDING_BASE}/packages`, params),
  );
}

export function updateHomepageTrendingService(serviceId, payload) {
  return axiosInstance.patch(
    `${HOMEPAGE_TRENDING_BASE}/services/${serviceId}`,
    payload,
  );
}

export function updateHomepageTrendingProduct(productId, payload) {
  return axiosInstance.patch(
    `${HOMEPAGE_TRENDING_BASE}/products/${productId}`,
    payload,
  );
}

export function updateHomepageTrendingPackage(packageId, payload) {
  return axiosInstance.patch(
    `${HOMEPAGE_TRENDING_BASE}/packages/${packageId}`,
    payload,
  );
}
