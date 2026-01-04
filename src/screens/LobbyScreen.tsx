import React, { useState } from 'react';
import { useApp, translations } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Users, User, Crown, Link, Coins, MapPin, Trophy, Flame, History, Plus, Play, X } from 'lucide-react';
import avatarExplorer from '@/assets/avatar-explorer.png';
import { ClansModal } from '@/components/modals/ClansModal';
import { ProfileModal } from '@/components/modals/ProfileModal';
import { FiltersModal } from '@/components/modals/FiltersModal';
import { MemoryModal } from '@/components/modals/MemoryModal';

export const LobbyScreen: React.FC = () => {
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

  const [showClansModal, setShowClansModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [showMemoryModal, setShowMemoryModal] = useState(false);

  const hasActiveTrip = activeTrip !== null;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Avatar Background */}
      <div className="absolute inset-0 flex items-center justify-center opacity-30">
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
          {/* Profile */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-full glass-panel border-2 border-gold/50 overflow-hidden">
                <img src={avatarExplorer} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-gold text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                Lv1
              </div>
            </div>
            <div>
              <p className="text-foreground font-display font-semibold">{profile?.display_name || 'Explorer'}</p>
              <p className="text-gold text-xs">Level {profile?.level || 1}</p>
            </div>
          </div>

          {/* Tokens */}
          <div className="glass-panel px-4 py-2 flex items-center gap-2">
            <Coins className="w-5 h-5 text-gold" />
            <span className="text-gold font-bold font-display">{profile?.tokens || 0}</span>
          </div>
        </div>

        {/* Welcome Back Message */}
        <div className="px-4 mb-4">
          <h1 className="text-2xl font-display font-bold text-foreground animate-fade-in">
            {t.welcomeBack}, {profile?.display_name || 'Explorer'}!
          </h1>
        </div>

        {/* Dharma Score Card - RPG Style */}
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

            {/* Stats Grid */}
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

            {/* Dharma Progress Bar */}
            <div className="mt-4">
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-gold rounded-full transition-all duration-500 animate-shimmer"
                  style={{ width: `${Math.min(profile?.dharma_score || 0, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Active Trip Card or No Trip Card */}
        <div className="px-4 mb-4 flex-1">
          {hasActiveTrip ? (
            <div className="glass-panel p-4 border-2 border-gold/30 animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center animate-pulse-gold">
                    <MapPin className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">{t.currentTrip}</h3>
                    <p className="text-xs text-gold">
                      {t.level} {activeTrip.currentLevel} {t.of} {activeTrip.totalLevels}
                    </p>
                  </div>
                </div>
                <div className="glass-panel-light px-3 py-1 rounded-full">
                  <span className="text-sm text-gold font-bold">{activeTrip.duration} {t.days}</span>
                </div>
              </div>

              {/* Trip Progress */}
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

              {/* Destination Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {activeTrip.destinations.slice(0, 3).map((dest) => (
                  <span
                    key={dest}
                    className="px-3 py-1 rounded-full glass-panel-light text-xs text-foreground"
                  >
                    {dest}
                  </span>
                ))}
                {activeTrip.destinations.length > 3 && (
                  <span className="px-3 py-1 rounded-full glass-panel-light text-xs text-gold">
                    +{activeTrip.destinations.length - 3}
                  </span>
                )}
              </div>

              {/* Tokens Earned */}
              <div className="flex items-center gap-2 mb-4 glass-panel-light p-2 rounded-lg">
                <Coins className="w-4 h-4 text-gold" />
                <span className="text-sm text-foreground">{t.tokensEarned}:</span>
                <span className="text-gold font-bold">{activeTrip.tokensEarned}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="glassGold"
                  className="flex items-center gap-2"
                  onClick={cancelTrip}
                >
                  <X className="w-4 h-4" />
                  {t.cancelTrip}
                </Button>
                <Button
                  variant="game"
                  className="flex items-center gap-2"
                  onClick={resumeTrip}
                >
                  <Play className="w-4 h-4" />
                  {t.resumeGame}
                </Button>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
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
          )}

          {/* Completed Trips Preview */}
          {completedTrips.length > 0 && (
            <button
              onClick={() => setCurrentScreen('completedTrips')}
              className="glass-panel p-4 mt-4 w-full animate-slide-up flex items-center justify-between hover:bg-gold/5 transition-colors"
              style={{ animationDelay: '200ms' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-gold/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-gold" />
                </div>
                <div className="text-left">
                  <h3 className="font-display font-medium text-foreground">{t.completedTrips}</h3>
                  <p className="text-xs text-muted-foreground">
                    {completedTrips.length} trips • {completedTrips.reduce((acc, trip) => acc + trip.memories.length, 0)} {t.memories}
                  </p>
                </div>
              </div>
              <History className="w-5 h-5 text-gold" />
            </button>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 pb-6">
          {/* Bottom Icons */}
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
