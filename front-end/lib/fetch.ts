import { toast } from "sonner"

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

export async function fetchApi<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new HttpError(
        response.status,
        error.message || "Ocorreu um erro na requisição"
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof HttpError) {
      toast.error(error.message)
      throw error
    }

    toast.error("Erro ao conectar com o servidor")
    throw new Error("Network error")
  }
} 