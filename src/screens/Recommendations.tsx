import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateBagRecommendations, BagRecommendation } from '../services/aiService';
import { calculatePowerTier } from '../utils/flightRules';
import { formatDistance } from '../utils/units';
import { ArrowLeft, RefreshCw, Plus, Sparkles } from 'lucide-react';

export const Recommendations = ({ onBack }: { onBack: () => void }) => {
  const { profile, discs, throws, addDisc, activeBagId } = useStore();
  const [recommendations, setRecommendations] = useState<BagRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const maxDistance = throws.length > 0 ? Math.max(...throws.map(t => t.distance)) : 0;
  const currentTier = calculatePowerTier(maxDistance);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    const recs = await generateBagRecommendations({ ...profile, powerTier: currentTier }, discs);
    setRecommendations(recs);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleAdd = (rec: BagRecommendation) => {
    if (activeBagId) {
      addDisc({
        brand: rec.brand,
        model: rec.model,
        speed: rec.speed,
        glide: rec.glide,
        turn: rec.turn,
        fade: rec.fade,
        bagId: activeBagId,
      });
      // Remove from recommendations
      setRecommendations(recommendations.filter(r => r.model !== rec.model));
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto relative min-h-screen bg-zinc-950">
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-bold uppercase tracking-wider">Back</span>
        </button>
        <button 
          onClick={fetchRecommendations} 
          disabled={isLoading}
          className="p-2 text-emerald-400 hover:text-emerald-300 disabled:text-zinc-600 transition-colors"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Bag Gaps Analysis</h1>
        <p className="text-sm text-zinc-400 flex items-center gap-2">
          <Sparkles size={16} className="text-emerald-400" />
          Based on your {formatDistance(maxDistance, profile.unit)} power
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 animate-pulse">
              <div className="h-6 bg-zinc-800 rounded w-1/2 mb-3"></div>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4].map(j => <div key={j} className="h-8 w-12 bg-zinc-800 rounded"></div>)}
              </div>
              <div className="h-4 bg-zinc-800 rounded w-full mb-2"></div>
              <div className="h-4 bg-zinc-800 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 text-sm">
          No recommendations found. Try refreshing.
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
              
              <div className="flex justify-between items-start mb-3 relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">{rec.brand}</p>
                  <h3 className="text-lg font-bold text-white">{rec.model}</h3>
                </div>
              </div>

              <div className="flex gap-2 mb-4 relative z-10">
                {[rec.speed, rec.glide, rec.turn, rec.fade].map((num, idx) => (
                  <div key={idx} className="bg-zinc-900/80 rounded-lg px-3 py-1.5 flex-1 text-center border border-zinc-700/30">
                    <span className="text-sm font-mono font-bold text-zinc-300">{num}</span>
                  </div>
                ))}
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 mb-4 relative z-10">
                <p className="text-xs text-emerald-100/80 leading-relaxed">{rec.reason}</p>
              </div>

              <button
                onClick={() => handleAdd(rec)}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm relative z-10"
              >
                <Plus size={16} />
                Add to Bag
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
