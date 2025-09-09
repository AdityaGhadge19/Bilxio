/*
  # Fix authentication and profile creation

  1. Database Functions
    - Create or replace the handle_new_user function
    - Ensure proper error handling and permissions

  2. Triggers
    - Create trigger for automatic profile creation on user signup
    - Ensure trigger fires after user creation

  3. Security
    - Fix RLS policies for profile insertion
    - Allow users to insert their own profile during signup
*/

-- Create or replace the function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Update RLS policies for profiles table
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users based on user_id" ON profiles;

-- Create a more permissive insert policy for profile creation
CREATE POLICY "Enable insert for authenticated users based on user_id" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Ensure the profiles table has the correct structure
ALTER TABLE profiles ALTER COLUMN full_name SET DEFAULT '';