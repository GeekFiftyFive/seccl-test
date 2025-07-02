import z from "zod";

export const queryParamsSchema = z.object({
  baseCode: z.string(),
  exchangeCode: z.string(),
});

export type QueryParams = z.infer<typeof queryParamsSchema>;
