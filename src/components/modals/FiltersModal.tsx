import React, { useState } from 'react';
import { X, ArrowLeft, Camera, SwitchCamera, Check, Lock } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const allFilters = [
  { id: 'temple_glow', name: 'Temple Glow', icon: '🛕' },
  { id: 'heritage_sepia', name: 'Heritage Sepia', icon: '📜' },
  { id: 'golden_hour', name: 'Golden Hour', icon: '🌅' },
  { id: 'ancient_stone', name: 'Ancient Stone', icon: '🗿' },
  { id: 'royal_purple', name: 'Royal Purple', icon: '👑' },
  { id: 'mystic_blue', name: 'Mystic Blue', icon: '💎' },
];

export const FiltersModal: React.FC<FiltersModalProps> = ({ isOpen, onClose }) => {
  const { isDemo } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string | null>('temple_glow');
  const [isFrontCamera, setIsFrontCamera] = useState(false);

  if (!isOpen) return null;

  // Demo user Bhargava has 2 unlocked filters
  const unlockedFilterIds = isDemo ? ['temple_glow', 'heritage_sepia'] : [];

  const handleCapture = () => {
    console.log('Capturing photo with filter:', selectedFilter);
  };

  const toggleCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Camera Preview Area */}
      <div className="flex-1 relative bg-gradient-to-b from-muted/30 via-muted/10 to-background">
        {/* Back Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 left-4 z-20 p-2.5 glass-panel rounded-full hover:bg-gold/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-20 p-2.5 glass-panel rounded-full hover:bg-gold/10 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Simulated camera view */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="relative">
            {/* Camera frame - responsive size */}
            <div className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-gold/30 flex items-center justify-center overflow-hidden">
              <div className="w-full h-full bg-gradient-to-br from-muted/50 to-muted/20 flex items-center justify-center">
                <Camera className="w-12 h-12 text-muted-foreground/50" />
              </div>
            </div>
            
            {/* Filter overlay effect */}
            {selectedFilter && (
              <div className="absolute inset-0 rounded-full pointer-events-none">
                <div className={`w-full h-full rounded-full ${
                  selectedFilter === 'temple_glow' ? 'bg-amber-500/15' :
                  selectedFilter === 'heritage_sepia' ? 'bg-orange-900/15' :
                  selectedFilter === 'golden_hour' ? 'bg-yellow-500/15' :
                  selectedFilter === 'ancient_stone' ? 'bg-stone-500/15' :
                  selectedFilter === 'royal_purple' ? 'bg-purple-500/15' :
                  'bg-blue-500/15'
                }`} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Controls Container */}
      <div className="flex-shrink-0 bg-background pb-6 pt-4 px-4 safe-bottom">
        {/* Filter Selection - Horizontal Scrollable */}
        <div className="mb-4">
          <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
            <div className="flex gap-3 min-w-max justify-start">
              {allFilters.map((filter) => {
                const isUnlocked = unlockedFilterIds.includes(filter.id);
                const isSelected = selectedFilter === filter.id;
                
                return (
                  <button
                    key={filter.id}
                    onClick={() => isUnlocked && setSelectedFilter(filter.id)}
                    disabled={!isUnlocked}
                    className={`relative flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                      isSelected 
                        ? 'ring-3 ring-gold scale-110 bg-gradient-gold' 
                        : isUnlocked 
                          ? 'glass-panel hover:scale-105' 
                          : 'glass-panel-light opacity-50'
                    }`}
                  >
                    <span className="text-xl">{filter.icon}</span>
                    
                    {!isUnlocked && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-muted flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-muted-foreground" />
                      </div>
                    )}
                    {isSelected && isUnlocked && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-gold flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-accent-foreground" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Selected filter name */}
          {selectedFilter && (
            <p className="text-center text-xs text-foreground font-medium mt-2">
              {allFilters.find(f => f.id === selectedFilter)?.name}
            </p>
          )}
        </div>

        {/* Capture Controls */}
        <div className="flex items-center justify-center gap-6">
          {/* Spacer */}
          <div className="w-12" />
          
          {/* Capture Button */}
          <button 
            onClick={handleCapture}
            className="w-16 h-16 rounded-full bg-gradient-gold flex items-center justify-center shadow-gold-intense hover:scale-105 transition-transform active:scale-95"
          >
            <div className="w-12 h-12 rounded-full border-3 border-accent-foreground/30 flex items-center justify-center">
              <Camera className="w-6 h-6 text-accent-foreground" />
            </div>
          </button>
          
          {/* Flip Camera Button */}
          <button 
            onClick={toggleCamera}
            className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-gold/10 transition-colors"
          >
            <SwitchCamera className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </div>
  );
};
