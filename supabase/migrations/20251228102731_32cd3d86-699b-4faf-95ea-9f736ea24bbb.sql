-- =====================================================
-- TN-EPIC: Enterprise-Grade Database Schema
-- =====================================================

-- 1. CREATE ENUMS
-- =====================================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.trip_status AS ENUM ('planning', 'active', 'paused', 'completed', 'cancelled');
CREATE TYPE public.destination_category AS ENUM ('temple', 'monument', 'nature', 'beach', 'city', 'village', 'museum', 'food');
CREATE TYPE public.memory_type AS ENUM ('photo', 'video', 'audio', 'note');
CREATE TYPE public.achievement_type AS ENUM ('explorer', 'photographer', 'pilgrim', 'foodie', 'historian', 'eco_warrior', 'social');
CREATE TYPE public.save_point_type AS ENUM ('shop', 'restaurant', 'temple', 'attraction', 'rest_area');

-- 2. CREATE PROFILES TABLE
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  level INTEGER DEFAULT 1,
  tokens INTEGER DEFAULT 0,
  dharma_score INTEGER DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  total_memories INTEGER DEFAULT 0,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE USER ROLES TABLE (Security Best Practice)
-- =====================================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- 4. CREATE DESTINATIONS TABLE
-- =====================================================
CREATE TABLE public.destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_tamil TEXT,
  description TEXT,
  description_tamil TEXT,
  category destination_category NOT NULL DEFAULT 'monument',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  icon_name TEXT DEFAULT 'MapPin',
  is_featured BOOLEAN DEFAULT FALSE,
  avg_visit_duration INTEGER DEFAULT 60, -- in minutes
  entry_fee DECIMAL(10, 2) DEFAULT 0,
  opening_hours TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE TRIPS TABLE
-- =====================================================
CREATE TABLE public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT,
  duration INTEGER NOT NULL DEFAULT 1, -- in days
  status trip_status DEFAULT 'planning',
  current_level INTEGER DEFAULT 1,
  total_levels INTEGER DEFAULT 1,
  tokens_earned INTEGER DEFAULT 0,
  dharma_earned INTEGER DEFAULT 0,
  start_date DATE,
  end_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CREATE TRIP DESTINATIONS (Many-to-Many)
-- =====================================================
CREATE TABLE public.trip_destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  visited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (trip_id, destination_id)
);

-- 7. CREATE MEMORIES TABLE
-- =====================================================
CREATE TABLE public.memories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  memory_type memory_type DEFAULT 'photo',
  title TEXT,
  description TEXT,
  file_url TEXT,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT FALSE,
  tokens_earned INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. CREATE SAVE POINTS TABLE (MSME Partners)
-- =====================================================
CREATE TABLE public.save_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  name_tamil TEXT,
  description TEXT,
  save_point_type save_point_type DEFAULT 'shop',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  bid_amount DECIMAL(10, 2) DEFAULT 0,
  tokens_reward INTEGER DEFAULT 10,
  is_active BOOLEAN DEFAULT TRUE,
  contact_phone TEXT,
  contact_email TEXT,
  opening_hours TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CREATE SAVE POINT VISITS TABLE
-- =====================================================
CREATE TABLE public.save_point_visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  save_point_id UUID REFERENCES public.save_points(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  tokens_earned INTEGER DEFAULT 0,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, save_point_id, trip_id)
);

-- 10. CREATE ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_tamil TEXT,
  description TEXT,
  description_tamil TEXT,
  achievement_type achievement_type NOT NULL,
  icon_name TEXT DEFAULT 'Trophy',
  tokens_reward INTEGER DEFAULT 50,
  requirement_count INTEGER DEFAULT 1, -- e.g., visit 5 temples
  requirement_type TEXT, -- e.g., 'temple_visits', 'photos_taken'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CREATE USER ACHIEVEMENTS TABLE
-- =====================================================
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, achievement_id)
);

-- 12. CREATE FILTERS TABLE (AR Filters/Effects)
-- =====================================================
CREATE TABLE public.filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_tamil TEXT,
  description TEXT,
  preview_url TEXT,
  filter_url TEXT,
  unlock_requirement TEXT, -- e.g., 'scan_brihadeshwara'
  destination_id UUID REFERENCES public.destinations(id) ON DELETE SET NULL,
  tokens_cost INTEGER DEFAULT 0,
  is_premium BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. CREATE USER FILTERS TABLE (Unlocked Filters)
-- =====================================================
CREATE TABLE public.user_filters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  filter_id UUID REFERENCES public.filters(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, filter_id)
);

-- 14. CREATE DHARMA ACTIVITIES TABLE (Civic Actions)
-- =====================================================
CREATE TABLE public.dharma_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  trip_id UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL, -- e.g., 'trash_disposal', 'heritage_photo', 'local_purchase'
  description TEXT,
  points_earned INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_level ON public.profiles(level);
