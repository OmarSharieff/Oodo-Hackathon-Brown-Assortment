import {SUPABASE_URL, SUPABASE_KEY} from'@env'

import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
