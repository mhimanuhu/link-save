/*
  # Add profiles table and update sharing functionality

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `updated_at` (timestamptz)

  2. Changes
    - Add `shared_by_email` column to `shared_links` table
    - Add unique constraint on username in profiles table
    - Add policies for profiles table

  3. Security
    - Enable RLS on profiles table
    - Add policies for profile management
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  updated_at timestamptz DEFAULT now()
);

-- Add shared_by_email to shared_links
ALTER TABLE shared_links ADD COLUMN IF NOT EXISTS shared_by_email text;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Update shared_links policies to include shared_by_email
DROP POLICY IF EXISTS "Users can share their links" ON shared_links;
CREATE POLICY "Users can share their links"
  ON shared_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM links
      WHERE links.id = link_id
      AND links.user_id = auth.uid()
    )
    AND shared_by_email = auth.email()
  );

-- Add index for username search
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);