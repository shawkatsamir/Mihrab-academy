const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  console.log("Fetching teachers...");
  const { data, error } = await supabase
    .from("teachers")
    .select("*, profiles(full_name, photo_url, is_active, created_at)")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching teachers:", JSON.stringify(error, null, 2));
  } else {
    console.log("Success! Fetched", data?.length, "teachers");
  }
}

main();
