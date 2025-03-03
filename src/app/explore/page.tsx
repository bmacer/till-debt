"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Search, DollarSign, Calendar, CreditCard } from "lucide-react";
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

export default function ExplorePage() {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                // Get users with their public debt totals
                const { data, error } = await supabase
                    .rpc('get_public_user_profiles')
                    .order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                setUsers(data || []);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <ProtectedRoute>
            <div className="container mx-auto max-w-6xl py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Explore Users</h1>
                        <p className="text-slate-500">Discover other users and their debt journeys</p>
                    </div>
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                        <Input
                            placeholder="Search users..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-slate-500">Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                        <h2 className="text-xl font-medium mb-2">No users found</h2>
                        <p className="text-slate-500">
                            {searchTerm ? "Try a different search term" : "There are no users to display yet"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredUsers.map((user) => (
                            <Card key={user.id} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <CardTitle className="flex items-center gap-2">
                                        <span className="truncate">{user.email}</span>
                                    </CardTitle>
                                    <CardDescription>
                                        <span className="flex items-center">
                                            <Calendar className="mr-1 h-4 w-4 text-slate-400" />
                                            <span>User since {format(new Date(user.created_at), 'MMM d, yyyy')}</span>
                                        </span>
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-sm text-slate-500">
                                                <DollarSign className="mr-1 h-4 w-4" />
                                                <span>Total Debt</span>
                                            </div>
                                            <span className="font-semibold">{formatCurrency(user.total_debt)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center text-sm text-slate-500">
                                                <CreditCard className="mr-1 h-4 w-4" />
                                                <span>Number of Debts</span>
                                            </div>
                                            <span className="font-semibold">{user.debt_count}</span>
                                        </div>
                                        <div className="pt-2">
                                            <Link href={`/explore/${user.id}`}>
                                                <Button variant="outline" className="w-full">
                                                    View Profile
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </ProtectedRoute>
    );
} 