-- Create the activity_comments table to store comments on debt activities
CREATE TABLE IF NOT EXISTS public.activity_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_email TEXT NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS activity_comments_activity_id_idx ON public.activity_comments(activity_id);
CREATE INDEX IF NOT EXISTS activity_comments_user_id_idx ON public.activity_comments(user_id);
CREATE INDEX IF NOT EXISTS activity_comments_created_at_idx ON public.activity_comments(created_at);

-- Set up Row Level Security (RLS) to ensure proper access control
ALTER TABLE public.activity_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for the activity_comments table
-- Allow users to view comments on public debt activities
DROP POLICY IF EXISTS select_activity_comments ON public.activity_comments;
CREATE POLICY select_activity_comments ON public.activity_comments
    FOR SELECT
    USING (true);  -- Anyone can view comments on public activities

-- Allow users to insert their own comments
DROP POLICY IF EXISTS insert_own_activity_comments ON public.activity_comments;
CREATE POLICY insert_own_activity_comments ON public.activity_comments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own comments
DROP POLICY IF EXISTS update_own_activity_comments ON public.activity_comments;
CREATE POLICY update_own_activity_comments ON public.activity_comments
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete their own comments
DROP POLICY IF EXISTS delete_own_activity_comments ON public.activity_comments;
CREATE POLICY delete_own_activity_comments ON public.activity_comments
    FOR DELETE
    USING (auth.uid() = user_id); 