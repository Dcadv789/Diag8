/*
  # Create Heartbeat Cron Job

  1. Enable Extension
    - Enables pg_cron extension for scheduling jobs
  
  2. New Function
    - Creates a heartbeat function that performs a simple SELECT
    - Returns NULL
    - Purpose: Keep the project active
*/

-- Enable the pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the heartbeat function
CREATE OR REPLACE FUNCTION public.fn_heartbeat()
RETURNS void AS $$
BEGIN
  -- Simple SELECT that does nothing
  PERFORM 1;
END;
$$ LANGUAGE plpgsql;

-- Schedule the job using pg_cron
SELECT cron.schedule(
  'heartbeat-job',                    -- Job name
  '30 0 * * *',                      -- Cron schedule (00:30 UTC = 21:30 BRT)
  'SELECT public.fn_heartbeat();'     -- SQL command to execute
);