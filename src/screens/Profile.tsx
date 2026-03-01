import { useStore } from '../store/useStore';
import { calculatePowerTier, getPowerTierName } from '../utils/flightRules';
import { Settings, Download, LogOut, ChevronRight, User } from 'lucide-react';

export const Profile = () => {
  const { profile, updateProfile, throws, discs } = useStore();
  const maxDistance = throws.length > 0 ? Math.max(...throws.map(t => t.distance)) : 0;
  const currentTier = calculatePowerTier(maxDistance);
  const tierName = getPowerTierName(currentTier);

  const handleExport = () => {
    const data = { profile, throws, discs };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flightforge-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto relative min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
      </div>

      <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-3xl p-6 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-zinc-800 rounded-full border-2 border-emerald-500/50 flex items-center justify-center relative">
          <User size={32} className="text-emerald-400" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400 uppercase tracking-wider shadow-lg">
            Tier {currentTier}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold text-white mb-1">{profile.name}</h2>
          <p className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-2">{tierName}</p>
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Throws</p>
              <p className="text-sm font-bold text-white">{throws.length}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Discs</p>
              <p className="text-sm font-bold text-white">{discs.length}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">Settings</h3>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl overflow-hidden">
          <div className="p-4 flex justify-between items-center border-b border-zinc-700/50">
            <span className="text-sm font-bold text-white">Units</span>
            <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
              <button
                onClick={() => updateProfile({ unit: 'ft' })}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${profile.unit === 'ft' ? 'bg-emerald-500 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Feet
              </button>
              <button
                onClick={() => updateProfile({ unit: 'yd' })}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${profile.unit === 'yd' ? 'bg-emerald-500 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Yards
              </button>
            </div>
          </div>
          <div className="p-4 flex justify-between items-center group cursor-pointer hover:bg-zinc-800/80 transition-colors">
            <span className="text-sm font-bold text-white">Edit Profile</span>
            <ChevronRight size={18} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4 px-2">Data</h3>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl overflow-hidden">
          <button onClick={handleExport} className="w-full p-4 flex justify-between items-center group hover:bg-zinc-800/80 transition-colors border-b border-zinc-700/50 text-left">
            <div className="flex items-center gap-3">
              <Download size={18} className="text-emerald-400" />
              <span className="text-sm font-bold text-white">Export Data (JSON)</span>
            </div>
            <ChevronRight size={18} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
          </button>
          <button className="w-full p-4 flex justify-between items-center group hover:bg-red-500/10 transition-colors text-left">
            <div className="flex items-center gap-3">
              <LogOut size={18} className="text-red-400" />
              <span className="text-sm font-bold text-red-400">Clear All Data</span>
            </div>
            <ChevronRight size={18} className="text-red-900 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};
