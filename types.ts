
export type BranchId = 'branch-1' | 'branch-2' | 'branch-3';
export type UserRole = 'BRANCH_USER' | 'HEAD_OFFICE';
export type Language = 'en' | 'ar';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  branchId?: BranchId;
  name: string;
  language: Language;
}

export interface SalesData {
  cash: number;
  visa: number;
  talabat: number;
  credit: number;
}

export interface ExpenseData {
  food: number;
  beverage: number;
  supplies: number;
  gas: number;
  vat: number;
  rent: number;
  salary: number;
  utilities: number;
  operational: number;
  depreciation: number;
}

export interface DailyEntry {
  id: string;
  branchId: BranchId;
  date: string;
  submittedBy: string; // User ID
  timestamp: string;
  openingBalance: number;
  sales: SalesData;
  expenses: ExpenseData;
  totalSales: number;
  totalExpenses: number;
  netIncome: number;
  closingBalance: number;
  status: 'submitted' | 'flagged' | 'validated';
}

export interface Branch {
  id: BranchId;
  name: string;
  location: string;
}

export interface UserSession {
  user: User;
  token: string;
}
