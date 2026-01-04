
import React, { useState } from 'react';
import { Material, MaterialAvailability } from '../types';
import { Plus, Trash2, Edit2, Search, Settings2, PackagePlus, X, ShoppingCart, TrendingUp, TrendingDown, Layers } from 'lucide-react';

interface MaterialsManagerProps {
  materials: Material[];
  categories: string[];
  onSave: (material: Omit<Material, 'id'> & { id?: string }) => void;
  onDelete: (id: string) => void;
  onUpdateCategories: (categories: string[]) => void;
}

const MaterialsManager: React.FC<MaterialsManagerProps> = ({ materials, categories, onSave, onDelete, onUpdateCategories }) => {
  const [formData, setFormData] = useState({ 
    id: '', 
    name: '', 
    category: categories[0] || '', 
    buyPrice: '', 
    sellPrice: '',
    availability: 'both' as MaterialAvailability
  });
  const [search, setSearch] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredMaterials = materials.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    const buyVal = formData.availability === 'sell_only' ? 0 : parseFloat(formData.buyPrice.toString().replace(',', '.'));
    const sellVal = formData.availability === 'buy_only' ? 0 : parseFloat(formData.sellPrice.toString().replace(',', '.'));
    
    if (formData.availability === 'both' && (isNaN(buyVal) || isNaN(sellVal))) return;
    if (formData.availability === 'buy_only' && isNaN(buyVal)) return;
    if (formData.availability === 'sell_only' && isNaN(sellVal)) return;

    onSave({
      id: formData.id || undefined,
      name: formData.name,
      category: formData.category || categories[0],
      buyPrice: buyVal || 0,
      sellPrice: sellVal || 0,
      availability: formData.availability
    });
    resetForm();
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', category: categories[0] || '', buyPrice: '', sellPrice: '', availability: 'both' });
    setIsFormVisible(false);
  };

  const startEdit = (m: Material) => {
    setFormData({ 
      id: m.id, 
      name: m.name, 
      category: m.category,
      buyPrice: m.buyPrice.toString(), 
      sellPrice: m.sellPrice.toString(),
      availability: m.availability || 'both'
    });
    setIsFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddCategory = () => {
    const trimmed = newCategoryName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      onUpdateCategories([...categories, trimmed]);
      setNewCategoryName('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    if (confirm(`Deseja remover a categoria "${cat}"? Materiais existentes nesta categoria não serão apagados, mas a categoria não aparecerá mais no seletor.`)) {
      onUpdateCategories(categories.filter(c => c !== cat));
    }
  };

  const isSellOnly = formData.availability === 'sell_only';
  const isBuyOnly = formData.availability === 'buy_only';

  return (
    <div className="space-y-6 md:space-y-10 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter uppercase leading-none">Gestão de Materiais</h2>
          <p className="text-slate-400 text-sm mt-1 font-medium italic">Base de dados operacional e controle de estoque.</p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-xl"
          >
            <Layers className="w-4 h-4" />
            Categorias
          </button>
          <button 
            onClick={() => setIsFormVisible(true)}
            className={`flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-2xl hover:scale-105 active:scale-95 ${
              isFormVisible 
              ? 'hidden' 
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/40 ring-4 ring-blue-600/20'
            }`}
          >
            <Plus className="w-4 h-4" />
            Cadastrar Material
          </button>
        </div>
      </header>

      {/* Modal de Gestão de Categorias */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-black uppercase italic tracking-tighter flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" /> Gerenciar Categorias
              </h3>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-slate-500 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Nova categoria..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={newCategoryName}
                  onChange={e => setNewCategoryName(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleAddCategory()}
                />
                <button 
                  onClick={handleAddCategory}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 no-scrollbar">
                {categories.map(cat => (
                  <div key={cat} className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800 group">
                    <span className="text-sm text-slate-300 font-bold tracking-tight">{cat}</span>
                    <button 
                      onClick={() => handleRemoveCategory(cat)}
                      className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsCategoryModalOpen(false)}
              className="w-full mt-6 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] transition-colors"
            >
              Concluir
            </button>
          </div>
        </div>
      )}

      {/* Formulário de Cadastro */}
      {isFormVisible && (
        <div className="bg-slate-900 border-2 border-blue-600/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
          <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none hidden md:block">
             <PackagePlus className="w-24 h-24" />
          </div>
          
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3 text-blue-500">
              <Settings2 className="w-5 h-5" />
              <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">
                {formData.id ? 'Modificar Registro' : 'Novo Cadastro no Sistema'}
              </h3>
            </div>
            <button onClick={resetForm} className="p-2 text-slate-500 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6 items-end">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nome do Material</label>
              <input 
                type="text" 
                placeholder="Ex: Cobre Mel"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoria</label>
              <select 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer text-sm"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="space-y-2 lg:col-span-1">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Disponibilidade</label>
              <div className="flex bg-slate-950 rounded-xl p-1 border border-slate-800">
                <button 
                  type="button"
                  title="Compra e Venda"
                  onClick={() => setFormData({...formData, availability: 'both'})}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${formData.availability === 'both' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Ambos
                </button>
                <button 
                  type="button"
                  title="Apenas Venda"
                  onClick={() => setFormData({...formData, availability: 'sell_only'})}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${formData.availability === 'sell_only' ? 'bg-green-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Venda
                </button>
                <button 
                  type="button"
                  title="Apenas Compra"
                  onClick={() => setFormData({...formData, availability: 'buy_only'})}
                  className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${formData.availability === 'buy_only' ? 'bg-red-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Compra
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-all ${isSellOnly ? 'opacity-20 text-slate-700' : 'text-slate-500'}`}>Compra (R$/kg)</label>
              <input 
                type="text" 
                placeholder="0,00"
                disabled={isSellOnly}
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all ${isSellOnly ? 'opacity-20 cursor-not-allowed bg-slate-900' : ''}`}
                value={isSellOnly ? '-' : formData.buyPrice}
                onChange={e => setFormData({...formData, buyPrice: e.target.value})}
                required={!isSellOnly}
              />
            </div>

            <div className="space-y-2">
              <label className={`text-[10px] font-black uppercase tracking-widest ml-1 transition-all ${isBuyOnly ? 'opacity-20 text-slate-700' : 'text-slate-500'}`}>Venda (R$/kg)</label>
              <input 
                type="text" 
                placeholder="0,00"
                disabled={isBuyOnly}
                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all ${isBuyOnly ? 'opacity-20 cursor-not-allowed bg-slate-900' : ''}`}
                value={isBuyOnly ? '-' : formData.sellPrice}
                onChange={e => setFormData({...formData, sellPrice: e.target.value})}
                required={!isBuyOnly}
              />
            </div>

            <div className="lg:col-span-6 flex flex-col md:flex-row justify-end gap-3 mt-4">
              <button 
                type="button"
                onClick={resetForm}
                className="w-full md:w-auto px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all order-2 md:order-1"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="w-full md:w-auto px-10 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-green-900/20 order-1 md:order-2"
              >
                {formData.id ? 'Salvar Alterações' : 'Confirmar Cadastro'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Área de Listagem com Visualização Diferenciada (Compacta no Mobile) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 md:p-8 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/50 gap-4">
          <h3 className="font-black text-white uppercase italic tracking-tighter text-sm md:text-base">Registros em Banco</h3>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Pesquisar..."
              className="bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs md:text-sm text-white focus:ring-1 focus:ring-blue-500 outline-none w-full"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* VERSÃO MOBILE: Cards Ultra-Compactos */}
        <div className="block md:hidden divide-y divide-slate-800">
          {filteredMaterials.map((m) => {
            const margin = m.sellPrice - m.buyPrice;
            const isSellOnlyList = m.availability === 'sell_only';
            const isBuyOnlyList = m.availability === 'buy_only';
            return (
              <div key={m.id} className="p-4 flex flex-col gap-3 hover:bg-slate-800/30 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-1">
                    <div className="flex gap-1.5 items-center flex-wrap">
                      <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 inline-block">
                        {m.category}
                      </span>
                      {isSellOnlyList && (
                        <span className="text-[8px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-1.5 py-0.5 rounded border border-green-500/20 inline-block">
                          Só Venda
                        </span>
                      )}
                      {isBuyOnlyList && (
                        <span className="text-[8px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 inline-block">
                          Só Compra
                        </span>
                      )}
                    </div>
                    <h4 className="text-white font-bold text-base leading-tight">{m.name}</h4>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEdit(m)}
                      className="p-2.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 rounded-lg active:bg-blue-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDelete(m.id)}
                      className="p-2.5 text-slate-400 hover:text-red-500 bg-slate-950 border border-slate-800 rounded-lg active:bg-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
                  <div className={`text-center border-r border-slate-800 ${isSellOnlyList ? 'opacity-20' : ''}`}>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter mb-0.5">Compra</p>
                    <p className="text-xs font-black text-white">{isSellOnlyList ? '-' : `R$${m.buyPrice.toFixed(2)}`}</p>
                  </div>
                  <div className={`text-center border-r border-slate-800 ${isBuyOnlyList ? 'opacity-20' : ''}`}>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter mb-0.5">Venda</p>
                    <p className="text-xs font-black text-white">{isBuyOnlyList ? '-' : `R$${m.sellPrice.toFixed(2)}`}</p>
                  </div>
                  <div className={`text-center ${(isSellOnlyList || isBuyOnlyList) ? 'opacity-20' : ''}`}>
                    <p className="text-[8px] text-slate-500 font-bold uppercase tracking-tighter mb-0.5">Margem</p>
                    <p className="text-xs font-black text-green-500">{(isSellOnlyList || isBuyOnlyList) ? '-' : `+${margin.toFixed(2)}`}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VERSÃO DESKTOP: Tabela Tradicional */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                <th className="px-8 py-5">Modo</th>
                <th className="px-8 py-5">Categoria</th>
                <th className="px-8 py-5">Material</th>
                <th className="px-8 py-5">Compra (R$/kg)</th>
                <th className="px-8 py-5">Venda (R$/kg)</th>
                <th className="px-8 py-5">Margem Operacional</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredMaterials.map((m) => {
                const margin = m.sellPrice - m.buyPrice;
                const isSellOnlyTable = m.availability === 'sell_only';
                const isBuyOnlyTable = m.availability === 'buy_only';
                return (
                  <tr key={m.id} className="hover:bg-slate-800/20 transition-colors group">
                    <td className="px-8 py-5">
                      {isSellOnlyTable ? (
                        <div className="flex items-center gap-1.5 text-green-500" title="Apenas para Venda">
                           <TrendingUp className="w-3.5 h-3.5" />
                           <span className="text-[9px] font-black uppercase">Venda</span>
                        </div>
                      ) : isBuyOnlyTable ? (
                        <div className="flex items-center gap-1.5 text-red-500" title="Apenas para Compra">
                           <TrendingDown className="w-3.5 h-3.5" />
                           <span className="text-[9px] font-black uppercase">Compra</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-blue-500" title="Compra e Venda">
                           <ShoppingCart className="w-3.5 h-3.5" />
                           <span className="text-[9px] font-black uppercase">Geral</span>
                        </div>
                      )}
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-blue-500 text-[10px] font-black uppercase px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20">
                        {m.category}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-white font-bold">{m.name}</td>
                    <td className={`px-8 py-5 font-mono text-sm ${isSellOnlyTable ? 'text-slate-700 italic' : 'text-slate-300'}`}>
                      {isSellOnlyTable ? 'Não aplicável' : `R$ ${m.buyPrice.toFixed(2)}`}
                    </td>
                    <td className={`px-8 py-5 font-mono text-sm ${isBuyOnlyTable ? 'text-slate-700 italic' : 'text-slate-300'}`}>
                      {isBuyOnlyTable ? 'Não aplicável' : `R$ ${m.sellPrice.toFixed(2)}`}
                    </td>
                    <td className={`px-8 py-5 ${(isSellOnlyTable || isBuyOnlyTable) ? 'opacity-20' : ''}`}>
                      <div className="flex flex-col">
                        <span className="text-green-500 font-black tracking-tighter">
                          {(isSellOnlyTable || isBuyOnlyTable) ? '-' : `R$ ${margin.toFixed(2)} /kg`}
                        </span>
                        {(!isSellOnlyTable && !isBuyOnlyTable) && <span className="text-[10px] text-slate-500 font-bold uppercase">Rentabilidade</span>}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => startEdit(m)}
                          className="p-3 text-slate-500 hover:text-white hover:bg-blue-600 rounded-xl transition-all"
                          title="Editar Registro"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => onDelete(m.id)}
                          className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                          title="Apagar do Sistema"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMaterials.length === 0 && (
          <div className="px-8 py-16 text-center text-slate-600 font-medium italic">
            Nenhum material encontrado no banco de dados.
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialsManager;
