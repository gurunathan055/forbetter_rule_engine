
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
  Users,
  UserPlus,
  ShieldCheck,
  UserCog
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

const MOCK_USERS: User[] = [
  {
    id: 'admin-001',
    username: 'supadmin',
    name: 'System Superadmin',
    email: 'admin@nexusbre.com',
    role: UserRole.SUPERADMIN,
    avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=4f46e5&color=fff'
  },
  {
    id: 'mgr-002',
    username: 'jdoe',
    name: 'Jane Doe',
    email: 'jane.doe@fmcg.com',
    role: UserRole.MANAGER,
    avatar: 'https://ui-avatars.com/api/?name=Jane+Doe&background=6366f1&color=fff'
  },
  {
    id: 'view-003',
    username: 'rsmith',
    name: 'Robert Smith',
    email: 'robert.smith@analytics.com',
    role: UserRole.VIEWER,
    avatar: 'https://ui-avatars.com/api/?name=Robert+Smith&background=94a3b8&color=fff'
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rules' | 'processor' | 'admin'>('dashboard');
  const [rules, setRules] = useState<Rule[]>(INITIAL_RULES);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

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

  const updateUserRole = (userId: string, newRole: UserRole) => {
    const updatedUsers = users.map(u => u.id === userId ? { ...u, role: newRole } : u);
    setUsers(updatedUsers);
    // If we updated the current user, update the active user state too
    if (user && user.id === userId) {
      const updatedUser = { ...user, role: newRole };
      setUser(updatedUser);
      localStorage.setItem('nexus_auth_user', JSON.stringify(updatedUser));
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const isSuperAdmin = user.role === UserRole.SUPERADMIN;
  const isManager = user.role === UserRole.MANAGER || isSuperAdmin;

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

          {isSuperAdmin && (
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
                user.role === UserRole.SUPERADMIN ? 'bg-rose-100 text-rose-700' : 
                user.role === UserRole.MANAGER ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
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
          {activeTab === 'dashboard' && <Dashboard rules={rules} user={user} />}
          {activeTab === 'rules' && (
            <RulesManager 
              userRole={user.role}
              rules={rules} 
              onAdd={addRule} 
              onUpdate={updateRule} 
              onDelete={deleteRule} 
            />
          )}
          {activeTab === 'processor' && <DataProcessor rules={rules} userRole={user.role} />}
          {activeTab === 'admin' && isSuperAdmin && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">User Access Management</h3>
                    <p className="text-slate-500">Manage organizational members, assign roles, and audit access permissions.</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                    <UserPlus size={18} /> Invite User
                  </button>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100 mb-8">
                  <ShieldCheck className="text-indigo-600" size={24} />
                  <div>
                    <p className="font-bold text-indigo-900">Enterprise RBAC Policy Enabled</p>
                    <p className="text-sm text-indigo-700">Role changes are logged in the audit trail and take effect immediately across all sessions.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 font-semibold text-slate-600">User</th>
                        <th className="pb-4 font-semibold text-slate-600">Email Address</th>
                        <th className="pb-4 font-semibold text-slate-600">Assigned Role</th>
                        <th className="pb-4 font-semibold text-slate-600">Security Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} className="w-8 h-8 rounded-lg" alt="" />
                              <div>
                                <p className="font-bold text-slate-800">{u.name}</p>
                                <p className="text-xs text-slate-400 font-mono tracking-tight">@{u.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-slate-600">{u.email}</td>
                          <td className="py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              u.role === UserRole.SUPERADMIN ? 'bg-rose-100 text-rose-700' : 
                              u.role === UserRole.MANAGER ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4">
                            <div className="flex gap-2">
                              {Object.values(UserRole).map(role => (
                                <button 
                                  key={role}
                                  onClick={() => updateUserRole(u.id, role)}
                                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase transition-all ${
                                    u.role === role 
                                      ? 'bg-indigo-600 text-white shadow-md' 
                                      : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-600'
                                  }`}
                                >
                                  {role}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-white shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-rose-500/20 rounded-xl">
                        <ShieldAlert className="text-rose-500" size={24} />
                      </div>
                      <h4 className="font-bold text-xl">System Audit Summary</h4>
                    </div>
                    <div className="space-y-4 text-sm text-slate-400">
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>Total Users</span>
                        <span className="font-bold text-white">{users.length}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-2">
                        <span>Privileged Accounts</span>
                        <span className="font-bold text-indigo-400">{users.filter(u => u.role !== UserRole.VIEWER).length}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span>Security Compliance</span>
                        <span className="font-bold text-emerald-400">98% Verified</span>
                      </div>
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                      <UserCog size={32} className="text-slate-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">Identity Configuration</h4>
                      <p className="text-sm text-slate-500 px-8">Federated identity and external SSO providers can be managed from the Cloud Console.</p>
                    </div>
                    <button className="text-indigo-600 font-bold text-sm hover:underline">View Integration Docs</button>
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
