import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Disc, Throw } from '../types';
import { formatDistance, convertToFt } from '../utils/units';
import { X, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export const ThrowLogModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { profile, discs, addThrow, throws } = useStore();
  const [selectedDiscId, setSelectedDiscId] = useState<string>('');
  const [type, setType] = useState<'FH' | 'BH'>('BH');
  const [distanceInput, setDistanceInput] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!selectedDiscId || !distanceInput) return;

    const distanceNum = parseFloat(distanceInput);
    if (isNaN(distanceNum)) return;

    const distanceFt = convertToFt(distanceNum, profile.unit);
    
    const isPR = throws.length === 0 || distanceFt > Math.max(...throws.map(t => t.distance));

    addThrow({
      discId: selectedDiscId,
      type,
      distance: distanceFt,
      notes,
    });

    if (isPR) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#059669']
      });
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }

    onClose();
    // Reset state
    setSelectedDiscId('');
    setDistanceInput('');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 pb-8">
      <div className="bg-zinc-900 w-full max-w-md rounded-3xl p-6 border border-zinc-800 shadow-2xl animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Log Throw</h2>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Select Disc</label>
            <select
              value={selectedDiscId}
              onChange={(e) => setSelectedDiscId(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none"
            >
              <option value="" disabled>Choose a disc...</option>
              {discs.map(disc => (
                <option key={disc.id} value={disc.id}>
                  {disc.brand} {disc.model} ({disc.speed}, {disc.glide}, {disc.turn}, {disc.fade})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Throw Type</label>
            <div className="flex gap-3">
              <button
                onClick={() => setType('BH')}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${type === 'BH' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}
              >
                Backhand
              </button>
              <button
                onClick={() => setType('FH')}
                className={`flex-1 py-3 rounded-xl font-bold transition-colors ${type === 'FH' ? 'bg-emerald-500 text-white' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}
              >
                Forehand
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Distance ({profile.unit})</label>
            <div className="relative">
              <input
                type="number"
                inputMode="decimal"
                value={distanceInput}
                onChange={(e) => setDistanceInput(e.target.value)}
                placeholder="e.g. 350"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">{profile.unit}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Windy, hyzer flip, etc."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={!selectedDiscId || !distanceInput}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4"
          >
            <Check size={20} />
            Save Throw
          </button>
        </div>
      </div>
    </div>
  );
};
