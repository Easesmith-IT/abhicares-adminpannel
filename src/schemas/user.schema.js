import z from "zod";

export const walletCreditSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  description: z.string().optional(),
});

export const userSchema = z.object({
  name: z.string().min(1, "Name is required"),

  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),

  email: z.string().email("Invalid email").optional().or(z.literal("")),

  dateOfBirth: z.string().optional(),

  Gender: z.string().min(1, "Gender is required"),

});
