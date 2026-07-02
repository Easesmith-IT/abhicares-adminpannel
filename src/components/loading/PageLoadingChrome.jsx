import { matchPath, useLocation } from "react-router-dom";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { usePageLoading } from "./PageLoadingProvider";

function LoadingSurface({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-200/80 bg-white/90 p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

function LoadingSectionHeader({
  titleWidth = "w-48",
  subtitleWidth = "w-72",
  actionWidth = "w-32",
}) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 md:flex-row md:items-center md:justify-between">
      <div className="space-y-2">
        <Skeleton className={cn("h-7 rounded-xl", titleWidth)} />
        <Skeleton className={cn("h-4 rounded-full", subtitleWidth)} />
      </div>
      <Skeleton className={cn("h-10 rounded-xl", actionWidth)} />
    </div>
  );
}

function FilterRowSkeleton({ filterCount = 4, wideSearch = true }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {wideSearch ? <Skeleton className="h-10 w-72 rounded-xl" /> : null}
      {Array.from({ length: filterCount }).map((_, index) => (
        <Skeleton
          key={`filter-${index}`}
          className="h-10 w-36 rounded-xl"
        />
      ))}
    </div>
  );
}

function TableCardSkeleton({
  columns = 6,
  rows = 6,
  includeTopAction = false,
  titleWidth = "w-48",
}) {
  return (
    <LoadingSurface className="overflow-hidden p-0">
      {includeTopAction ? (
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div className="space-y-2">
            <Skeleton className={cn("h-6 rounded-xl", titleWidth)} />
            <Skeleton className="h-4 w-72 rounded-full" />
          </div>
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      ) : null}

      <div className="border-b border-slate-100 bg-slate-50/70 px-6 py-4">
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: columns }).map((_, index) => (
            <Skeleton
              key={`table-head-${index}`}
              className="h-4 w-4/5 rounded-full"
            />
          ))}
        </div>
      </div>

      <div className="px-6 py-2">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div
            key={`table-row-${rowIndex}`}
            className="grid gap-4 border-b border-slate-100 py-4 last:border-b-0"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: columns }).map((__, columnIndex) => (
              <Skeleton
                key={`table-cell-${rowIndex}-${columnIndex}`}
                className={cn(
                  "h-4 rounded-full",
                  columnIndex === columns - 1 ? "w-3/4 justify-self-end" : "w-5/6"
                )}
              />
            ))}
          </div>
        ))}
      </div>
    </LoadingSurface>
  );
}

function GridCardSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingSurface key={`grid-card-${index}`} className="overflow-hidden p-0">
          <Skeleton className="h-44 w-full rounded-none" />
          <div className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <Skeleton className="h-5 w-40 rounded-full" />
                <Skeleton className="h-4 w-24 rounded-full" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 w-9 rounded-xl" />
                <Skeleton className="h-9 w-9 rounded-xl" />
              </div>
            </div>
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <Skeleton className="h-4 w-4/6 rounded-full" />
          </div>
        </LoadingSurface>
      ))}
    </div>
  );
}

function StatsGridSkeleton({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingSurface key={`stat-${index}`}>
          <div className="flex items-start justify-between gap-3">
            <Skeleton className="h-12 w-12 rounded-2xl" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-3 w-32 rounded-full" />
          </div>
        </LoadingSurface>
      ))}
    </div>
  );
}

function SidebarStackSkeleton({ count = 4 }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <LoadingSurface key={`sidebar-card-${index}`}>
          <div className="space-y-3">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </LoadingSurface>
      ))}
    </div>
  );
}

function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-80 rounded-2xl" />
          <Skeleton className="h-4 w-[30rem] max-w-full rounded-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>

      <StatsGridSkeleton count={6} />

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <LoadingSurface key={`alert-${index}`}>
            <div className="flex items-start gap-3">
              <Skeleton className="h-10 w-10 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-40 rounded-full" />
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-2/3 rounded-full" />
              </div>
            </div>
          </LoadingSurface>
        ))}
      </div>

      <TableCardSkeleton
        includeTopAction
        titleWidth="w-44"
        columns={4}
        rows={5}
      />
    </div>
  );
}

