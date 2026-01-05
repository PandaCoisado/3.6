
import React, { useState, useEffect } from 'react';
import { View, Material, Transaction, TransactionType, Employee, PaymentRecord } from './types';
import { storageService } from './storageService';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import PricesView from './PricesView';
import MaterialsManager from './MaterialsManager';
import TransactionForm from './TransactionForm';
import History from './History';
import RecycleBin from './RecycleBin';
import EmployeesManager from './EmployeesManager';

const App: React.FC = () => {
  // Define explicitamente o dashboard como a tela inicial padrão
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [materials, setMaterials] = useState<Material[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [trash, setTrash] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);

  useEffect(() => {
    // Carregamento inicial de dados
    const initialMaterials = storageService.getMaterials();
    const initialTransactions = storageService.getTransactions();
    
    // Lógica de "Seed" (Dados Iniciais) para evitar tela vazia no lançamento
    if (initialMaterials.length === 0 && initialTransactions.length === 0) {
      const demoMaterials: Omit<Material, 'id'>[] = [
        { name: 'Cobre Mel', category: 'Metais', buyPrice: 42.50, sellPrice: 48.00, availability: 'both' },
        { name: 'Alumínio Perfil', category: 'Metais', buyPrice: 12.00, sellPrice: 15.50, availability: 'both' },
        { name: 'Ferro Pesado', category: 'Metais', buyPrice: 0.80, sellPrice: 1.20, availability: 'both' },
        { name: 'Pet Transparente', category: 'Plásticos', buyPrice: 2.10, sellPrice: 3.20, availability: 'both' }
      ];
      
      demoMaterials.forEach(m => storageService.saveMaterial(m as any));
      
      // Cria uma transação de exemplo para popular o dashboard imediatamente
      storageService.saveTransaction({
        type: TransactionType.BUY,
        personName: 'Fornecedor de Exemplo',
        items: [{ materialName: 'Cobre Mel', weight: 10, unitPrice: 42.5, total: 425 }],
        total: 425,
        date: new Date().toISOString()
      });
    }

    // Sincroniza estados com o Storage
    setMaterials(storageService.getMaterials());
    setTransactions(storageService.getTransactions());
    setTrash(storageService.getTrash());
    setCategories(storageService.getCategories());
    setEmployees(storageService.getEmployees());
    setPayments(storageService.getPayments());
  }, []);

  const handleNewTransaction = (tx: Omit<Transaction, 'id'>) => {
    const updated = storageService.saveTransaction(tx as any);
    setTransactions(updated);
  };

  const handleMoveToTrash = (id: string) => {
    storageService.moveToTrash(id);
    setTransactions(storageService.getTransactions());
    setTrash(storageService.getTrash());
  };

  const handleRestoreTrash = (id: string) => {
    storageService.restoreFromTrash(id);
    setTransactions(storageService.getTransactions());
    setTrash(storageService.getTrash());
  };

  const handlePermanentDelete = (ids: string[]) => {
    const updated = storageService.permanentDeleteTrash(ids);
    setTrash(updated);
  };

  const handleSaveEmployee = (emp: Omit<Employee, 'id'> & { id?: string }) => {
    const updated = storageService.saveEmployee(emp);
    setEmployees(updated);
  };

  const handleDeleteEmployee = (id: string) => {
    if (confirm('Deseja remover este funcionário? Os históricos de pagamento serão preservados.')) {
      setEmployees(storageService.deleteEmployee(id));
    }
  };

  const handlePayDaily = (pay: Omit<PaymentRecord, 'id'>) => {
    setPayments(storageService.savePayment(pay));
  };

  const handleUpdatePayment = (id: string, status: 'paid') => {
    setPayments(storageService.updatePaymentStatus(id, status));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard materials={materials} transactions={transactions} />;
      case 'prices':
        return <PricesView materials={materials} />;
      case 'management':
        return (
          <MaterialsManager 
            materials={materials} 
            categories={categories}
            onSave={(m) => setMaterials(storageService.saveMaterial(m))} 
            onDelete={(id) => setMaterials(storageService.deleteMaterial(id))}
            onUpdateCategories={(c) => setCategories(storageService.saveCategories(c))}
          />
        );
      case 'employees':
        return (
          <EmployeesManager 
            employees={employees} 
            payments={payments}
            onSaveEmployee={handleSaveEmployee}
            onDeleteEmployee={handleDeleteEmployee}
            onPayDaily={handlePayDaily}
            onUpdatePayment={handleUpdatePayment}
            onBack={() => setCurrentView('dashboard')}
          />
        );
      case 'buy':
        return <TransactionForm type={TransactionType.BUY} materials={materials} onComplete={handleNewTransaction} />;
      case 'sell':
        return <TransactionForm type={TransactionType.SELL} materials={materials} onComplete={handleNewTransaction} />;
      case 'history':
        return <History transactions={transactions} onDelete={handleMoveToTrash} />;
      case 'trash':
        return <RecycleBin trash={trash} onRestore={handleRestoreTrash} onPermanentDelete={handlePermanentDelete} />;
      default:
        return <Dashboard materials={materials} transactions={transactions} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 selection:bg-blue-500/30">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      <main className="flex-1 p-4 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
