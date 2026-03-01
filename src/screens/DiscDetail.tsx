import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { getSmartLabels, calculatePowerTier } from '../utils/flightRules';
import { formatDistance } from '../utils/units';
import { ArrowLeft, Edit2, Save, Trash2, Sparkles } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { generatePersonalizedTip } from '../services/aiService';
import { FieldSessionModal } from '../components/FieldSessionModal';

export const DiscDetail = ({ discId, onBack }: { discId: string, onBack: () => void }) => {
  const { discs, throws, profile, updateDisc, deleteDisc } = useStore();
  const disc = discs.find(d => d.id === discId);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(disc?.notes || '');
  const [personalizedTip, setPersonalizedTip] = useState<string | null>(null);
  const [isTipLoading, setIsTipLoading] = useState(false);
  const [isFieldSessionOpen, setIsFieldSessionOpen] = useState(false);

  if (!disc) return null;

  const discThrows = throws.filter(t => t.discId === disc.id).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const maxDistance = discThrows.length > 0 ? Math.max(...discThrows.map(t => t.distance)) : 0;
  const currentTier = calculatePowerTier(maxDistance);
  const labels = getSmartLabels(disc);

  const chartData = discThrows.map(t => ({
    date: format(new Date(t.date), 'MMM d'),
    distance: t.distance,
  }));

  useEffect(() => {
    const fetchTip = async () => {
      setIsTipLoading(true);
      const tip = await generatePersonalizedTip(disc, { ...profile, powerTier: currentTier }, maxDistance);
      setPersonalizedTip(tip);
      setIsTipLoading(false);
    };
    fetchTip();
  }, [discId]);

  const handleSaveNotes = () => {
    updateDisc(disc.id, { notes });
    setIsEditingNotes(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this disc? All associated throws will also be deleted.')) {
      deleteDisc(disc.id);
      onBack();
    }
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto relative min-h-screen bg-zinc-950">
      <button onClick={onBack} className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft size={20} />
        <span className="text-sm font-bold uppercase tracking-wider">Back</span>
      </button>

      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{disc.brand}</p>
          <h1 className="text-4xl font-black text-white tracking-tighter">{disc.model}</h1>
        </div>
        <button onClick={handleDelete} className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors">
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex gap-2 mb-8">
        {[
          { label: 'SPEED', value: disc.speed },
          { label: 'GLIDE', value: disc.glide },
          { label: 'TURN', value: disc.turn },
          { label: 'FADE', value: disc.fade },
        ].map((stat, i) => (
          <div key={i} className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-center">
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className="text-xl font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {labels.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Characteristics</h3>
          <div className="flex flex-wrap gap-2">
            {labels.map((label, i) => (
              <span key={i} className="text-xs font-bold bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700">
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
        <h3 className="text-sm font-bold text-emerald-400 mb-2 uppercase tracking-wider flex items-center gap-2 relative z-10">
          <Sparkles size={16} className="text-emerald-400" />
          Personalized Tips
        </h3>
        {isTipLoading ? (
          <div className="animate-pulse flex space-x-4 relative z-10">
            <div className="flex-1 space-y-2 py-1">
              <div className="h-3 bg-emerald-500/20 rounded w-3/4"></div>
              <div className="h-3 bg-emerald-500/20 rounded w-5/6"></div>
            </div>
          </div>
        ) : (
          <p className="text-zinc-300 text-sm leading-relaxed relative z-10">
            {personalizedTip || `With your ${formatDistance(maxDistance, profile.unit)} power, try throwing this disc with a slight hyzer release to maximize its full flight potential.`}
          </p>
        )}
      </div>

      {discThrows.length > 0 && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Throw History</h3>
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Max: {formatDistance(maxDistance, profile.unit)}</span>
          </div>
          <div className="h-48 bg-zinc-900 border border-zinc-800 rounded-3xl p-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} width={30} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#34d399' }}
                />
                <Line type="monotone" dataKey="distance" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Private Notes</h3>
          {!isEditingNotes && (
            <button onClick={() => setIsEditingNotes(true)} className="text-zinc-400 hover:text-white transition-colors">
              <Edit2 size={16} />
            </button>
          )}
        </div>
        {isEditingNotes ? (
          <div className="space-y-3">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 min-h-[100px]"
              placeholder="Add your notes here..."
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsEditingNotes(false)} className="px-4 py-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider">Cancel</button>
              <button onClick={handleSaveNotes} className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors uppercase tracking-wider flex items-center gap-1">
                <Save size={14} /> Save
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 min-h-[100px]">
            {disc.notes ? (
              <p className="text-sm text-zinc-300 whitespace-pre-wrap">{disc.notes}</p>
            ) : (
              <p className="text-sm text-zinc-600 italic">No notes added yet.</p>
            )}
          </div>
        )}
      </div>

      <button 
        onClick={() => setIsFieldSessionOpen(true)}
        className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-4 rounded-2xl transition-colors uppercase tracking-wider text-sm"
      >
        Start Field Session
      </button>

      <FieldSessionModal 
        isOpen={isFieldSessionOpen} 
        onClose={() => setIsFieldSessionOpen(false)} 
        discId={disc.id} 
        maxDistance={maxDistance} 
      />
    </div>
  );
};
