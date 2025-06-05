-- Function to get the total number of users with the 'farmer' role.
CREATE OR REPLACE FUNCTION get_total_farmers()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER FROM public.users WHERE role = 'farmer' AND status = 'active';
$$;

-- Function to get the total number of group buys.
CREATE OR REPLACE FUNCTION get_total_groups()
RETURNS INTEGER
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COUNT(*)::INTEGER FROM public.group_buys;
$$;