async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Obtenha a URL da API das variáveis de ambiente
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }

  return response.json();
}

export default fetchApi;
