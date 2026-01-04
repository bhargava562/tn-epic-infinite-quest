import React from 'react';
import { Globe } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
] as const;

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useApp();

  const currentLang = languages.find((l) => l.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="glass" size="icon" className="rounded-full">
          <Globe className="h-5 w-5 text-gold" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass-panel border-gold/20 min-w-[150px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`cursor-pointer flex items-center gap-2 ${
              language === lang.code ? 'text-gold' : 'text-foreground'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="font-body">{lang.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
