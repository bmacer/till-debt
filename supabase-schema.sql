-- Drop existing triggers first to avoid dependency issues
DROP TRIGGER IF EXISTS update_debts_updated_at ON public.debts;

-- Drop existing policies to avoid dependency issues
DROP POLICY IF EXISTS select_own_debts ON public.debts;
DROP POLICY IF EXISTS insert_own_debts ON public.debts;
DROP POLICY IF EXISTS update_own_debts ON public.debts;
DROP POLICY IF EXISTS delete_own_debts ON public.debts;

-- Drop policies for debt_history if they exist
DROP POLICY IF EXISTS select_own_debt_history ON public.debt_history;
DROP POLICY IF EXISTS insert_own_debt_history ON public.debt_history;
DROP POLICY IF EXISTS delete_cascade_debt_history ON public.debt_history;

-- Drop the existing tables if they exist
DROP TABLE IF EXISTS public.debt_history;
DROP TABLE IF EXISTS public.debts;

-- Create the debts table with the updated schema
CREATE TABLE public.debts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category TEXT NOT NULL,
    color TEXT,
    private BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create the debt_history table to track balance changes
CREATE TABLE public.debt_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX debts_user_id_idx ON public.debts(user_id);
CREATE INDEX debt_history_debt_id_idx ON public.debt_history(debt_id);
CREATE INDEX debt_history_recorded_at_idx ON public.debt_history(recorded_at);

-- Set up Row Level Security (RLS) to ensure users can only access their own debts
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debt_history ENABLE ROW LEVEL SECURITY;

-- Create policies for the debts table
CREATE POLICY select_own_debts ON public.debts
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY insert_own_debts ON public.debts
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY update_own_debts ON public.debts
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY delete_own_debts ON public.debts
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create policies for the debt_history table
CREATE POLICY select_own_debt_history ON public.debt_history
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.debts
        WHERE debts.id = debt_history.debt_id
        AND debts.user_id = auth.uid()
    ));

CREATE POLICY insert_own_debt_history ON public.debt_history
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.debts
        WHERE debts.id = debt_history.debt_id
        AND debts.user_id = auth.uid()
    ));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at column
CREATE TRIGGER update_debts_updated_at
BEFORE UPDATE ON public.debts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create a function to record debt balance history when amount changes
CREATE OR REPLACE FUNCTION record_debt_history()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') OR (TG_OP = 'UPDATE' AND OLD.amount <> NEW.amount) THEN
        INSERT INTO public.debt_history (debt_id, amount)
        VALUES (NEW.id, NEW.amount);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically record debt history
CREATE TRIGGER record_debt_history_trigger
AFTER INSERT OR UPDATE ON public.debts
FOR EACH ROW
EXECUTE FUNCTION record_debt_history(); 