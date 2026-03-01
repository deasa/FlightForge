import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateFieldSession, FieldSessionThrow } from '../services/aiService';
import { X, Target, RefreshCw } from 'lucide-react';

export const FieldSessionModal = ({ isOpen, onClose, discId, maxDistance }: { isOpen: boolean, onClose: () => void, discId: string, maxDistance: number }) => {
  const { profile, discs } = useStore();
  const disc = discs.find(d => d.id === discId);
  const [throws, setThrows] = useState<FieldSessionThrow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    if (!disc) return;
    setIsLoading(true);
    const session = await generateFieldSession(disc, profile, maxDistance);
    setThrows(session);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchSession();
    }
  }, [isOpen]);

  if (!isOpen || !disc) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 pb-8">
      <div className="bg-zinc-900 w-full max-w-md rounded-3xl p-6 border border-zinc-800 shadow-2xl animate-in slide-in-from-bottom-10 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Target className="text-emerald-400" size={24} />
            Field Session
          </h2>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-sm text-zinc-400">
            AI-generated practice plan for your <strong className="text-white">{disc.brand} {disc.model}</strong> based on your power profile.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 animate-pulse">
                <div className="h-5 bg-zinc-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-zinc-700 rounded w-full mb-1"></div>
                <div className="h-4 bg-zinc-700 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : throws.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            Failed to generate session. Try again.
          </div>
        ) : (
          <div className="space-y-4">
            {throws.map((t, i) => (
              <div key={i} className="bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-white">{t.title}</h3>
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg border border-emerald-500/30 whitespace-nowrap ml-2">
                    Target: {t.targetDistance} {profile.unit}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{t.description}</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={fetchSession}
          disabled={isLoading}
          className="w-full mt-6 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-xl border border-zinc-700 transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          Regenerate Session
        </button>
      </div>
    </div>
  );
};
