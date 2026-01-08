import React, { useState } from 'react';
import { useApp, translations } from '@/contexts/AppContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, Mail, Lock, ArrowLeft, Check } from 'lucide-react';

const AVATARS = [
  { id: 'explorer', src: '/avatar-explorer.png', name: 'Explorer' },
  { id: 'pilgrim', src: '/avatar-pilgrim.png', name: 'Pilgrim' },
  { id: 'historian', src: '/avatar-historian.png', name: 'Historian' },
  { id: 'artist', src: '/avatar-artist.png', name: 'Artist' },
];

// Use a default avatar color since images might not exist
const DEFAULT_AVATAR_COLORS = [
  'bg-gold',
  'bg-royal',
  'bg-emerald-500',
  'bg-purple-500',
];

export const RegisterScreen: React.FC = () => {
  const { language, registerUser, setCurrentScreen, pendingEmail } = useApp();
  const t = translations[language];

  const [name, setName] = useState('');
  const [email, setEmail] = useState(pendingEmail || '');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const result = await registerUser({
        email,
        password,
        displayName: name,
        bio,
        avatarIndex: selectedAvatar,
      });

      if (result.success) {
        toast.success('Account created successfully!');
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-royal/20 via-background to-background" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col safe-top safe-bottom safe-x">
        {/* Back Button */}
        <div className="p-4">
          <button
            onClick={() => setCurrentScreen('auth')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Login</span>
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col px-6 pb-8 overflow-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-display font-bold text-foreground">
              Create Account
            </h2>
            <p className="text-muted-foreground mt-2">
              Join the heritage adventure
            </p>
          </div>

          {/* Avatar Selection */}
          <div className="mb-6">
            <Label className="text-muted-foreground mb-3 block">Choose Avatar</Label>
            <div className="flex justify-center gap-4">
              {DEFAULT_AVATAR_COLORS.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(index)}
                  className={`relative w-16 h-16 rounded-full ${color} flex items-center justify-center transition-all ${
                    selectedAvatar === index
                      ? 'ring-4 ring-gold scale-110'
                      : 'hover:scale-105 opacity-70'
                  }`}
                >
                  <User className="w-8 h-8 text-white" />
                  {selectedAvatar === index && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gold rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-accent-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-muted-foreground">Display Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Your display name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 h-12 bg-card border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-email" className="text-muted-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={!!pendingEmail}
                  className="pl-10 h-12 bg-card border-border disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reg-password" className="text-muted-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Min. 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 bg-card border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-muted-foreground">Bio (Optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="bg-card border-border resize-none"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              variant="game"
              size="lg"
              className="w-full mt-6"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentScreen('auth')}
              className="text-gold hover:text-gold-light font-semibold"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
