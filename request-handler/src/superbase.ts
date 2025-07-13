import { createClient } from '@supabase/supabase-js';
console.log("process.env.SUPERBASE_URL", process.env.SUPERBASE_URL);
console.log("process.env.SUPERBASE_KEY", process.env.SUPERBASE_KEY);

// const SUPERBASE_URL= process.env.SUPERBASE_URL!;
// const SUPERBASE_KEY=  process.env.SUPERBASE_KEY!;
const SUPERBASE_URL="https://glkglkgdxtshjmlhefnq.supabase.co"
const SUPERBASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsa2dsa2dkeHRzaGptbGhlZm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjA0MjcsImV4cCI6MjA2Nzg5NjQyN30.xFng3WSGNrnSiHwk-kuJuYvzkKpr57W_5QK4jVMNa9o"


export const supabase = createClient(
SUPERBASE_URL,
SUPERBASE_KEY
);

