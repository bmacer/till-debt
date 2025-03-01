// Script to run SQL functions using the Supabase JS client
const fs = require("fs");
const { createClient } = require("@supabase/supabase-js");

// Load environment variables
require("dotenv").config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function runSqlFile(filePath) {
  try {
    console.log(`Reading SQL file: ${filePath}`);
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(`Executing SQL from ${filePath}...`);
    const { data, error } = await supabase.rpc("exec_sql", { sql_query: sql });

    if (error) {
      console.error(`Error executing SQL from ${filePath}:`, error);
    } else {
      console.log(`Successfully executed SQL from ${filePath}`);
      console.log(data);
    }
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
  }
}

async function main() {
  // List of SQL files to execute
  const sqlFiles = [
    "get-public-user-profiles.sql",
    "get-public-user-profile.sql",
    "create-debt-comments.sql",
    "create-activity-comments.sql",
  ];

  for (const file of sqlFiles) {
    await runSqlFile(file);
  }
}

main().catch(console.error);
