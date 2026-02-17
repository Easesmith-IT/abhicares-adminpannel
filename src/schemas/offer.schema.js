import { z } from "zod";

export const offerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    code: z
      .string()
      .regex(/^[A-Z0-9]{4,10}$/, "Code must be 4–10 uppercase letters/numbers"),
    type: z.enum(["FLAT", "PERCENTAGE", "COMBO"]),

    discountValue: z.coerce.number().optional(),
    maxDiscountAmount: z.coerce.number().optional(),

    minOrderValue: z.coerce.number().min(0).default(0),

    validFrom: z.string().min(1, "Valid from is required"),
    validTo: z.string().min(1, "Valid to is required"),

    description: z.string().optional(),

    applicableTo: z.object({
      services: z.array(z.string()).default([]),
      products: z.array(z.string()).default([]),
      packages: z.array(z.string()).default([]),
    }),

    applicableCities: z
      .array(
        z.object({
          cityId: z.string(),
        }),
      )
      .default([]),

    applicableUserTypes: z
      .array(z.enum(["NEW", "RETURNING", "ALL"]))
      .default(["ALL"]),

    priority: z.coerce.number().default(0),
    isActive: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "PERCENTAGE" && !data.discountValue) {
      ctx.addIssue({
        path: ["discountValue"],
        message: "Discount value is required",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.type === "PERCENTAGE" && !data.maxDiscountAmount) {
      ctx.addIssue({
        path: ["maxDiscountAmount"],
        message: "Max discount amount is required",
        code: z.ZodIssueCode.custom,
      });
    }
  });