CREATE INDEX idx_profiles_dharma_score ON public.profiles(dharma_score DESC);

CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_role ON public.user_roles(role);

CREATE INDEX idx_destinations_category ON public.destinations(category);
CREATE INDEX idx_destinations_featured ON public.destinations(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_destinations_location ON public.destinations(latitude, longitude);

CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_trips_user_status ON public.trips(user_id, status);
CREATE INDEX idx_trips_created_at ON public.trips(created_at DESC);

CREATE INDEX idx_trip_destinations_trip_id ON public.trip_destinations(trip_id);
CREATE INDEX idx_trip_destinations_destination_id ON public.trip_destinations(destination_id);

CREATE INDEX idx_memories_user_id ON public.memories(user_id);
CREATE INDEX idx_memories_trip_id ON public.memories(trip_id);
CREATE INDEX idx_memories_created_at ON public.memories(created_at DESC);

CREATE INDEX idx_save_points_destination_id ON public.save_points(destination_id);
CREATE INDEX idx_save_points_type ON public.save_points(save_point_type);
CREATE INDEX idx_save_points_active ON public.save_points(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_save_points_location ON public.save_points(latitude, longitude);

CREATE INDEX idx_save_point_visits_user_id ON public.save_point_visits(user_id);
CREATE INDEX idx_save_point_visits_save_point_id ON public.save_point_visits(save_point_id);

CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX idx_user_achievements_completed ON public.user_achievements(is_completed) WHERE is_completed = TRUE;

CREATE INDEX idx_dharma_activities_user_id ON public.dharma_activities(user_id);
CREATE INDEX idx_dharma_activities_trip_id ON public.dharma_activities(trip_id);
CREATE INDEX idx_dharma_activities_created_at ON public.dharma_activities(created_at DESC);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.save_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.save_point_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_filters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dharma_activities ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECURITY DEFINER FUNCTION FOR ROLE CHECKS
-- =====================================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- Profiles Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (TRUE);

-- User Roles Policies
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Destinations Policies (Public Read)
CREATE POLICY "Destinations are viewable by everyone"
  ON public.destinations FOR SELECT
  TO authenticated
  USING (TRUE);

CREATE POLICY "Admins can manage destinations"
  ON public.destinations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Trips Policies
CREATE POLICY "Users can view their own trips"
  ON public.trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own trips"
  ON public.trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own trips"
  ON public.trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own trips"
  ON public.trips FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Trip Destinations Policies
CREATE POLICY "Users can view their trip destinations"
  ON public.trip_destinations FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = trip_destinations.trip_id 
    AND trips.user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their trip destinations"
  ON public.trip_destinations FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE trips.id = trip_destinations.trip_id 
    AND trips.user_id = auth.uid()
  ));

-- Memories Policies
CREATE POLICY "Users can view their own memories"
  ON public.memories FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view public memories"
  ON public.memories FOR SELECT
  TO authenticated
  USING (is_public = TRUE);

CREATE POLICY "Users can create their own memories"
  ON public.memories FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own memories"
  ON public.memories FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own memories"
  ON public.memories FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Save Points Policies (Public Read)
CREATE POLICY "Save points are viewable by everyone"
  ON public.save_points FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage save points"
  ON public.save_points FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Save Point Visits Policies
CREATE POLICY "Users can view their own visits"
  ON public.save_point_visits FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can record their visits"
  ON public.save_point_visits FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Achievements Policies (Public Read)
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User Achievements Policies
CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own achievements"
  ON public.user_achievements FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Filters Policies (Public Read)
CREATE POLICY "Filters are viewable by everyone"
  ON public.filters FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

CREATE POLICY "Admins can manage filters"
  ON public.filters FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- User Filters Policies
CREATE POLICY "Users can view their unlocked filters"
  ON public.user_filters FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock filters"
  ON public.user_filters FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Dharma Activities Policies
CREATE POLICY "Users can view their own dharma activities"
  ON public.dharma_activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own dharma activities"
  ON public.dharma_activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- =====================================================
-- AUTO-UPDATE TIMESTAMPS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_save_points_updated_at
  BEFORE UPDATE ON public.save_points
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'full_name', split_part(NEW.email, '@', 1))
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- FUNCTION TO UPDATE USER STATS
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_user_stats_on_trip_complete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE public.profiles
    SET 
      tokens = tokens + NEW.tokens_earned,
      dharma_score = dharma_score + NEW.dharma_earned,
      total_trips = total_trips + 1,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_trip_completed
  AFTER UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.update_user_stats_on_trip_complete();

-- =====================================================
-- FUNCTION TO COUNT MEMORIES
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_memory_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET total_memories = total_memories + 1
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles
    SET total_memories = total_memories - 1
    WHERE id = OLD.user_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

CREATE TRIGGER on_memory_change
  AFTER INSERT OR DELETE ON public.memories
  FOR EACH ROW EXECUTE FUNCTION public.update_memory_count();