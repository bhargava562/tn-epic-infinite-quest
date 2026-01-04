import React, { useState, useEffect } from 'react';
import { useApp, translations } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Music, Video, Camera, Check, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import templeBackground from '@/assets/temple-background.jpg';

export const ARScreen: React.FC = () => {
  const { language, profile, setCurrentScreen } = useApp();
  const t = translations[language];
  const [isScanning, setIsScanning] = useState(false);
  const [showUnlockPopup, setShowUnlockPopup] = useState(false);
  const [showLevelComplete, setShowLevelComplete] = useState(false);
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [tokensEarned, setTokensEarned] = useState(0);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setShowUnlockPopup(true);
      setTimeout(() => setShowUnlockPopup(false), 3000);
    }, 2000);
  };

  const handleComplete = () => {
    setTokensEarned(50);
    setShowLevelComplete(true);
  };

  const handleContinue = () => {
    toast({
      title: "🎉 " + t.levelAced,
      description: `+50 ${t.templeTokens}`,
    });
    setCurrentScreen('lobby');
  };

  const handleSnapshot = () => {
    toast({
      title: "📸 Photo Captured!",
      description: "Saved to your Memory Line",
    });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Simulated Camera View */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${templeBackground})` }}
      >
        {/* Camera border effect */}
        <div className="absolute inset-0 border-4 border-royal/50 pointer-events-none" />
        
        {/* AR Overlay Grid */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(45 100% 51% / 0.3) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(45 100% 51% / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Golden Path Visualization */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(45, 100%, 51%)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="hsl(45, 100%, 60%)" stopOpacity="1" />
            <stop offset="100%" stopColor="hsl(45, 100%, 51%)" stopOpacity="0.8" />
          </linearGradient>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Animated golden path */}
        <path
          d="M 50 100% Q 45 80% 50 60% T 55 40% T 50 20% T 52 5%"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="8"
          filter="url(#pathGlow)"
          className="ar-path"
          style={{
            strokeDasharray: '20 10',
            animation: 'shimmer 2s linear infinite',
          }}
        />
        
        {/* Path center glow line */}
        <path
          d="M 50% 100% Q 45% 80% 50% 60% T 55% 40% T 50% 20%"
          fill="none"
          stroke="hsl(45, 100%, 70%)"
          strokeWidth="3"
          filter="url(#pathGlow)"
          opacity="0.6"
        />
      </svg>

      {/* Floating Save Point Markers */}
      <div className="absolute left-[40%] top-[35%] z-20 float">
        <div className="relative">
          <div className="absolute inset-0 bg-gold/40 rounded-full blur-lg" />
          <div className="relative glass-panel px-3 py-2 rounded-full border-gold/50 border">
            <span className="text-gold text-xs font-bold">Save Point</span>
          </div>
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-30 min-h-screen flex flex-col safe-top safe-bottom safe-x">
        {/* Top Controls */}
        <div className="p-4 flex items-center justify-between">
          {/* Back Button */}
          <Button
            variant="glass"
            size="icon"
            onClick={() => setCurrentScreen('map')}
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Button>

          {/* Vlogger Kit */}
          <div className="flex flex-col gap-3">
            <Button
              variant={isMusicOn ? "goldOutline" : "glass"}
              size="icon"
              onClick={() => setIsMusicOn(!isMusicOn)}
            >
              <Music className="w-5 h-5" />
            </Button>
            <Button
              variant={isRecording ? "gold" : "glass"}
              size="icon"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Video className="w-5 h-5" />
            </Button>
            <Button
              variant="glass"
              size="icon"
              onClick={handleSnapshot}
            >
              <Camera className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Scanning Indicator */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center z-40">
            <div className="text-center animate-pulse">
              <div className="w-32 h-32 border-4 border-gold rounded-lg mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gold/20" />
                <div 
                  className="absolute inset-0 bg-gradient-to-b from-gold/50 to-transparent"
                  style={{ animation: 'dataScan 1s linear infinite' }}
                />
              </div>
              <p className="text-gold font-display font-bold text-xl">{t.scanning}</p>
            </div>
          </div>
        )}

        {/* Filter Unlock Popup */}
        {showUnlockPopup && (
          <div className="absolute inset-x-4 top-1/3 z-50 animate-scale-in">
            <div className="glass-panel p-6 border-gold/50 border-2 text-center">
              <Sparkles className="w-12 h-12 text-gold mx-auto mb-3 animate-pulse" />
              <p className="text-gold font-display font-bold text-xl">{t.filterUnlocked}</p>
              <p className="text-muted-foreground text-sm mt-2">Thanjavur Temple Crown</p>
            </div>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" onClick={handleScan} />

        {/* Bottom Complete Button */}
        <div className="p-4 pb-6">
          <Button
            variant="gold"
            size="xl"
            className="w-full h-16 text-xl gap-3"
            onClick={handleComplete}
          >
            <Check className="w-6 h-6" />
            <span>Complete Level</span>
          </Button>
        </div>
      </div>

      {/* Level Complete Overlay */}
      {showLevelComplete && (
        <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-lg flex items-center justify-center animate-fade-in">
          <div className="text-center px-6">
            {/* Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: i % 2 === 0 ? 'hsl(45, 100%, 51%)' : 'hsl(232, 67%, 50%)',
                    left: `${Math.random() * 100}%`,
                    top: '-10%',
                    animation: `confetti ${1 + Math.random()}s ease-out forwards`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                />
              ))}
            </div>

            <h1 className="text-4xl font-display font-bold gradient-text-gold gold-glow-text mb-4">
              {t.levelAced}
            </h1>
            
            <div className="glass-panel p-6 mb-8 inline-block">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-accent-foreground" />
                </div>
                <div className="text-left">
                  <p className="text-muted-foreground text-sm">{t.tokensEarned}</p>
                  <p className="text-gold font-display font-bold text-2xl">+50</p>
                </div>
              </div>
            </div>

            <Button
              variant="game"
              size="xl"
              className="px-12"
              onClick={handleContinue}
            >
              {t.continue}
            </Button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
