import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

type Language = 'en' | 'ta' | 'fr' | 'de';
type ScreenType = 'onboarding' | 'auth' | 'register' | 'dashboard' | 'lobby' | 'tripPlanning' | 'map' | 'ar' | 'completedTrips';

type Profile = Database['public']['Tables']['profiles']['Row'];
type DbTrip = Database['public']['Tables']['trips']['Row'];

// Demo user Bhargava data
const BHARGAVA_EMAIL = 'bhargava@tnepic.com';
const BHARGAVA_PASSWORD = 'bhargava';

const DEMO_PROFILE: Profile = {
  id: 'demo-bhargava-001',
  display_name: 'Bhargava',
  email: BHARGAVA_EMAIL,
  avatar_url: '/avatar-explorer.png',
  level: 5,
  tokens: 1250,
  dharma_score: 340,
  total_trips: 4,
  total_memories: 12,
  preferred_language: 'en',
  created_at: '2025-12-01T00:00:00Z',
  updated_at: '2025-12-28T00:00:00Z',
};

const DEMO_ACTIVE_TRIP: DbTrip = {
  id: 'demo-trip-001',
  user_id: 'demo-bhargava-001',
  title: 'Thanjavur Heritage Journey',
  duration: 3,
  status: 'active',
  current_level: 2,
  total_levels: 6,
  start_date: '2025-12-26',
  end_date: null,
  completed_at: null,
  tokens_earned: 45,
  dharma_earned: 25,
  created_at: '2025-12-26T08:00:00Z',
  updated_at: '2025-12-28T00:00:00Z',
};

const DEMO_COMPLETED_TRIPS: DbTrip[] = [
  {
    id: 'demo-trip-002',
    user_id: 'demo-bhargava-001',
    title: 'Madurai Temple Trail',
    duration: 2,
    status: 'completed',
    current_level: 4,
    total_levels: 4,
    start_date: '2025-12-20',
    end_date: '2025-12-21',
    completed_at: '2025-12-21T18:30:00Z',
    tokens_earned: 180,
    dharma_earned: 95,
    created_at: '2025-12-20T08:00:00Z',
    updated_at: '2025-12-21T18:30:00Z',
  },
  {
    id: 'demo-trip-003',
    user_id: 'demo-bhargava-001',
    title: 'Mahabalipuram Discovery',
    duration: 1,
    status: 'completed',
    current_level: 2,
    total_levels: 2,
    start_date: '2025-12-15',
    end_date: '2025-12-15',
    completed_at: '2025-12-15T16:00:00Z',
    tokens_earned: 120,
    dharma_earned: 60,
    created_at: '2025-12-15T08:00:00Z',
    updated_at: '2025-12-15T16:00:00Z',
  },
  {
    id: 'demo-trip-004',
    user_id: 'demo-bhargava-001',
    title: 'Kanyakumari Coastal Quest',
    duration: 2,
    status: 'completed',
    current_level: 3,
    total_levels: 3,
    start_date: '2025-12-10',
    end_date: '2025-12-11',
    completed_at: '2025-12-11T17:00:00Z',
    tokens_earned: 150,
    dharma_earned: 80,
    created_at: '2025-12-10T08:00:00Z',
    updated_at: '2025-12-11T17:00:00Z',
  },
];

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

interface RegisterData {
  email: string;
  password: string;
  displayName: string;
  bio?: string;
  avatarIndex: number;
}

interface AppContextType {
  // Auth state
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isDemo: boolean;
  isLoading: boolean;
  pendingEmail: string;
  
  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  
  // Legacy auth state
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  
  // Trips
  activeTrip: Trip | null;
  setActiveTrip: (trip: Trip | null) => void;
  completedTrips: Trip[];
  setCompletedTrips: (trips: Trip[]) => void;
  
