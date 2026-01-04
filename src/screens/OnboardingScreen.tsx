import React from 'react';
import { useApp, translations } from '@/contexts/AppContext';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import templeBackground from '@/assets/temple-background.jpg';

export const OnboardingScreen: React.FC = () => {
  const { language, signInWithGoogle, signInAsGuest } = useApp();
  const t = translations[language];

  const handleGoogleAuth = async () => {
    await signInWithGoogle();
  };

  const handleGuestPlay = async () => {
    await signInAsGuest();
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Cinematic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${templeBackground})` }}
      >
        {/* Data pulse overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background/95" />
        
        {/* Animated scan line */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, hsl(45, 100%, 51%) 50%, transparent 100%)',
            backgroundSize: '100% 200%',
            animation: 'dataScan 3s linear infinite',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col safe-top safe-bottom safe-x">
        {/* Language Selector - Top Right */}
        <div className="absolute top-6 right-6">
          <LanguageSelector />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20">
          {/* Logo */}
          <Logo className="animate-fade-in" />

          {/* Branding Text */}
          <div className="text-center mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-muted-foreground text-lg mb-2 font-body">{t.welcome}</p>
            <h1 className="text-5xl font-display font-bold gradient-text-gold gold-glow-text mb-3">
              {t.tnEpic}
            </h1>
            <p className="text-gold/80 text-sm font-body tracking-widest uppercase">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Auth Section - Bottom */}
        <div className="px-6 pb-8 space-y-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          {/* Google Button */}
          <Button
            variant="social"
            size="xl"
            className="w-full gap-3"
            onClick={handleGoogleAuth}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>{t.continueGoogle}</span>
          </Button>

          {/* Instagram Button - Disabled for now */}
          <Button
            variant="social"
            size="xl"
            className="w-full gap-3 opacity-50 cursor-not-allowed"
            disabled
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="url(#instagramGradient)">
              <defs>
                <linearGradient id="instagramGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFDC80" />
                  <stop offset="10%" stopColor="#FCAF45" />
                  <stop offset="30%" stopColor="#F77737" />
                  <stop offset="50%" stopColor="#F56040" />
                  <stop offset="70%" stopColor="#FD1D1D" />
                  <stop offset="80%" stopColor="#E1306C" />
                  <stop offset="90%" stopColor="#C13584" />
                  <stop offset="100%" stopColor="#833AB4" />
                </linearGradient>
              </defs>
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span>{t.continueInstagram}</span>
          </Button>

          {/* Guest Play Link */}
          <button
            className="w-full text-center text-gold/80 hover:text-gold text-sm font-body py-3 transition-colors"
            onClick={handleGuestPlay}
          >
            {t.playAsGuest}
          </button>

          {/* Terms Footer */}
          <p className="text-center text-muted-foreground/60 text-xs font-body">
            {t.termsAccept}
          </p>
        </div>
      </div>
    </div>
  );
};
