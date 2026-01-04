
import { Material, Transaction, Employee, PaymentRecord } from '../types';

const MATERIALS_KEY = 'fv_materials';
const TRANSACTIONS_KEY = 'fv_transactions';
const TRASH_KEY = 'fv_trash_transactions';
const CATEGORIES_KEY = 'fv_categories';
const EMPLOYEES_KEY = 'fv_employees';
const PAYMENTS_KEY = 'fv_payments';

const generateId = () => {
  return typeof crypto !== 'undefined' && crypto.randomUUID 
    ? crypto.randomUUID() 
    : Math.random().toString(36).substring(2, 15);
};

const DEFAULT_CATEGORIES = ['Metais', 'Plásticos', 'Papéis/Papelão', 'Eletrônicos', 'Automotivo', 'Outros'];

export const storageService = {
  getMaterials: (): Material[] => {
    const data = localStorage.getItem(MATERIALS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveMaterial: (material: Omit<Material, 'id'> & { id?: string }) => {
    const materials = storageService.getMaterials();
    if (material.id) {
      const index = materials.findIndex(m => m.id === material.id);
      if (index > -1) materials[index] = { ...materials[index], ...material } as Material;
    } else {
      materials.push({ ...material, id: generateId() } as Material);
    }
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
    return materials;
  },
  deleteMaterial: (id: string) => {
    const materials = storageService.getMaterials().filter(m => m.id !== id);
    localStorage.setItem(MATERIALS_KEY, JSON.stringify(materials));
    return materials;
  },

  getTransactions: (): Transaction[] => {
    const data = localStorage.getItem(TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveTransaction: (transaction: Omit<Transaction, 'id'>) => {
    const transactions = storageService.getTransactions();
    const newTx = { ...transaction, id: generateId() } as Transaction;
    transactions.push(newTx);
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    return transactions;
  },
  moveToTrash: (id: string) => {
    const transactions = storageService.getTransactions();
    const trash = storageService.getTrash();
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      trash.push(tx);
      const filtered = transactions.filter(t => t.id !== id);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
      localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
    }
    return transactions;
  },

  getTrash: (): Transaction[] => {
    const data = localStorage.getItem(TRASH_KEY);
    return data ? JSON.parse(data) : [];
  },
  restoreFromTrash: (id: string) => {
    const trash = storageService.getTrash();
    const transactions = storageService.getTransactions();
    const tx = trash.find(t => t.id === id);
    if (tx) {
      transactions.push(tx);
      const filteredTrash = trash.filter(t => t.id !== id);
      localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
      localStorage.setItem(TRASH_KEY, JSON.stringify(filteredTrash));
    }
  },
  permanentDeleteTrash: (ids: string[]) => {
    const trash = storageService.getTrash().filter(t => !ids.includes(t.id));
    localStorage.setItem(TRASH_KEY, JSON.stringify(trash));
    return trash;
  },

  getEmployees: (): Employee[] => {
    const data = localStorage.getItem(EMPLOYEES_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveEmployee: (emp: Omit<Employee, 'id'> & { id?: string }) => {
    const employees = storageService.getEmployees();
    if (emp.id) {
      const idx = employees.findIndex(e => e.id === emp.id);
      if (idx > -1) employees[idx] = { ...employees[idx], ...emp } as Employee;
    } else {
      employees.push({ ...emp, id: generateId() } as Employee);
    }
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(employees));
    return employees;
  },
  deleteEmployee: (id: string) => {
    const filtered = storageService.getEmployees().filter(e => e.id !== id);
    localStorage.setItem(EMPLOYEES_KEY, JSON.stringify(filtered));
    return filtered;
  },

  getPayments: (): PaymentRecord[] => {
    const data = localStorage.getItem(PAYMENTS_KEY);
    return data ? JSON.parse(data) : [];
  },
  savePayment: (pay: Omit<PaymentRecord, 'id'>) => {
    const payments = storageService.getPayments();
    payments.push({ ...pay, id: generateId() } as PaymentRecord);
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    return payments;
  },
  updatePaymentStatus: (id: string, status: 'paid') => {
    const payments = storageService.getPayments();
    const idx = payments.findIndex(p => p.id === id);
    if (idx > -1) payments[idx].status = status;
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(payments));
    return payments;
  },

  getCategories: (): string[] => {
    const data = localStorage.getItem(CATEGORIES_KEY);
    return data ? JSON.parse(data) : DEFAULT_CATEGORIES;
  },
  saveCategories: (categories: string[]) => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    return categories;
  }
};
