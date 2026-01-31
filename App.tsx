
import React, { useState, useEffect } from 'react';
import { Department, Rule, RuleSeverity } from './types';
import Dashboard from './views/Dashboard';
import RulesManager from './views/RulesManager';
import DataProcessor from './views/DataProcessor';
import { 
  LayoutDashboard, 
  Settings2, 
  DatabaseZap, 
  Menu, 
  X, 
  ChevronRight,
  Truck,
  Package,
  Factory,
  ShoppingCart
} from 'lucide-react';

const INITIAL_RULES: Rule[] = [
  {
    id: '1',
    name: 'High Value Procurement Approval',
    description: 'Procurement orders over $10,000 require senior management sign-off.',
    department: Department.PROCUREMENT,
    condition: 'data.total_value > 10000',
    action: 'Flag for approval',
    severity: RuleSeverity.CRITICAL,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Stock Outage Risk',
    description: 'Inventory levels dropping below reorder point.',
    department: Department.WAREHOUSING,
    condition: 'data.stock_level < data.reorder_point',
    action: 'Trigger purchase order',
    severity: RuleSeverity.WARNING,
    isActive: true,
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Expiry Alert',
    description: 'Perishable goods expiring within 7 days.',
    department: Department.WAREHOUSING,
    condition: 'new Date(data.expiry_date) - new Date() < (7 * 24 * 60 * 60 * 1000)',
    action: 'Prioritize for distribution',
    severity: RuleSeverity.CRITICAL,
    isActive: true,
    createdAt: new Date().toISOString()
  }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rules' | 'processor'>('dashboard');
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const addRule = (newRule: Rule) => setRules([...rules, newRule]);
  const updateRule = (updated: Rule) => setRules(rules.map(r => r.id === updated.id ? updated : r));
  const deleteRule = (id: string) => setRules(rules.filter(r => r.id !== id));

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-900 transition-all duration-300 flex flex-col z-20`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <DatabaseZap className="text-indigo-900 w-6 h-6" />
          </div>
          {isSidebarOpen && <h1 className="text-white font-bold text-xl tracking-tight">Nexus BRE</h1>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'rules' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <Settings2 size={20} />
            {isSidebarOpen && <span>Rule Repository</span>}
          </button>
          <button 
            onClick={() => setActiveTab('processor')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'processor' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <DatabaseZap size={20} />
            {isSidebarOpen && <span>Data Processor</span>}
          </button>
        </nav>

        <div className="p-4 bg-indigo-950/50">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full text-indigo-300 hover:text-white flex justify-center">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 capitalize">{activeTab}</h2>
            <p className="text-slate-500 text-sm">Enterprise FMCG Business Rules Engine</p>
          </div>
          <div className="flex gap-4">
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white text-xs font-bold text-blue-600">P</span>
              <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-white text-xs font-bold text-green-600">M</span>
              <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white text-xs font-bold text-orange-600">W</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard rules={rules} />}
          {activeTab === 'rules' && <RulesManager rules={rules} onAdd={addRule} onUpdate={updateRule} onDelete={deleteRule} />}
          {activeTab === 'processor' && <DataProcessor rules={rules} />}
        </div>
      </main>
    </div>
  );
};

export default App;
