export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  value: number;
  date: string;
  category: string;
  description: string;
  created_at: string;
}

export interface TransactionFormData {
  type: TransactionType;
  value: number;
  date: string;
  category: string;
  description: string;
}

export interface Filters {
  period: {
    start: string;
    end: string;
  };
  category: string;
  type: TransactionType | "all";
}

export const EXPENSE_CATEGORIES = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Saúde",
  "Educação",
  "Lazer",
  "Roupas",
  "Outros",
] as const;

export const INCOME_CATEGORIES = [
  "Salário",
  "Freelance",
  "Investimentos",
  "Outros",
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];
