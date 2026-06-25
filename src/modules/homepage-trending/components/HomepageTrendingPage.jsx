import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
  AlertCircle,
  LockKeyhole,
  MapPin,
  RefreshCw,
  Search,
  Sparkles,
} from "lucide-react";

import { useCustomSidebar } from "@/components/layout/sidebarContext";
import { PaginationComp } from "@/components/shared/PaginationComp";
import { H2 } from "@/components/shared/typography";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Wrapper from "@/components/wrappers/Wrapper";
import useDebounce from "@/hooks/useDebounce";
import {
  fetchHomepageTrendingCities,
  fetchHomepageTrendingPackages,
  fetchHomepageTrendingProducts,
  fetchHomepageTrendingServices,
  updateHomepageTrendingPackage,
  updateHomepageTrendingProduct,
  updateHomepageTrendingService,
} from "../api/homepageTrending.api";
import PackagesTrendingTable from "./PackagesTrendingTable";
import ProductsTrendingTable from "./ProductsTrendingTable";
import ServicesTrendingTable from "./ServicesTrendingTable";
import {
  HOMEPAGE_TRENDING_DEFAULT_ENABLED,
  HOMEPAGE_TRENDING_DEFAULT_LIMIT,
  HOMEPAGE_TRENDING_ENABLED_OPTIONS,
  HOMEPAGE_TRENDING_TABS,
  buildHomepageTrendingRequestParams,
  buildHomepageTrendingSearchParams,
  getHomepageTrendingTabStateForCity,
  getHomepageTrendingTabStateForFilterChange,
  getHomepageTrendingTabStateForTabChange,
  getHomepageTrendingUrlState,
} from "../utils/homepageTrending.filters";
import { getApiErrorMessage, getApiErrorStatus } from "../utils/homepageTrending.errors";
import {
  buildCatalogTogglePayload,
  buildServiceTogglePayload,
  collectCategoryOptions,
  collectServiceOptions,
  mapHomepageTrendingPackage,
  mapHomepageTrendingProduct,
  mapHomepageTrendingService,
  mergeFilterOptions,
} from "../utils/homepageTrending.mappers";

const ALL_FILTER_VALUE = "__all__";

