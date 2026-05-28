export interface TrackingStage {
  id: string
  label: string
  description: string
  status: 'completed' | 'active' | 'pending'
}

export const DEMO_TRACKING_ID = 'TT-2026-4821'

export function getDemoStages(activeIndex = 3): TrackingStage[] {
  const labels = [
    { id: 'received', label: 'Vehicle Received', description: 'Your car has arrived at TyreTrack bay.' },
    { id: 'inspection', label: 'Inspection', description: 'Technician assessment and service checklist.' },
    { id: 'in-progress', label: 'Service In Progress', description: 'Work is underway in our premium bay.' },
    { id: 'quality', label: 'Quality Check', description: 'Final inspection and road-test readiness.' },
    { id: 'ready', label: 'Ready for Pickup', description: 'Your vehicle is ready. Drive with confidence.' },
  ]

  return labels.map((item, i) => ({
    ...item,
    status: i < activeIndex ? 'completed' : i === activeIndex ? 'active' : 'pending',
  }))
}
