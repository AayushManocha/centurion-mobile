export function getMondayOfThisWeek() {
  const now = new Date();
  while (now.getDay() !== 1) { // 0 = Sunday, 1 = Monday, ...
    now.setDate(now.getDate() - 1);
  }
  now.setDate(now.getDate() - 1);
  return now;
}