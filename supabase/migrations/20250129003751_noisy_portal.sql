/*
  # Fix diagnostic_results table and policies

  1. Changes
    - Recreate diagnostic_results table with proper constraints
    - Create new RLS policies with proper checks
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS diagnostic_results CASCADE;

-- Recreate diagnostic_results table
CREATE TABLE diagnostic_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  company_data jsonb NOT NULL,
  answers jsonb NOT NULL,
  pillar_scores jsonb NOT NULL,
  total_score numeric NOT NULL,
  max_possible_score numeric NOT NULL,
  percentage_score numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT fk_user
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_diagnostic_results_user_id ON diagnostic_results(user_id);
CREATE INDEX idx_diagnostic_results_created_at ON diagnostic_results(created_at DESC);

-- Enable RLS
ALTER TABLE diagnostic_results ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable insert for authenticated users only"
ON diagnostic_results FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() = user_id
);

CREATE POLICY "Enable read access for users based on user_id"
ON diagnostic_results FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);

CREATE POLICY "Enable delete for users based on user_id"
ON diagnostic_results FOR DELETE
TO authenticated
USING (
  auth.uid() = user_id
);