/*
  # Initial schema for Links Saver

  1. New Tables
    - `links`
      - `id` (uuid, primary key)
      - `title` (text)
      - `url` (text)
      - `tags` (text array)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
    - `shared_links`
      - `id` (uuid, primary key)
      - `link_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `recipient_email` (text)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create links table
CREATE TABLE IF NOT EXISTS links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  url text NOT NULL,
  tags text[] DEFAULT '{}',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create shared_links table
CREATE TABLE IF NOT EXISTS shared_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid REFERENCES links(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_email text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_links ENABLE ROW LEVEL SECURITY;

-- Policies for links table
CREATE POLICY "Users can create their own links"
  ON links FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own links"
  ON links FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for shared_links table
CREATE POLICY "Users can share their links"
  ON shared_links FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM links
      WHERE links.id = link_id
      AND links.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view links shared with them"
  ON shared_links FOR SELECT
  TO authenticated
  USING (
    recipient_email = (
      SELECT email FROM auth.users
      WHERE id = auth.uid()
    )
  );