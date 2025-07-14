import { createClient } from '@supabase/supabase-js';

const SUPERBASE_URL= process.env.SUPERBASE_URL!;
const SUPERBASE_KEY=  process.env.SUPERBASE_KEY!;

export const supabase = createClient(
SUPERBASE_URL,
SUPERBASE_KEY
);

