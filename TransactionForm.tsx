
import React, { useState, useMemo } from 'react';
import { Material, TransactionType, TransactionItem } from '../types';
import { Scale, Plus, ShoppingCart, Trash2, CheckCircle2, User } from 'lucide-react';

interface TransactionFormProps {
  type: TransactionType;
  materials: Material[];
  onComplete: (transaction: { type: TransactionType; personName: string; items: TransactionItem[]; total: number; date: string }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ type, materials, onComplete }) => {
  const [personName, setPersonName] = useState('');
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [weight, setWeight] = useState('');
  const [basket, setBasket] = useState<TransactionItem[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const isBuy = type === TransactionType.BUY;

  const availableMaterials = useMemo(() => {
    return materials.filter(m => isBuy ? m.availability !== 'sell_only' : m.availability !== 'buy_only');
  }, [materials, isBuy]);

  const selectedMaterial = useMemo(() => availableMaterials.find(m => m.id === selectedMaterialId), [selectedMaterialId, availableMaterials]);
  const unitPrice = selectedMaterial ? (isBuy ? selectedMaterial.buyPrice : selectedMaterial.sellPrice) : 0;
  const currentItemTotal = useMemo(() => {
    const w = parseFloat(weight.replace(',', '.'));
    return isNaN(w) ? 0 : w * unitPrice;
  }, [weight, unitPrice]);

  const handleAddItem = () => {
    const w = parseFloat(weight.replace(',', '.'));
    if (!selectedMaterial || isNaN(w) || w <= 0) return;

    setBasket([...basket, {
      materialName: selectedMaterial.name,
      weight: w,
      unitPrice: unitPrice,
      total: currentItemTotal
    }]);
    setWeight('');
    setSelectedMaterialId('');
  };

  const handleSubmitTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (basket.length === 0 || !personName.trim()) return;

    onComplete({
      type,
      personName: personName.trim(),
      items: basket,
      total: basket.reduce((acc, item) => acc + item.total, 0),
      date: new Date().toISOString()
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setBasket([]);
      setPersonName('');
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-20 flex flex-col items-center text-center animate-in zoom-in duration-500">
        <div className={`p-6 rounded-full mb-8 ${isBuy ? 'bg-red-500' : 'bg-green-500'}`}><CheckCircle2 className="w-16 h-16 text-white" /></div>
        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">Concluído!</h3>
        <p className="text-slate-400 font-medium">{type} registrada com sucesso.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <header>
        <h2 className={`text-3xl md:text-5xl font-black uppercase italic tracking-tighter ${isBuy ? 'text-red-500' : 'text-green-500'}`}>Registrar {type}</h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome do Cliente/Fornecedor</label>
              <input type="text" placeholder="Nome completo..." className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-white font-bold focus:ring-2 focus:ring-blue-500 outline-none" value={personName} onChange={e => setPersonName(e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Material</label>
              <select className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-white font-bold outline-none" value={selectedMaterialId} onChange={e => setSelectedMaterialId(e.target.value)}>
                <option value="">Selecione...</option>
                {availableMaterials.map(m => <option key={m.id} value={m.id}>{m.name} (R${(isBuy ? m.buyPrice : m.sellPrice).toFixed(2)})</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Peso (kg)</label>
              <input type="text" placeholder="0.00" className="w-full bg-slate-950 border border-slate-800 rounded-xl px-6 py-3 text-white font-bold outline-none" value={weight} onChange={e => setWeight(e.target.value)} />
            </div>

            <button onClick={handleAddItem} disabled={!selectedMaterial || !weight} className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" /> Adicionar Material
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col min-h-[400px]">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><ShoppingCart className="w-4 h-4" /> Carrinho</h3>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {basket.length === 0 ? <p className="text-center text-slate-600 italic py-10">Carrinho vazio</p> : basket.map((item, idx) => (
              <div key={idx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex justify-between items-center group">
                <div>
                  <h4 className="text-sm text-white font-bold">{item.materialName}</h4>
                  <p className="text-[10px] text-slate-500 font-bold">{item.weight}kg x R${item.unitPrice.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-white">R${item.total.toFixed(2)}</span>
                  <button onClick={() => setBasket(basket.filter((_, i) => i !== idx))} className="text-slate-600 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <span className="text-slate-400 font-black uppercase text-xl">Total</span>
              <span className={`text-3xl font-black ${isBuy ? 'text-red-500' : 'text-green-500'}`}>
                R$ {basket.reduce((acc, i) => acc + i.total, 0).toFixed(2)}
              </span>
            </div>
            <button onClick={handleSubmitTransaction} disabled={basket.length === 0 || !personName.trim()} className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl disabled:opacity-50 ${isBuy ? 'bg-red-600 hover:bg-red-500' : 'bg-green-600 hover:bg-green-500'}`}>Finalizar {type}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionForm;
