import { useCallback, useEffect, useRef, useState, type DependencyList, type Dispatch, type SetStateAction } from "react"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/api"

export interface AsyncState<T> {
  data: T
  setData: Dispatch<SetStateAction<T>>
  loading: boolean
  error: string | null
  reload: () => Promise<void>
}

/**
 * Charge des données au montage (et quand `deps` change), en exposant chargement et erreur.
 * `enabled = false` suspend le chargement (ex. utilisateur pas encore connu).
 */
export function useAsync<T>(loader: () => Promise<T>, deps: DependencyList, initial: T, enabled = true): AsyncState<T> {
  const [data, setData] = useState<T>(initial)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const loaderRef = useRef(loader)
  loaderRef.current = loader
  const requestId = useRef(0)

  const reload = useCallback(async () => {
    const id = ++requestId.current
    setLoading(true)
    setError(null)
    try {
      const result = await loaderRef.current()
      if (id === requestId.current) setData(result)
    } catch (err) {
      if (id === requestId.current) setError(getErrorMessage(err, "Erreur lors du chargement des données"))
    } finally {
      if (id === requestId.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (enabled) {
      reload()
    } else {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, reload, ...deps])

  return { data, setData, loading, error, reload }
}

/**
 * Exécute une action (création, suppression…) et affiche le résultat dans un toast.
 * Le message d'erreur renvoyé par le backend est affiché tel quel.
 * Renvoie le résultat de l'action, ou `undefined` en cas d'échec.
 */
export async function runAction<T>(action: () => Promise<T>, successMessage?: string, errorFallback?: string) {
  try {
    const result = await action()
    if (successMessage) toast.success(successMessage)
    return { ok: true as const, result }
  } catch (error) {
    toast.error(getErrorMessage(error, errorFallback))
    return { ok: false as const, result: undefined }
  }
}
