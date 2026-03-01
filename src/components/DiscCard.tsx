import { Disc } from '../types';
import { getSmartLabels } from '../utils/flightRules';
import { formatDistance } from '../utils/units';
import { useStore } from '../store/useStore';

export const DiscCard = ({ disc, onClick }: { key?: string | number, disc: Disc, onClick?: () => void }) => {
  const { profile, throws } = useStore();
  const discThrows = throws.filter(t => t.discId === disc.id);
  const maxDistance = discThrows.length > 0 ? Math.max(...discThrows.map(t => t.distance)) : 0;
  const labels = getSmartLabels(disc);

  return (
    <div 
      onClick={onClick}
      className="bg-zinc-800 rounded-2xl p-4 border border-zinc-700/50 hover:border-emerald-500/50 transition-colors cursor-pointer active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-xs text-zinc-400 font-medium uppercase tracking-wider">{disc.brand}</p>
          <h3 className="text-lg font-bold text-zinc-100">{disc.model}</h3>
        </div>
        {maxDistance > 0 && (
          <div className="text-right">
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Max</p>
            <p className="text-sm font-bold text-emerald-400">{formatDistance(maxDistance, profile.unit)}</p>
          </div>
        )}
      </div>

      <div className="flex gap-2 mb-4">
        {[disc.speed, disc.glide, disc.turn, disc.fade].map((num, i) => (
          <div key={i} className="bg-zinc-900/80 rounded-lg px-3 py-1.5 flex-1 text-center border border-zinc-700/30">
            <span className="text-sm font-mono font-bold text-zinc-300">{num}</span>
          </div>
        ))}
      </div>

      {labels.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {labels.slice(0, 2).map((label, i) => (
            <span key={i} className="text-[10px] bg-zinc-700/50 text-zinc-300 px-2 py-0.5 rounded-full border border-zinc-600/50">
              {label}
            </span>
          ))}
          {labels.length > 2 && (
            <span className="text-[10px] bg-zinc-700/50 text-zinc-400 px-2 py-0.5 rounded-full border border-zinc-600/50">
              +{labels.length - 2}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
