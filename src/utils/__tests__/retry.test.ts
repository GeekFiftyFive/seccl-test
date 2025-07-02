import { retry } from "../retry";

describe("retry", () => {
  beforeEach(() => {
    // Enable fake timers before each test
    jest.useFakeTimers({ advanceTimers: true });
    // Spy on setTimeout to inspect calls
    jest.spyOn(global, "setTimeout");
  });

  afterEach(() => {
    // Clean up after each test
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it("should retry until successful", async () => {
    const attempts = 4;
    const fn = jest.fn(() => {
      if (fn.mock.calls.length < attempts) {
        throw new Error("Failed");
      }
      return "Success";
    });

    await expect(
      retry(fn as unknown as () => Promise<unknown>, attempts, 100, () => true)
    ).resolves.toBe("Success");
    expect(fn).toHaveBeenCalledTimes(4);
    expect(setTimeout).toHaveBeenCalledTimes(3);

    // Assert backoff was exponential
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 100);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 200);
    expect(setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 400);
  });

  it("should return instantly if successful", async () => {
    const fn = jest.fn(() => "Success");

    await expect(
      retry(fn as unknown as () => Promise<unknown>, 1, 100, () => true)
    ).resolves.toBe("Success");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(setTimeout).not.toHaveBeenCalled();
  });

  it("should throw if not retryable", async () => {
    const fn = jest.fn(() => {
      throw new Error("Not retryable");
    });

    await expect(
      retry(fn as unknown as () => Promise<unknown>, 1, 100, () => false)
    ).rejects.toThrow("Not retryable");
    expect(fn).toHaveBeenCalledTimes(1);
    expect(setTimeout).not.toHaveBeenCalled();
  });

  it("should throw if max retries exceeded", async () => {
    const fn = jest.fn(() => {
      throw new Error("Failed");
    });

    await expect(
      retry(fn as unknown as () => Promise<unknown>, 4, 100, () => true)
    ).rejects.toThrow("Failed");
    expect(fn).toHaveBeenCalledTimes(4);
    expect(setTimeout).toHaveBeenCalledTimes(3);

    // Assert backoff was exponential
    expect(setTimeout).toHaveBeenNthCalledWith(1, expect.any(Function), 100);
    expect(setTimeout).toHaveBeenNthCalledWith(2, expect.any(Function), 200);
    expect(setTimeout).toHaveBeenNthCalledWith(3, expect.any(Function), 400);
  });
});
