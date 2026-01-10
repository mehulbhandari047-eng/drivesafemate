
import { createClient } from '@supabase/supabase-js';

/**
 * SUPABASE CLIENT CONFIGURATION
 * 
 * Project URL: https://fugmigfwfpbzqeukpzgl.supabase.co
 * This URL is used to connect to your Supabase project's REST and Auth APIs.
 */
const SUPABASE_URL = 'https://fugmigfwfpbzqeukpzgl.supabase.co';

/**
 * The Supabase Anon Key is used for client-side operations.
 * It is safe to use in the browser as it respects Row Level Security (RLS) policies.
 */
const SUPABASE_ANON_KEY = 'sb_publishable_coJhCkTXwKSPvgNS8pQCeA_Ze3CFUbt';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
