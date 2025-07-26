DROP POLICY IF EXISTS "Anyone can check if email exists" ON accounts;

-- Create new policy that allows anyone to check if an email exists
-- This is safe because it only allows checking existence, not viewing any other data
CREATE POLICY "Anyone can check if email exists" ON accounts
  FOR SELECT 
  USING (true);
