import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .max(50, "Max 50 characters"),

  totalServices: z.preprocess(
    (val) => (val === "" || val === undefined ? undefined : Number(val)),
    z.number().min(0, "Must be 0 or more").optional(),
  ),
});

export const cityConfigSchema = z.object({
  cityId: z.string(),
  isActive: z.boolean(),

  startingPrice: z.coerce.number().min(0, "Price must be >= 0"),

  appHomepage: z.boolean(),
  webHomepage: z.boolean(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),

  img: z.any().optional(),
  previewImage: z.string().optional(),

  cityConfigs: z
    .array(cityConfigSchema)
    .refine((arr) => arr.some((c) => c.isActive), {
      message: "At least one active city is required",
    }),
});

export const productCityConfigSchema = z
  .object({
    cityId: z.string(),
    isActive: z.boolean(),

    price: z.coerce.number().optional(),
    offerPrice: z.coerce.number().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.isActive) return;

    if (val.price === undefined || isNaN(val.price)) {
      ctx.addIssue({
        path: ["price"],
        message: "Price is required for active city",
        code: z.ZodIssueCode.custom,
      });
    }

    if (val.offerPrice === undefined || isNaN(val.offerPrice)) {
      ctx.addIssue({
        path: ["offerPrice"],
        message: "Offer price is required for active city",
        code: z.ZodIssueCode.custom,
      });
    }

    if (val.price !== undefined && val.price <= 0) {
      ctx.addIssue({
        path: ["price"],
        message: "Price must be greater than 0",
        code: z.ZodIssueCode.custom,
      });
    }

    if (val.offerPrice !== undefined && val.offerPrice <= 0) {
      ctx.addIssue({
        path: ["offerPrice"],
        message: "Offer price must be greater than 0",
        code: z.ZodIssueCode.custom,
      });
    }
  });


export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),

  img: z.any().optional(),
  previewImage: z.string().optional(),

  cityConfigs: z
    .array(productCityConfigSchema)
    .refine((arr) => arr.some((c) => c.isActive), {
      message: "At least one active city is required",
    }),
});

export const cityPackageSchema = z.object({
  cityId: z.string(),
  cityName: z.string(),
  state: z.string().optional(),
  country: z.string().optional(),
  isActive: z.boolean().optional(),
  startingPrice: z.string().optional(),
  price: z.string().optional(),
});

export const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  products: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
      }),
    )
    .min(1, "Select at least one product"),
  cityConfigs: z.array(cityPackageSchema),
});
