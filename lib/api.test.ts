import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { api, ApiError, getErrorMessage, request, UNAUTHORIZED_EVENT } from "./api"

const jsonResponse = (status: number, body: unknown, headers: Record<string, string> = {}) =>
  new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  })

/** Attend l'échec de la requête et renvoie l'erreur. */
const failure = (promise: Promise<unknown>): Promise<ApiError> =>
  promise.then(
    () => {
      throw new Error("La requête aurait dû échouer")
    },
    (error: ApiError) => error,
  )

describe("client API", () => {
  const fetchMock = vi.fn()
  const dispatched: string[] = []

  beforeEach(() => {
    fetchMock.mockReset()
    dispatched.length = 0
    vi.stubGlobal("fetch", fetchMock)
    vi.stubGlobal("window", { dispatchEvent: (event: Event) => dispatched.push(event.type) })
    vi.stubGlobal("localStorage", { getItem: () => "jeton-test" })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("envoie le token et renvoie le JSON", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, [{ id: 1 }]))
    await expect(api.get("/api/classes")).resolves.toEqual([{ id: 1 }])
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe("http://localhost:8080/api/classes")
    expect(init.headers.Authorization).toBe("Bearer jeton-test")
  })

  it("ajoute les paramètres de requête", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { id: 1 }))
    await api.patch("/api/subjects/1/coefficient", undefined, { coefficient: 2.5 })
    expect(fetchMock.mock.calls[0][0]).toBe("http://localhost:8080/api/subjects/1/coefficient?coefficient=2.5")
  })

  it("expose le message d'erreur du backend", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(409, { status: 409, message: "Une note existe déjà pour cette évaluation", errorCode: "CONFLICT" }),
    )
    const error = await failure(api.post("/api/grades", {}))
    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(409)
    expect(error.errorCode).toBe("CONFLICT")
    expect(getErrorMessage(error)).toBe("Une note existe déjà pour cette évaluation")
  })

  it("regroupe les erreurs de validation par champ", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(400, {
        message: "Données invalides",
        fieldErrors: { anneeAcademique: "Format AAAA-AAAA attendu" },
      }),
    )
    const error = await failure(api.post("/api/evaluations", {}))
    expect(error.message).toBe("Format AAAA-AAAA attendu")
    expect(error.fieldErrors).toEqual({ anneeAcademique: "Format AAAA-AAAA attendu" })
  })

  it("signale un 401 pour déconnecter l'utilisateur, sauf sur les routes publiques", async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { message: "Token expiré" }))
    await api.get("/api/users").catch(() => undefined)
    expect(dispatched).toEqual([UNAUTHORIZED_EVENT])

    await request("/api/auth/login", { method: "POST", body: {}, auth: false }).catch(() => undefined)
    expect(dispatched).toEqual([UNAUTHORIZED_EVENT])
  })

  it("traduit une panne réseau en message lisible", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"))
    const error = await failure(api.get("/api/users"))
    expect(error.status).toBe(0)
    expect(error.message).toMatch(/Impossible de joindre le serveur/)
  })

  it("accepte une réponse sans contenu", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))
    await expect(api.delete("/api/grades/1")).resolves.toBeUndefined()
  })
})
