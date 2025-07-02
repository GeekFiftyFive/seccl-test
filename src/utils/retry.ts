export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number,
  baseDelayMs: number,
  isRetryable: (e: unknown) => boolean
): Promise<T> {
  let attempt = 0;
  let lastError: unknown | undefined;
  do {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      attempt++;
      if (!isRetryable(e) || attempt >= maxAttempts) {
        break;
      }
      await sleep(baseDelayMs * 2 ** (attempt - 1)); // TODO: Implement dithering
    }
    // biome-ignore lint/correctness/noConstantCondition: We need to sleep whenever we retry, and this has to be the last thing in the loop
  } while (true);
  throw lastError;
}
