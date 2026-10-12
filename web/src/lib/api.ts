import "server-only";

import type { paths } from "./api-types";
import { serverEnv } from "./env";

/**
 * Server-only client for the Django API. The browser never calls Django:
 * every request comes from here with the shared X-Api-Key.
 */

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
    public requestId: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type ApiPath = keyof paths & string;

type FetchOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  requestId?: string;
};

export async function apiFetch<T>(path: ApiPath, options: FetchOptions = {}): Promise<T> {
  const { body, requestId = crypto.randomUUID().replaceAll("-", ""), headers, ...init } = options;

  const response = await fetch(`${serverEnv.apiUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(body !== undefined && { "Content-Type": "application/json" }),
      "X-Api-Key": serverEnv.apiKey,
      "X-Request-Id": requestId,
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    const error = payload?.error ?? {};
    throw new ApiError(
      response.status,
      error.code ?? "http_error",
      error.message ?? response.statusText,
      response.headers.get("X-Request-Id") ?? requestId,
    );
  }

  return (await response.json()) as T;
}

export type HealthOut = paths["/api/v1/health"]["get"]["responses"][200]["content"]["application/json"];

export function getHealth() {
  return apiFetch<HealthOut>("/api/v1/health", { cache: "no-store" });
}
