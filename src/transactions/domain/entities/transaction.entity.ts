export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense';
  title: string;
  amount: number;
  category?: string;
  occurredAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
