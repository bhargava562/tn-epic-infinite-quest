import React, { useState, useMemo } from 'react';
import { useApp, translations } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { MapPin, Calendar, ArrowLeft, Sparkles, Search, X } from 'lucide-react';
import { z } from 'zod';
import templeBackground from '@/assets/temple-background.jpg';

// Input validation schemas
const searchQuerySchema = z.string().max(100, 'Search query too long').trim();
const durationSchema = z.number().min(1).max(14);
const destinationsSchema = z.array(z.string()).min(1, 'Select at least one destination').max(10, 'Maximum 10 destinations allowed');

const allDestinations = [
  { id: 'madurai', name: 'Madurai', nameTa: 'மதுரை', icon: '🛕' },
  { id: 'thanjavur', name: 'Thanjavur', nameTa: 'தஞ்சாவூர்', icon: '🏛️' },
  { id: 'chennai', name: 'Chennai', nameTa: 'சென்னை', icon: '🌊' },
  { id: 'kanchipuram', name: 'Kanchipuram', nameTa: 'காஞ்சிபுரம்', icon: '👘' },
  { id: 'mahabalipuram', name: 'Mahabalipuram', nameTa: 'மகாபலிபுரம்', icon: '🗿' },
  { id: 'rameswaram', name: 'Rameswaram', nameTa: 'ராமேஸ்வரம்', icon: '🌅' },
  { id: 'pondicherry', name: 'Pondicherry', nameTa: 'புதுச்சேரி', icon: '🏖️' },
  { id: 'ooty', name: 'Ooty', nameTa: 'ஊட்டி', icon: '⛰️' },
  { id: 'tiruchirappalli', name: 'Tiruchirappalli', nameTa: 'திருச்சிராப்பள்ளி', icon: '🏰' },
  { id: 'kumbakonam', name: 'Kumbakonam', nameTa: 'கும்பகோணம்', icon: '🛕' },
  { id: 'chidambaram', name: 'Chidambaram', nameTa: 'சிதம்பரம்', icon: '💃' },
  { id: 'kodaikanal', name: 'Kodaikanal', nameTa: 'கொடைக்கானல்', icon: '🌲' },
];

// Valid destination IDs for validation
const validDestinationIds = new Set(allDestinations.map(d => d.id));

export const TripPlanningScreen: React.FC = () => {
  const { language, startNewTrip, setCurrentScreen } = useApp();
  const t = translations[language];
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [duration, setDuration] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Validated search query handler
  const handleSearchChange = (value: string) => {
    const result = searchQuerySchema.safeParse(value);
    if (result.success) {
      setSearchQuery(result.data);
      setShowDropdown(true);
    }
    // Silently ignore invalid input (too long)
  };

  // Validated duration handler
  const handleDurationChange = (value: number) => {
    const result = durationSchema.safeParse(value);
    if (result.success) {
      setDuration(result.data);
    }
  };

  const filteredDestinations = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return allDestinations.filter(
      (dest) =>
        !selectedDestinations.includes(dest.id) &&
        (dest.name.toLowerCase().includes(query) ||
          dest.nameTa.includes(query))
    );
  }, [searchQuery, selectedDestinations]);

  const selectedDestinationObjects = useMemo(() => {
    return selectedDestinations
      .map((id) => allDestinations.find((d) => d.id === id))
      .filter(Boolean);
  }, [selectedDestinations]);

  const addDestination = (id: string) => {
    // Validate destination ID exists
    if (!validDestinationIds.has(id)) return;
    
    // Validate max destinations not exceeded
    if (selectedDestinations.length >= 10) return;
    
    if (!selectedDestinations.includes(id)) {
      setSelectedDestinations((prev) => [...prev, id]);
    }
    setSearchQuery('');
    setShowDropdown(false);
  };

  const removeDestination = (id: string) => {
    setSelectedDestinations((prev) => prev.filter((d) => d !== id));
  };

  const handleStartGame = () => {
    // Validate all inputs before starting
    const destinationsResult = destinationsSchema.safeParse(selectedDestinations);
    const durationResult = durationSchema.safeParse(duration);
    
    if (destinationsResult.success && durationResult.success) {
      startNewTrip(durationResult.data, destinationsResult.data);
    }
  };

  const canStart = selectedDestinations.length > 0 && selectedDestinations.length <= 10;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={templeBackground}
          alt="Temple"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col safe-top safe-bottom safe-x">
        {/* Header */}
        <div className="p-4 flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('lobby')}
            className="glass-panel p-2 rounded-full hover:bg-gold/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-display font-bold text-foreground">
              {t.planYourTrip}
            </h1>
            <p className="text-sm text-muted-foreground">{t.selectDestinations}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 overflow-y-auto pb-32">
          {/* Duration Section */}
          <div className="glass-panel p-5 mb-4 animate-slide-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <Calendar className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <span className="text-foreground font-display font-medium">{t.tripDuration}</span>
              </div>
              <div className="glass-panel-light px-4 py-2 rounded-full">
                <span className="text-gold font-bold text-lg">{duration} {t.days}</span>
              </div>
            </div>
            <Slider
              value={[duration]}
              onValueChange={([value]) => handleDurationChange(value)}
              min={1}
              max={14}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>1 {t.days}</span>
              <span>14 {t.days}</span>
            </div>
          </div>

          {/* Search Destinations Section */}
          <div className="glass-panel p-5 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <MapPin className="w-5 h-5 text-accent-foreground" />
              </div>
              <div className="flex-1">
                <span className="text-foreground font-display font-medium">{t.mustVisit}</span>
                <p className="text-xs text-muted-foreground">
                  {selectedDestinations.length}/10 selected
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowDropdown(true)}
                maxLength={100}
                className="pl-11 h-12 glass-panel-light border-gold/20 text-foreground placeholder:text-muted-foreground/60"
              />
              
              {/* Search Dropdown */}
              {showDropdown && filteredDestinations.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-2xl overflow-hidden z-20 max-h-48 overflow-y-auto">
                  {filteredDestinations.map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => addDestination(dest.id)}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gold/10 transition-colors text-left"
                    >
                      <span className="text-xl">{dest.icon}</span>
                      <span className="text-foreground font-medium">
                        {language === 'ta' ? dest.nameTa : dest.name}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Destinations List */}
            {selectedDestinationObjects.length > 0 ? (
              <div className="space-y-2">
                {selectedDestinationObjects.map((dest, index) => (
                  <div
                    key={dest!.id}
                    className="flex items-center gap-3 p-3 glass-panel-light rounded-xl animate-scale-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center text-sm font-bold text-accent-foreground">
                      {index + 1}
                    </div>
                    <span className="text-xl">{dest!.icon}</span>
                    <span className="flex-1 text-foreground font-medium">
                      {language === 'ta' ? dest!.nameTa : dest!.name}
                    </span>
                    <button
                      onClick={() => removeDestination(dest!.id)}
                      className="p-2 hover:bg-destructive/20 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Search and add destinations to your trip</p>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Bottom Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-background via-background to-transparent">
          <div className="max-w-md mx-auto">
            <Button
              variant="game"
              size="xl"
              className={`w-full h-16 text-xl transition-all duration-300 ${
                !canStart ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleStartGame}
              disabled={!canStart}
            >
              <Sparkles className="w-6 h-6 mr-2" />
              {t.startGame}
            </Button>
            {!canStart && (
              <p className="text-center text-sm text-muted-foreground mt-2">
                Select at least one destination
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};