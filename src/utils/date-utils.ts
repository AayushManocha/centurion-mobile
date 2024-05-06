export function getMondayOfThisWeek(date = new Date()) {
  const now = date;
  while (now.getDay() !== 1) { // 0 = Sunday, 1 = Monday, ...
    now.setDate(now.getDate() - 1);
  }
  console.log('now: ', now)
  return now;
}