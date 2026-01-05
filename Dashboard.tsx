import React, { useMemo, useState } from 'react';
import { Material, Transaction, TransactionType } from './types';
import { TrendingDown, TrendingUp, DollarSign, BrainCircuit, Layers, CalendarDays, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getBusinessInsights } from './geminiService';.

interface DashboardProps {
  materials: Material[];
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ materials, transactions }) => {
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekRange = useMemo(() => {
    const start = new Date(selectedDate);
    start.setDate(selectedDate.getDate() - selectedDate.getDay());
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    return { start, end };
  }, [selectedDate]);

  const transactionsInPeriod = useMemo(() => {
    return transactions.filter(t => {
      const tDate = new Date(t.date);
      return tDate >= weekRange.start && tDate <= weekRange.end;
    });
  }, [transactions, weekRange]);

  const stats = useMemo(() => {
    const totalBuy = transactionsInPeriod.filter(t => t.type === TransactionType.BUY).reduce((acc, t) => acc + t.total, 0);
    const totalSell = transactionsInPeriod.filter(t => t.type === TransactionType.SELL).reduce((acc, t) => acc + t.total, 0);
    return { totalBuy, totalSell, profit: totalSell - totalBuy };
  }, [transactionsInPeriod]);

  const chartData = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekRange.start);
      d.setDate(weekRange.start.getDate() + i);
      const dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      
      const dayTransactions = transactionsInPeriod.filter(t => {
        const tDate = new Date(t.date);
        return tDate.getDate() === d.getDate() && 
               tDate.getMonth() === d.getMonth() && 
               tDate.getFullYear() === d.getFullYear();
      });

      const buy = dayTransactions.filter(t => t.type === TransactionType.BUY).reduce((acc, t) => acc + t.total, 0);
      const sell = dayTransactions.filter(t => t.type === TransactionType.SELL).reduce((acc, t) => acc + t.total, 0);
      
      days.push({ name: dateStr, Compra: buy, Venda: sell });
    }
    return days;
  }, [transactionsInPeriod, weekRange]);

  const fetchInsights = async () => {
    if (loadingInsights) return;
    setLoadingInsights(true);
    try {
      const data = await getBusinessInsights(materials, transactionsInPeriod);
      setInsights(data);
    } catch (e) {
      setInsights("Erro ao carregar insights.");
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500 pb-10">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <h2 className="text-3xl md:text-5xl font-black text-white italic tracking-tighter uppercase leading-none">Faturamento</h2>
          <p className="text-slate-400 mt-2 text-sm md:text-base font-medium">Balanço financeiro da semana selecionada.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-xl">
          <button onClick={() => {
            const d = new Date(selectedDate); d.setDate(d.getDate() - 7); setSelectedDate(d);
          }} className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="relative group px-2 flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl hover:border-blue-500 transition-colors">
            <CalendarDays className="w-4 h-4 text-blue-500 ml-2" />
            <input 
              type="date" 
              className="bg-transparent text-white font-black uppercase text-[10px] tracking-widest py-2 px-1 outline-none cursor-pointer [color-scheme:dark]"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                const parts = e.target.value.split('-');
                const newDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]), 12, 0, 0);
                setSelectedDate(newDate);
              }}
            />
          </div>

          <button onClick={() => {
            const d = new Date(selectedDate); d.setDate(d.getDate() + 7); setSelectedDate(d);
          }} className="p-2.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>

          <button onClick={() => setSelectedDate(new Date())} className="p-2.5 hover:bg-blue-600/20 text-blue-500 rounded-xl transition-all border-l border-slate-800" title="Hoje">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-red-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Saídas (Compras)</p>
            <TrendingDown className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            {stats.totalBuy.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-xl hover:border-green-500/30 transition-all group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Entradas (Vendas)</p>
            <TrendingUp className="w-4 h-4 text-green-500 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            {stats.totalSell.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
        </div>

        <div className="bg-slate-900 border-2 border-blue-600/20 p-6 rounded-3xl shadow-2xl sm:col-span-2 lg:col-span-1 group">
          <div className="flex justify-between items-start mb-4">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Balanço Final</p>
            <DollarSign className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <h3 className={`text-2xl md:text-4xl font-black tracking-tight ${stats.profit >= 0 ? 'text-blue-400' : 'text-orange-500'}`}>
            {stats.profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <h3 className="text-lg font-black text-white uppercase tracking-tighter italic border-l-4 border-blue-600 pl-4 mb-8">Performance Semanal</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorBuy" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ef4444" stopOpacity={0.1}/><stop offset="95%" stopColor="#ef4444" stopOpacity={0}/></linearGradient>
                  <linearGradient id="colorSell" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/><stop offset="95%" stopColor="#22c55e" stopOpacity={0}/></linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} dy={10} />
                <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} width={80} tickFormatter={(v) => `R$ ${v}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
                <Area type="monotone" dataKey="Compra" stroke="#ef4444" fill="url(#colorBuy)" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} activeDot={{ r: 6 }} />
                <Area type="monotone" dataKey="Venda" stroke="#22c55e" fill="url(#colorSell)" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col shadow-2xl min-h-[400px]">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/40"><BrainCircuit className="w-5 h-5 text-white" /></div>
            <h3 className="font-black text-white uppercase italic tracking-tighter text-sm">Consultoria IA</h3>
          </div>
          
          <div className="flex-1 text-sm text-slate-400 overflow-y-auto pr-2 custom-scrollbar">
            {loadingInsights ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 py-10 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="font-black uppercase text-[9px] tracking-[0.2em] text-slate-500 animate-pulse">Auditando Fluxo de Caixa...</p>
              </div>
            ) : insights ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {insights.split('\n').filter(l => l.trim()).map((line, i) => (
                  <div key={i} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-[11px] font-medium leading-relaxed relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 group-hover:w-full group-hover:opacity-5 transition-all"></div>
                    {line.replace(/^(\d+\.|-|\*)\s+/, '')}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-10 opacity-30 px-4">
                <BrainCircuit className="w-12 h-12 mb-4 text-slate-700" />
                <p className="text-[10px] font-black uppercase tracking-widest leading-loose">Solicite uma análise estratégica para otimizar seus preços.</p>
              </div>
            )}
          </div>
          
          <button 
            onClick={fetchInsights} 
            disabled={loadingInsights || transactionsInPeriod.length === 0} 
            className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-30 shadow-xl shadow-blue-900/20 active:scale-95"
          >
            {transactionsInPeriod.length === 0 ? 'Sem dados para análise' : 'Gerar Relatório Estratégico'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
