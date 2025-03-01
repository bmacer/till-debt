"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, DollarSign, Calendar, CreditCard, PiggyBank } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

interface UserProfile {
    id: string;
    email: string;
    created_at: string;
    total_debt: number;
    debt_count: number;
}

interface PublicDebt {
    id: string;
    name: string;
    amount: number;
    created_at: string;
    updated_at: string;
}

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.id as string;
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [debts, setDebts] = useState<PublicDebt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                // Get user profile
                const { data: profileData, error: profileError } = await supabase
                    .rpc('get_public_user_profile', { user_id: userId });

                if (profileError) {
                    throw profileError;
                }

                if (profileData && profileData.length > 0) {
                    setUserProfile(profileData[0]);
                }

                // Get user's public debts
                const { data: debtsData, error: debtsError } = await supabase
                    .from('debts')
                    .select('id, name, amount, created_at, updated_at')
                    .eq('user_id', userId)
                    .eq('private', false)
                    .order('created_at', { ascending: false });

                if (debtsError) {
                    throw debtsError;
                }

                setDebts(debtsData || []);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId]);

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="container mx-auto max-w-4xl py-8">
                    <p className="text-center">Loading user profile...</p>
                </div>
            </ProtectedRoute>
        );
    }

    if (!userProfile) {
        return (
            <ProtectedRoute>
                <div className="container mx-auto max-w-4xl py-8">
                    <div className="mb-6">
                        <Link href="/explore">
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
                            </Button>
                        </Link>
                    </div>
                    <div className="text-center py-12">
                        <User className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <h2 className="text-xl font-medium mb-2">User Not Found</h2>
                        <p className="text-slate-500">
                            This user doesn't exist or has no public debts to display
                        </p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="container mx-auto max-w-4xl py-8">
                <div className="mb-6">
                    <Link href="/explore">
                        <Button variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Explore
                        </Button>
                    </Link>
                </div>

                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl">{userProfile.email}</CardTitle>
                        <CardDescription className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            User since {format(new Date(userProfile.created_at), 'MMMM d, yyyy')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
                                <DollarSign className="h-8 w-8 text-slate-400 mr-4" />
                                <div>
                                    <p className="text-sm text-slate-500">Total Public Debt</p>
                                    <p className="text-2xl font-bold">{formatCurrency(userProfile.total_debt)}</p>
                                </div>
                            </div>
                            <div className="flex items-center p-4 bg-slate-50 rounded-lg">
                                <CreditCard className="h-8 w-8 text-slate-400 mr-4" />
                                <div>
                                    <p className="text-sm text-slate-500">Public Debts</p>
                                    <p className="text-2xl font-bold">{userProfile.debt_count}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <PiggyBank className="mr-2 h-6 w-6" />
                    Public Debts
                </h2>

                {debts.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg">
                        <p className="text-slate-500">No public debts to display</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {debts.map((debt) => (
                            <Card key={debt.id} className="overflow-hidden">
                                <CardHeader className="pb-2">
                                    <CardTitle>{debt.name}</CardTitle>
                                    <CardDescription>
                                        Last updated: {format(new Date(debt.updated_at), 'MMM d, yyyy')}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{formatCurrency(debt.amount)}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
} 