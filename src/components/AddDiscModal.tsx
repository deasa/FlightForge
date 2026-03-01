import { useState } from 'react';
import { useStore } from '../store/useStore';
import { X, Check } from 'lucide-react';

export const AddDiscModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { addDisc, activeBagId } = useStore();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [speed, setSpeed] = useState('7');
  const [glide, setGlide] = useState('5');
  const [turn, setTurn] = useState('0');
  const [fade, setFade] = useState('2');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!brand || !model || !activeBagId) return;

    addDisc({
      brand,
      model,
      speed: parseFloat(speed),
      glide: parseFloat(glide),
      turn: parseFloat(turn),
      fade: parseFloat(fade),
      bagId: activeBagId,
    });

    onClose();
    setBrand('');
    setModel('');
    setSpeed('7');
    setGlide('5');
    setTurn('0');
    setFade('2');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 pb-8">
      <div className="bg-zinc-900 w-full max-w-md rounded-3xl p-6 border border-zinc-800 shadow-2xl animate-in slide-in-from-bottom-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white">Add Disc</h2>
          <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Brand</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Innova"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Model</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. Teebird"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">Flight Numbers</label>
            <div className="grid grid-cols-4 gap-2">
              <div>
                <label className="block text-[10px] text-zinc-500 text-center mb-1">Speed</label>
                <input
                  type="number"
                  step="0.5"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-3 text-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 text-center mb-1">Glide</label>
                <input
                  type="number"
                  step="0.5"
                  value={glide}
                  onChange={(e) => setGlide(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-3 text-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 text-center mb-1">Turn</label>
                <input
                  type="number"
                  step="0.5"
                  value={turn}
                  onChange={(e) => setTurn(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-3 text-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-[10px] text-zinc-500 text-center mb-1">Fade</label>
                <input
                  type="number"
                  step="0.5"
                  value={fade}
                  onChange={(e) => setFade(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-2 py-3 text-center text-white font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!brand || !model}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors mt-4"
          >
            <Check size={20} />
            Add to Bag
          </button>
        </div>
      </div>
    </div>
  );
};
