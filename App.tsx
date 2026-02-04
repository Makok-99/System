
import React, { useState, useEffect } from 'react';
import { User, Language } from './types';
import { storageService } from './services/storageService';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import EntryForm from './components/EntryForm';
import ReportView from './components/ReportView';
import SystemSpecs from './components/SystemSpecs';
import { LogIn, User as UserIcon, Lock, Loader2, Info } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync user language from local storage on login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const authenticatedUser = storageService.login(username, password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        setActiveTab(authenticatedUser.role === 'HEAD_OFFICE' ? 'dashboard' : 'entry');
      } else {
        setError('Invalid credentials. Hint: try "admin" or "branch1" with password "password"');
      }
      setLoading(false);
    }, 800);
  };

  const handleLanguageChange = (lang: Language) => {
    if (user) {
      const updatedUser = storageService.updateUserLanguage(user.id, lang);
      if (updatedUser) setUser(updatedUser);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 -left-20 w-72 h-72 bg-indigo-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>

        <div className="max-w-md w-full bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-10 relative border border-white/20">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="bg-indigo-600 p-4 rounded-3xl mb-6 shadow-2xl shadow-indigo-600/30">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">FinAI <span className="text-indigo-600">Pro</span></h1>
            <p className="text-slate-500 mt-2 font-medium">Enterprise Branch Management</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                placeholder="Username" 
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none transition-all font-medium"
                required
              />
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3 text-rose-600 text-xs font-bold animate-shake">
                <Info className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Secure Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
              Branch Isolation Active <br /> AI Auditing Enabled
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard user={user} />;
      case 'entry': return (
        <EntryForm 
          branchId={user.branchId!} 
          onSuccess={() => setActiveTab('reports')} 
          userId={user.id} 
        />
      );
      case 'reports': return <ReportView user={user} />;
      case 'specs': return <SystemSpecs />;
      default: return <Dashboard user={user} />;
    }
  };

  return (
    <Layout 
      session={{ user, token: 'mock-jwt' }} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={() => {
        setUser(null);
        setUsername('');
        setPassword('');
      }}
      onLanguageChange={handleLanguageChange}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
