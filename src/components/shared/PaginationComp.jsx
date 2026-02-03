import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function PaginationComp({
  pageCount,
  page,
  setPage,
  className,
  show = true,
}) {
  if (!pageCount || pageCount < 1) return null;

  const maxVisiblePages = 5;

  const handlePrevious = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (page < pageCount) setPage((prev) => prev + 1);
  };

  const renderPageNumbers = () => {
    const items = [];

    // Show all pages if small count
    if (pageCount <= maxVisiblePages) {
      for (let i = 1; i <= pageCount; i++) {
        items.push(renderPage(i));
      }
      return items;
    }

    // Always show first page
    items.push(renderPage(1));

    // Ellipsis before
    if (page > 3) {
      items.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Middle pages
    const start = Math.max(2, page - 1);
    const end = Math.min(pageCount - 1, page + 1);

    for (let i = start; i <= end; i++) {
      items.push(renderPage(i));
    }

    // Ellipsis after
    if (page < pageCount - 2) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
    }

    // Always show last page
    items.push(renderPage(pageCount));

    return items;
  };

  const renderPage = (pageNumber) => {
    const isActive = page === pageNumber;

    return (
      <PaginationItem key={pageNumber} className="cursor-pointer">
        <PaginationLink
          onClick={() => setPage(pageNumber)}
          className={cn(
            "size-10 rounded-full border flex items-center justify-center transition",
            isActive
              ? "bg-main text-white border-main"
              : "bg-white text-gray-700 hover:bg-gray-100",
          )}
        >
          {pageNumber}
        </PaginationLink>
      </PaginationItem>
    );
  };

  return (
    <div
      className={cn(
        "flex flex-col md:flex-row items-center gap-3 w-full",
        className,
      )}
    >
      <Pagination>
        <PaginationContent className="gap-3">
          {/* Previous */}
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={handlePrevious}
              className={cn(
                "size-10 rounded-full border transition",
                page === 1
                  ? "opacity-50 pointer-events-none bg-gray-100"
                  : "bg-white hover:bg-gray-100",
              )}
            />
          </PaginationItem>

          {/* Page Numbers */}
          {show ? (
            renderPageNumbers()
          ) : (
            <PaginationItem>
              <PaginationLink className="size-10 rounded-full bg-main text-white border-main">
                {page}
              </PaginationLink>
            </PaginationItem>
          )}

          {/* Next */}
          <PaginationItem className="cursor-pointer">
            <PaginationNext
              onClick={handleNext}
              className={cn(
                "size-10 rounded-full border transition",
                page === pageCount
                  ? "opacity-50 pointer-events-none bg-gray-100"
                  : "bg-white hover:bg-gray-100",
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {show && (
        <span className="text-gray-600 text-sm whitespace-nowrap">
          Total Pages: {pageCount}
        </span>
      )}
    </div>
  );
}
