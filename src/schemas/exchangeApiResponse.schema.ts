import z from "zod";

export const exchangeApiSchema = z.object({
  base_code: z.string(),
  rates: z.record(z.number()),
});
