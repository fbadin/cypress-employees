export function getRandomSalary(min = 80000, max = 140000) {
  // Ensure the min is not greater than the max
  if (min > max) {
      [min, max] = [max, min];
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}