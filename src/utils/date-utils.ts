export function getMondayOfThisWeek() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
  return new Date(now.setDate(diff));
}