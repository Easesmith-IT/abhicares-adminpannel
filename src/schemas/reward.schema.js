// reward-schema.js
import { z } from "zod";

export const rewardSchema = z.object({
  points: z.coerce.number().min(1, "Minimum 1 point required"),
});
