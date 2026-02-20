import z from "zod";

export const walletCreditSchema = z.object({
  amount: z.coerce.number().min(1, "Amount must be greater than 0"),
  description: z.string().optional(),
});
