import { cn } from "@/lib/utils";

export const H1 = ({ children, className }) => (
  <h1
    className={cn(
      "scroll-m-20 text-4xl font-semibold tracking-tight text-balance",
      className
    )}
  >
    {children}
  </h1>
);

export const H2 = ({ children, className }) => (
  <h2
    className={cn(
      "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
      className
    )}
  >
    {children}
  </h2>
);

export const H3 = ({ children, className }) => (
  <h3
    className={cn(
      "scroll-m-20 text-2xl font-semibold tracking-tight",
      className
    )}
  >
    {children}
  </h3>
);

export const H4 = ({ children, className }) => (
  <h4
    className={cn(
      "scroll-m-20 text-xl font-semibold tracking-tight",
      className
    )}
  >
    {children}
  </h4>
);

export const P = ({ children, className }) => (
  <p
    className={cn("leading-7 not-first:mt-6 text-muted-foreground", className)}
  >
    {children}
  </p>
);
export const Small = ({ children, className }) => (
  <small
    className={cn(
      "text-sm font-medium leading-none text-muted-foreground",
      className
    )}
  >
    {children}
  </small>
);
