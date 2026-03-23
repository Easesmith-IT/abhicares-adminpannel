import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MultiSelect({
  label = "Select Items",
  options = [],
  value = [],
  onChange,
  className = "",
  isLoading,
}) {
  const [open, setOpen] = useState(false);

  const toggleItem = (val) => {
    const isSelected = value.includes(val);
    const updated = isSelected
      ? value.filter((v) => v !== val)
      : [...value, val];
    onChange(updated);
  };

  const displayText = value.length
    ? options
        .filter((opt) => value.includes(opt.value))
        .map((opt) => opt.label)
        .join(", ")
    : label;

  return (
    <div className="flex flex-col gap-1">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={isLoading}
            variant="outline"
            className="w-full px-2.5 justify-between"
          >
            <p className="truncate line-clamp-1">{displayText}</p>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("w-[320px] p-0", className)}>
          <Command>
            <CommandInput placeholder="Search..." />
            <CommandEmpty>No results found</CommandEmpty>
            <CommandList>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => toggleItem(opt.value)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded border border-muted ${
                        value.includes(opt.value)
                          ? "bg-primary text-white"
                          : "bg-transparent"
                      }`}
                    >
                      {value.includes(opt.value) && (
                        <Check className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <span>{opt.label}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
