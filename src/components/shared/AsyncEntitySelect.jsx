import { useEffect, useRef, useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";

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
import { Spinner } from "../ui/spinner";

const LIMIT = 20;

const AsyncEntitySelect = ({
  value = [],
  onChange,
  fetchFn,
  placeholder = "Select...",
}) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [hasMore, setHasMore] = useState(true);

  

  const pageRef = useRef(1);
  const loadingRef = useRef(false);

  const loadOptions = async ({ q, page, append }) => {
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    const data = await fetchFn(q, page);

    setOptions((prev) => {
      if (!append) return data;

      // ✅ de-duplicate by _id (safety net)
      const map = new Map(prev.map((i) => [i._id, i]));
      data.forEach((i) => map.set(i._id, i));
      return Array.from(map.values());
    });

    setHasMore(data.length === LIMIT);

    loadingRef.current = false;
    setLoading(false);
  };

  // initial load
  useEffect(() => {
    pageRef.current = 1;
    loadOptions({ q: "", page: 1, append: false });
  }, []);

  const onSearch = (q) => {
    setSearch(q);
    pageRef.current = 1;
    setHasMore(true);
    loadOptions({ q, page: 1, append: false });
  };

  const onScroll = (e) => {
    const el = e.target;



    if (
      !hasMore ||
      loadingRef.current ||
      el.scrollTop + el.clientHeight < el.scrollHeight - 10
    ) {
      return;
    }

    const nextPage = pageRef.current + 1;
    pageRef.current = nextPage;

    loadOptions({
      q: search,
      page: nextPage,
      append: true,
    });
  };

  const toggle = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {value.length ? `${value.length} selected` : placeholder}
          <ChevronsUpDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search..." onValueChange={onSearch} />

          <div className="max-h-60 overflow-y-auto" onScroll={onScroll}>
            <CommandGroup>
              {options.map((item) => (
                <CommandItem key={item._id} onSelect={() => toggle(item._id)}>
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value.includes(item._id) ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {item.name}
                </CommandItem>
              ))}

              {loading && (
                <div className="flex justify-center items-center">
                  <Spinner />
                </div>
              )}
              {!loading && options.length === 0 && (
                <CommandEmpty>No results</CommandEmpty>
              )}
            </CommandGroup>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default AsyncEntitySelect;
