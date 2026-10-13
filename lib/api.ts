import type { ErrorResponse } from "./types"

export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/+$/, "")

export const TOKEN_STORAGE_KEY = "eduGradesToken"
export const USER_STORAGE_KEY = "eduGradesUser"

/** Événement émis lorsqu'une requête authentifiée reçoit un 401 (token expiré ou invalide). */
export const UNAUTHORIZED_EVENT = "edugrades:unauthorized"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public errorCode?: string,
    public fieldErrors?: Record<string, string>,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

const DEFAULT_MESSAGES: Record<number, string> = {
  0: "Impossible de joindre le serveur. Vérifiez votre connexion ou réessayez plus tard.",
  400: "Requête invalide.",
  401: "Votre session a expiré. Veuillez vous reconnecter.",
  403: "Accès refusé : vous n'avez pas les droits nécessaires pour cette action.",
  404: "Ressource introuvable.",
  409: "Opération impossible : conflit avec des données existantes.",
  429: "Trop de tentatives. Réessayez dans quelques minutes.",
  500: "Erreur interne du serveur.",
}

export const getToken = (): string | null => {
  if (typeof window === "undefined") return null
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

/** Message lisible pour l'utilisateur, quelle que soit l'erreur. */
export const getErrorMessage = (error: unknown, fallback = "Une erreur est survenue"): string => {
  if (error instanceof ApiError) return error.message || fallback
  if (error instanceof Error && error.message) return error.message
  return fallback
}

const toApiError = async (response: Response): Promise<ApiError> => {
  let body: ErrorResponse | null = null
  const text = await response.text().catch(() => "")
  if (text) {
    try {
      body = JSON.parse(text) as ErrorResponse
    } catch {
      body = { message: text.length < 300 ? text : undefined }
    }
  }
  let message = body?.message || DEFAULT_MESSAGES[response.status] || `Erreur ${response.status}`
  const fieldErrors = body?.fieldErrors
  if (fieldErrors && Object.keys(fieldErrors).length > 0) {
    message = Object.values(fieldErrors).join(" ")
  }
  return new ApiError(response.status, message, body?.errorCode, fieldErrors)
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: unknown
  query?: Record<string, string | number | boolean | null | undefined>
  /** false pour les routes publiques (connexion) : pas de token et pas de déconnexion sur 401. */
  auth?: boolean
  headers?: Record<string, string>
}

const buildUrl = (endpoint: string, query?: RequestOptions["query"]) => {
  const url = `${API_BASE_URL}${endpoint}`
  if (!query) return url
  const params = new URLSearchParams()
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.append(key, String(value))
  })
  const qs = params.toString()
  return qs ? `${url}?${qs}` : url
}

const send = async (endpoint: string, options: RequestOptions = {}): Promise<Response> => {
  const { method = "GET", body, query, auth = true, headers = {} } = options
  const finalHeaders: Record<string, string> = { Accept: "application/json", ...headers }
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json"
  if (auth) {
    const token = getToken()
    if (token) finalHeaders.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(buildUrl(endpoint, query), {
      method,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError(0, DEFAULT_MESSAGES[0])
  }

  if (!response.ok) {
    if (response.status === 401 && auth && typeof window !== "undefined") {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
    }
    throw await toApiError(response)
  }
  return response
}

export const request = async <T>(endpoint: string, options: RequestOptions = {}): Promise<T> => {
  const response = await send(endpoint, options)
  if (response.status === 204) return undefined as T
  const text = await response.text()
  if (!text) return undefined as T
  const contentType = response.headers.get("content-type") || ""
  if (contentType.includes("json")) return JSON.parse(text) as T
  return text as unknown as T
}

export const api = {
  get: <T>(endpoint: string, query?: RequestOptions["query"]) => request<T>(endpoint, { query }),
  post: <T>(endpoint: string, body?: unknown, query?: RequestOptions["query"]) =>
    request<T>(endpoint, { method: "POST", body, query }),
  put: <T>(endpoint: string, body?: unknown) => request<T>(endpoint, { method: "PUT", body }),
  patch: <T>(endpoint: string, body?: unknown, query?: RequestOptions["query"]) =>
    request<T>(endpoint, { method: "PATCH", body, query }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
}

const filenameFromDisposition = (disposition: string | null): string | null => {
  if (!disposition) return null
  const utf8 = /filename\*=UTF-8''([^;]+)/i.exec(disposition)
  if (utf8) {
    try {
      return decodeURIComponent(utf8[1].trim())
    } catch {
      /* nom mal encodé : on essaie la forme simple */
    }
  }
  const simple = /filename="?([^";]+)"?/i.exec(disposition)
  return simple ? simple[1].trim() : null
}

/**
 * Télécharge un fichier (PDF, ZIP, Excel) en envoyant le token dans l'en-tête.
 * Le nom proposé par le backend (Content-Disposition) est utilisé quand il est disponible.
 */
export const downloadFile = async (
  endpoint: string,
  fallbackFilename: string,
  query?: RequestOptions["query"],
): Promise<void> => {
  const response = await send(endpoint, { query, headers: { Accept: "*/*" } })
  const blob = await response.blob()
  const filename = filenameFromDisposition(response.headers.get("content-disposition")) || fallbackFilename
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
