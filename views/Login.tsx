
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { DatabaseZap, LogIn, Mail, Lock, ShieldCheck, Loader2 } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      // Hardcoded Superadmin check as requested
      if (username === 'supadmin' && password === 'suP@admin@12390') {
        onLogin({
          id: 'admin-001',
          username: 'supadmin',
          name: 'System Superadmin',
          email: 'admin@nexusbre.com',
          role: UserRole.SUPERADMIN,
          avatar: 'https://ui-avatars.com/api/?name=Super+Admin&background=4f46e5&color=fff'
        });
      } else if (username && password) {
        // Mocking other logins
        onLogin({
          id: 'user-' + Math.random().toString(36).substr(2, 4),
          username: username,
          name: username,
          email: `${username}@nexusbre.com`,
          role: UserRole.MANAGER,
          avatar: `https://ui-avatars.com/api/?name=${username}&background=6366f1&color=fff`
        });
      } else {
        setError('Invalid credentials. Please use supadmin / suP@admin@12390');
      }
      setLoading(false);
    }, 1200);
  };

  const handleGoogleSSO = () => {
    setLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'google-001',
        username: 'google_user',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        role: UserRole.MANAGER,
        avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=ea4335&color=fff'
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>
      
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg mb-4">
            <DatabaseZap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Nexus BRE</h1>
          <p className="text-slate-400 text-sm mt-2">Enterprise FMCG Intelligence Portal</p>
        </div>

        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input 
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="supadmin"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-500 w-5 h-5" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          {error && <p className="text-rose-400 text-xs text-center font-medium bg-rose-400/10 py-2 rounded-lg">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <LogIn size={20} />}
            Sign In
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-700"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-slate-900/10 px-2 text-slate-500 font-bold backdrop-blur-md">Or continue with</span></div>
        </div>

        <button 
          onClick={handleGoogleSSO}
          disabled={loading}
          className="w-full bg-white hover:bg-slate-50 text-slate-900 font-bold py-3 rounded-xl flex items-center justify-center gap-3 transition-all border border-slate-200 shadow-sm disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
          Sign in with Google
        </button>

        <p className="mt-8 text-center text-xs text-slate-500">
          Secure biometric-ready authentication enabled <ShieldCheck className="inline w-3 h-3 text-indigo-400" />
        </p>
      </div>
    </div>
  );
};

export default Login;
