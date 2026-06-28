export const HOMEPAGE_TRENDING_DEFAULT_TAB = "services";
export const HOMEPAGE_TRENDING_DEFAULT_LIMIT = 10;
export const HOMEPAGE_TRENDING_DEFAULT_ENABLED = "all";

export const HOMEPAGE_TRENDING_TABS = [
  { value: "services", label: "Services" },
  { value: "products", label: "Products" },
  { value: "packages", label: "Packages" },
];

export const HOMEPAGE_TRENDING_ENABLED_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "enabled", label: "Enabled" },
  { value: "disabled", label: "Disabled" },
];

function normalizePositiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export function normalizeHomepageTrendingTab(value) {
  return HOMEPAGE_TRENDING_TABS.some((tab) => tab.value === value)
    ? value
    : HOMEPAGE_TRENDING_DEFAULT_TAB;
}

export function normalizeHomepageTrendingEnabled(value) {
  return HOMEPAGE_TRENDING_ENABLED_OPTIONS.some(
    (option) => option.value === value,
  )
    ? value
    : HOMEPAGE_TRENDING_DEFAULT_ENABLED;
}

export function getHomepageTrendingUrlState(searchParams, fallbackCityId = "") {
  return {
    cityId: searchParams.get("cityId") || fallbackCityId || "",
    tab: normalizeHomepageTrendingTab(searchParams.get("tab")),
    enabled: normalizeHomepageTrendingEnabled(searchParams.get("enabled")),
    search: searchParams.get("search") || "",
    page: normalizePositiveInt(searchParams.get("page"), 1),
    limit: normalizePositiveInt(
      searchParams.get("limit"),
      HOMEPAGE_TRENDING_DEFAULT_LIMIT,
    ),
    categoryId: searchParams.get("categoryId") || "",
    serviceId: searchParams.get("serviceId") || "",
  };
}

export function buildHomepageTrendingSearchParams(state) {
  const params = new URLSearchParams();
  const normalizedTab = normalizeHomepageTrendingTab(state.tab);
  const normalizedEnabled = normalizeHomepageTrendingEnabled(state.enabled);
  const normalizedPage = normalizePositiveInt(state.page, 1);
  const normalizedLimit = normalizePositiveInt(
    state.limit,
    HOMEPAGE_TRENDING_DEFAULT_LIMIT,
  );
  const trimmedSearch = state.search?.trim() || "";

  if (state.cityId) {
    params.set("cityId", state.cityId);
  }

  params.set("tab", normalizedTab);
  params.set("enabled", normalizedEnabled);
  params.set("page", String(normalizedPage));
  params.set("limit", String(normalizedLimit));

  if (trimmedSearch) {
    params.set("search", trimmedSearch);
  }

  if (state.categoryId) {
    params.set("categoryId", state.categoryId);
  }

  if (normalizedTab !== "services" && state.serviceId) {
    params.set("serviceId", state.serviceId);
  }

  return params;
}

export function buildHomepageTrendingRequestParams(state) {
  const params = {
    cityId: state.cityId,
    page: state.page,
    limit: state.limit,
  };

  if (state.search?.trim()) {
    params.search = state.search.trim();
  }

  if (state.categoryId) {
    params.categoryId = state.categoryId;
  }

  if (state.tab !== "services" && state.serviceId) {
    params.serviceId = state.serviceId;
  }

  if (state.enabled === "enabled") {
    params.enabled = "true";
  } else if (state.enabled === "disabled") {
    params.enabled = "false";
  }

  return params;
}

export function getHomepageTrendingTabStateForCity(state, cityId) {
  return {
    ...state,
    cityId,
    categoryId: "",
    serviceId: "",
    page: 1,
  };
}

export function getHomepageTrendingTabStateForTabChange(state, tab) {
  return {
    ...state,
    tab,
    page: 1,
    serviceId: tab === "services" ? "" : state.serviceId,
  };
}

export function getHomepageTrendingTabStateForFilterChange(state, updates) {
  return {
    ...state,
    ...updates,
    page: 1,
  };
}
