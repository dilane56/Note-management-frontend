"use client"

import { ErrorState, LoadingState, SectionHeader } from "@/components/shared"
import { StatisticsView } from "@/components/statistics-view"
import { useAsync } from "@/hooks/useAsync"
import { classApi } from "@/lib/class-api"
import type { SchoolClass } from "@/lib/types"

export function StatisticsManagement() {
  const { data: classes, loading, error, reload } = useAsync<SchoolClass[]>(() => classApi.getClasses(), [], [])

  return (
    <div className="space-y-6">
      <SectionHeader title="Statistiques" description="Performances par classe et par évaluation" />
      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <LoadingState />
      ) : (
        <StatisticsView classes={classes} />
      )}
    </div>
  )
}
