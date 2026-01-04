import React, { useState } from 'react';
import { useApp, translations } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Coins, MapPin } from 'lucide-react';
import { z } from 'zod';
import tamilNaduMap from '@/assets/tamil-nadu-map.jpg';

// Input validation schema for search
const searchQuerySchema = z.string().max(100, 'Search query too long').trim();

const getLevelPins = (currentLevel: number) => [
  { id: 1, name: 'Chennai Gateway', x: 75, y: 25, unlocked: true, completed: currentLevel > 1 },
  { id: 2, name: 'Kanchipuram Temples', x: 68, y: 35, unlocked: currentLevel >= 2, completed: currentLevel > 2, isCurrent: currentLevel === 2 },
  { id: 3, name: 'Mahabalipuram Shore', x: 80, y: 42, unlocked: currentLevel >= 3, completed: currentLevel > 3 },
  { id: 4, name: 'Thanjavur Glory', x: 55, y: 55, unlocked: currentLevel >= 4, completed: currentLevel > 4 },
  { id: 5, name: 'Madurai Marvel', x: 45, y: 75, unlocked: currentLevel >= 5, completed: currentLevel > 5 },
  { id: 6, name: 'Rameswaram Sacred', x: 60, y: 90, unlocked: currentLevel >= 6, completed: currentLevel > 6 },
];

export const MapScreen: React.FC = () => {
  const { language, profile, activeTrip, setCurrentScreen } = useApp();
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');
  
  const currentLevel = activeTrip?.currentLevel || 2;
  const levelPins = getLevelPins(currentLevel);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(currentLevel);

  // Validated search handler
  const handleSearchChange = (value: string) => {
    const result = searchQuerySchema.safeParse(value);
    if (result.success) {
      setSearchQuery(result.data);
    }
    // Silently ignore invalid input (too long)
  };

  const handleGoByAR = () => {
    setCurrentScreen('ar');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Map Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${tamilNaduMap})` }}
      >
        <div className="absolute inset-0 bg-background/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col safe-top safe-bottom safe-x">
        {/* HUD Top */}
        <div className="p-4 flex items-center justify-between">
          {/* Back Button & Tokens */}
          <div className="flex items-center gap-3">
            <Button
              variant="glass"
              size="icon"
              onClick={() => setCurrentScreen('lobby')}
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Button>
            <div className="glass-panel px-3 py-1.5 flex items-center gap-2">
              <Coins className="w-4 h-4 text-gold" />
              <span className="text-gold font-bold text-sm">{profile?.tokens || 0}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-[180px] mx-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                maxLength={100}
                className="pl-9 h-9 glass-panel border-gold/20 text-sm placeholder:text-muted-foreground/60"
              />
            </div>
          </div>

          {/* Current Level */}
          <div className="glass-panel px-3 py-1.5">
            <span className="text-gold font-bold text-sm">Lv{activeTrip?.currentLevel || 1}</span>
          </div>
        </div>

        {/* Map Area with Level Pins */}
        <div className="flex-1 relative">
          {levelPins.map((pin) => {
            const isCurrent = pin.id === currentLevel;
            
            return (
              <button
                key={pin.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
                  selectedLevel === pin.id ? 'scale-125 z-20' : 'hover:scale-110'
                } ${isCurrent ? 'z-30' : ''}`}
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                onClick={() => setSelectedLevel(pin.id)}
                disabled={!pin.unlocked}
              >
                {/* Current Level Glow Effect */}
                {isCurrent && (
                  <div className="absolute inset-0 bg-gold/50 rounded-full blur-lg animate-pulse scale-150" />
                )}
                
                {/* Pin Glow */}
                {pin.unlocked && !isCurrent && (
                  <div className={`absolute inset-0 rounded-full blur-md ${
                    selectedLevel === pin.id ? 'bg-gold/60' : 'bg-gold/30'
                  }`} />
                )}
                
                {/* Pin Icon */}
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
                    isCurrent
                      ? 'bg-gradient-gold shadow-gold-intense ring-4 ring-gold/50'
                      : pin.completed
                        ? 'bg-gradient-gold'
                        : pin.unlocked
                          ? selectedLevel === pin.id
                            ? 'bg-gradient-gold shadow-gold-intense'
                            : 'glass-panel border-2 border-gold/50'
                          : 'glass-panel opacity-50'
                  }`}
                >
                  <span className={`font-bold text-sm ${
                    isCurrent || pin.completed ? 'text-accent-foreground' : pin.unlocked ? 'text-gold' : 'text-muted-foreground'
                  }`}>
                    {pin.id}
                  </span>
                </div>

                {/* Level Name Tooltip */}
                {(selectedLevel === pin.id || isCurrent) && (
                  <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <div className={`px-3 py-1.5 text-xs font-body rounded-lg ${
                      isCurrent ? 'bg-gradient-gold text-accent-foreground font-bold' : 'glass-panel text-foreground'
                    }`}>
                      {isCurrent && '📍 '}{pin.name}
                    </div>
                  </div>
                )}
              </button>
            );
          })}

          {/* Avatar Position Indicator - Now at current level position */}
          {(() => {
            const currentPin = levelPins.find(p => p.id === currentLevel);
            if (!currentPin) return null;
            
            return (
              <div
                className="absolute transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
                style={{ left: `${currentPin.x}%`, top: `${currentPin.y - 8}%` }}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gold/50 rounded-full blur-lg animate-pulse" />
                  <div className="relative w-8 h-8 bg-gradient-gold rounded-full flex items-center justify-center shadow-gold-intense">
                    <MapPin className="w-4 h-4 text-accent-foreground" />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>

        {/* Bottom Section */}
        <div className="p-4 pb-6">
          {/* Selected Level Info */}
          {selectedLevel && (
            <div className="glass-panel p-4 mb-4 animate-scale-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground font-display font-semibold">
                    Level {selectedLevel}: {levelPins.find(p => p.id === selectedLevel)?.name}
                  </h3>
                  <p className="text-muted-foreground text-sm font-body">
                    Explore and collect Temple Tokens
                  </p>
                </div>
                <div className="flex items-center gap-1 text-gold">
                  <Coins className="w-4 h-4" />
                  <span className="font-bold">+50</span>
                </div>
              </div>
            </div>
          )}

          {/* GO BY AR Button */}
          <Button
            variant="game"
            size="xl"
            className="w-full h-16 text-xl"
            onClick={handleGoByAR}
          >
            {t.goByAr}
          </Button>
        </div>
      </div>
    </div>
  );
};