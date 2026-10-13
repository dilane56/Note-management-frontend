"use client"

import { useState, type ReactNode } from "react"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TableCell, TableRow } from "@/components/ui/table"
import { evaluationLabel } from "@/lib/format"
import type { Evaluation, SchoolClass } from "@/lib/types"

/** En-tête de section : titre, description et actions éventuelles. */
export function SectionHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Chargement impossible</AlertTitle>
      <AlertDescription className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>{message}</span>
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-1" />
            Réessayer
          </Button>
        )}
      </AlertDescription>
    </Alert>
  )
}

export function LoadingState({ label = "Chargement..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-8 text-muted-foreground" role="status">
      <Loader2 className="w-5 h-5 animate-spin mr-2" />
      {label}
    </div>
  )
}

/** Ligne de tableau pour les états chargement / vide. */
export function TableStateRow({ colSpan, loading, emptyLabel }: { colSpan: number; loading: boolean; emptyLabel: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-8 text-muted-foreground">
        {loading ? (
          <span className="inline-flex items-center" role="status">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Chargement...
          </span>
        ) : (
          emptyLabel
        )}
      </TableCell>
    </TableRow>
  )
}

export function StatCard({
  title,
  value,
  hint,
  icon: Icon,
  valueClassName,
}: {
  title: string
  value: ReactNode
  hint?: ReactNode
  icon: LucideIcon
  valueClassName?: string
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName ?? ""}`}>{value}</div>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}

/**
 * Boîte de confirmation (remplace `confirm()`).
 * `onConfirm` peut être asynchrone : la boîte reste ouverte pendant l'opération.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Supprimer",
  onConfirm,
  onOpenChange,
}: {
  open: boolean
  title: string
  description: ReactNode
  confirmLabel?: string
  onConfirm: () => Promise<unknown> | unknown
  onOpenChange: (open: boolean) => void
}) {
  const [busy, setBusy] = useState(false)
  const confirm = async () => {
    setBusy(true)
    try {
      await onConfirm()
    } finally {
      setBusy(false)
      onOpenChange(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={(value) => !busy && onOpenChange(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Annuler
          </Button>
          <Button variant="destructive" onClick={confirm} disabled={busy}>
            {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/** Gère l'élément à supprimer et la boîte de confirmation associée. */
export function useConfirmDelete<T>() {
  const [target, setTarget] = useState<T | null>(null)
  return {
    target,
    ask: (item: T) => setTarget(item),
    dialogProps: {
      open: target !== null,
      onOpenChange: (open: boolean) => {
        if (!open) setTarget(null)
      },
    },
  }
}

export function EvaluationSelect({
  evaluations,
  value,
  onChange,
  includeAll = false,
  allLabel = "Toutes les évaluations",
  placeholder = "Sélectionner une évaluation",
  id,
}: {
  evaluations: Evaluation[]
  value: string
  onChange: (value: string) => void
  includeAll?: boolean
  allLabel?: string
  placeholder?: string
  id?: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">{allLabel}</SelectItem>}
        {evaluations.map((evaluation) => (
          <SelectItem key={evaluation.id} value={String(evaluation.id)}>
            {evaluationLabel(evaluation)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function ClassSelect({
  classes,
  value,
  onChange,
  placeholder = "Sélectionner une classe",
  includeAll = false,
  id,
}: {
  classes: SchoolClass[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  includeAll?: boolean
  id?: string
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">Toutes les classes</SelectItem>}
        {classes.map((schoolClass) => (
          <SelectItem key={schoolClass.id} value={String(schoolClass.id)}>
            {schoolClass.className} — {schoolClass.filiereName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
