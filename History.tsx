
import React, { useState } from 'react';
import { Transaction, TransactionType, formatDateBR } from '../types';
import { Search, Download, ChevronDown, ChevronUp, Trash2, Package, Calendar, Info } from 'lucide-react';

interface HistoryProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const History: React.FC<HistoryProps> = ({ transactions, onDelete }) => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | TransactionType>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = transactions.filter(t => {
    const matchesSearch = t.personName?.toLowerCase().includes(search.toLowerCase()) || 
                          t.items?.some(item => item.materialName.toLowerCase().includes(search.toLowerCase()));
    const matchesFilter = filter === 'ALL' || t.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Relatórios</h2>
          <p className="text-slate-400 font-medium">Histórico completo de movimentações.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-2 rounded-xl no-print">
            <Info className="w-4 h-4 text-blue-500" />
            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Exclusões vão para Lixeira</span>
          </div>
          <button onClick={() => window.print()} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-black uppercase tracking-widest no-print shadow-lg">Relatório PDF</button>
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col lg:flex-row gap-4 justify-between bg-slate-900/50 no-print">
          <input type="text" placeholder="Buscar operação..." className="bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-sm text-white focus:ring-2 focus:ring-blue-500 outline-none w-full max-w-md" value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            {['ALL', TransactionType.BUY, TransactionType.SELL].map((f) => (
              <button key={f} onClick={() => setFilter(f as any)} className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === f ? (f === 'ALL' ? 'bg-blue-600' : f === TransactionType.BUY ? 'bg-red-600' : 'bg-green-600') + ' text-white' : 'text-slate-500 hover:text-white'}`}>
                {f === 'ALL' ? 'TUDO' : f === TransactionType.BUY ? 'COMPRAS' : 'VENDAS'}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-800">
          {filtered.slice().reverse().map((t) => {
            const isExpanded = expandedId === t.id;
            return (
              <div key={t.id} className={`group transition-all ${isExpanded ? 'bg-slate-800/20' : 'hover:bg-slate-800/10'}`}>
                <div className="p-5 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer" onClick={() => setExpandedId(isExpanded ? null : t.id)}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg font-black text-[10px] uppercase ${t.type === TransactionType.BUY ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>{t.type}</div>
                    <div>
                      <h4 className="text-white font-bold">{t.personName}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1.5"><Calendar className="w-3 h-3" /> {formatDateBR(t.date)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <span className={`text-lg font-black ${t.type === TransactionType.BUY ? 'text-red-400' : 'text-green-400'}`}>R$ {t.total.toFixed(2)}</span>
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); onDelete(t.id); }} className="p-2 text-slate-600 hover:text-red-500 no-print"><Trash2 className="w-5 h-5" /></button>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
                    </div>
                  </div>
                </div>
                {isExpanded && (
                  <div className="px-5 md:px-8 pb-8 pt-2 animate-in slide-in-from-top-2">
                    <div className="bg-slate-950/50 border border-slate-800 rounded-2xl overflow-hidden p-4">
                      {t.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 border-b border-slate-900 last:border-0">
                          <span className="text-sm text-white font-bold flex items-center gap-2"><Package className="w-3 h-3 text-blue-500" /> {item.materialName}</span>
                          <span className="text-xs text-slate-400">{item.weight}kg x R${item.unitPrice.toFixed(2)} = <b className="text-white">R${item.total.toFixed(2)}</b></span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default History;
