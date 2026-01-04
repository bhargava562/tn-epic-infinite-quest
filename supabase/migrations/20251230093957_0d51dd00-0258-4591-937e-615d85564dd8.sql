-- Fix 1: Create storage buckets with proper RLS policies for memories
INSERT INTO storage.buckets (id, name, public) 
VALUES ('memories', 'memories', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for public destination images (admin managed)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('destinations', 'destinations', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for save point images (admin managed)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('save-points', 'save-points', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for memories bucket (private user content)
CREATE POLICY "Users can view their own memories"
ON storage.objects FOR SELECT
USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own memories"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own memories"
ON storage.objects FOR UPDATE
USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own memories"
ON storage.objects FOR DELETE
USING (bucket_id = 'memories' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Public read access for destination images
CREATE POLICY "Anyone can view destination images"
ON storage.objects FOR SELECT
USING (bucket_id = 'destinations');

-- Only admins can manage destination images
CREATE POLICY "Admins can manage destination images"
ON storage.objects FOR ALL
USING (bucket_id = 'destinations' AND public.has_role(auth.uid(), 'admin'));

-- Public read access for save point images
CREATE POLICY "Anyone can view save point images"
ON storage.objects FOR SELECT
USING (bucket_id = 'save-points');

-- Only admins can manage save point images
CREATE POLICY "Admins can manage save point images"
ON storage.objects FOR ALL
USING (bucket_id = 'save-points' AND public.has_role(auth.uid(), 'admin'));

-- Fix 2: Update user_roles policies to require authenticated (non-anonymous) users
-- Drop and recreate policies to ensure they require proper authentication
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate with explicit authenticated role requirement and check for non-anonymous
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') 
  AND (auth.jwt() ->> 'is_anonymous')::boolean IS NOT TRUE
);