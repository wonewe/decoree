export function formatDate(dateInput: string | number | Date | null | undefined) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) {
    return typeof dateInput === "string" ? dateInput : "";
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}. ${month}. ${day}`;
}

export function formatDateRange(
  startInput: string | null | undefined,
  endInput: string | null | undefined
) {
  if (!startInput && !endInput) return "";
  const start = formatDate(startInput);
  const end = formatDate(endInput);
  if (!end || end === start) {
    return start;
  }
  return `${start} ~ ${end}`;
}
