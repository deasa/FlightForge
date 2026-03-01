import { useStore } from '../store/useStore';
import { getPowerTierName, calculatePowerTier } from '../utils/flightRules';
import { formatDistance } from '../utils/units';
import { Trophy, Activity, Target, ArrowRight, Sparkles } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const Home = ({ setActiveTab, onShowRecommendations }: { setActiveTab: (tab: string) => void, onShowRecommendations: () => void }) => {
  const { profile, throws, discs } = useStore();

  const maxDistance = throws.length > 0 ? Math.max(...throws.map(t => t.distance)) : 0;
  const currentTier = calculatePowerTier(maxDistance);
  const tierName = getPowerTierName(currentTier);

  const fhThrows = throws.filter(t => t.type === 'FH');
  const maxFh = fhThrows.length > 0 ? Math.max(...fhThrows.map(t => t.distance)) : 0;

  const recentThrows = throws.slice(0, 5);

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {profile.name}</h1>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
              Tier {currentTier}: {tierName}
            </span>
            <span className="text-zinc-500 text-sm">{throws.length} throws logged</span>
          </div>
        </div>
      </div>

      {throws.length === 0 ? (
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-3xl p-8 text-center mb-8">
          <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700">
            <Target className="text-emerald-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Ready to track?</h2>
          <p className="text-zinc-400 mb-6 text-sm">Log your first throw to start building your power profile and get smart bag recommendations.</p>
          <button 
            onClick={() => setActiveTab('throws')}
            className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-xl w-full hover:bg-emerald-400 transition-colors"
          >
            Log First Throw
          </button>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-3xl p-6 mb-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Trophy size={14} className="text-emerald-400" /> Personal Best
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-white tracking-tighter">{formatDistance(maxDistance, profile.unit).split(' ')[0]}</span>
                  <span className="text-xl font-bold text-zinc-500">{profile.unit}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Max Forehand</p>
              <p className="text-xl font-bold text-white">{maxFh > 0 ? formatDistance(maxFh, profile.unit) : '--'}</p>
            </div>
            <div className="bg-zinc-800/80 border border-zinc-700/50 rounded-2xl p-4">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Discs in Bag</p>
              <p className="text-xl font-bold text-white">{discs.length}</p>
            </div>
          </div>

          <div 
            onClick={onShowRecommendations}
            className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-8 flex items-center justify-between cursor-pointer hover:bg-emerald-500/20 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                <Sparkles size={20} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Bag Gaps Analysis</h3>
                <p className="text-xs text-emerald-400">View AI recommendations</p>
              </div>
            </div>
            <ArrowRight size={18} className="text-emerald-400" />
          </div>

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">Recent Throws</h3>
              <button onClick={() => setActiveTab('throws')} className="text-emerald-400 text-sm font-bold flex items-center gap-1 hover:text-emerald-300">
                View All <ArrowRight size={16} />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentThrows.map(throwLog => {
                const disc = discs.find(d => d.id === throwLog.discId);
                return (
                  <div key={throwLog.id} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${throwLog.type === 'FH' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                        {throwLog.type}
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{disc ? `${disc.brand} ${disc.model}` : 'Unknown Disc'}</p>
                        <p className="text-xs text-zinc-500">{formatDistanceToNow(new Date(throwLog.date), { addSuffix: true })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white">{formatDistance(throwLog.distance, profile.unit)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
