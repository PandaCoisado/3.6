
export enum TransactionType {
  BUY = 'Compra',
  SELL = 'Venda'
}

export type MaterialAvailability = 'both' | 'sell_only' | 'buy_only';

export interface Material {
  id: string;
  name: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  availability: MaterialAvailability;
}

export interface TransactionItem {
  materialName: string;
  weight: number;
  unitPrice: number;
  total: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  personName: string;
  items: TransactionItem[];
  total: number;
  date: string; // ISO String format
}

export interface Employee {
  id: string;
  name: string;
  dailyRate: number;
  active: boolean;
}

export interface PaymentRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  amount: number;
  date: string; // ISO String format
  status: 'pending' | 'paid';
}

export type View = 'dashboard' | 'prices' | 'management' | 'buy' | 'sell' | 'history' | 'employees' | 'trash';

// Utility helper for date formatting in UI
export const formatDateBR = (isoString: string) => {
  try {
    const date = new Date(isoString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return isoString;
  }
};
