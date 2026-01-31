
import React, { useState, useEffect } from 'react';
import { Department, Rule, RuleSeverity, User, UserRole } from './types';
import Dashboard from './views/Dashboard';
import RulesManager from './views/RulesManager';
import DataProcessor from './views/DataProcessor';
import Login from './views/Login';
import { 
  LayoutDashboard, 
  Settings2, 
  DatabaseZap, 
  Menu, 
  X, 
  LogOut,
  ShieldAlert,
  Users
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
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rules' | 'processor' | 'admin'>('dashboard');
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Persistence logic
  useEffect(() => {
    const savedUser = localStorage.getItem('nexus_auth_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('nexus_auth_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('nexus_auth_user');
  };

  const addRule = (newRule: Rule) => setRules([...rules, newRule]);
  const updateRule = (updated: Rule) => setRules(rules.map(r => r.id === updated.id ? updated : r));
  const deleteRule = (id: string) => setRules(rules.filter(r => r.id !== id));

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-indigo-900 transition-all duration-300 flex flex-col z-20 shadow-xl`}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-white p-2 rounded-lg">
            <DatabaseZap className="text-indigo-900 w-6 h-6" />
          </div>
          {isSidebarOpen && <h1 className="text-white font-bold text-xl tracking-tight">Nexus BRE</h1>}
        </div>

        <nav className="flex-1 mt-6 px-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-800 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <LayoutDashboard size={20} />
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('rules')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'rules' ? 'bg-indigo-800 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <Settings2 size={20} />
            {isSidebarOpen && <span>Rule Repository</span>}
          </button>
          
          <button 
            onClick={() => setActiveTab('processor')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'processor' ? 'bg-indigo-800 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}
          >
            <DatabaseZap size={20} />
            {isSidebarOpen && <span>Data Processor</span>}
          </button>

          {user.role === UserRole.SUPERADMIN && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'admin' ? 'bg-indigo-800 text-white shadow-lg' : 'text-indigo-200 hover:bg-indigo-800'}`}
            >
              <Users size={20} />
              {isSidebarOpen && <span>User Control</span>}
            </button>
          )}
        </nav>

        {/* User Profile Area */}
        <div className="mt-auto p-4 border-t border-indigo-800/50">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <img src={user.avatar} className="w-10 h-10 rounded-xl border-2 border-indigo-500/30 shadow-md" alt="User" />
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold truncate">{user.name}</p>
                <p className="text-indigo-300 text-[10px] uppercase font-bold tracking-widest">{user.role}</p>
              </div>
            )}
            {isSidebarOpen && (
              <button onClick={handleLogout} className="text-indigo-400 hover:text-white transition-colors">
                <LogOut size={18} />
              </button>
            )}
          </div>
          {!isSidebarOpen && (
             <button onClick={handleLogout} className="w-full mt-4 flex justify-center text-indigo-400 hover:text-white transition-colors">
                <LogOut size={18} />
             </button>
          )}
        </div>

        <div className="p-4 bg-indigo-950/50">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full text-indigo-300 hover:text-white flex justify-center transition-transform hover:scale-110">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-10 px-8 py-4 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
               <h2 className="text-2xl font-bold text-slate-800 capitalize">
                {activeTab === 'admin' ? 'Administrative Control' : activeTab}
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                user.role === UserRole.SUPERADMIN ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'
              }`}>
                {user.role}
              </span>
            </div>
            <p className="text-slate-500 text-sm">Enterprise FMCG Business Rules Engine</p>
          </div>
          <div className="flex gap-4">
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white text-xs font-bold text-blue-600 shadow-sm" title="Procurement">P</span>
              <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center border-2 border-white text-xs font-bold text-green-600 shadow-sm" title="Production">M</span>
              <span className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center border-2 border-white text-xs font-bold text-orange-600 shadow-sm" title="Warehousing">W</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && <Dashboard rules={rules} />}
          {activeTab === 'rules' && (
            <RulesManager 
              userRole={user.role}
              rules={rules} 
              onAdd={addRule} 
              onUpdate={updateRule} 
              onDelete={deleteRule} 
            />
          )}
          {activeTab === 'processor' && <DataProcessor rules={rules} />}
          {activeTab === 'admin' && user.role === UserRole.SUPERADMIN && (
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-2">User Access Management</h3>
                <p className="text-slate-500 mb-6">Centralized control for system roles and permissions.</p>
                
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <ShieldAlert className="text-rose-500" size={24} />
                  <div>
                    <p className="font-bold text-slate-800">Security Policy Active</p>
                    <p className="text-sm text-slate-500">Only Superadmins can modify rules for critical production lines.</p>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                    <h4 className="font-bold text-indigo-900 mb-2">Simulation: Role Switching</h4>
                    <p className="text-sm text-indigo-700 mb-4">Temporarily change your role to test permissions.</p>
                    <div className="flex gap-2">
                       {[UserRole.SUPERADMIN, UserRole.MANAGER, UserRole.VIEWER].map(r => (
                         <button 
                           key={r}
                           onClick={() => {
                             const updatedUser = { ...user, role: r };
                             setUser(updatedUser);
                             localStorage.setItem('nexus_auth_user', JSON.stringify(updatedUser));
                           }}
                           className={`px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all ${
                             user.role === r ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-100'
                           }`}
                         >
                           {r}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
