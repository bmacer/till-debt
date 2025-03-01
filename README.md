This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Till Debt Do Us Part

A debt tracking application that helps users manage and track their debt journey to financial freedom.

## Features

- User authentication with email/password and Google OAuth
- Add and track individual debts with details like:
  - Debt name
  - Current balance
  - Category
  - Privacy setting (public/private)
- Track balance changes over time
- Dashboard to view all your debts
- Individual debt detail pages
- Update debt balances as you pay them down
- Secure data storage with Supabase
- Timeline graph for tracking debt balances over time
- Achievement badges to celebrate milestones
- Comments system for debt activities:
  - Add comments to specific debt activities
  - Add general comments to debts
  - Track your thoughts and progress notes
- Explore other users:
  - Discover other users and their public debt journeys
  - View user profiles with their public debt information
  - See statistics like user registration date, total debt, and number of debts

## Getting Started

First, set up your Supabase project:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Run the SQL script in `supabase-schema.sql` in the SQL Editor to set up the database schema
3. Run the additional SQL functions in the SQL Editor:
   - `get-public-user-profiles.sql` - Function to get all public user profiles
   - `get-public-user-profile.sql` - Function to get a single user profile
4. Copy your Supabase URL and anon key to a `.env` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

To learn more about Supabase, check out:

- [Supabase Documentation](https://supabase.com/docs) - learn about Supabase features and API.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
