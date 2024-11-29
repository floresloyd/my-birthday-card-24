
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =  import.meta.env.VITE_SUPABASE_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('supabaseUrl and supabaseKey are required.');
  }

console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_API_KEY);

const guests_db = createClient(supabaseUrl, supabaseKey) 



export default guests_db;