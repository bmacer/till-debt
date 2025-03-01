-- Function to get a single public user profile with their debt information
-- First drop the existing function if it exists
DROP FUNCTION IF EXISTS get_public_user_profile(UUID);

-- Then recreate it with the correct return types
CREATE OR REPLACE FUNCTION get_public_user_profile(user_id UUID)
RETURNS TABLE (
  id UUID,
  email VARCHAR(255),
  created_at TIMESTAMPTZ,
  total_debt DECIMAL,
  debt_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    au.created_at,
    COALESCE(SUM(CASE WHEN d.private = false THEN d.amount ELSE 0 END), 0) as total_debt,
    COUNT(CASE WHEN d.private = false THEN 1 ELSE NULL END) as debt_count
  FROM 
    auth.users au
  LEFT JOIN 
    public.debts d ON au.id = d.user_id
  WHERE
    au.id = user_id
  GROUP BY 
    au.id, au.email, au.created_at
  HAVING 
    COUNT(CASE WHEN d.private = false THEN 1 ELSE NULL END) > 0;
END;
$$; 