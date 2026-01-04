
import React, { useState } from 'react';
import { Employee, PaymentRecord, formatDateBR } from '../types';
import { Users, Plus, Trash2, Edit2, DollarSign, Receipt, Clock, CheckCircle2, ChevronLeft, UserPlus, X } from 'lucide-react';

interface EmployeesManagerProps {
  employees: Employee[];
  payments: PaymentRecord[];
  onSaveEmployee: (emp: Omit<Employee, 'id'> & { id?: string }) => void;
  onDeleteEmployee: (id: string) => void;
  onPayDaily: (pay: Omit<PaymentRecord, 'id'>) => void;
  onUpdatePayment: (id: string, status: 'paid') => void;
  onBack: () => void;
}

const EmployeesManager: React.FC<EmployeesManagerProps> = ({ 
  employees, payments, onSaveEmployee, onDeleteEmployee, onPayDaily, onUpdatePayment, onBack 
}) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'payments'>('roster');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [receiptModal, setReceiptModal] = useState<PaymentRecord | null>(null);
  const [formData, setFormData] = useState({ name: '', dailyRate: '' });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveEmployee({
      id: editingEmployee?.id,
      name: formData.name,
      dailyRate: parseFloat(formData.dailyRate),
      active: true
    });
    setFormData({ name: '', dailyRate: '' });
    setEditingEmployee(null);
  };

  const startEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({ name: emp.name, dailyRate: emp.dailyRate.toString() });
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all shadow-lg">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Equipe & Diárias</h2>
            <p className="text-slate-400 font-medium mt-1">Gestão financeira de colaboradores.</p>
          </div>
        </div>

        <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
          <button 
            onClick={() => setActiveTab('roster')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'roster' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Funcionários
          </button>
          <button 
            onClick={() => setActiveTab('payments')}
            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'payments' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}
          >
            Histórico Pago
          </button>
        </div>
      </header>

      {activeTab === 'roster' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl sticky top-8">
              <h3 className="text-white font-black uppercase italic tracking-tighter flex items-center gap-2 mb-8">
                <UserPlus className="w-5 h-5 text-blue-500" /> {editingEmployee ? 'Modificar' : 'Novo'} Colaborador
              </h3>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome Completo</label>
                  <input type="text" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Valor Diária (R$)</label>
                  <input type="number" step="0.01" required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500" value={formData.dailyRate} onChange={e => setFormData({...formData, dailyRate: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-900/40">
                  {editingEmployee ? 'Salvar Alterações' : 'Cadastrar na Equipe'}
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {employees.length === 0 ? (
              <div className="py-20 text-center opacity-30 bg-slate-900 border border-dashed border-slate-800 rounded-3xl flex flex-col items-center">
                <Users className="w-12 h-12 mb-4" />
                <p className="font-black uppercase tracking-widest text-xs">Sem equipe cadastrada</p>
              </div>
            ) : (
              employees.map(emp => {
                const pendingPayments = payments.filter(p => p.employeeId === emp.id && p.status === 'pending');
                return (
                  <div key={emp.id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 hover:border-blue-500/30 transition-all shadow-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20"><Users className="w-6 h-6 text-blue-500" /></div>
                        <div>
                          <h4 className="text-white font-black text-xl tracking-tighter uppercase italic">{emp.name}</h4>
                          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Contrato: R$ {emp.dailyRate.toFixed(2)}/dia</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => onPayDaily({ employeeId: emp.id, employeeName: emp.name, amount: emp.dailyRate, date: new Date().toISOString(), status: 'pending' })} className="px-6 py-3 bg-slate-950 border border-slate-800 hover:border-blue-500 text-blue-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Lançar Diária</button>
                        <button onClick={() => startEdit(emp)} className="p-3 text-slate-500 hover:text-white"><Edit2 className="w-5 h-5" /></button>
                        <button onClick={() => onDeleteEmployee(emp.id)} className="p-3 text-slate-500 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                      </div>
                    </div>

                    {pendingPayments.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                        {pendingPayments.map(p => (
                          <div key={p.id} className="bg-slate-950 p-4 rounded-xl flex justify-between items-center border border-orange-500/10 shadow-inner">
                            <span className="text-xs text-slate-500 font-bold uppercase tracking-tighter flex items-center gap-2"><Clock className="w-3 h-3 text-orange-500" /> Aberta em: {formatDateBR(p.date)}</span>
                            <button onClick={() => { onUpdatePayment(p.id, 'paid'); setReceiptModal({...p, status: 'paid'}); }} className="bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all">Pagar Diária</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800">
                <th className="px-8 py-5">Colaborador</th>
                <th className="px-8 py-5">Finalizado em</th>
                <th className="px-8 py-5">Montante</th>
                <th className="px-8 py-5 text-right">Recibo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {payments.filter(p => p.status === 'paid').slice().reverse().map(p => (
                <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-8 py-5 text-white font-bold">{p.employeeName}</td>
                  <td className="px-8 py-5 text-slate-500 text-xs">{formatDateBR(p.date)}</td>
                  <td className="px-8 py-5 font-black text-green-400">R$ {p.amount.toFixed(2)}</td>
                  <td className="px-8 py-5 text-right"><button onClick={() => setReceiptModal(p)} className="p-3 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"><Receipt className="w-5 h-5" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {receiptModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white text-slate-950 w-full max-w-sm rounded-none p-8 shadow-2xl relative border-t-[12px] border-blue-600 font-mono">
            <button onClick={() => setReceiptModal(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 no-print"><X className="w-6 h-6" /></button>
            <div className="text-center mb-8"><h3 className="text-xl font-black uppercase tracking-tighter">Recibo de Diária</h3><p className="text-[10px] text-slate-500 font-bold">FERRO VELHO PREMIUM</p></div>
            <div className="space-y-4 text-sm border-y border-dashed border-slate-200 py-6">
              <div className="flex justify-between"><span className="font-bold">PARA:</span> <span>{receiptModal.employeeName}</span></div>
              <div className="flex justify-between"><span className="font-bold">DATA:</span> <span>{formatDateBR(receiptModal.date)}</span></div>
              <div className="flex justify-between items-end pt-4"><span className="font-bold">TOTAL:</span> <span className="text-2xl font-black">R$ {receiptModal.amount.toFixed(2)}</span></div>
            </div>
            <div className="mt-12 pt-8 border-t border-slate-200 text-center"><div className="w-full border-b border-slate-900 pb-1"></div><p className="text-[9px] font-bold uppercase mt-2">Assinatura Digital de Quitação</p></div>
            <button onClick={() => window.print()} className="w-full mt-8 py-3 bg-slate-900 text-white rounded-lg font-black uppercase text-[10px] no-print">Imprimir Via</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeesManager;
