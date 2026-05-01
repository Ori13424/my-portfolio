"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SysAdminDashboard() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [editorData, setEditorData] = useState("");

  // Simulated Database Fetch
  useEffect(() => {
    const isAuth = sessionStorage.getItem("sys_auth");
    if (isAuth !== "verified") {
      // Kick them out if they didn't use the secret login
      router.push('/');
    } else {
      setAuthorized(true);
      // In a real app, you would fetch from your database here.
      // We are populating it with dummy JSON for the UI demo.
      setEditorData(JSON.stringify({
        "system_status": "ONLINE",
        "last_updated": new Date().toISOString(),
        "works": [ { "id": "scada-frontend", "title": "HELIOS: SCADA Designer" } ],
        "skills": { "software": [], "hardware": [] }
      }, null, 2));
    }
  }, [router]);

  const handleSave = () => {
    alert("SYSTEM UPDATED: Changes pushed to local configuration.");
    // Here is where you would normally do an await fetch('/api/update-portfolio', ...)
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sys_auth");
    router.push('/');
  }

  if (!authorized) return <div className="min-h-screen bg-black text-red-500 font-mono p-8">UNAUTHORIZED ACCESS ATTEMPT LOGGED.</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-emerald-400 font-mono p-8 md:p-12 selection:bg-emerald-500/30">
      
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end border-b border-emerald-500/20 pb-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold tracking-widest uppercase mb-2 flex items-center gap-3">
              <span className="material-symbols-outlined">admin_panel_settings</span>
              System Override Control
            </h1>
            <p className="text-xs text-emerald-600/70 tracking-widest uppercase">Root Access Granted // Architecture Editor</p>
          </div>
          <button onClick={handleLogout} className="text-xs uppercase tracking-widest text-red-400 hover:text-red-300 border border-red-500/30 px-4 py-2 rounded">
            [ Terminate Session ]
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sidebar */}
          <div className="space-y-6">
             <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded p-6">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 text-emerald-300 border-b border-emerald-500/20 pb-2">Active Modules</h3>
                <ul className="space-y-3 text-xs tracking-wider text-emerald-600">
                  <li className="flex items-center gap-2 text-emerald-400"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> PORTFOLIO_DATA.json</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-900"></span> system_config.yaml</li>
                  <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-emerald-900"></span> review_cache.db</li>
                </ul>
             </div>

             <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded p-6 text-xs text-emerald-600/80 leading-relaxed">
                 Note: This environment allows direct manipulation of the core data arrays. Ensure JSON format is strictly validated before deployment to prevent client-side crash.
             </div>
          </div>

          {/* Main Editor */}
          <div className="lg:col-span-2 flex flex-col h-[600px]">
            <div className="bg-[#0a0a0a] border border-emerald-500/20 rounded flex-grow flex flex-col overflow-hidden">
               <div className="bg-emerald-500/5 px-4 py-2 border-b border-emerald-500/20 text-xs tracking-widest text-emerald-500/50 flex justify-between">
                  <span>editing: /db/portfolio.json</span>
                  <span>UTF-8</span>
               </div>
               <textarea 
                  value={editorData}
                  onChange={(e) => setEditorData(e.target.value)}
                  spellCheck={false}
                  className="flex-grow w-full bg-transparent p-6 text-sm font-mono text-emerald-300 focus:outline-none resize-none leading-relaxed"
               />
            </div>
            
            <div className="flex justify-end mt-6 gap-4">
              <button className="px-6 py-3 border border-emerald-500/30 text-emerald-500 text-xs uppercase tracking-widest rounded hover:bg-emerald-500/10 transition-colors">
                Validate Sync
              </button>
              <button onClick={handleSave} className="px-6 py-3 bg-emerald-500/20 border border-emerald-500 text-emerald-400 font-bold text-xs uppercase tracking-widest rounded hover:bg-emerald-500 hover:text-[#050505] transition-all">
                Deploy Override
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}