function TablePageSkeleton({
  headerTitleWidth = "w-56",
  includePrimaryAction = true,
  columns = 6,
  rows = 6,
  filterCount = 3,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className={cn("h-8 rounded-2xl", headerTitleWidth)} />
          <Skeleton className="h-4 w-[26rem] max-w-full rounded-full" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
          {includePrimaryAction ? (
            <Skeleton className="h-10 w-36 rounded-xl" />
          ) : null}
        </div>
      </div>

      <FilterRowSkeleton filterCount={filterCount} />
      <TableCardSkeleton columns={columns} rows={rows} />

      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={`page-pill-${index}`}
              className="h-9 w-9 rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CatalogGridPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-36 rounded-2xl" />
          <Skeleton className="h-4 w-28 rounded-full" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-10 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      <LoadingSurface>
        <div className="grid gap-4 md:grid-cols-[220px_minmax(0,1fr)]">
          <Skeleton className="h-40 w-full rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-6 w-48 rounded-xl" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Skeleton className="h-14 w-full rounded-2xl" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </LoadingSurface>

      <GridCardSkeleton />

      <div className="flex justify-between">
        <Skeleton className="h-4 w-24 rounded-full" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton
              key={`catalog-page-pill-${index}`}
              className="h-9 w-9 rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailWorkspaceSkeleton({
  showAlerts = true,
  showHeaderActions = true,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-8 w-72 rounded-2xl" />
        </div>
        {showHeaderActions ? (
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        ) : null}
      </div>

      <LoadingSurface>
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-5">
            <Skeleton className="h-20 w-20 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-7 w-56 rounded-xl" />
              <Skeleton className="h-4 w-40 rounded-full" />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-9 w-32 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
        </div>
      </LoadingSurface>

      {showAlerts ? (
        <div className="space-y-3">
          {Array.from({ length: 2 }).map((_, index) => (
            <LoadingSurface key={`warning-${index}`} className="p-4">
              <div className="flex items-start gap-3">
                <Skeleton className="h-10 w-10 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48 rounded-full" />
                  <Skeleton className="h-4 w-full rounded-full" />
                </div>
              </div>
            </LoadingSurface>
          ))}
        </div>
      ) : null}

      <StatsGridSkeleton />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <LoadingSurface>
            <LoadingSectionHeader
              titleWidth="w-40"
              subtitleWidth="w-60"
              actionWidth="w-28"
            />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`timeline-${index}`}
                  className="rounded-2xl border border-slate-100 p-4"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-10 w-10 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-44 rounded-full" />
                      <Skeleton className="h-4 w-full rounded-full" />
                      <Skeleton className="h-4 w-4/5 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </LoadingSurface>

          <LoadingSurface>
            <LoadingSectionHeader
              titleWidth="w-52"
              subtitleWidth="w-56"
              actionWidth="w-24"
            />
            <div className="mt-5 space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`detail-card-${index}`}
                  className="rounded-2xl border border-slate-100 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-56 rounded-full" />
                      <Skeleton className="h-4 w-40 rounded-full" />
                    </div>
                    <Skeleton className="h-10 w-28 rounded-xl" />
                  </div>
                  <div className="mt-4 grid gap-3 md:grid-cols-2">
                    <Skeleton className="h-20 w-full rounded-2xl" />
                    <Skeleton className="h-20 w-full rounded-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </LoadingSurface>
        </div>

        <div className="xl:col-span-4">
          <SidebarStackSkeleton />
        </div>
      </div>
    </div>
  );
}

function FormWorkspaceSkeleton({ showSegmentedTabs = false }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-8 w-72 rounded-2xl" />
          <Skeleton className="h-4 w-80 rounded-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-32 rounded-xl" />
          <Skeleton className="h-10 w-40 rounded-xl" />
        </div>
      </div>

      {showSegmentedTabs ? (
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSurface key={`form-summary-${index}`}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-32 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <Skeleton className="h-24 w-full rounded-2xl" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            </LoadingSurface>
          ))}
        </div>
      ) : null}

      <LoadingSurface>
        {showSegmentedTabs ? (
          <div className="flex gap-3 border-b border-slate-100 pb-4">
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
            <Skeleton className="h-10 w-36 rounded-xl" />
          </div>
        ) : null}

        <div className="mt-5 space-y-6">
          <Skeleton className="h-14 w-full rounded-2xl" />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-3 md:col-span-2">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`upload-slot-${index}`}
                className="h-48 w-full rounded-2xl"
              />
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-36 rounded-xl" />
          </div>
        </div>
      </LoadingSurface>
    </div>
  );
}

function MarketingWorkspaceSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 rounded-2xl" />
          <Skeleton className="h-4 w-80 rounded-full" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-72 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-11 w-32 rounded-xl" />
        <Skeleton className="h-11 w-32 rounded-xl" />
        <Skeleton className="h-11 w-40 rounded-xl" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <LoadingSurface key={`campaign-card-${index}`}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-36 rounded-full" />
                  <Skeleton className="h-4 w-28 rounded-full" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <Skeleton className="h-28 w-full rounded-2xl" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </LoadingSurface>
        ))}
      </div>

      <LoadingSurface>
        <div className="flex gap-3 border-b border-slate-100 pb-4">
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
        <div className="mt-5 space-y-4">
          <Skeleton className="h-12 w-full rounded-2xl" />
          <div className="grid gap-4 lg:grid-cols-2">
            <Skeleton className="h-64 w-full rounded-3xl" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton
                  key={`marketing-panel-${index}`}
                  className="h-20 w-full rounded-2xl"
                />
              ))}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={`marketing-slot-${index}`}
                className="h-40 w-full rounded-2xl"
              />
            ))}
          </div>
        </div>
      </LoadingSurface>
    </div>
  );
}

function WizardPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-2xl" />
        </div>
        <Skeleton className="h-10 w-44 rounded-xl" />
      </div>

      <LoadingSurface>
        <div className="grid gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`step-${index}`}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 p-4"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-20 rounded-full" />
                <Skeleton className="h-3 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </LoadingSurface>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_380px]">
        <LoadingSurface>
          <LoadingSectionHeader
            titleWidth="w-44"
            subtitleWidth="w-72"
            actionWidth="w-28"
          />
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={`wizard-card-${index}`}
                className="h-28 w-full rounded-2xl"
              />
            ))}
          </div>
        </LoadingSurface>

        <LoadingSurface>
          <LoadingSectionHeader
            titleWidth="w-28"
            subtitleWidth="w-48"
            actionWidth="w-24"
          />
          <div className="mt-5 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                key={`cart-item-${index}`}
                className="h-20 w-full rounded-2xl"
              />
            ))}
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </LoadingSurface>
      </div>
    </div>
  );
}

const pageSkeletonRegistry = [
  {
    path: "/admin/dashboard",
    end: true,
    showFullPage: false,
    render: () => <DashboardPageSkeleton />,
  },
  {
    path: "/admin/banners",
    end: true,
    showFullPage: false,
    render: () => <MarketingWorkspaceSkeleton />,
  },
  {
    path: "/admin/banners/configure/:cityId",
    showFullPage: true,
    render: () => <FormWorkspaceSkeleton showSegmentedTabs />,
  },
  {
    path: "/admin/customers/:customerId/create-order/*",
    showFullPage: true,
    render: () => <WizardPageSkeleton />,
  },
  {
    path: "/admin/customers/:customerId",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton />,
  },
  {
    path: "/admin/partners/:partnerId/offered-bookings/:offerId",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton showHeaderActions={false} />,
  },
  {
    path: "/admin/partners/:partnerId/offered-bookings",
    end: true,
    showFullPage: false,
    render: () => (
      <TablePageSkeleton
        headerTitleWidth="w-72"
        columns={6}
        rows={6}
        filterCount={3}
      />
    ),
  },
  {
    path: "/admin/partners/:partnerId/offer-metrics",
    end: true,
    showFullPage: false,
    render: () => <DashboardPageSkeleton />,
  },
  {
    path: "/admin/partners/:partnerId",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton />,
  },
  {
    path: "/admin/orders/:id",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton />,
  },
  {
    path: "/admin/bookings/:id",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton showHeaderActions={false} />,
  },
  {
    path: "/admin/help-center/tickets/:ticketId",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton showHeaderActions={false} />,
  },
  {
    path: "/admin/crash-report/:crashId",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton showAlerts={false} />,
  },
  {
    path: "/admin/offered-bookings/:offerId",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton showHeaderActions={false} />,
  },
  {
    path: "/admin/seller-cashouts/:cashoutId",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton showAlerts={false} />,
  },
  {
    path: "/admin/categories/:categoryId/product/:serviceId/info/:productId",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton showAlerts={false} />,
  },
  {
    path: "/admin/categories/:categoryId/package/:serviceId/info/:packageId",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton showAlerts={false} />,
  },
  {
    path: "/admin/categories/:categoryId/product/:serviceId",
    end: true,
    showFullPage: false,
    render: () => <CatalogGridPageSkeleton />,
  },
  {
    path: "/admin/categories/:categoryId",
    end: true,
    showFullPage: false,
    render: () => <CatalogGridPageSkeleton />,
  },
  {
    path: "/admin/notifications/create",
    end: true,
    showFullPage: true,
    render: () => <FormWorkspaceSkeleton />,
  },
  {
    path: "/admin/notifications/:id",
    end: true,
    showFullPage: true,
    render: () => <DetailWorkspaceSkeleton showAlerts={false} />,
  },
  {
    path: "/admin/homepage-trending",
    showFullPage: false,
    render: () => (
      <TablePageSkeleton
        headerTitleWidth="w-72"
        columns={7}
        rows={7}
        filterCount={4}
      />
    ),
  },
  {
    path: "/admin/payments/platform-financials",
    end: true,
    showFullPage: false,
    render: () => <DashboardPageSkeleton />,
  },
  {
    path: "/admin/payments/platform-financials-breakdown",
    end: true,
    showFullPage: false,
    render: () => (
      <TablePageSkeleton
        headerTitleWidth="w-72"
        columns={6}
        rows={8}
        filterCount={4}
      />
    ),
  },
  {
    path: "/admin/partners/metrics",
    end: true,
    showFullPage: false,
    render: () => <DashboardPageSkeleton />,
  },
  {
    path: "/admin/auto-assign-analytics",
    end: true,
    showFullPage: false,
    render: () => <DashboardPageSkeleton />,
  },
  {
    path: "/admin/notifications",
    end: true,
    showFullPage: false,
    render: () => (
      <TablePageSkeleton
        headerTitleWidth="w-64"
        columns={6}
        rows={6}
        filterCount={2}
      />
    ),
  },
];

