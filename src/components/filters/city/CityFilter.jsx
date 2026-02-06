import { Check, ChevronsUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import useCities from "./useCities";

const CityFilter = ({ value, onChange }) => {
  const { cities, page, totalPages, isLoading, nextPage, prevPage, onSearch } =
    useCities();

  const selectedCity = cities.find((c) => c._id === value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-[220px] justify-between"
        >
          {selectedCity ? selectedCity.city : "Filter by city"}
          <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[220px] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search city..." onValueChange={onSearch} />

          <CommandEmpty>No city found.</CommandEmpty>

          <CommandGroup>
            {cities.map((city) => (
              <CommandItem key={city._id} onSelect={() => onChange(city._id)}>
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === city._id ? "opacity-100" : "opacity-0"
                  }`}
                />
                {city.city}
              </CommandItem>
            ))}
          </CommandGroup>

          {/* Pagination controls */}
          <div className="flex items-center justify-between border-t px-2 py-1">
            <Button
              size="icon"
              variant="ghost"
              disabled={page === 1 || isLoading}
              onClick={prevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-xs text-muted-foreground">
              Page {page} / {totalPages}
            </span>

            <Button
              size="icon"
              variant="ghost"
              disabled={page === totalPages || isLoading}
              onClick={nextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CityFilter;
