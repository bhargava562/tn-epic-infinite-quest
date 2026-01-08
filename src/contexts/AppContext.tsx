import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

type Language = 'en' | 'ta' | 'fr' | 'de';
type ScreenType = 'onboarding' | 'auth' | 'register' | 'dashboard' | 'lobby' | 'tripPlanning' | 'map' | 'ar' | 'completedTrips';

interface Memory {
  id: string;
  image: string;
  location: string;
  timestamp: Date;
}

interface Trip {
  id: string;
  title: string;
  duration: number;
  destinations: string[];
  currentLevel: number;
  totalLevels: number;
  startDate: Date;
  endDate?: Date;
  isCompleted: boolean;
  tokensEarned: number;
  dharmaEarned: number;
  memories: Memory[];
}

interface Profile {
  id: string;
  display_name: string | null;
  email: string | null;
  avatar_url: string | null;
  level: number | null;
  tokens: number | null;
  dharma_score: number | null;
  total_trips: number | null;
  total_memories: number | null;
  preferred_language: string | null;
  created_at: string | null;
  updated_at: string | null;
}

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  bio?: string;
  avatarIndex: number;
}

interface AppContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isDemo: boolean;
  isLoading: boolean;
  pendingEmail: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;
  completedTrips: Trip[];
  setCompletedTrips: (trips: Trip[]) => void;
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  signInWithEmail: (email: string, password: string) => Promise<{ needsRegistration?: boolean; error?: string }>;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => Promise<void>;
  registerUser: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  startNewTrip: (duration: number, destinations: string[]) => void;
  cancelTrip: () => void;
  completeTrip: () => void;
  resumeTrip: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('auth');
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState('');
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  // Fetch user profile from database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as Profile;
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return null;
    }
  };

  // Fetch user trips from database
  const fetchTrips = async (userId: string) => {
    try {
      const { data: tripsData, error } = await supabase
        .from('trips')
        .select(`
          id,
          title,
          duration,
          status,
          current_level,
          total_levels,
          tokens_earned,
          dharma_earned,
          start_date,
          end_date,
          completed_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching trips:', error);
        return { active: null, completed: [] };
      }

      const trips: Trip[] = (tripsData || []).map(trip => ({
        id: trip.id,
        title: trip.title || 'Trip',
        duration: trip.duration,
        destinations: [],
        currentLevel: trip.current_level || 1,
        totalLevels: trip.total_levels || 1,
        startDate: trip.start_date ? new Date(trip.start_date) : new Date(),
        endDate: trip.end_date ? new Date(trip.end_date) : undefined,
        isCompleted: trip.status === 'completed',
        tokensEarned: trip.tokens_earned || 0,
        dharmaEarned: trip.dharma_earned || 0,
        memories: [],
      }));

      const active = trips.find(t => !t.isCompleted) || null;
      const completed = trips.filter(t => t.isCompleted);

      return { active, completed };
    } catch (err) {
      console.error('Error in fetchTrips:', err);
      return { active: null, completed: [] };
    }
  };

  // Initialize auth state
  useEffect(() => {
    // If true, the app will ALWAYS start at the login screen and require the user
    // to log in again (no automatic session restore to dashboard).
    const FORCE_LOGIN_EACH_LAUNCH = true;
    let forcedSignOutRequested = false;

    // Set up auth state listener FIRST
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      // When forcing login on each launch, any restored session (including anonymous/guest)
      // should be cleared immediately.
      if (FORCE_LOGIN_EACH_LAUNCH && currentSession?.user && !forcedSignOutRequested) {
        forcedSignOutRequested = true;

        // Show login immediately to avoid flashing the dashboard.
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        setProfile(null);
        setActiveTrip(null);
        setCompletedTrips([]);
        setCurrentScreen('auth');
        setIsLoading(false);

        // Defer signOut to avoid calling backend methods directly inside the auth callback.
        setTimeout(() => {
          supabase.auth.signOut();
        }, 0);

        return;
      }

      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsAuthenticated(!!currentSession?.user);

      if (currentSession?.user) {
        // Defer database calls with setTimeout to prevent deadlock
        setTimeout(() => {
          fetchProfile(currentSession.user.id).then((profileData) => {
            if (profileData) {
              setProfile(profileData);
              if (profileData.preferred_language) {
                setLanguage(profileData.preferred_language as Language);
              }
            }
          });

          fetchTrips(currentSession.user.id).then(({ active, completed }) => {
            setActiveTrip(active);
            setCompletedTrips(completed);
          });
        }, 0);

        setCurrentScreen('dashboard');
      } else {
        setProfile(null);
        setActiveTrip(null);
        setCompletedTrips([]);
        setCurrentScreen('auth');
      }

      setIsLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (FORCE_LOGIN_EACH_LAUNCH && existingSession?.user && !forcedSignOutRequested) {
        forcedSignOutRequested = true;
        setTimeout(() => {
          supabase.auth.signOut();
        }, 0);
        setIsLoading(false);
        return;
      }

      if (!FORCE_LOGIN_EACH_LAUNCH && existingSession?.user) {
        setSession(existingSession);
        setUser(existingSession.user);
        setIsAuthenticated(true);

        fetchProfile(existingSession.user.id).then((profileData) => {
          if (profileData) {
            setProfile(profileData);
            if (profileData.preferred_language) {
              setLanguage(profileData.preferred_language as Language);
            }
          }
        });

        fetchTrips(existingSession.user.id).then(({ active, completed }) => {
          setActiveTrip(active);
          setCompletedTrips(completed);
        });

        setCurrentScreen('dashboard');
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string): Promise<{ needsRegistration?: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check if user needs to register
        if (error.message.includes('Invalid login credentials')) {
          setPendingEmail(email);
          return { needsRegistration: true };
        }
        return { error: error.message };
      }

      if (data.user) {
        setIsDemo(false);
        return {};
      }

      return { error: 'Login failed' };
    } catch (err) {
      console.error('Sign in error:', err);
      return { error: 'An unexpected error occurred' };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.error('Google sign in error:', error);
      }
    } catch (err) {
      console.error('Google sign in error:', err);
    }
  };

  const signInAsGuest = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('Guest sign in error:', error);
        return;
      }

      if (data.user) {
        setIsDemo(false);
        // Profile will be created by the handle_new_user trigger
      }
    } catch (err) {
      console.error('Guest sign in error:', err);
    }
  };

  const registerUser = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: data.displayName,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { success: false, error: 'This email is already registered. Please sign in instead.' };
        }
        return { success: false, error: error.message };
      }

      if (authData.user) {
        // Update avatar if needed
        if (data.avatarIndex >= 0) {
          setTimeout(async () => {
            await supabase
              .from('profiles')
              .update({ avatar_url: `/avatar-${data.avatarIndex}.png` })
              .eq('id', authData.user!.id);
          }, 1000); // Wait for trigger to create profile
        }
        
        setIsDemo(false);
        setPendingEmail('');
        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setIsDemo(false);
      setIsAuthenticated(false);
      setActiveTrip(null);
      setCompletedTrips([]);
      setPendingEmail('');
      setUser(null);
      setSession(null);
      setCurrentScreen('auth');
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const startNewTrip = async (duration: number, destinations: string[]) => {
    if (!user) {
      // Fallback to local-only trip for demo
      const newTrip: Trip = {
        id: Date.now().toString(),
        title: 'Tamil Nadu Adventure',
        duration,
        destinations,
        currentLevel: 1,
        totalLevels: destinations.length * 2,
        startDate: new Date(),
        isCompleted: false,
        tokensEarned: 0,
        dharmaEarned: 0,
        memories: [],
      };
      setActiveTrip(newTrip);
      setCurrentScreen('map');
      return;
    }

    try {
      const { data: trip, error } = await supabase
        .from('trips')
        .insert({
          user_id: user.id,
          title: 'Tamil Nadu Adventure',
          duration,
          status: 'active',
          current_level: 1,
          total_levels: destinations.length * 2,
          start_date: new Date().toISOString().split('T')[0],
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating trip:', error);
        return;
      }

      const newTrip: Trip = {
        id: trip.id,
        title: trip.title || 'Tamil Nadu Adventure',
        duration: trip.duration,
        destinations,
        currentLevel: trip.current_level || 1,
        totalLevels: trip.total_levels || 1,
        startDate: new Date(trip.start_date || Date.now()),
        isCompleted: false,
        tokensEarned: 0,
        dharmaEarned: 0,
        memories: [],
      };

      setActiveTrip(newTrip);
      setCurrentScreen('map');
    } catch (err) {
      console.error('Error starting trip:', err);
    }
  };

  const cancelTrip = async () => {
    if (activeTrip && user) {
      try {
        await supabase
          .from('trips')
          .update({ status: 'cancelled' })
          .eq('id', activeTrip.id)
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Error cancelling trip:', err);
      }
    }
    setActiveTrip(null);
    setCurrentScreen('tripPlanning');
  };

  const completeTrip = async () => {
    if (!activeTrip) return;

    if (user) {
      try {
        await supabase
          .from('trips')
          .update({
            status: 'completed',
            completed_at: new Date().toISOString(),
            end_date: new Date().toISOString().split('T')[0],
          })
          .eq('id', activeTrip.id)
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Error completing trip:', err);
      }
    }

    const completed: Trip = {
      ...activeTrip,
      isCompleted: true,
      endDate: new Date(),
    };
    setCompletedTrips((prev) => [completed, ...prev]);
    setActiveTrip(null);
    setCurrentScreen('dashboard');
  };

  const resumeTrip = () => {
    if (activeTrip) {
      setCurrentScreen('map');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        session,
        profile,
        isDemo,
        isLoading,
        pendingEmail,
        language,
        setLanguage,
        isAuthenticated,
        setIsAuthenticated,
        activeTrip,
        setActiveTrip,
        completedTrips,
        setCompletedTrips,
        currentScreen,
        setCurrentScreen,
        signInWithEmail,
        signInWithGoogle,
        signInAsGuest,
        registerUser,
        signOut,
        startNewTrip,
        cancelTrip,
        completeTrip,
        resumeTrip,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Translations
export const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome to',
    tnEpic: 'TN-Epic',
    tagline: 'The New Generation Game',
    continueGoogle: 'Continue with Google',
    continueInstagram: 'Continue with Instagram',
    playAsGuest: 'Play as Guest',
    termsAccept: 'By entering, you accept the Heritage Protocol',
    startGame: 'Start Game',
    resumeGame: 'Resume Game',
    cancelTrip: 'Cancel Trip',
    newTrip: 'Start New Trip',
    tripDuration: 'Trip Duration',
    days: 'Days',
    mustVisit: 'Must-Visit Destinations',
    dharmaBar: 'Dharma Score',
    templeTokens: 'Temple Tokens',
    goByAr: 'GO BY AR',
    levelAced: 'Level Aced!',
    tokensEarned: 'Tokens Earned',
    continue: 'Continue',
    search: 'Search destinations...',
    scanning: 'Scanning...',
    filterUnlocked: 'NEW FILTER UNLOCKED!',
    currentTrip: 'Current Trip',
    completedTrips: 'Completed Trips',
    level: 'Level',
    of: 'of',
    noActiveTrip: 'No Active Trip',
    startYourJourney: 'Start your heritage journey',
    tripHistory: 'Trip History',
    memories: 'Memories',
    viewMemories: 'View Memories',
    destinations: 'Destinations',
    tokensCollected: 'Tokens Collected',
    planYourTrip: 'Plan Your Trip',
    selectDestinations: 'Select your destinations',
    welcomeBack: 'Welcome Back',
    yourStats: 'Your Stats',
    civicKarma: 'Civic Karma',
    totalTokens: 'Total Tokens',
    tripsCompleted: 'Trips Completed',
  },
  ta: {
    welcome: 'வரவேற்கிறோம்',
    tnEpic: 'தமிழ்நாடு எபிக்',
    tagline: 'புதிய தலைமுறை விளையாட்டு',
    continueGoogle: 'Google உடன் தொடரவும்',
    continueInstagram: 'Instagram உடன் தொடரவும்',
    playAsGuest: 'விருந்தினராக விளையாடு',
    termsAccept: 'நுழைவதன் மூலம், பாரம்பரிய நெறிமுறையை ஏற்கிறீர்கள்',
    startGame: 'விளையாட்டைத் தொடங்கு',
    resumeGame: 'விளையாட்டை மீண்டும் தொடங்கு',
    cancelTrip: 'பயணத்தை ரத்து செய்',
    newTrip: 'புதிய பயணத்தைத் தொடங்கு',
    tripDuration: 'பயண காலம்',
    days: 'நாட்கள்',
    mustVisit: 'கட்டாயம் பார்க்க வேண்டிய இடங்கள்',
    dharmaBar: 'தர்ம மதிப்பெண்',
    templeTokens: 'கோவில் டோக்கன்கள்',
    goByAr: 'AR மூலம் செல்',
    levelAced: 'நிலை வெற்றி!',
    tokensEarned: 'பெற்ற டோக்கன்கள்',
    continue: 'தொடர்க',
    search: 'இடங்களைத் தேடுங்கள்...',
    scanning: 'ஸ்கேன் செய்கிறது...',
    filterUnlocked: 'புதிய வடிகட்டி திறக்கப்பட்டது!',
    currentTrip: 'தற்போதைய பயணம்',
    completedTrips: 'முடிந்த பயணங்கள்',
    level: 'நிலை',
    of: 'இல்',
    noActiveTrip: 'செயலில் பயணம் இல்லை',
    startYourJourney: 'உங்கள் பாரம்பரிய பயணத்தைத் தொடங்குங்கள்',
    tripHistory: 'பயண வரலாறு',
    memories: 'நினைவுகள்',
    viewMemories: 'நினைவுகளைப் பார்',
    destinations: 'இடங்கள்',
    tokensCollected: 'சேகரிக்கப்பட்ட டோக்கன்கள்',
    planYourTrip: 'உங்கள் பயணத்தைத் திட்டமிடுங்கள்',
    selectDestinations: 'உங்கள் இடங்களைத் தேர்வு செய்யுங்கள்',
    welcomeBack: 'மீண்டும் வரவேற்கிறோம்',
    yourStats: 'உங்கள் புள்ளிவிவரங்கள்',
    civicKarma: 'குடிமை கர்மா',
    totalTokens: 'மொத்த டோக்கன்கள்',
    tripsCompleted: 'முடிந்த பயணங்கள்',
  },
  fr: {
    welcome: 'Bienvenue à',
    tnEpic: 'TN-Epic',
    tagline: 'Le Jeu Nouvelle Génération',
    continueGoogle: 'Continuer avec Google',
    continueInstagram: 'Continuer avec Instagram',
    playAsGuest: 'Jouer en tant qu\'invité',
    termsAccept: 'En entrant, vous acceptez le Protocole Patrimoine',
    startGame: 'Commencer le Jeu',
    resumeGame: 'Reprendre le Jeu',
    cancelTrip: 'Annuler le Voyage',
    newTrip: 'Nouveau Voyage',
    tripDuration: 'Durée du Voyage',
    days: 'Jours',
    mustVisit: 'Destinations Incontournables',
    dharmaBar: 'Score Dharma',
    templeTokens: 'Jetons Temple',
    goByAr: 'ALLER EN RA',
    levelAced: 'Niveau Réussi!',
    tokensEarned: 'Jetons Gagnés',
    continue: 'Continuer',
    search: 'Rechercher des destinations...',
    scanning: 'Analyse...',
    filterUnlocked: 'NOUVEAU FILTRE DÉBLOQUÉ!',
    currentTrip: 'Voyage Actuel',
    completedTrips: 'Voyages Terminés',
    level: 'Niveau',
    of: 'de',
    noActiveTrip: 'Pas de Voyage Actif',
    startYourJourney: 'Commencez votre voyage patrimonial',
    tripHistory: 'Historique des Voyages',
    memories: 'Souvenirs',
    viewMemories: 'Voir les Souvenirs',
    destinations: 'Destinations',
    tokensCollected: 'Jetons Collectés',
    planYourTrip: 'Planifiez Votre Voyage',
    selectDestinations: 'Sélectionnez vos destinations',
    welcomeBack: 'Bon Retour',
    yourStats: 'Vos Statistiques',
    civicKarma: 'Karma Civique',
    totalTokens: 'Jetons Totaux',
    tripsCompleted: 'Voyages Terminés',
  },
  de: {
    welcome: 'Willkommen bei',
    tnEpic: 'TN-Epic',
    tagline: 'Das Spiel der neuen Generation',
    continueGoogle: 'Mit Google fortfahren',
    continueInstagram: 'Mit Instagram fortfahren',
    playAsGuest: 'Als Gast spielen',
    termsAccept: 'Durch das Betreten akzeptieren Sie das Erbe-Protokoll',
    startGame: 'Spiel Starten',
    resumeGame: 'Spiel Fortsetzen',
    cancelTrip: 'Reise Abbrechen',
    newTrip: 'Neue Reise',
    tripDuration: 'Reisedauer',
    days: 'Tage',
    mustVisit: 'Must-Visit Ziele',
    dharmaBar: 'Dharma-Punktzahl',
    templeTokens: 'Tempel-Token',
    goByAr: 'MIT AR GEHEN',
    levelAced: 'Level Geschafft!',
    tokensEarned: 'Verdiente Token',
    continue: 'Weiter',
    search: 'Ziele suchen...',
    scanning: 'Scannen...',
    filterUnlocked: 'NEUER FILTER FREIGESCHALTET!',
    currentTrip: 'Aktuelle Reise',
    completedTrips: 'Abgeschlossene Reisen',
    level: 'Level',
    of: 'von',
    noActiveTrip: 'Keine Aktive Reise',
    startYourJourney: 'Beginnen Sie Ihre Erbe-Reise',
    tripHistory: 'Reiseverlauf',
    memories: 'Erinnerungen',
    viewMemories: 'Erinnerungen Ansehen',
    destinations: 'Ziele',
    tokensCollected: 'Gesammelte Token',
    planYourTrip: 'Planen Sie Ihre Reise',
    selectDestinations: 'Wählen Sie Ihre Ziele',
    welcomeBack: 'Willkommen Zurück',
    yourStats: 'Ihre Statistiken',
    civicKarma: 'Bürger-Karma',
    totalTokens: 'Gesamt-Token',
    tripsCompleted: 'Abgeschlossene Reisen',
  },
};
