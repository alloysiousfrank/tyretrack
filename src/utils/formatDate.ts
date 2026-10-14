// Single place that decides how dates are shown across the site:
// always DD/MM/YYYY (date, month, year), e.g. 13/10/2026.
export const formatDate = (value?: string | number | Date | null): string => {
  if (value === undefined || value === null || value === "") return "—"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Date + time, same DD/MM/YYYY order for the date part.
export const formatDateTime = (value?: string | number | Date | null): string => {
  if (value === undefined || value === null || value === "") return "—"
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return "—"
  return `${formatDate(d)}, ${d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}`
}
