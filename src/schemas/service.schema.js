import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  img: z.any().optional(),
  previewImage: z.string().optional(),
  cityConfigs: z
    .array(
      z.object({
        cityId: z.string(),
        cityName: z.string().optional(),
        isActive: z.boolean(),
        commission: z.coerce.number().min(0),
        convenience: z.coerce.number().min(0),
      }),
    )
    .refine((arr) => arr.some((c) => c.isActive), {
      message: "At least one active city is required",
    }),
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

export const CityConfigSchema = z
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
    .array(CityConfigSchema)
    .refine((arr) => arr.some((c) => c.isActive), {
      message: "At least one active city is required",
    }),
});

export const packageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  products: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string().optional(),
      }),
    )
    .min(1, "Select at least one product"),
  cityConfigs: z
    .array(CityConfigSchema)
    .refine((arr) => arr.some((c) => c.isActive), {
      message: "At least one active city is required",
    }),
});
