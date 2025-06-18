// src/hooks/useBackendConnection.ts
import { useEffect, useState } from "react";
import fetchApi from "../services/api";

export const useBackendConnection = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Faz uma requisição HEAD mais leve e considera qualquer resposta como sucesso
        // (incluindo 404), desde que o servidor responda
        await fetchApi("/", { method: "HEAD" });
        setIsConnected(true);
      } catch (error) {
        // Verifica se o erro é um erro de conexão (não resposta do servidor)
        if (
          error instanceof Error &&
          (error.message.includes("Failed to fetch") ||
            error.message.includes("timed out") ||
            error.message.includes("NetworkError"))
        ) {
          setIsConnected(false);
          // Tenta reconectar após 3 segundos
          setTimeout(checkConnection, 3000);
        } else {
          // Se for outro tipo de erro (como 404), considera que o backend está respondendo
          setIsConnected(true);
        }
      }
    };

    checkConnection();
  }, []);

  return isConnected;
};
