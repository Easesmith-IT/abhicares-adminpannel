import { z } from "zod";

export const cityConfigSchema = z.object({
  cityId: z.string(),
  cityName: z.string(),
  startingPrice: z.coerce.number().min(0, "Price must be >= 0"),
  appHomepage: z.boolean(),
  webHomepage: z.boolean(),
});

export const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  img: z.any().optional(),
  previewImage: z.string().optional(),

  cityConfigs: z.array(cityConfigSchema).min(1, "At least one city required"),
});

