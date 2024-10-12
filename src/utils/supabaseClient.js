import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://heznwurkghqymlilvzoy.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhlem53dXJrZ2hxeW1saWx2em95Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjg1MjQ2NzcsImV4cCI6MjA0NDEwMDY3N30.Tz79FPJFeTgxjbzmGSnZZYUWVfBPz43QQzNy9M0uH-k'; // Reemplaza con tu clave anónima de Supabase

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
