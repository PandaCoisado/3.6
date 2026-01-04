
import React, { useState, useMemo } from 'react';
import { Material } from '../types';
import { Search, Tag, TrendingUp, TrendingDown } from 'lucide-react';

interface PricesViewProps {
  materials: Material[];
}

const PricesView: React.FC<PricesViewProps> = ({ materials }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('TODOS');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(materials.map(m => m.category)));
    return ['TODOS', ...cats];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
                           m.category.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'TODOS' || m.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [materials, search, selectedCategory]);

  const groupedByFiltered = useMemo(() => {
    return filteredMaterials.reduce((acc, m) => {
      if (!acc[m.category]) acc[m.category] = [];
      acc[m.category].push(m);
      return acc;
    }, {} as Record<string, Material[]>);
  }, [filteredMaterials]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="flex flex-col gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase">Preços Atuais</h2>
          <p className="text-slate-400 text-sm md:text-base">Consulte as cotações do dia por categoria.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input 
              type="text"
              placeholder="Pesquisar material..."
              className="bg-slate-800 border border-slate-700 rounded-2xl pl-12 pr-6 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none w-full shadow-lg"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Seletor de Categorias Estilo Tabs/Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                selectedCategory === cat 
                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/40' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white hover:border-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {Object.entries(groupedByFiltered).map(([category, items]) => (
          <div key={category} className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl transition-all hover:border-slate-700">
            <div className="bg-slate-800/40 px-6 md:px-8 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Tag className="w-4 h-4 text-blue-500" />
                <h3 className="font-black text-white uppercase italic tracking-tighter text-sm md:text-base">{category}</h3>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase bg-slate-950 px-2 py-1 rounded">
                {items.length} Itens
              </span>
            </div>
            <div className="divide-y divide-slate-800/50">
              {items.map(m => {
                const canBuy = m.availability !== 'sell_only';
                const canSell = m.availability !== 'buy_only';
                return (
                  <div key={m.id} className="px-6 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-800/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-8 bg-blue-600/20 rounded-full hidden md:block"></div>
                      <h4 className="text-white font-bold text-lg tracking-tight">{m.name}</h4>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 md:gap-12">
                      <div className={`flex flex-col ${!canBuy ? 'opacity-20 select-none' : ''}`}>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Pagamos (Compra)</p>
                        <div className="flex items-center gap-1.5 text-red-400 font-black text-xl md:text-2xl tracking-tighter">
                          <TrendingDown className="w-4 h-4 opacity-50" />
                          {canBuy ? `R$ ${m.buyPrice.toFixed(2)}` : 'N/A'}
                        </div>
                      </div>
                      <div className={`flex flex-col ${!canSell ? 'opacity-20 select-none' : ''}`}>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Vendemos (Venda)</p>
                        <div className="flex items-center gap-1.5 text-green-400 font-black text-xl md:text-2xl tracking-tighter">
                          <TrendingUp className="w-4 h-4 opacity-50" />
                          {canSell ? `R$ ${m.sellPrice.toFixed(2)}` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredMaterials.length === 0 && (
          <div className="py-24 text-center bg-slate-900/50 border-2 border-dashed border-slate-800 rounded-3xl">
            <Search className="w-12 h-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500 font-medium text-lg italic">Nenhum material encontrado para estes critérios.</p>
            <button 
              onClick={() => {setSearch(''); setSelectedCategory('TODOS');}}
              className="mt-4 text-blue-500 font-bold uppercase text-xs hover:underline"
            >
              Limpar Todos os Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricesView;
