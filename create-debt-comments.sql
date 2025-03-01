-- Create the debt_comments table to store comments on debt activities
CREATE TABLE IF NOT EXISTS public.debt_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
    debt_history_id UUID REFERENCES public.debt_history(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS debt_comments_debt_id_idx ON public.debt_comments(debt_id);
CREATE INDEX IF NOT EXISTS debt_comments_debt_history_id_idx ON public.debt_comments(debt_history_id);
CREATE INDEX IF NOT EXISTS debt_comments_created_at_idx ON public.debt_comments(created_at);

-- Set up Row Level Security (RLS) to ensure users can only access their own comments
ALTER TABLE public.debt_comments ENABLE ROW LEVEL SECURITY;

-- Create policies for the debt_comments table
DROP POLICY IF EXISTS select_own_debt_comments ON public.debt_comments;
CREATE POLICY select_own_debt_comments ON public.debt_comments
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.debts
        WHERE debts.id = debt_comments.debt_id
        AND debts.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS insert_own_debt_comments ON public.debt_comments;
CREATE POLICY insert_own_debt_comments ON public.debt_comments
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.debts
            WHERE debts.id = debt_comments.debt_id
            AND debts.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS update_own_debt_comments ON public.debt_comments;
CREATE POLICY update_own_debt_comments ON public.debt_comments
    FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS delete_own_debt_comments ON public.debt_comments;
CREATE POLICY delete_own_debt_comments ON public.debt_comments
    FOR DELETE
    USING (auth.uid() = user_id); 