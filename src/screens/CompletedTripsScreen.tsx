import React, { useState } from 'react';
import { useApp, translations } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Trophy, Coins, MapPin, Calendar, Image, ChevronRight, X } from 'lucide-react';

export const CompletedTripsScreen: React.FC = () => {
  const { language, completedTrips, setCurrentScreen, setCompletedTrips } = useApp();
  const t = translations[language];
  const [selectedTrip, setSelectedTrip] = useState<string | null>(null);

  const selectedTripData = completedTrips.find(trip => trip.id === selectedTrip);

  // Demo data for empty state
  const demoTrips = completedTrips.length > 0 ? completedTrips : [
    {
      id: 'demo1',
      duration: 5,
      destinations: ['Madurai', 'Thanjavur'],
      currentLevel: 10,
      totalLevels: 10,
      startDate: new Date('2024-12-01'),
      endDate: new Date('2024-12-05'),
      isCompleted: true,
      tokensEarned: 450,
      memories: [
        { id: 'm1', image: '/placeholder.svg', location: 'Meenakshi Temple', timestamp: new Date() },
        { id: 'm2', image: '/placeholder.svg', location: 'Brihadeeswara Temple', timestamp: new Date() },
      ],
    },
    {
      id: 'demo2',
      duration: 3,
      destinations: ['Chennai', 'Mahabalipuram'],
      currentLevel: 6,
      totalLevels: 6,
      startDate: new Date('2024-11-15'),
      endDate: new Date('2024-11-17'),
      isCompleted: true,
      tokensEarned: 280,
      memories: [
        { id: 'm3', image: '/placeholder.svg', location: 'Marina Beach', timestamp: new Date() },
      ],
    },
  ];

  const displayTrips = completedTrips.length > 0 ? completedTrips : demoTrips;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_hsl(var(--gold))_1px,_transparent_0)]" style={{ backgroundSize: '40px 40px' }} />
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
          <div className="flex-1">
            <h1 className="text-xl font-display font-bold text-foreground">
              {t.tripHistory}
            </h1>
            <p className="text-sm text-muted-foreground">
              {displayTrips.length} {t.completedTrips.toLowerCase()}
            </p>
          </div>
          <div className="glass-panel p-2 rounded-full">
            <Trophy className="w-5 h-5 text-gold" />
          </div>
        </div>

        {/* Stats Summary */}
        <div className="px-4 mb-4">
          <div className="glass-panel p-4 grid grid-cols-3 gap-4 animate-slide-up">
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-gold">
                {displayTrips.length}
              </div>
              <div className="text-xs text-muted-foreground">Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-gold">
                {displayTrips.reduce((acc, trip) => acc + trip.tokensEarned, 0)}
              </div>
              <div className="text-xs text-muted-foreground">Tokens</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-gold">
                {displayTrips.reduce((acc, trip) => acc + trip.memories.length, 0)}
              </div>
              <div className="text-xs text-muted-foreground">{t.memories}</div>
            </div>
          </div>
        </div>

        {/* Trips List */}
        <div className="flex-1 px-4 overflow-y-auto pb-6">
          <div className="space-y-3">
            {displayTrips.map((trip, index) => (
              <button
                key={trip.id}
                onClick={() => setSelectedTrip(trip.id)}
                className="w-full glass-panel p-4 animate-slide-up hover:bg-gold/5 transition-all duration-300 hover:scale-[1.01]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Trip Title */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-display font-bold text-foreground">
                          {trip.destinations.slice(0, 2).join(' → ')}
                          {trip.destinations.length > 2 && ` +${trip.destinations.length - 2}`}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : 'Completed'}
                          </span>
                          <span>•</span>
                          <span>{trip.duration} {t.days}</span>
                        </div>
                      </div>
                    </div>

                    {/* Trip Stats */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-1 glass-panel-light px-2 py-1 rounded-full">
                        <Coins className="w-3 h-3 text-gold" />
                        <span className="text-xs text-gold font-bold">{trip.tokensEarned}</span>
                      </div>
                      <div className="flex items-center gap-1 glass-panel-light px-2 py-1 rounded-full">
                        <Image className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-foreground">{trip.memories.length} {t.memories}</span>
                      </div>
                      <div className="flex items-center gap-1 glass-panel-light px-2 py-1 rounded-full">
                        <Trophy className="w-3 h-3 text-gold" />
                        <span className="text-xs text-foreground">{trip.totalLevels} Levels</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="w-5 h-5 text-muted-foreground ml-2" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Trip Detail Modal */}
        {selectedTripData && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center animate-fade-in">
            <div className="w-full max-w-md bg-background border-t border-gold/20 rounded-t-3xl p-6 animate-slide-up max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-foreground">Trip Details</h2>
                <button
                  onClick={() => setSelectedTrip(null)}
                  className="glass-panel p-2 rounded-full"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>

              {/* Trip Info */}
              <div className="glass-panel p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-gold flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-foreground">
                      {selectedTripData.destinations.join(' → ')}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedTripData.duration} {t.days} • {selectedTripData.totalLevels} Levels
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="glass-panel-light p-3 rounded-xl text-center">
                    <div className="text-xl font-display font-bold text-gold">
                      {selectedTripData.tokensEarned}
                    </div>
                    <div className="text-xs text-muted-foreground">{t.tokensCollected}</div>
                  </div>
                  <div className="glass-panel-light p-3 rounded-xl text-center">
                    <div className="text-xl font-display font-bold text-gold">
                      {selectedTripData.memories.length}
                    </div>
                    <div className="text-xs text-muted-foreground">{t.memories}</div>
                  </div>
                </div>
              </div>

              {/* Memories Grid */}
              <div className="mb-4">
                <h4 className="font-display font-medium text-foreground mb-3">{t.memories}</h4>
                {selectedTripData.memories.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {selectedTripData.memories.map((memory) => (
                      <div
                        key={memory.id}
                        className="aspect-square rounded-xl glass-panel-light overflow-hidden relative group"
                      >
                        <img
                          src={memory.image}
                          alt={memory.location}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <span className="text-[10px] text-foreground">{memory.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel-light p-6 text-center rounded-xl">
                    <Image className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No memories captured</p>
                  </div>
                )}
              </div>

              {/* Destinations */}
              <div>
                <h4 className="font-display font-medium text-foreground mb-3">{t.destinations}</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTripData.destinations.map((dest) => (
                    <span
                      key={dest}
                      className="px-3 py-1 rounded-full glass-panel-light text-sm text-foreground"
                    >
                      {dest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
