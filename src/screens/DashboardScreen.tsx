import React, { useState } from 'react';
import { useApp, translations } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { 
  Users, User, Crown, Link, Coins, MapPin, Trophy, Flame, 
  History, Plus, Play, X, ArrowLeft, Camera, MapPinned, Flag
} from 'lucide-react';
import avatarExplorer from '@/assets/avatar-explorer.png';
import { ClansModal } from '@/components/modals/ClansModal';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { FiltersModal } from '@/components/modals/FiltersModal';
import { MemoryModal } from '@/components/modals/MemoryModal';

type TabType = 'current' | 'completed';

interface TripDetailViewProps {
  trip: any;
  onBack: () => void;
}

const TripDetailView: React.FC<TripDetailViewProps> = ({ trip, onBack }) => {
  const { language } = useApp();
  const t = translations[language];

  // Demo data for trip details
  const demoPhotos = [
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1621351683756-3e4e4e3e5e4e?w=200&h=200&fit=crop',
    'https://images.unsplash.com/photo-1548013146-72479768bada?w=200&h=200&fit=crop',
  ];

  const demoCheckpoints = [
    { name: 'Brihadeeswara Temple', completed: true, icon: '🛕' },
    { name: 'Art Gallery', completed: true, icon: '🎨' },
    { name: 'Thanjavur Palace', completed: true, icon: '🏰' },
    { name: 'Saraswati Mahal Library', completed: trip.isCompleted, icon: '📚' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="glass-panel p-4 flex items-center gap-3 sticky top-0 z-20">
        <button
          onClick={onBack}
          className="p-2 rounded-full glass-panel-light hover:bg-gold/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-display font-bold text-foreground">{trip.title}</h1>
          <p className="text-xs text-muted-foreground">
            {trip.duration} days • {trip.tokensEarned} tokens earned
          </p>
        </div>
        {trip.isCompleted && (
          <Trophy className="w-6 h-6 text-gold" />
        )}
      </div>

      <div className="p-4 space-y-6">
        {/* Photo Gallery */}
        <div>
          <h3 className="flex items-center gap-2 text-foreground font-display font-semibold mb-3">
            <Camera className="w-5 h-5 text-gold" />
            Photo Gallery
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {demoPhotos.map((photo, index) => (
              <div
                key={index}
                className="aspect-square rounded-xl overflow-hidden glass-panel"
              >
                <img
                  src={photo}
                  alt={`Memory ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Memory Lane */}
        <div>
          <h3 className="flex items-center gap-2 text-foreground font-display font-semibold mb-3">
            <Link className="w-5 h-5 text-gold" />
            Memory Lane
          </h3>
          <div className="glass-panel p-4">
            <div className="flex gap-3 overflow-x-auto pb-2">
              {trip.memories?.length > 0 ? (
                trip.memories.map((memory: any, index: number) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-gold/30"
                  >
                    <img
                      src={memory.image || demoPhotos[index % demoPhotos.length]}
                      alt={memory.location || 'Memory'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No memories captured yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Checkpoints Roadmap */}
        <div>
          <h3 className="flex items-center gap-2 text-foreground font-display font-semibold mb-3">
            <MapPinned className="w-5 h-5 text-gold" />
            Checkpoints Roadmap
          </h3>
          <div className="glass-panel p-4">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-border" />
              
              {demoCheckpoints.map((checkpoint, index) => (
                <div key={index} className="relative flex items-center gap-4 py-3">
                  <div
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-2xl ${
                      checkpoint.completed
                        ? 'bg-gold/20 border-2 border-gold'
                        : 'bg-muted border-2 border-border'
                    }`}
                  >
                    {checkpoint.icon}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${checkpoint.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {checkpoint.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {checkpoint.completed ? '✓ Completed' : 'Pending'}
                    </p>
                  </div>
                  {checkpoint.completed && (
                    <Flag className="w-5 h-5 text-gold" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-panel p-4 text-center">
            <Coins className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-gold">{trip.tokensEarned}</p>
            <p className="text-xs text-muted-foreground">Tokens Earned</p>
          </div>
          <div className="glass-panel p-4 text-center">
            <Flame className="w-6 h-6 text-gold mx-auto mb-2" />
            <p className="text-2xl font-display font-bold text-gold">{trip.dharmaEarned}</p>
            <p className="text-xs text-muted-foreground">Dharma Points</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardScreen: React.FC = () => {
  const { 
    language, 
    profile, 
    activeTrip, 
    completedTrips,
    setCurrentScreen, 
    resumeTrip, 
    cancelTrip 
  } = useApp();
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<TabType>('current');
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [showClansModal, setShowClansModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);

  if (selectedTrip) {
    return <TripDetailView trip={selectedTrip} onBack={() => setSelectedTrip(null)} />;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Avatar Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        <img
          src={avatarExplorer}
          alt="Avatar"
          className="h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col safe-top safe-bottom safe-x">
        {/* Top Section - Profile & Stats */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full glass-panel border-2 border-gold/50 overflow-hidden">
                <img src={avatarExplorer} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gold text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                Lv{profile?.level || 1}
              </div>
            </div>
            <div>
              <p className="text-foreground font-display font-semibold">{profile?.display_name || 'Explorer'}</p>
              <p className="text-gold text-xs">Level {profile?.level || 1}</p>
            </div>
          </div>

          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <Coins className="w-5 h-5 text-gold" />
            <span className="text-gold font-bold font-display">{profile?.tokens || 0}</span>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="px-4 mb-4">
          <h1 className="text-2xl font-display font-bold text-foreground animate-fade-in">
            {t.welcomeBack}, {profile?.display_name || 'Explorer'}!
          </h1>
        </div>

        {/* Dharma Score Card */}
        <div className="px-4 mb-4">
          <div className="glass-panel p-4 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                <Flame className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-display font-bold text-foreground">{t.yourStats}</h2>
                <p className="text-xs text-muted-foreground">{t.civicKarma}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="glass-panel-light p-3 rounded-xl text-center">
                <div className="text-2xl font-display font-bold text-gold">{profile?.dharma_score || 0}%</div>
                <div className="text-xs text-muted-foreground mt-1">{t.dharmaBar}</div>
              </div>
              <div className="glass-panel-light p-3 rounded-xl text-center">
                <div className="text-2xl font-display font-bold text-gold">{profile?.tokens || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.totalTokens}</div>
              </div>
              <div className="glass-panel-light p-3 rounded-xl text-center">
                <div className="text-2xl font-display font-bold text-gold">{profile?.total_trips || completedTrips.length}</div>
                <div className="text-xs text-muted-foreground mt-1">{t.tripsCompleted}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 mb-4">
          <div className="glass-panel p-1 flex">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'current'
                  ? 'bg-gold text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.currentTrip}
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
                activeTab === 'completed'
                  ? 'bg-gold text-accent-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.completedTrips}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 px-4 pb-4 overflow-auto">
          {activeTab === 'current' ? (
            /* Current Trip Section */
            activeTrip ? (
              <div className="glass-panel p-4 border-2 border-gold/30 animate-slide-up">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center animate-pulse">
                      <MapPin className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-foreground">{activeTrip.title}</h3>
                      <p className="text-xs text-gold">
                        {t.level} {activeTrip.currentLevel} {t.of} {activeTrip.totalLevels}
                      </p>
                    </div>
                  </div>
                  <div className="glass-panel-light px-3 py-1 rounded-full">
                    <span className="text-sm text-gold font-bold">{activeTrip.duration} {t.days}</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{Math.round((activeTrip.currentLevel / activeTrip.totalLevels) * 100)}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-gold rounded-full transition-all duration-500"
                      style={{ width: `${(activeTrip.currentLevel / activeTrip.totalLevels) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Tokens */}
                <div className="flex items-center gap-2 mb-4 glass-panel-light p-2 rounded-lg">
                  <Coins className="w-4 h-4 text-gold" />
                  <span className="text-sm text-foreground">{t.tokensEarned}:</span>
                  <span className="text-gold font-bold">{activeTrip.tokensEarned}</span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="glassGold" className="flex items-center gap-2" onClick={cancelTrip}>
                    <X className="w-4 h-4" />
                    {t.cancelTrip}
                  </Button>
                  <Button variant="game" className="flex items-center gap-2" onClick={resumeTrip}>
                    <Play className="w-4 h-4" />
                    {t.resumeGame}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-6 text-center animate-slide-up">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">{t.noActiveTrip}</h3>
                <p className="text-muted-foreground text-sm mb-4">{t.startYourJourney}</p>
                <Button
                  variant="game"
                  size="lg"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => setCurrentScreen('tripPlanning')}
                >
                  <Plus className="w-5 h-5" />
                  {t.newTrip}
                </Button>
              </div>
            )
          ) : (
            /* Completed Trips Section */
            completedTrips.length > 0 ? (
              <div className="space-y-3">
                {completedTrips.map((trip) => (
                  <button
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className="w-full glass-panel p-4 flex items-center gap-4 hover:border-gold/50 transition-all text-left"
                  >
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-gold" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-display font-semibold text-foreground">{trip.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        {trip.duration} days • {trip.tokensEarned} tokens
                      </p>
                    </div>
                    <div className="text-gold">
                      <History className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="glass-panel p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">No Completed Trips</h3>
                <p className="text-muted-foreground text-sm">
                  Complete your first trip to see it here!
                </p>
              </div>
            )
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 pb-6">
          <div className="flex items-center justify-around">
            <button 
              onClick={() => setShowClansModal(true)}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
            >
              <div className="glass-panel p-3 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-body">Clans</span>
            </button>
            
            <button 
              onClick={() => setShowProfileModal(true)}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
            >
              <div className="glass-panel p-3 rounded-full">
                <User className="w-6 h-6" />
              </div>
              <span className="text-xs font-body">Profile</span>
            </button>
            
            <button 
              onClick={() => setShowFiltersModal(true)}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
            >
              <div className="glass-panel p-3 rounded-full">
                <Crown className="w-6 h-6" />
              </div>
              <span className="text-xs font-body">Filters</span>
            </button>
            
            <button 
              onClick={() => setShowMemoryModal(true)}
              className="flex flex-col items-center gap-1 text-muted-foreground hover:text-gold transition-colors"
            >
              <div className="glass-panel p-3 rounded-full">
                <Link className="w-6 h-6" />
              </div>
              <span className="text-xs font-body">Memory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ClansModal isOpen={showClansModal} onClose={() => setShowClansModal(false)} />
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
      <FiltersModal isOpen={showFiltersModal} onClose={() => setShowFiltersModal(false)} />
      <MemoryModal isOpen={showMemoryModal} onClose={() => setShowMemoryModal(false)} />
    </div>
  );
};
