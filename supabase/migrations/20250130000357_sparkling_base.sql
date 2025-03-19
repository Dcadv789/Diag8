/*
  # Create Heartbeat Cron Job

  1. New Function
    - Creates a heartbeat function that performs a simple SELECT
    - Returns NULL
    - Purpose: Keep the project active
  
  2. Cron Job
    - Scheduled to run daily at 21:30 BRT (00:30 UTC)
    - Calls the heartbeat function
*/

-- Create the heartbeat function
CREATE OR REPLACE FUNCTION public.fn_heartbeat()
RETURNS void AS $$
BEGIN
  -- Simple SELECT that does nothing
  PERFORM 1;
END;
$$ LANGUAGE plpgsql;

-- Create the cron job to run at 21:30 BRT (00:30 UTC)
SELECT cron.schedule(
  'heartbeat-job',                    -- Job name
  '30 0 * * *',                      -- Cron schedule (00:30 UTC = 21:30 BRT)
  'SELECT public.fn_heartbeat();'     -- SQL command to execute
);