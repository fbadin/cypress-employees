export type User = {
  fullName: string;
  email: string;
  position: string;
  department: typeof DEPARTMENTS[number];
  salary: number;
  startDate: Date;
}

export const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Human Resources',
  'Finances'
] as const;