import React from 'react';
import { X, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';

interface MemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Demo memories for Bhargava
const demoMemories = [
  { 
    id: 1, 
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&h=400&fit=crop',
    location: 'Meenakshi Temple',
    date: '2025-12-21',
    side: 'left'
  },
  { 
    id: 2, 
    image: 'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400&h=400&fit=crop',
    location: 'Madurai Palace',
    date: '2025-12-21',
    side: 'right'
  },
  { 
    id: 3, 
    image: 'https://images.unsplash.com/photo-1600100397608-e1d89195b46f?w=400&h=400&fit=crop',
    location: 'Shore Temple',
    date: '2025-12-15',
    side: 'left'
  },
  { 
    id: 4, 
    image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?w=400&h=400&fit=crop',
    location: 'Arjuna\'s Penance',
    date: '2025-12-15',
    side: 'right'
  },
  { 
    id: 5, 
    image: 'https://images.unsplash.com/photo-1609766857326-18a204cc10d1?w=400&h=400&fit=crop',
    location: 'Thanjavur Temple',
    date: '2025-12-26',
    side: 'left'
  },
];

export const MemoryModal: React.FC<MemoryModalProps> = ({ isOpen, onClose }) => {
  const { isDemo } = useApp();

  if (!isOpen) return null;

  const memories = isDemo ? demoMemories : [];

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border/50 flex-shrink-0">
        <button 
          onClick={onClose} 
          className="p-2 glass-panel rounded-full hover:bg-gold/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
            <LinkIcon className="w-4 h-4 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-base font-display font-bold text-foreground leading-tight">Memory Line</h1>
            <p className="text-[10px] text-muted-foreground">{memories.length} moments</p>
          </div>
        </div>
        
        <button 
          onClick={onClose} 
          className="p-2 glass-panel rounded-full hover:bg-gold/10 transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Memory Timeline - Full Screen Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {memories.length > 0 ? (
          <div className="relative">
            {/* Central vertical line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gold via-gold/50 to-transparent -translate-x-1/2" />
            
            {/* Memory nodes */}
            <div className="relative space-y-8">
              {memories.map((memory, index) => (
                <div 
                  key={memory.id} 
                  className={`flex items-center gap-2 animate-fade-in ${
                    memory.side === 'left' ? 'flex-row' : 'flex-row-reverse'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Photo */}
                  <div className={`w-[44%] ${memory.side === 'left' ? 'text-right pr-1' : 'text-left pl-1'}`}>
                    <div className="inline-block">
                      <div className="relative group">
                        <img 
                          src={memory.image} 
                          alt={memory.location}
                          className="w-24 h-24 object-cover rounded-2xl border-2 border-gold/30 shadow-lg"
                        />
                      </div>
                      <p className="text-xs text-foreground font-medium mt-1.5 truncate max-w-[96px]">{memory.location}</p>
                      <p className="text-[10px] text-muted-foreground">{memory.date}</p>
                    </div>
                  </div>

                  {/* Center node */}
                  <div className="w-[12%] flex justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-gradient-gold border-2 border-background shadow-gold" />
                  </div>

                  {/* Empty space on other side */}
                  <div className="w-[44%]" />
                </div>
              ))}
            </div>

            {/* Empty frames at bottom */}
            <div className="mt-8 space-y-8">
              {[1, 2, 3].map((i) => (
                <div 
                  key={`empty-${i}`}
                  className={`flex items-center gap-2 opacity-40 ${
                    i % 2 === 0 ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`w-[44%] ${i % 2 === 0 ? 'text-left pl-1' : 'text-right pr-1'}`}>
                    <div className="inline-block">
                      <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-muted flex items-center justify-center">
                        <span className="text-muted-foreground text-2xl">?</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-1.5">Future Memory</p>
                    </div>
                  </div>
                  <div className="w-[12%] flex justify-center">
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-dashed border-muted" />
                  </div>
                  <div className="w-[44%]" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="w-20 h-20 rounded-full glass-panel flex items-center justify-center mb-4">
              <LinkIcon className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-display font-semibold text-lg text-foreground mb-2">No Memories Yet</h3>
            <p className="text-sm text-muted-foreground">
              Start a trip to capture your heritage journey
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
