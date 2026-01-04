import React from 'react';
import { X, Users, Crown, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockClans = [
  { id: 1, name: 'Temple Guardians', members: 156, rank: 1, icon: '🛕' },
  { id: 2, name: 'Heritage Hunters', members: 98, rank: 2, icon: '🏛️' },
  { id: 3, name: 'Dharma Warriors', members: 234, rank: 3, icon: '⚔️' },
];

export const ClansModal: React.FC<ClansModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-background border-t border-gold/20 rounded-t-3xl p-6 pb-8 animate-slide-up">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1 bg-muted rounded-full" />
        
        <div className="flex items-center justify-between mb-6 mt-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
              <Users className="w-5 h-5 text-accent-foreground" />
            </div>
            <h2 className="text-xl font-display font-bold text-foreground">Clans</h2>
          </div>
          <button onClick={onClose} className="p-2 glass-panel rounded-full">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {mockClans.map((clan) => (
            <div key={clan.id} className="glass-panel p-4 rounded-2xl flex items-center gap-4">
              <div className="text-3xl">{clan.icon}</div>
              <div className="flex-1">
                <h3 className="font-display font-semibold text-foreground">{clan.name}</h3>
                <p className="text-xs text-muted-foreground">{clan.members} members</p>
              </div>
              <div className="flex items-center gap-1 text-gold">
                <Trophy className="w-4 h-4" />
                <span className="font-bold">#{clan.rank}</span>
              </div>
            </div>
          ))}
        </div>

        <Button variant="game" className="w-full">
          <Crown className="w-5 h-5 mr-2" />
          Create Your Clan
        </Button>
      </div>
    </div>
  );
};
