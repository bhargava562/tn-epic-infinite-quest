import React from 'react';
import { X, ArrowLeft, Flame, Coins, MapPin, Trophy, Star } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import avatarExplorer from '@/assets/avatar-explorer.png';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, completedTrips } = useApp();

  if (!isOpen) return null;

  const stats = [
    { label: 'Dharma Score', value: `${profile?.dharma_score || 0}%`, icon: Flame },
    { label: 'Tokens', value: profile?.tokens || 0, icon: Coins },
    { label: 'Trips', value: profile?.total_trips || completedTrips.length, icon: MapPin },
    { label: 'Memories', value: profile?.total_memories || 0, icon: Star },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50">
        <button 
          onClick={onClose} 
          className="p-2 glass-panel rounded-full hover:bg-gold/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        
        <h1 className="text-lg font-display font-bold text-foreground">Profile</h1>
        
        <button 
          onClick={onClose} 
          className="p-2 glass-panel rounded-full hover:bg-gold/10 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-8">
        {/* Profile Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div className="w-20 h-20 rounded-full glass-panel border-4 border-gold/50 overflow-hidden">
              <img src={avatarExplorer} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-gold text-accent-foreground text-xs font-bold px-3 py-0.5 rounded-full whitespace-nowrap">
              Lv{profile?.level || 1}
            </div>
          </div>
          <h2 className="text-xl font-display font-bold text-foreground mt-2">
            {profile?.display_name || 'Explorer'}
          </h2>
          <p className="text-muted-foreground text-sm">{profile?.email || 'Guest Explorer'}</p>
        </div>

        {/* Dharma Scorecard */}
        <div className="glass-panel p-4 rounded-2xl mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-5 h-5 text-gold" />
            <h3 className="font-display font-semibold text-foreground">Dharma Scorecard</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat) => (
              <div key={stat.label} className="glass-panel-light p-3 rounded-xl text-center">
                <stat.icon className="w-4 h-4 text-gold mx-auto mb-1" />
                <div className="text-base font-display font-bold text-gold">{stat.value}</div>
                <div className="text-[10px] text-muted-foreground leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Level Progress */}
        <div className="glass-panel p-4 rounded-2xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-muted-foreground">Level Progress</span>
            <span className="text-sm text-gold font-bold">
              {((profile?.dharma_score || 0) % 100)}%
            </span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-gold rounded-full transition-all duration-500"
              style={{ width: `${(profile?.dharma_score || 0) % 100}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            {100 - ((profile?.dharma_score || 0) % 100)} points to Level {(profile?.level || 1) + 1}
          </p>
        </div>
      </div>
    </div>
  );
};
