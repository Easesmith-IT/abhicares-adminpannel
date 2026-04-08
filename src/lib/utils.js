import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export function previewDbImage(url) {
  return `${import.meta.env.VITE_APP_IMAGE_URL}/${url}`;
}

export function customId(id, prefix = "ID") {
  if (!id) return "";
  const part = `${id.slice(0, 4)}-${id.slice(-4)}`.toUpperCase();
  return `#${prefix}-${part}`;
}
