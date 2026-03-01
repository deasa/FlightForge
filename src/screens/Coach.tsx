import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { calculatePowerTier } from '../utils/flightRules';
import { Play, Target, ChevronRight, Sparkles } from 'lucide-react';
import { generateDailyTip, generateTutorials, Tutorial } from '../services/aiService';
import { FieldSessionModal } from '../components/FieldSessionModal';

export const Coach = () => {
  const { throws, profile, discs } = useStore();
  const [dailyTip, setDailyTip] = useState<string | null>(null);
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isTutorialsLoading, setIsTutorialsLoading] = useState(true);
  const [isFieldSessionOpen, setIsFieldSessionOpen] = useState(false);
  const [selectedDiscId, setSelectedDiscId] = useState<string>('');

  const maxDistance = throws.length > 0 ? Math.max(...throws.map(t => t.distance)) : 0;
  const currentTier = calculatePowerTier(maxDistance);

  useEffect(() => {
    const fetchTipAndTutorials = async () => {
      setIsTipLoading(true);
      setIsTutorialsLoading(true);

      // Fetch tip
      generateDailyTip({ ...profile, powerTier: currentTier }).then(tip => {
        setDailyTip(tip);
        setIsTipLoading(false);
      });

      // Fetch tutorials
      generateTutorials(currentTier).then(tuts => {
        setTutorials(tuts);
        setIsTutorialsLoading(false);
      });
    };
    fetchTipAndTutorials();
  }, []);

  const handlePlanSession = () => {
    if (selectedDiscId) {
      setIsFieldSessionOpen(true);
    }
  };

  const selectedDiscMaxDistance = selectedDiscId 
    ? Math.max(0, ...throws.filter(t => t.discId === selectedDiscId).map(t => t.distance))
    : 0;

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto relative min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Coach</h1>
      </div>

      <div className="bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <div className="flex items-center gap-2 mb-3 relative z-10">
          <Sparkles size={16} className="text-indigo-400" />
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">AI Daily Tip</span>
        </div>
        
        {isTipLoading ? (
          <div className="animate-pulse space-y-2 py-1 relative z-10">
            <div className="h-4 bg-indigo-500/20 rounded w-3/4"></div>
            <div className="h-4 bg-indigo-500/20 rounded w-full"></div>
            <div className="h-4 bg-indigo-500/20 rounded w-5/6"></div>
          </div>
        ) : (
          <p className="text-indigo-200/90 text-sm leading-relaxed mb-4 relative z-10">
            {dailyTip || `For your current power tier (${currentTier}), ensure your weight is fully transferred to your front foot before the disc crosses your chest.`}
          </p>
        )}
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Field Session Planner</h2>
        </div>
        <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-5">
          <p className="text-sm text-zinc-400 mb-4">Select a disc to get 3 tailored throws based on your logged power.</p>
          
          <select
            value={selectedDiscId}
            onChange={(e) => setSelectedDiscId(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none mb-4"
          >
            <option value="" disabled>Choose a disc...</option>
            {discs.map(disc => (
              <option key={disc.id} value={disc.id}>
                {disc.brand} {disc.model}
              </option>
            ))}
          </select>

          <button 
            onClick={handlePlanSession}
            disabled={!selectedDiscId}
            className="w-full bg-zinc-800 hover:bg-zinc-700 disabled:bg-zinc-900 disabled:text-zinc-600 text-white font-bold py-3 rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            <Target size={18} />
            Plan Session
          </button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-white">Recommended Tutorials</h2>
        </div>
        
        {isTutorialsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 bg-zinc-700 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : tutorials.length > 0 ? (
          <div className="space-y-3">
            {tutorials.map((tutorial, idx) => (
              <a 
                key={idx} 
                href={tutorial.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 flex items-center justify-between group cursor-pointer hover:border-zinc-600 transition-colors block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700 group-hover:bg-zinc-700 transition-colors">
                    <Play size={20} className="text-emerald-400 ml-1" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1">{tutorial.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                      <span>{tutorial.category}</span>
                      <span>•</span>
                      <span>{tutorial.duration}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-zinc-600 group-hover:text-zinc-400 transition-colors" />
              </a>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 text-sm bg-zinc-800/50 border border-zinc-700/50 rounded-2xl">
            No tutorials found. Try refreshing.
          </div>
        )}
      </div>

      {selectedDiscId && (
        <FieldSessionModal 
          isOpen={isFieldSessionOpen} 
          onClose={() => setIsFieldSessionOpen(false)} 
          discId={selectedDiscId} 
          maxDistance={selectedDiscMaxDistance} 
        />
      )}
    </div>
  );
};