function resolveSkeletonConfig(pathname) {
  const matchedEntry = pageSkeletonRegistry.find(({ path, end = false }) =>
    matchPath({ path, end }, pathname)
  );

  if (matchedEntry) {
    return {
      showFullPage: matchedEntry.showFullPage ?? false,
      content: matchedEntry.render(),
    };
  }

  if (
    pathname.includes("/add-") ||
    pathname.includes("/create") ||
    pathname.includes("/update")
  ) {
    return {
      showFullPage: true,
      content: <FormWorkspaceSkeleton />,
    };
  }

  if (
    pathname.includes("/metrics") ||
    pathname.includes("/financials")
  ) {
    return {
      showFullPage: false,
      content: <DashboardPageSkeleton />,
    };
  }

  if (
    pathname.includes("/customers") ||
    pathname.includes("/partners") ||
    pathname.includes("/orders") ||
    pathname.includes("/bookings") ||
    pathname.includes("/payments") ||
    pathname.includes("/offers") ||
    pathname.includes("/reviews") ||
    pathname.includes("/settings") ||
    pathname.includes("/cash-management") ||
    pathname.includes("/invoice-item-categories") ||
    pathname.includes("/available-cities") ||
    pathname.includes("/help-center") ||
    pathname.includes("/enquiries") ||
    pathname.includes("/crash-report") ||
    pathname.includes("/seller-cashouts")
  ) {
    return {
      showFullPage: false,
      content: <TablePageSkeleton />,
    };
  }

  return {
    showFullPage: false,
    content: <TablePageSkeleton />,
  };
}

export default function PageLoadingChrome() {
  const { isInitialOverlayVisible, isActivityBarVisible, activeRequestCount } =
    usePageLoading();
  const location = useLocation();
  const skeletonConfig = resolveSkeletonConfig(location.pathname);
  const shouldShowFullPageOverlay =
    isInitialOverlayVisible && skeletonConfig.showFullPage;

  return (
    <>
      <div
        aria-hidden={!isActivityBarVisible}
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 z-20 overflow-hidden transition-all duration-200",
          isActivityBarVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="relative h-1 w-full bg-slate-200/70">
          <div className="absolute inset-y-0 left-0 w-1/3 animate-pulse rounded-r-full bg-gradient-to-r from-blue-500 via-sky-400 to-cyan-300" />
        </div>
      </div>

      {shouldShowFullPageOverlay ? (
        <div className="absolute inset-0 z-30 overflow-hidden rounded-[32px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(241,245,249,0.95))] backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-sky-400 to-cyan-300" />

          <div className="flex h-full flex-col gap-6 overflow-auto p-6 lg:p-8">
            <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-blue-700">
                  <Spinner className="h-3.5 w-3.5" />
                  Loading workspace
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-9 w-72 max-w-full rounded-2xl" />
                  <Skeleton className="h-4 w-96 max-w-full rounded-full" />
                </div>
              </div>

              <LoadingSurface className="w-fit px-4 py-3">
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Active requests
                </div>
                <div className="mt-2 text-2xl font-black text-slate-900">
                  {String(Math.max(activeRequestCount, 1)).padStart(2, "0")}
                </div>
              </LoadingSurface>
            </div>

            {skeletonConfig.content}
          </div>
        </div>
      ) : null}
    </>
  );
}
