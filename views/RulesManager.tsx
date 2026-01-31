
import React, { useState } from 'react';
import { Rule, Department, RuleSeverity } from '../types';
import { Plus, Trash2, Edit3, Save, X, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

interface Props {
  rules: Rule[];
  onAdd: (rule: Rule) => void;
  onUpdate: (rule: Rule) => void;
  onDelete: (id: string) => void;
}

const RulesManager: React.FC<Props> = ({ rules, onAdd, onUpdate, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Rule>>({
    name: '',
    description: '',
    department: Department.PROCUREMENT,
    condition: '',
    action: '',
    severity: RuleSeverity.INFO,
    isActive: true
  });

  const handleSave = () => {
    if (editingId) {
      onUpdate({ ...formData, id: editingId } as Rule);
      setEditingId(null);
    } else {
      onAdd({
        ...formData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      } as Rule);
      setIsAdding(false);
    }
    setFormData({});
  };

  const handleEdit = (rule: Rule) => {
    setFormData(rule);
    setEditingId(rule.id);
    setIsAdding(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Operational Repository</h3>
          <p className="text-slate-500">Manage all logic gates and validation rules across the supply chain.</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => { setIsAdding(true); setEditingId(null); setFormData({ department: Department.PROCUREMENT, severity: RuleSeverity.INFO, isActive: true }); }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-semibold transition-all"
          >
            <Plus size={18} /> Add New Rule
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-8 rounded-2xl border-2 border-indigo-100 shadow-xl space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-bold text-indigo-900 flex items-center gap-2">
              <Plus size={20} /> {editingId ? 'Edit Rule Configuration' : 'Create New Logic Gate'}
            </h4>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Rule Name</label>
              <input 
                value={formData.name || ''}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Temperature Out of Range"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Department</label>
              <select 
                value={formData.department}
                onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-span-full space-y-2">
              <label className="text-sm font-semibold text-slate-700">Description</label>
              <textarea 
                value={formData.description || ''}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 h-20"
                placeholder="What does this rule verify?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Condition (Logic)</label>
              <div className="relative">
                <input 
                  value={formData.condition || ''}
                  onChange={e => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  placeholder="data.temp > 25"
                />
                <div className="absolute right-3 top-2.5 text-slate-400">
                  <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-mono">JS</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Action Result</label>
              <input 
                value={formData.action || ''}
                onChange={e => setFormData({ ...formData, action: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Notify Production Manager"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Severity</label>
              <div className="flex gap-4">
                {Object.values(RuleSeverity).map(s => (
                  <button
                    key={s}
                    onClick={() => setFormData({ ...formData, severity: s })}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${formData.severity === s ? 'ring-2 ring-indigo-500 ring-offset-1 bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-500'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-6 py-2 rounded-xl text-slate-500 hover:bg-slate-50 font-medium">Cancel</button>
            <button onClick={handleSave} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-xl font-semibold">
              <Save size={18} /> {editingId ? 'Update Rule' : 'Deploy Rule'}
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rules.map(rule => (
          <div key={rule.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative overflow-hidden flex flex-col">
            <div className={`absolute top-0 left-0 w-1.5 h-full ${
              rule.severity === RuleSeverity.CRITICAL ? 'bg-rose-500' : 
              rule.severity === RuleSeverity.WARNING ? 'bg-amber-500' : 'bg-blue-500'
            }`}></div>
            
            <div className="flex justify-between items-start mb-4">
              <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] uppercase font-bold text-slate-500">
                {rule.department}
              </span>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(rule)} className="text-slate-400 hover:text-indigo-600"><Edit3 size={16} /></button>
                <button onClick={() => onDelete(rule.id)} className="text-slate-400 hover:text-rose-600"><Trash2 size={16} /></button>
              </div>
            </div>

            <h4 className="font-bold text-slate-800 mb-2 truncate">{rule.name}</h4>
            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow">{rule.description}</p>
            
            <div className="bg-slate-50 rounded-lg p-3 mb-4">
              <p className="text-[10px] text-slate-400 font-mono mb-1 uppercase tracking-wider">Logic Condition</p>
              <code className="text-xs text-indigo-600 font-mono block overflow-x-auto whitespace-nowrap">
                {rule.condition}
              </code>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                rule.severity === RuleSeverity.CRITICAL ? 'bg-rose-50 text-rose-600' :
                rule.severity === RuleSeverity.WARNING ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {rule.severity}
              </span>
              <button 
                onClick={() => onUpdate({ ...rule, isActive: !rule.isActive })}
                className="text-slate-400 hover:text-indigo-600"
              >
                {rule.isActive ? <ToggleRight className="text-emerald-500" size={24} /> : <ToggleLeft size={24} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RulesManager;
