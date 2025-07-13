"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
console.log("process.env.SUPERBASE_URL", process.env.SUPERBASE_URL);
console.log("process.env.SUPERBASE_KEY", process.env.SUPERBASE_KEY);
exports.supabase = (0, supabase_js_1.createClient)('https://glkglkgdxtshjmlhefnq.supabase.co', // Replace with your Supabase project URL
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsa2dsa2dkeHRzaGptbGhlZm5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMjA0MjcsImV4cCI6MjA2Nzg5NjQyN30.xFng3WSGNrnSiHwk-kuJuYvzkKpr57W_5QK4jVMNa9o' // Replace with anon or service key
);
