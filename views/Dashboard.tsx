
import React from 'react';
import { Rule, Department, RuleSeverity, User, UserRole } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { ShieldCheck, AlertTriangle, Activity, Database, User as UserIcon } from 'lucide-react';

interface Props {
  rules: Rule[];
  user: User;
}

const Dashboard: React.FC<Props> = ({ rules, user }) => {
  const deptData = Object.values(Department).map(dept => ({
    name: dept,
    count: rules.filter(r => r.department === dept).length,
    active: rules.filter(r => r.department === dept && r.isActive).length
  }));

  const severityData = [
    { name: 'Critical', value: rules.filter(r => r.severity === RuleSeverity.CRITICAL).length, color: '#ef4444' },
    { name: 'Warning', value: rules.filter(r => r.severity === RuleSeverity.WARNING).length, color: '#f59e0b' },
    { name: 'Info', value: rules.filter(r => r.severity === RuleSeverity.INFO).length, color: '#3b82f6' },
  ];

  const stats = [
    { label: 'Total Rules', value: rules.length, icon: Database, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Data Quality Score', value: '94.2%', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Active Alerts', value: rules.filter(r => r.severity === RuleSeverity.CRITICAL).length, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Evaluation Speed', value: '1.2ms', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  const isSuperAdmin = user.role === UserRole.SUPERADMIN;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-1/3 opacity-10 flex items-center justify-center">
          <UserIcon size={180} />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Welcome back, {user.name.split(' ')[0]}!</h2>
          <p className="text-indigo-100/80 max-w-xl">
            {user.role === UserRole.SUPERADMIN 
              ? "You have full administrative privileges. Use the Control module to manage system access."
              : user.role === UserRole.MANAGER 
              ? "Your rule authoring privileges are active. Production quality metrics are trending upward."
              : "Read-only access enabled. You are viewing real-time compliance metrics for all departments."}
          </p>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rule Distribution by Dept */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Rule Distribution by Department</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Total Rules" />
                <Bar dataKey="active" fill="#10b981" radius={[4, 4, 0, 0]} name="Active" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Severity Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Risk Severity Profile</h3>
          <div className="h-[300px] w-full flex flex-col items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={severityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-4 mt-4 text-sm">
              {severityData.map(d => (
                <div key={d.name} className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }}></span>
                  <span className="text-slate-600">{d.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Log / Recent Rules */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Rule Deployments</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="pb-4 font-semibold text-slate-600">Rule Name</th>
                <th className="pb-4 font-semibold text-slate-600">Department</th>
                <th className="pb-4 font-semibold text-slate-600">Status</th>
                <th className="pb-4 font-semibold text-slate-600">Date Added</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {rules.slice(0, 5).map(rule => (
                <tr key={rule.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="py-4 font-medium text-slate-700 group-hover:text-indigo-600 transition-colors">{rule.name}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
                      {rule.department}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`flex items-center gap-1 text-sm ${rule.isActive ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${rule.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      {rule.isActive ? 'Operational' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 text-slate-500 text-sm">
                    {new Date(rule.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
