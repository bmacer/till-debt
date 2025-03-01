# SQL Setup Instructions

This document provides instructions on how to set up the SQL functions required for the "Till Debt Do Us Part" application.

## Option 1: Manual Setup (Recommended)

1. Log in to your Supabase dashboard at [https://app.supabase.com](https://app.supabase.com)
2. Navigate to the SQL Editor
3. Execute the following SQL files in order:
   - `create-exec-sql-function.sql` (only needed if you want to use the automated script)
   - `get-public-user-profiles.sql`
   - `get-public-user-profile.sql`
   - `create-debt-comments.sql` (if you're using the commenting feature)
   - `create-activity-comments.sql` (if you're using the activity timeline comments feature)

## Option 2: Automated Setup

If you prefer an automated approach, you can use the provided Node.js script:

1. Make sure you have your Supabase URL and anon key in your `.env` file:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

2. Install the required dependencies:

   ```bash
   npm install @supabase/supabase-js dotenv
   ```

3. First, run the `create-exec-sql-function.sql` manually in the Supabase SQL Editor

4. Then run the script:
   ```bash
   node run-sql-functions.js
   ```

## Troubleshooting

### Type Mismatch Error

If you encounter a type mismatch error like:

```
ERROR: 42804: structure of query does not match function result type
DETAIL: Returned type character varying(255) does not match expected type text in column 2.
```

Make sure the return type in your function matches the actual type in the database. For example, if `auth.users.email` is `VARCHAR(255)`, your function should return `VARCHAR(255)` instead of `TEXT`.

### Cannot Change Return Type Error

If you encounter an error like:

```
ERROR: cannot change return type of existing function
DETAIL: 42P13
```

You need to drop the existing function before recreating it. The SQL files have been updated to include `DROP FUNCTION IF EXISTS` statements to handle this automatically.

If you're still having issues, you can manually drop the functions in the SQL Editor:

```sql
DROP FUNCTION IF EXISTS get_public_user_profiles();
DROP FUNCTION IF EXISTS get_public_user_profile(UUID);
```

Then run the SQL files again.