export default function HomepageTrendingPage() {
  const { selectedCityId: globalCityId, setSelectedCity } = useCustomSidebar();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryState = getHomepageTrendingUrlState(searchParams, globalCityId);
  const [searchValue, setSearchValue] = useState(queryState.search);
  const debouncedSearch = useDebounce(searchValue, 400);

  const [cities, setCities] = useState([]);
  const [citiesLoading, setCitiesLoading] = useState(false);

  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [mutationError, setMutationError] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: HOMEPAGE_TRENDING_DEFAULT_LIMIT,
    total: 0,
    totalPages: 0,
  });
  const [rowLoadingMap, setRowLoadingMap] = useState({});
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    services: [],
  });

  function updateUrlState(nextState, options = {}) {
    setSearchParams(buildHomepageTrendingSearchParams(nextState), options);
  }

  useEffect(() => {
    if (searchValue !== queryState.search) {
      setSearchValue(queryState.search);
    }
  }, [queryState.search, searchValue]);

  useEffect(() => {
    const urlCityId = searchParams.get("cityId");

    if (!urlCityId && globalCityId) {
      updateUrlState(
        {
          ...queryState,
          cityId: globalCityId,
        },
        { replace: true },
      );
    }
  }, [globalCityId, queryState, searchParams]);

  useEffect(() => {
    let ignore = false;

    async function loadCities() {
      try {
        setCitiesLoading(true);
        const response = await fetchHomepageTrendingCities();

        if (ignore) {
          return;
        }

        setCities(response.data?.data || []);
      } catch (error) {
        if (!ignore) {
          toast.error(getApiErrorMessage(error));
        }
      } finally {
        if (!ignore) {
          setCitiesLoading(false);
        }
      }
    }

    loadCities();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (debouncedSearch === queryState.search) {
      return;
    }

    updateUrlState(
      getHomepageTrendingTabStateForFilterChange(queryState, {
        search: debouncedSearch,
      }),
      { replace: true },
    );
  }, [debouncedSearch, queryState]);

  useEffect(() => {
    setFilterOptions({
      categories: [],
      services: [],
    });
  }, [queryState.cityId, queryState.tab]);

  useEffect(() => {
    if (!queryState.cityId) {
      setRows([]);
      setFetchError(null);
      setPagination({
        page: 1,
        limit: queryState.limit,
        total: 0,
        totalPages: 0,
      });
      return;
    }

    let ignore = false;

    async function loadTrendingRows() {
      try {
        setIsLoading(true);
        setFetchError(null);

        const requestParams = buildHomepageTrendingRequestParams(queryState);
        let response;
        let mappedRows = [];

        if (queryState.tab === "services") {
          response = await fetchHomepageTrendingServices(requestParams);
          mappedRows = (response.data?.data || []).map(mapHomepageTrendingService);
        } else if (queryState.tab === "products") {
          response = await fetchHomepageTrendingProducts(requestParams);
          mappedRows = (response.data?.data || []).map(mapHomepageTrendingProduct);
        } else {
          response = await fetchHomepageTrendingPackages(requestParams);
          mappedRows = (response.data?.data || []).map(mapHomepageTrendingPackage);
        }

        if (ignore) {
          return;
        }

        setRows(mappedRows);
        setPagination({
          page: response.data?.pagination?.page || queryState.page,
          limit: response.data?.pagination?.limit || queryState.limit,
          total: response.data?.pagination?.total || 0,
          totalPages: response.data?.pagination?.totalPages || 0,
        });
        setFilterOptions((current) => ({
          categories: mergeFilterOptions(
            current.categories,
            collectCategoryOptions(mappedRows),
          ),
          services:
            queryState.tab === "services"
              ? []
              : mergeFilterOptions(
                  current.services,
                  collectServiceOptions(mappedRows),
                ),
        }));
      } catch (error) {
        if (!ignore) {
          setRows([]);
          setFetchError(error);
          setPagination({
            page: queryState.page,
            limit: queryState.limit,
            total: 0,
            totalPages: 0,
          });
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadTrendingRows();

    return () => {
      ignore = true;
    };
  }, [
    queryState.categoryId,
    queryState.cityId,
    queryState.enabled,
    queryState.limit,
    queryState.page,
    queryState.search,
    queryState.serviceId,
    queryState.tab,
  ]);

  async function handleToggle(rowId, nextValue) {
    const previousRow = rows.find((row) => row.id === rowId);

    if (!previousRow || !queryState.cityId) {
      return;
    }

    const payload =
      queryState.tab === "services"
        ? buildServiceTogglePayload(queryState.cityId, nextValue)
        : buildCatalogTogglePayload(queryState.cityId, nextValue);

    setMutationError("");
    setRowLoadingMap((current) => ({
      ...current,
      [rowId]: true,
    }));
    setRows((current) =>
      current.map((row) =>
        row.id === rowId ? { ...row, homepageEnabled: nextValue } : row,
      ),
    );

    try {
      let response;

      if (queryState.tab === "services") {
        response = await updateHomepageTrendingService(rowId, payload);
      } else if (queryState.tab === "products") {
        response = await updateHomepageTrendingProduct(rowId, payload);
      } else {
        response = await updateHomepageTrendingPackage(rowId, payload);
      }

      toast.success(response?.data?.message || "Homepage status updated successfully");
    } catch (error) {
      const message = getApiErrorMessage(error);

      setRows((current) =>
        current.map((row) =>
          row.id === rowId
            ? { ...row, homepageEnabled: previousRow.homepageEnabled }
            : row,
        ),
      );
      setMutationError(message);
      toast.error(message);
    } finally {
      setRowLoadingMap((current) => {
        const nextMap = { ...current };
        delete nextMap[rowId];
        return nextMap;
      });
    }
  }

  function handleCityChange(cityId) {
    const selectedCity = cities.find((city) => city._id === cityId);

    if (selectedCity) {
      setSelectedCity(selectedCity);
    }

    updateUrlState(
      getHomepageTrendingTabStateForCity(queryState, cityId),
    );
  }

  function handleTabChange(tab) {
    updateUrlState(getHomepageTrendingTabStateForTabChange(queryState, tab));
  }

  function handleEnabledChange(enabled) {
    updateUrlState(
      getHomepageTrendingTabStateForFilterChange(queryState, { enabled }),
    );
  }

  function handleCategoryChange(categoryId) {
    updateUrlState(
      getHomepageTrendingTabStateForFilterChange(queryState, {
        categoryId: categoryId === ALL_FILTER_VALUE ? "" : categoryId,
        serviceId: "",
      }),
    );
  }

  function handleServiceChange(serviceId) {
    updateUrlState(
      getHomepageTrendingTabStateForFilterChange(queryState, {
        serviceId: serviceId === ALL_FILTER_VALUE ? "" : serviceId,
      }),
    );
  }

  function handlePageChange(page) {
    const resolvedPage =
      typeof page === "function" ? page(queryState.page) : page;

    updateUrlState({
      ...queryState,
      page: resolvedPage,
    });
  }

  function clearFilters() {
    setSearchValue("");
    setMutationError("");
    updateUrlState({
      ...queryState,
      enabled: HOMEPAGE_TRENDING_DEFAULT_ENABLED,
      search: "",
      page: 1,
      categoryId: "",
      serviceId: "",
    });
  }

  const fetchErrorStatus = getApiErrorStatus(fetchError);
  const showPermissionDenied = fetchErrorStatus === 403;
  const showSessionExpired = fetchErrorStatus === 401;
  const showFetchError = Boolean(fetchError) && !showPermissionDenied && !showSessionExpired;

  return (
    <Wrapper>
      <div className="space-y-6">
        <section className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <H2 className="text-slate-900">Homepage Trending</H2>
                  <Badge variant="outline" className="border-blue-100 bg-blue-50 text-blue-700">
                    City scoped
                  </Badge>
                </div>
                <p className="max-w-3xl text-sm text-slate-600">
                  Manage city-wise homepage visibility for services, products, and packages with
                  URL-synced filters and inline toggles.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                  {pagination.total} result{pagination.total === 1 ? "" : "s"}
                </Badge>
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <RefreshCw className="size-4" />
                  Reset Filters
                </Button>
              </div>
            </div>

            <Tabs value={queryState.tab} onValueChange={handleTabChange}>
              <TabsList className="w-fit bg-slate-100">
                {HOMEPAGE_TRENDING_TABS.map((tab) => (
                  <TabsTrigger key={tab.value} value={tab.value} className="px-4">
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  City
                </p>
                <Select
                  value={queryState.cityId || undefined}
                  onValueChange={handleCityChange}
                  disabled={citiesLoading}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={citiesLoading ? "Loading cities..." : "Select city"} />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city._id} value={city._id}>
                        {city.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Homepage Status
                </p>
                <Select value={queryState.enabled} onValueChange={handleEnabledChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {HOMEPAGE_TRENDING_ENABLED_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Category
                </p>
                <Select
                  value={queryState.categoryId || ALL_FILTER_VALUE}
                  onValueChange={handleCategoryChange}
                  disabled={!queryState.cityId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ALL_FILTER_VALUE}>All categories</SelectItem>
                    {filterOptions.categories.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {queryState.tab !== "services" ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Service
                  </p>
                  <Select
                    value={queryState.serviceId || ALL_FILTER_VALUE}
                    onValueChange={handleServiceChange}
                    disabled={!queryState.cityId}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="All services" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_FILTER_VALUE}>All services</SelectItem>
                      {filterOptions.services.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Mode
                  </p>
                  <div className="flex h-9 items-center rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 text-sm text-slate-500">
                    Category scoped
                  </div>
                </div>
              )}

              <div className="space-y-2 xl:col-span-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Search
                </p>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchValue}
                    onChange={(event) => setSearchValue(event.target.value)}
                    placeholder={`Search ${queryState.tab}...`}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {!queryState.cityId ? (
          <section className="rounded-[28px] border border-white/70 bg-white/90 p-8 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <Empty className="border border-dashed border-slate-200 bg-slate-50/70">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MapPin className="size-5" />
                </EmptyMedia>
                <EmptyTitle>No city selected</EmptyTitle>
                <EmptyDescription>
                  Choose a city first. No API call is made until a city is selected.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </section>
        ) : (
          <>
            {showPermissionDenied ? (
              <Alert variant="warning">
                <LockKeyhole />
                <AlertTitle>Permission denied</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(fetchError)}
                </AlertDescription>
              </Alert>
            ) : null}

            {showSessionExpired ? (
              <Alert variant="danger">
                <AlertCircle />
                <AlertTitle>Session expired</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(fetchError)}
                </AlertDescription>
              </Alert>
            ) : null}

            {showFetchError ? (
              <Alert variant="danger">
                <AlertCircle />
                <AlertTitle>Unable to load trending data</AlertTitle>
                <AlertDescription>
                  {getApiErrorMessage(fetchError)}
                </AlertDescription>
              </Alert>
            ) : null}

            {mutationError ? (
              <Alert variant="danger">
                <Sparkles />
                <AlertTitle>Mutation failed</AlertTitle>
                <AlertDescription>{mutationError}</AlertDescription>
              </Alert>
            ) : null}

            <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
              <div className="border-b border-slate-100 px-6 py-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">
                      {HOMEPAGE_TRENDING_TABS.find((tab) => tab.value === queryState.tab)?.label}
                    </h3>
                    <p className="text-sm text-slate-500">
                      Sticky table headers, server-driven pagination, and city-only homepage toggles.
                    </p>
                  </div>
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                    Page {pagination.page} of {pagination.totalPages || 1}
                  </Badge>
                </div>
              </div>

              <div className="max-h-[68vh] overflow-auto px-4 pb-4 pt-2">
                {queryState.tab === "services" ? (
                  <ServicesTrendingTable
                    rows={rows}
                    isLoading={isLoading}
                    rowLoadingMap={rowLoadingMap}
                    onToggle={handleToggle}
                  />
                ) : null}

                {queryState.tab === "products" ? (
                  <ProductsTrendingTable
                    rows={rows}
                    isLoading={isLoading}
                    rowLoadingMap={rowLoadingMap}
                    onToggle={handleToggle}
                  />
                ) : null}

                {queryState.tab === "packages" ? (
                  <PackagesTrendingTable
                    rows={rows}
                    isLoading={isLoading}
                    rowLoadingMap={rowLoadingMap}
                    onToggle={handleToggle}
                  />
                ) : null}
              </div>

              <div className="border-t border-slate-100 px-6 py-4">
                <PaginationComp
                  page={queryState.page}
                  pageCount={pagination.totalPages}
                  setPage={handlePageChange}
                />
              </div>
            </section>
          </>
        )}
      </div>
    </Wrapper>
  );
}
