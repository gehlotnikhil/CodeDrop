import { createClient } from '@supabase/supabase-js';
console.log("process.env.SUPERBASE_URL", process.env.SUPERBASE_URL);
console.log("process.env.SUPERBASE_KEY", process.env.SUPERBASE_KEY);

const SUPERBASE_URL= process.env.SUPERBASE_URL!;
const SUPERBASE_KEY=  process.env.SUPERBASE_KEY!;


export const supabase = createClient(
SUPERBASE_URL,
SUPERBASE_KEY
);

