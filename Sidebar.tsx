
import React from 'react';
import { LayoutDashboard, ShoppingCart, TrendingUp, History, Recycle, Settings2, BarChart3, Users, Trash2 } from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'prices', label: 'Cotações', icon: BarChart3 },
    { id: 'management', label: 'Materiais', icon: Settings2 },
    { id: 'employees', label: 'Equipe', icon: Users },
    { id: 'buy', label: 'Compras', icon: ShoppingCart },
    { id: 'sell', label: 'Vendas', icon: TrendingUp },
    { id: 'history', label: 'Relatórios', icon: History },
    { id: 'trash', label: 'Lixeira', icon: Trash2 },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0 no-print transition-all duration-300 z-50">
      <div className="p-4 lg:p-6 flex items-center gap-3 border-b border-slate-800/50">
        <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-900/40 shrink-0">
          <Recycle className="w-5 h-5 text-white" />
        </div>
        <div className="hidden lg:block overflow-hidden">
          <h1 className="text-lg font-black text-white tracking-tighter italic uppercase leading-tight">FERRO VELHO</h1>
          <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.2em] opacity-80">Premium Manager</p>
        </div>
      </div>

      <nav className="flex-1 px-3 lg:px-4 py-8 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              title={item.label}
              className={`w-full flex items-center justify-center lg:justify-start gap-0 lg:gap-4 p-3 lg:px-4 lg:py-3.5 rounded-2xl transition-all duration-300 group relative ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/30' 
                  : 'text-slate-500 hover:bg-slate-800 hover:text-white'
              } ${item.id === 'trash' && !isActive ? 'hover:text-red-400' : ''}`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-inherit'}`} />
              <span className={`hidden lg:block font-black text-[11px] uppercase tracking-widest transition-opacity ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