  // Navigation
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  
  // Actions
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

// Convert DB trip to local Trip format with demo memories
const dbTripToTrip = (dbTrip: DbTrip, includeMemories: boolean = false): Trip => {
  const demoMemories: Memory[] = includeMemories ? [
    { id: '1', image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=200', location: 'Temple Entrance', timestamp: new Date() },
    { id: '2', image: 'https://images.unsplash.com/photo-1590077428593-a55bb07c4665?w=200', location: 'Inner Sanctum', timestamp: new Date() },
    { id: '3', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=200', location: 'Garden View', timestamp: new Date() },
  ] : [];

  return {
    id: dbTrip.id,
    title: dbTrip.title || 'Untitled Trip',
    duration: dbTrip.duration,
    destinations: ['Thanjavur', 'Brihadeeswara Temple', 'Art Gallery'],
    currentLevel: dbTrip.current_level || 1,
    totalLevels: dbTrip.total_levels || 1,
    startDate: new Date(dbTrip.start_date || dbTrip.created_at || new Date()),
    endDate: dbTrip.end_date ? new Date(dbTrip.end_date) : undefined,
    isCompleted: dbTrip.status === 'completed',
    tokensEarned: dbTrip.tokens_earned || 0,
    dharmaEarned: dbTrip.dharma_earned || 0,
    memories: demoMemories,
  };
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('onboarding');
  
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingEmail, setPendingEmail] = useState('');
  
  // Trip state
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);
  const [completedTrips, setCompletedTrips] = useState<Trip[]>([]);

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string): Promise<{ needsRegistration?: boolean; error?: string }> => {
    // Check for demo user Bhargava
    if ((email.toLowerCase() === 'bhargava' || email.toLowerCase() === BHARGAVA_EMAIL) && password === BHARGAVA_PASSWORD) {
      setIsDemo(true);
      setProfile(DEMO_PROFILE);
      setActiveTrip(dbTripToTrip(DEMO_ACTIVE_TRIP));
      setCompletedTrips(DEMO_COMPLETED_TRIPS.map(t => dbTripToTrip(t, true)));
      setIsAuthenticated(true);
      setCurrentScreen('dashboard');
      return { needsRegistration: false };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setPendingEmail(email);
          return { needsRegistration: true };
        }
        return { error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        
        // Fetch profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        
        if (profileData) {
          setProfile(profileData);
        }
        
        setIsDemo(false);
        setIsAuthenticated(true);
        setCurrentScreen('dashboard');
      }

      return {};
    } catch (err) {
      return { error: 'Login failed. Please try again.' };
    }
  };

  // Sign in with Google (redirects to auth for now)
  const signInWithGoogle = async () => {
    setCurrentScreen('auth');
  };

  // Sign in as Guest
  const signInAsGuest = async () => {
    try {
      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        const guestProfile: Profile = {
          id: `guest-${Date.now()}`,
          display_name: `Guest_${Math.floor(Math.random() * 10000)}`,
          email: null,
          avatar_url: null,
          level: 1,
          tokens: 0,
          dharma_score: 0,
          total_trips: 0,
          total_memories: 0,
          preferred_language: 'en',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setProfile(guestProfile);
        setIsDemo(false);
        setIsAuthenticated(true);
        setActiveTrip(null);
        setCompletedTrips([]);
        setCurrentScreen('dashboard');
        return;
      }

      if (data.user) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle();
        
        setUser(data.user);
        setSession(data.session);
        setProfile(profileData);
        setIsDemo(false);
        setIsAuthenticated(true);
        setActiveTrip(null);
        setCompletedTrips([]);
        setCurrentScreen('dashboard');
      }
    } catch (err) {
      console.warn('Guest sign in encountered an issue');
    }
  };

  // Register new user
  const registerUser = async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: data.displayName,
          }
        }
      });

      if (authError) {
        if (authError.message.includes('already registered')) {
          return { success: false, error: 'This email is already registered. Please sign in.' };
        }
        return { success: false, error: authError.message };
      }

      if (authData.user) {
        // Wait for profile trigger
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Update profile with additional data
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            display_name: data.displayName,
            avatar_url: `/avatar-${data.avatarIndex}.png`,
          })
          .eq('id', authData.user.id);

        // Fetch updated profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .maybeSingle();

        setUser(authData.user);
        setSession(authData.session);
        setProfile(profileData || {
          id: authData.user.id,
          display_name: data.displayName,
          email: data.email,
          avatar_url: `/avatar-${data.avatarIndex}.png`,
          level: 1,
          tokens: 0,
          dharma_score: 0,
          total_trips: 0,
          total_memories: 0,
          preferred_language: 'en',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setIsDemo(false);
        setIsAuthenticated(true);
        setPendingEmail('');
        setCurrentScreen('dashboard');

        return { success: true };
      }

      return { success: false, error: 'Registration failed' };
    } catch (err) {
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsDemo(false);
    setIsAuthenticated(false);
    setActiveTrip(null);
    setCompletedTrips([]);
    setPendingEmail('');
    setCurrentScreen('onboarding');
  };

  const startNewTrip = (duration: number, destinations: string[]) => {
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
  };

  const cancelTrip = () => {
    setActiveTrip(null);
    setCurrentScreen('tripPlanning');
  };

  const completeTrip = () => {
    if (activeTrip) {
      const completed: Trip = {
        ...activeTrip,
        isCompleted: true,
        endDate: new Date(),
      };
      setCompletedTrips((prev) => [completed, ...prev]);
      setActiveTrip(null);
      setCurrentScreen('dashboard');
    }
  };

  const resumeTrip = () => {
    if (activeTrip) {
      setCurrentScreen('map');
    }
  };

  // Initialize auth state
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && !isDemo) {
          setTimeout(() => {
            supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle()
              .then(({ data }) => {
                if (data) {
                  setProfile(data);
                  setIsAuthenticated(true);
                  if (currentScreen === 'onboarding' || currentScreen === 'auth' || currentScreen === 'register') {
                    setCurrentScreen('dashboard');
                  }
                }
              });
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [isDemo]);

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
    civicKarma: 'Bürger Karma',
    totalTokens: 'Gesamt Token',
    tripsCompleted: 'Reisen Abgeschlossen',
  },
};
