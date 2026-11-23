/**
 * Shared behaviour for every mock service: latency, injectable failure and a
 * single error type the UI can branch on. No network, storage or persistence —
 * reloading the page resets everything.
 */

export const serviceErrorCodes = ["not-found", "conflict", "unavailable"] as const;
export type ServiceErrorCode = (typeof serviceErrorCodes)[number];

export class ServiceError extends Error {
  constructor(
    public readonly code: ServiceErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError;
}

const DEFAULT_LATENCY_MS = 450;

/**
 * Probability that any call fails with "unavailable", 0 to 1.
 * Set NEXT_PUBLIC_MOCK_FAILURE_RATE to exercise AsyncState's error branch (S2.1)
 * without editing a component. Unset means never fail.
 */
function failureRate(): number {
  const raw = Number(process.env.NEXT_PUBLIC_MOCK_FAILURE_RATE);
  return Number.isFinite(raw) && raw > 0 ? Math.min(raw, 1) : 0;
}

function latency(): number {
  const raw = Number(process.env.NEXT_PUBLIC_MOCK_LATENCY_MS);
  return Number.isFinite(raw) && raw >= 0 ? raw : DEFAULT_LATENCY_MS;
}

/**
 * Wraps a synchronous read or write against the in-memory fixtures so every
 * service behaves like a remote call. `produce` runs only after the delay,
 * so a simulated failure never half-applies a write.
 */
export async function transport<T>(produce: () => T): Promise<T> {
  await new Promise<void>((resolve) => setTimeout(resolve, latency()));
  if (Math.random() < failureRate()) {
    throw new ServiceError("unavailable", "The mock service is unavailable. Try again.");
  }
  return produce();
}

/** Fixtures are mutated by writes, so every read hands back a copy. */
export function clone<T>(value: T): T {
  return structuredClone(value);
}

export function required<T>(value: T | undefined, what: string): T {
  if (value === undefined) throw new ServiceError("not-found", `${what} was not found.`);
  return value;
}
