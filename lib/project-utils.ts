export interface Deliverable {
  functionality: string
  details: string
  days: number
}

// Function to calculate credits based on days (1 credit per 5 days, rounded down)
export function calculateCredits(days: number): number {
  return Math.floor(days / 5)
}

// Convert deliverables to array of arrays format for database storage
export function formatDeliverablesForDB(deliverables: Deliverable[]) {
  return deliverables.map((d) => [d.functionality, d.details, d.days])
}

// Convert array of arrays format from database to form format
export function formatDeliverablesFromDB(deliverables: any[]): Deliverable[] {
  if (!Array.isArray(deliverables) || deliverables.length === 0) {
    return [{ functionality: "", details: "", days: 1 }]
  }

  return deliverables.map((d, index) => {
    if (Array.isArray(d) && d.length >= 3) {
      return {
        functionality: d[0] || "",
        details: d[1] || "",
        days: Number(d[2]) || 1,
      }
    }
    // Fallback for old or different format
    return { functionality: `Deliverable ${index + 1}`, details: "", days: 1 }
  })
}