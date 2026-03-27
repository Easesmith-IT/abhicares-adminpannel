import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function customId(id, prefix = "ID") {
  if (!id) return "";
  const part = `${id.slice(0, 4)}-${id.slice(-4)}`.toUpperCase();
  return `#${prefix}-${part}`;
}
