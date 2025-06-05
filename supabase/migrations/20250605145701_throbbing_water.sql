/*
  # Create Statistics Functions
  
  1. New Functions
    - `get_total_farmers`: Returns count of users with 'farmer' role
    - `get_total_groups`: Returns count of all group buys
  
  2. Security
    - Functions are read-only and safe to expose
    - No RLS bypass needed as they only return aggregate counts
*/

-- Function to get the total number of users with the 'farmer' role.
CREATE OR REPLACE FUNCTION get_total_farmers()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER FROM public.users WHERE role = 'farmer' AND is_active = true;
$$;

-- Function to get the total number of group buys.
CREATE OR REPLACE FUNCTION get_total_groups()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER FROM public.group_buys;
$$;