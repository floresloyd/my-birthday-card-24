
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey =  import.meta.env.VITE_SUPABASE_API_KEY;



const guests_db = createClient(supabaseUrl, supabaseKey) 


const { data, error } = await guests_db.from('guests').select('*');
if (error) console.error("Error fetching guests:", error);
console.log("Guests data:", data);
console.log("URL: ", supabaseUrl);
console.log("KEY: ", supabaseKey);


export default guests_db;