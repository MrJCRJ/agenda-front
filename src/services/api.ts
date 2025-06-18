// src/services/api.ts

interface ApiError extends Error {
  status?: number;
  data?: unknown;
}

interface FetchApiOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

/**
 * Enhanced fetch wrapper with better error handling, timeout, and TypeScript support
 * @param endpoint API endpoint (e.g., '/appointments')
 * @param options Fetch options (extends RequestInit)
 * @param timeout Request timeout in milliseconds (default: 8000ms)
 */
async function fetchApi<T = unknown>(
  endpoint: string,
  options?: FetchApiOptions,
  timeout: number = 8000
): Promise<T> {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Remove leading/trailing slashes for consistency
  const normalizedEndpoint = endpoint.replace(/^\/|\/$/g, "");
  const url = `${API_URL}/${normalizedEndpoint}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorData: unknown;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
      }

      const error: ApiError = new Error(
        (errorData as { message?: string })?.message ||
          `HTTP error! status: ${response.status}`
      );
      error.status = response.status;
      error.data = errorData;
      throw error;
    }

    try {
      return (await response.json()) as T;
    } catch {
      throw new Error("Failed to parse JSON response");
    }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeout}ms`);
    }

    // Automatic retry logic (default: 0 retries)
    const retries = options?.retries ?? 0;
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchApi<T>(
        endpoint,
        { ...options, retries: retries - 1 },
        timeout
      );
    }

    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown fetch error occurred");
  }
}

export default fetchApi;
