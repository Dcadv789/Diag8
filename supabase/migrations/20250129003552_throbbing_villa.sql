/*
  # Fix RLS policies for diagnostic_results table

  1. Changes
    - Drop existing RLS policies for diagnostic_results
    - Create new, properly configured RLS policies that allow:
      - Users to insert their own results
      - Users to view their own results
      - Users to delete their own results
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own diagnostic results" ON diagnostic_results;
DROP POLICY IF EXISTS "Users can insert their own diagnostic results" ON diagnostic_results;
DROP POLICY IF EXISTS "Usuários podem ver seus próprios resultados" ON diagnostic_results;
DROP POLICY IF EXISTS "Usuários podem inserir seus próprios resultados" ON diagnostic_results;

-- Create new policies
CREATE POLICY "Enable insert for authenticated users only"
ON diagnostic_results FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable read access for users based on user_id"
ON diagnostic_results FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Enable delete for users based on user_id"
ON diagnostic_results FOR DELETE
TO authenticated
USING (auth.uid() = user_id);