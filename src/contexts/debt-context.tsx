"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./auth-context";

// Define the Debt type
export interface Debt {
    id: string;
    user_id: string;
    name: string;
    amount: number;
    private: boolean;
    created_at: string;
    updated_at: string;
    description?: string;
}

// Define the DebtInput type
export interface DebtInput {
    name: string;
    amount: number;
    private: boolean;
    description?: string;
}

// Define the DebtHistory type
export interface DebtHistory {
    id: string;
    debt_id: string;
    amount: number;
    recorded_at: string;
}

// Define the DebtComment type
export interface DebtComment {
    id: string;
    debt_id: string;
    debt_history_id: string | null;
    user_id: string;
    comment: string;
    created_at: string;
}

// Define the DebtProfile type
export interface DebtProfile {
    id: string;
    user_id: string;
    name: string;
    amount: number;
    original_amount: number;
    interest_rate: number | null;
    minimum_payment: number | null;
    due_date: string | null;
    private: boolean;
    created_at: string;
}

// Define the DebtContextType
export interface DebtContextType {
    debts: Debt[];
    loading: boolean;
    error: string | null;
    addDebt: (debt: DebtInput) => Promise<void>;
    updateDebt: (id: string, updates: Partial<DebtInput>) => Promise<void>;
    deleteDebt: (id: string) => Promise<void>;
    updateBalance: (id: string, amount: number) => Promise<void>;
    getDebtHistory: (debtId: string) => Promise<DebtHistory[]>;
    getDebt: (id: string) => Promise<Debt | null>;
    getDebtComments: (debtId: string) => Promise<DebtComment[]>;
    addDebtComment: (debtId: string, comment: string, debtHistoryId?: string) => Promise<void>;
    deleteDebtComment: (commentId: string) => Promise<void>;
}

// Create the DebtContext
const DebtContext = createContext<DebtContextType | undefined>(undefined);

// Create the DebtProvider component
export function DebtProvider({ children }: { children: React.ReactNode }) {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    // Function to fetch debts from Supabase
    const fetchDebts = async () => {
        if (!user) {
            setDebts([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("debts")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            setDebts(data || []);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch debts when the user changes
    useEffect(() => {
        fetchDebts();
    }, [user]);

    // Function to add a new debt
    const addDebt = async (debt: Omit<Debt, "id" | "user_id" | "created_at" | "updated_at">) => {
        if (!user) {
            setError("You must be logged in to add a debt");
            return;
        }

        try {
            setLoading(true);
            const { data, error } = await supabase
                .from("debts")
                .insert([
                    {
                        ...debt,
                        user_id: user.id,
                    },
                ])
                .select();

            if (error) {
                throw error;
            }

            // Refresh the debts list
            await fetchDebts();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to update a debt
    const updateDebt = async (id: string, debt: Partial<Debt>) => {
        if (!user) {
            setError("You must be logged in to update a debt");
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase
                .from("debts")
                .update(debt)
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) {
                throw error;
            }

            // Refresh the debts list
            await fetchDebts();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to update just the balance of a debt
    const updateBalance = async (id: string, newAmount: number) => {
        if (!user) {
            setError("You must be logged in to update a debt balance");
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase
                .from("debts")
                .update({ amount: newAmount })
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) {
                throw error;
            }

            // Refresh the debts list
            await fetchDebts();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to delete a debt
    const deleteDebt = async (id: string) => {
        if (!user) {
            setError("You must be logged in to delete a debt");
            return;
        }

        try {
            setLoading(true);
            const { error } = await supabase
                .from("debts")
                .delete()
                .eq("id", id)
                .eq("user_id", user.id);

            if (error) {
                throw error;
            }

            // Refresh the debts list
            await fetchDebts();
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Function to get debt history
    const getDebtHistory = async (debtId: string): Promise<DebtHistory[]> => {
        if (!user) {
            setError("You must be logged in to view debt history");
            return [];
        }

        try {
            const { data, error } = await supabase
                .from("debt_history")
                .select("*")
                .eq("debt_id", debtId)
                .order("recorded_at", { ascending: true });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error: any) {
            setError(error.message);
            return [];
        }
    };

    // Function to get a single debt
    const getDebt = async (id: string): Promise<Debt | null> => {
        if (!user) {
            setError("You must be logged in to view debt details");
            return null;
        }

        try {
            const { data, error } = await supabase
                .from("debts")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                throw error;
            }

            return data as Debt;
        } catch (error: any) {
            setError(error.message);
            return null;
        }
    };

    // Function to refresh debts
    const refreshDebts = async () => {
        await fetchDebts();
    };

    // Function to get comments for a debt
    const getDebtComments = async (debtId: string): Promise<DebtComment[]> => {
        if (!user) {
            setError("You must be logged in to view debt comments");
            return [];
        }

        try {
            const { data, error } = await supabase
                .from("debt_comments")
                .select("*")
                .eq("debt_id", debtId)
                .order("created_at", { ascending: false });

            if (error) {
                throw error;
            }

            return data || [];
        } catch (error: any) {
            setError(error.message);
            return [];
        }
    };

    // Function to add a comment to a debt
    const addDebtComment = async (debtId: string, comment: string, debtHistoryId?: string): Promise<void> => {
        if (!user) {
            setError("You must be logged in to add a comment");
            return;
        }

        try {
            const { error } = await supabase
                .from("debt_comments")
                .insert({
                    debt_id: debtId,
                    debt_history_id: debtHistoryId || null,
                    user_id: user.id,
                    comment
                });

            if (error) {
                throw error;
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    // Function to delete a comment
    const deleteDebtComment = async (commentId: string): Promise<void> => {
        if (!user) {
            setError("You must be logged in to delete a comment");
            return;
        }

        try {
            const { error } = await supabase
                .from("debt_comments")
                .delete()
                .eq("id", commentId)
                .eq("user_id", user.id);

            if (error) {
                throw error;
            }
        } catch (error: any) {
            setError(error.message);
        }
    };

    // Create the context value
    const value = {
        debts,
        loading,
        error,
        addDebt,
        updateDebt,
        deleteDebt,
        updateBalance,
        getDebtHistory,
        getDebt,
        getDebtComments,
        addDebtComment,
        deleteDebtComment,
    };

    return <DebtContext.Provider value={value}>{children}</DebtContext.Provider>;
}

// Create a hook to use the DebtContext
export function useDebts() {
    const context = useContext(DebtContext);
    if (context === undefined) {
        throw new Error("useDebts must be used within a DebtProvider");
    }
    return context;
}
