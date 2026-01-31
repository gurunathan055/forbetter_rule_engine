
import React, { useState } from 'react';
import { Rule, Department, BatchProcessingResult, RuleSeverity } from '../types';
import { processBatch } from '../components/RuleEngine';
import { generateRulesFromData, analyzeAnomalies } from '../services/geminiService';
import { 
  FileJson, 
  Play, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  BrainCircuit, 
  Download, 
  ClipboardCheck,
  Loader2,
  Sparkles,
  X,
  DatabaseZap
} from 'lucide-react';

interface Props {
  rules: Rule[];
}

const SAMPLE_DATA = [
  { "id": "PO-901", "total_value": 15000, "supplier": "AgroCorp", "item": "Wheat Grain" },
  { "id": "PO-902", "total_value": 4500, "supplier": "PackSystems", "item": "Labeling Roll" },
  { "id": "INV-101", "stock_level": 5, "reorder_point": 20, "item": "Sugar Refined" },
  { "id": "INV-102", "expiry_date": "2025-05-01", "item": "Fresh Milk 1L" }
];

const DataProcessor: React.FC<Props> = ({ rules }) => {
  const [rawData, setRawData] = useState<string>(JSON.stringify(SAMPLE_DATA, null, 2));
  const [results, setResults] = useState<BatchProcessingResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleRun = () => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const parsed = JSON.parse(rawData);
        const dataArray = Array.isArray(parsed) ? parsed : [parsed];
        const res = processBatch(dataArray, rules);
        setResults(res);
      } catch (e) {
        alert("Invalid JSON data provided.");
      }
      setIsProcessing(false);
    }, 800);
  };

  const handleAiAnalyze = async () => {
    if (results.length === 0) return;
    setIsAiLoading(true);
    const flatResults = results.flatMap(r => r.results.filter(v => !v.isPassed));
    const analysis = await analyzeAnomalies(flatResults);
    setAiAnalysis(analysis);
    setIsAiLoading(false);
  };

  const handleSuggestRules = async () => {
    setIsAiLoading(true);
    try {
      const parsed = JSON.parse(rawData);
      const sample = Array.isArray(parsed) ? parsed[0] : parsed;
      const suggested = await generateRulesFromData(sample, Department.PROCUREMENT);
      // We could add these suggested rules to state here if we wanted
      console.log("Suggested Rules:", suggested);
      alert("AI suggested " + suggested.length + " rules based on your schema. Check console for details (Mock implementation).");
    } catch (e) {
      alert("Please provide valid JSON to use AI suggestions.");
    }
    setIsAiLoading(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* Left: Input */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileJson className="text-indigo-600" /> Data Payload Input
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={handleSuggestRules}
                disabled={isAiLoading}
                className="text-xs flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                {isAiLoading ? <Loader2 className="animate-spin" size={14} /> : <BrainCircuit size={14} />} 
                AI Suggest Rules
              </button>
              <button 
                onClick={() => setRawData('')}
                className="text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
          <div className="relative group">
            <textarea 
              value={rawData}
              onChange={e => setRawData(e.target.value)}
              className="w-full h-[400px] p-4 font-mono text-sm bg-slate-900 text-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-y-auto"
              spellCheck={false}
              placeholder='[ { "id": 1, ... } ]'
            />
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] text-indigo-400 font-bold bg-indigo-950/80 px-2 py-1 rounded">JSON Format</span>
            </div>
          </div>
          <button 
            onClick={handleRun}
            disabled={isProcessing}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all disabled:bg-indigo-400"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : <Play size={20} />} 
            Run Engine Evaluation
          </button>
        </div>

        {aiAnalysis && (
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 p-8 rounded-2xl text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles size={80} />
            </div>
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold flex items-center gap-2">
                <BrainCircuit className="text-indigo-400" /> AI Strategic Insights
              </h4>
              <button onClick={() => setAiAnalysis(null)} className="text-indigo-400 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="prose prose-invert text-indigo-100 whitespace-pre-wrap leading-relaxed text-sm">
              {aiAnalysis}
            </div>
          </div>
        )}
      </div>

      {/* Right: Results */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ClipboardCheck className="text-emerald-600" /> Evaluation Results
            </h3>
            {results.length > 0 && (
              <div className="flex gap-2">
                <button 
                  onClick={handleAiAnalyze}
                  disabled={isAiLoading}
                  className="flex items-center gap-2 text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                  {isAiLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} AI Deep Scan
                </button>
                <button className="p-2 text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg">
                  <Download size={18} />
                </button>
              </div>
            )}
          </div>

          {results.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
              <DatabaseZap size={48} className="mb-4 opacity-20" />
              <p>No processed data yet.</p>
              <p className="text-xs">Paste your data payload and click 'Run Engine'</p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((res, i) => (
                <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 flex justify-between items-center border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Record #{i + 1}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      res.results.every(v => v.isPassed) ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {res.results.every(v => v.isPassed) ? 'COMPLIANT' : 'VIOLATION DETECTED'}
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    {res.results.map((ruleRes, j) => (
                      <div key={j} className="flex gap-3 items-start">
                        {ruleRes.isPassed ? (
                          <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={16} />
                        ) : (
                          <AlertCircle className={`shrink-0 mt-0.5 ${
                            ruleRes.severity === RuleSeverity.CRITICAL ? 'text-rose-500' : 
                            ruleRes.severity === RuleSeverity.WARNING ? 'text-amber-500' : 'text-blue-500'
                          }`} size={16} />
                        )}
                        <div>
                          <p className={`text-sm font-medium ${ruleRes.isPassed ? 'text-slate-600' : 'text-slate-900'}`}>
                            {ruleRes.ruleName}
                          </p>
                          {!ruleRes.isPassed && (
                            <p className="text-xs text-slate-500 mt-0.5 italic">{ruleRes.message}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataProcessor;
