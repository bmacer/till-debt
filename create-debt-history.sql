-- Create the debt_history table to track balance changes
CREATE TABLE IF NOT EXISTS public.debt_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    debt_id UUID NOT NULL REFERENCES public.debts(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS debt_history_debt_id_idx ON public.debt_history(debt_id);
CREATE INDEX IF NOT EXISTS debt_history_recorded_at_idx ON public.debt_history(recorded_at);

-- Set up Row Level Security (RLS) to ensure users can only access their own debt history
ALTER TABLE public.debt_history ENABLE ROW LEVEL SECURITY;

-- Create policies for the debt_history table
DROP POLICY IF EXISTS select_own_debt_history ON public.debt_history;
CREATE POLICY select_own_debt_history ON public.debt_history
    FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.debts
        WHERE debts.id = debt_history.debt_id
        AND debts.user_id = auth.uid()
    ));

DROP POLICY IF EXISTS insert_own_debt_history ON public.debt_history;
CREATE POLICY insert_own_debt_history ON public.debt_history
    FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.debts
        WHERE debts.id = debt_history.debt_id
        AND debts.user_id = auth.uid()
    ));

-- Create a function to record debt balance history when amount changes
DROP FUNCTION IF EXISTS record_debt_history();
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
DROP TRIGGER IF EXISTS record_debt_history_trigger ON public.debts;
CREATE TRIGGER record_debt_history_trigger
AFTER INSERT OR UPDATE ON public.debts
FOR EACH ROW
EXECUTE FUNCTION record_debt_history(); 