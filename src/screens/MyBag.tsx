import { useState } from 'react';
import { useStore } from '../store/useStore';
import { DiscCard } from '../components/DiscCard';
import { AddDiscModal } from '../components/AddDiscModal';
import { Plus, Search, Settings, Sparkles } from 'lucide-react';

export const MyBag = ({ onDiscClick, onShowRecommendations }: { onDiscClick: (id: string) => void, onShowRecommendations: () => void }) => {
  const { bags, discs, activeBagId, setActiveBag } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const activeBag = bags.find(b => b.id === activeBagId) || bags[0];
  const bagDiscs = discs.filter(d => d.bagId === activeBag.id);

  const filteredDiscs = bagDiscs.filter(d => {
    if (!searchQuery) return true;
    const searchStr = `${d.brand} ${d.model}`.toLowerCase();
    return searchStr.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto relative min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Bag</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={onShowRecommendations}
            className="p-2 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 rounded-full transition-colors"
          >
            <Sparkles size={20} />
          </button>
          <button className="p-2 text-zinc-400 hover:text-white transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {bags.map(bag => (
          <button
            key={bag.id}
            onClick={() => setActiveBag(bag.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors border ${activeBagId === bag.id ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-600'}`}
          >
            {bag.name}
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
        {filteredDiscs.length === 0 ? (
          <div className="text-center py-12 text-zinc-500 text-sm">
            No discs found in this bag.
          </div>
        ) : (
          filteredDiscs.map((disc) => (
            <DiscCard key={disc.id} disc={disc} onClick={() => onDiscClick(disc.id)} />
          ))
        )}
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed bottom-20 right-4 w-14 h-14 bg-emerald-500 hover:bg-emerald-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 transition-transform active:scale-95 z-40"
      >
        <Plus size={24} strokeWidth={3} />
      </button>

      <AddDiscModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
