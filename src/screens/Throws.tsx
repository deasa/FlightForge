import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatDistance } from '../utils/units';
import { getUntappedPotential, calculatePowerTier } from '../utils/flightRules';
import { Plus, Search, Filter } from 'lucide-react';
import { ThrowLogModal } from '../components/ThrowLogModal';

export const Throws = () => {
  const { profile, throws, discs } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'MAX' | 'AVG'>('MAX');
  const [filter, setFilter] = useState<'ALL' | 'BH' | 'FH'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const maxDistance = throws.length > 0 ? Math.max(...throws.map(t => t.distance)) : 0;
  const currentTier = calculatePowerTier(maxDistance);

  const filteredThrows = throws.filter(t => {
    if (filter !== 'ALL' && t.type !== filter) return false;
    if (searchQuery) {
      const disc = discs.find(d => d.id === t.discId);
      if (!disc) return false;
      const searchStr = `${disc.brand} ${disc.model}`.toLowerCase();
      if (!searchStr.includes(searchQuery.toLowerCase())) return false;
    }
    return true;
  });

  // Group by disc to show stats per disc
  const discStats = discs.map(disc => {
    const discThrows = filteredThrows.filter(t => t.discId === disc.id);
    if (discThrows.length === 0) return null;

    const max = Math.max(...discThrows.map(t => t.distance));
    const avg = discThrows.reduce((sum, t) => sum + t.distance, 0) / discThrows.length;
    const untapped = getUntappedPotential(disc, max, currentTier);

    return {
      disc,
      max,
      avg,
      untapped,
      throwsCount: discThrows.length
    };
  }).filter(Boolean) as { disc: any, max: number, avg: number, untapped: number, throwsCount: number }[];

  // Sort by max or avg depending on view mode
  discStats.sort((a, b) => viewMode === 'MAX' ? b.max - a.max : b.avg - a.avg);

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto relative min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Power Profile</h1>
      </div>

      <div className="flex gap-2 mb-6 bg-zinc-800/50 p-1 rounded-xl border border-zinc-700/50">
        <button
          onClick={() => setViewMode('MAX')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${viewMode === 'MAX' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}
        >
          MAX DISTANCE
        </button>
        <button
          onClick={() => setViewMode('AVG')}
          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-colors ${viewMode === 'AVG' ? 'bg-zinc-700 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-300'}`}
        >
          AVERAGE
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {['ALL', 'BH', 'FH'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f as any)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors border ${filter === f ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'}`}
          >
            {f === 'ALL' ? 'All Throws' : f === 'BH' ? 'Backhand Only' : 'Forehand Only'}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
        <input
          type="text"
          placeholder="Search discs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-zinc-800/50 border border-zinc-700/50 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
        />
      </div>

      <div className="space-y-4">
        {discStats.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No throws found matching your filters.
          </div>
        ) : (
          discStats.map((stat) => (
            <div key={stat.disc.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{stat.disc.brand}</p>
                  <h3 className="text-base font-bold text-white">{stat.disc.model}</h3>
                  <div className="flex gap-1.5 mt-1">
                    <span className="text-xs font-mono text-zinc-400">{stat.disc.speed} | {stat.disc.glide} | {stat.disc.turn} | {stat.disc.fade}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-white tracking-tighter">
                    {formatDistance(viewMode === 'MAX' ? stat.max : stat.avg, profile.unit).split(' ')[0]}
                  </p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{profile.unit}</p>
                </div>
              </div>

              {stat.untapped > 0 && (
                <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
                  <p className="text-xs text-amber-400 font-medium">Untapped potential: ~{formatDistance(stat.untapped, profile.unit)} more</p>
                </div>
              )}
              
              <div className="mt-3 h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${Math.min(100, (stat.max / (stat.max + stat.untapped)) * 100)}%` }}
                ></div>
              </div>
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      <ThrowLogModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
