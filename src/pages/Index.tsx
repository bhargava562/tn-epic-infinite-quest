import React from 'react';
import { AppProvider, useApp } from '@/contexts/AppContext';
import { OnboardingScreen } from '@/screens/OnboardingScreen';
import { LobbyScreen } from '@/screens/LobbyScreen';
import { TripPlanningScreen } from '@/screens/TripPlanningScreen';
import { MapScreen } from '@/screens/MapScreen';
import { ARScreen } from '@/screens/ARScreen';
import { CompletedTripsScreen } from '@/screens/CompletedTripsScreen';

const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen />;
      case 'lobby':
        return <LobbyScreen />;
      case 'tripPlanning':
        return <TripPlanningScreen />;
      case 'map':
        return <MapScreen />;
      case 'ar':
        return <ARScreen />;
      case 'completedTrips':
        return <CompletedTripsScreen />;
      default:
        return <OnboardingScreen />;
    }
  };

  return (
    <div className="min-h-screen w-full max-w-md mx-auto overflow-hidden relative">
      {/* Mobile container with max-width for desktop preview */}
      <div className="min-h-screen">
        {renderScreen()}
      </div>
    </div>
  );
};

const Index = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
