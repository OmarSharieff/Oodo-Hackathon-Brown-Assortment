import { createClient } from '@supabase/supabase-js'
//import { app } from '../../app.js'

const supabaseUrl = 'https://catpesomtcsxavbzihhe.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase