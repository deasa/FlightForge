import { useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Home } from './screens/Home';
import { Throws } from './screens/Throws';
import { MyBag } from './screens/MyBag';
import { Coach } from './screens/Coach';
import { Profile } from './screens/Profile';
import { DiscDetail } from './screens/DiscDetail';
import { Recommendations } from './screens/Recommendations';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDiscId, setSelectedDiscId] = useState<string | null>(null);
  const [showRecommendations, setShowRecommendations] = useState(false);

  const handleDiscClick = (id: string) => {
    setSelectedDiscId(id);
  };

  const handleBack = () => {
    setSelectedDiscId(null);
  };

  return (
    <div className="bg-zinc-950 min-h-screen text-zinc-50 font-sans selection:bg-emerald-500/30">
      {selectedDiscId ? (
        <DiscDetail discId={selectedDiscId} onBack={handleBack} />
      ) : showRecommendations ? (
        <Recommendations onBack={() => setShowRecommendations(false)} />
      ) : (
        <>
          {activeTab === 'home' && <Home setActiveTab={setActiveTab} onShowRecommendations={() => setShowRecommendations(true)} />}
          {activeTab === 'throws' && <Throws />}
          {activeTab === 'bag' && <MyBag onDiscClick={handleDiscClick} onShowRecommendations={() => setShowRecommendations(true)} />}
          {activeTab === 'coach' && <Coach />}
          {activeTab === 'profile' && <Profile />}
          <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}
    </div>
  );
}
