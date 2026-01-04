
import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { Trash2, RefreshCcw, CheckSquare, Square, AlertCircle, Package } from 'lucide-react';

interface RecycleBinProps {
  trash: Transaction[];
  onRestore: (id: string) => void;
  onPermanentDelete: (ids: string[]) => void;
}

const RecycleBin: React.FC<RecycleBinProps> = ({ trash, onRestore, onPermanentDelete }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === trash.length ? [] : trash.map(t => t.id));
  };

  const handlePermanentDelete = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Excluir permanentemente ${selectedIds.length} registro(s)? Esta ação não pode ser desfeita.`)) {
      onPermanentDelete(selectedIds);
      setSelectedIds([]);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase flex items-center gap-3">
            <Trash2 className="w-8 h-8 text-red-500" /> Lixeira Operacional
          </h2>
          <p className="text-slate-400 font-medium">Recupere ou apague permanentemente operações de compra e venda.</p>
        </div>
        
        {trash.length > 0 && (
          <div className="flex gap-3">
            <button 
              onClick={toggleSelectAll}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              {selectedIds.length === trash.length ? <Square className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
              {selectedIds.length === trash.length ? 'Desmarcar Tudo' : 'Selecionar Tudo'}
            </button>
            <button 
              onClick={handlePermanentDelete}
              disabled={selectedIds.length === 0}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:opacity-30 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-red-900/20"
            >
              Excluir Permanente
            </button>
          </div>
        )}
      </header>

      {trash.length === 0 ? (
        <div className="py-32 flex flex-col items-center justify-center text-center opacity-30">
          <Trash2 className="w-16 h-16 mb-4" />
          <p className="text-xl font-black uppercase italic">Lixeira Vazia</p>
          <p className="text-sm">Nenhuma operação excluída recentemente.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b border-slate-800">
                <th className="px-8 py-5 w-10"></th>
                <th className="px-8 py-5">Tipo</th>
                <th className="px-8 py-5">Pessoa</th>
                <th className="px-8 py-5">Data</th>
                <th className="px-8 py-5">Total</th>
                <th className="px-8 py-5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {trash.map((t) => (
                <tr key={t.id} className={`hover:bg-slate-800/30 transition-colors ${selectedIds.includes(t.id) ? 'bg-blue-600/5' : ''}`}>
                  <td className="px-8 py-5">
                    <button onClick={() => toggleSelect(t.id)} className="text-slate-500 hover:text-blue-500">
                      {selectedIds.includes(t.id) ? <CheckSquare className="w-5 h-5 text-blue-500" /> : <Square className="w-5 h-5" />}
                    </button>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded ${t.type === TransactionType.BUY ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-white font-bold">{t.personName}</td>
                  <td className="px-8 py-5 text-slate-500 text-xs">{t.date}</td>
                  <td className={`px-8 py-5 font-black ${t.type === TransactionType.BUY ? 'text-red-400' : 'text-green-400'}`}>
                    R$ {t.total.toFixed(2)}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => onRestore(t.id)}
                      className="p-3 text-blue-500 hover:bg-blue-500/10 rounded-xl transition-all"
                      title="Restaurar Operação"
                    >
                      <RefreshCcw className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecycleBin;
