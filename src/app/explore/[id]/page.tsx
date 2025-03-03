"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, DollarSign, Calendar, CreditCard, PiggyBank, Activity, MessageSquare, Send } from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { format, parseISO, compareDesc, formatDistanceToNow } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";

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

interface DebtActivity {
    id: string;
    debt_id: string;
    debt_name: string;
    amount: number;
    recorded_at: string;
    type: 'creation' | 'update';
}

interface ActivityComment {
    id: string;
    activity_id: string;
    user_id: string;
    user_email: string;
    comment: string;
    created_at: string;
}

export default function UserProfilePage() {
    const { user } = useAuth();
    const params = useParams();
    const userId = params.id as string;
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [debts, setDebts] = useState<PublicDebt[]>([]);
    const [activities, setActivities] = useState<DebtActivity[]>([]);
    const [comments, setComments] = useState<Record<string, ActivityComment[]>>({});
    const [newComments, setNewComments] = useState<Record<string, string>>({});
    const [submittingComment, setSubmittingComment] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedActivities, setExpandedActivities] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const fetchUserProfile = async () => {
            setLoading(true);
            try {
                // Get user profile
                const { data: profileData, error: profileError } = await supabase
                    .rpc('get_public_user_profile', { input_user_id: userId });

                if (profileError) {
                    console.error("Profile error:", profileError);
                    throw profileError;
                }

                console.log("Profile data:", profileData);

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
                    console.error("Debts error:", debtsError);
                    throw debtsError;
                }

                // If we have debts but no profile, create a basic profile
                if (debtsData && debtsData.length > 0 && !userProfile) {
                    // We know the user exists if they have debts
                    // Calculate total debt and debt count
                    const totalDebt = debtsData.reduce((sum, debt) => sum + debt.amount, 0);

                    // Create a basic profile
                    setUserProfile({
                        id: userId,
                        email: "User", // We don't have access to the email
                        created_at: new Date().toISOString(), // We don't have access to the creation date
                        total_debt: totalDebt,
                        debt_count: debtsData.length
                    });
                }

                setDebts(debtsData || []);

                // Fetch debt history for all public debts
                if (debtsData && debtsData.length > 0) {
                    const allActivities: DebtActivity[] = [];
                    const activityComments: Record<string, ActivityComment[]> = {};

                    // Add debt creation activities - use actual UUIDs instead of string prefixes
                    debtsData.forEach(debt => {
                        // Generate a proper UUID for creation activities
                        const creationId = crypto.randomUUID();
                        allActivities.push({
                            id: creationId,
                            debt_id: debt.id,
                            debt_name: debt.name,
                            amount: debt.amount,
                            recorded_at: debt.created_at,
                            type: 'creation'
                        });
                    });

                    // Fetch debt history for balance updates
                    for (const debt of debtsData) {
                        const { data: historyData, error: historyError } = await supabase
                            .from('debt_history')
                            .select('id, debt_id, amount, recorded_at')
                            .eq('debt_id', debt.id)
                            .order('recorded_at', { ascending: false });

                        if (historyError) {
                            console.error(`Error fetching history for debt ${debt.id}:`, historyError);
                            continue;
                        }

                        if (historyData && historyData.length > 0) {
                            // Skip the first history entry as it's created when the debt is created
                            const updates = historyData.slice(0, -1).map(history => ({
                                id: history.id,
                                debt_id: history.debt_id,
                                debt_name: debt.name,
                                amount: history.amount,
                                recorded_at: history.recorded_at,
                                type: 'update' as const
                            }));

                            allActivities.push(...updates);
                        }
                    }

                    // Sort activities by date (newest first)
                    allActivities.sort((a, b) =>
                        compareDesc(parseISO(a.recorded_at), parseISO(b.recorded_at))
                    );

                    // Fetch comments for all activities
                    const activityIds = allActivities.map(a => a.id);

                    if (activityIds.length > 0) {
                        const { data: commentsData, error: commentsError } = await supabase
                            .from('activity_comments')
                            .select('id, activity_id, user_id, user_email, comment, created_at')
                            .in('activity_id', activityIds)
                            .order('created_at', { ascending: true });

                        if (commentsError) {
                            console.error("Error fetching comments:", commentsError);
                        } else if (commentsData) {
                            // Group comments by activity_id
                            commentsData.forEach(comment => {
                                if (!activityComments[comment.activity_id]) {
                                    activityComments[comment.activity_id] = [];
                                }
                                activityComments[comment.activity_id].push(comment);
                            });
                        }
                    }

                    setComments(activityComments);
                    setActivities(allActivities);
                }
            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserProfile();
        }
    }, [userId, userProfile]);

    const handleCommentChange = (activityId: string, value: string) => {
        setNewComments(prev => ({
            ...prev,
            [activityId]: value
        }));
    };

    const toggleActivityExpansion = (activityId: string) => {
        setExpandedActivities(prev => ({
            ...prev,
            [activityId]: !prev[activityId]
        }));
    };

    const handleAddComment = async (activityId: string) => {
        if (!user) {
            alert("You must be logged in to add comments");
            return;
        }

        const commentText = newComments[activityId];
        if (!commentText?.trim()) return;

        setSubmittingComment(activityId);

        try {
            const { data, error } = await supabase
                .from('activity_comments')
                .insert({
                    activity_id: activityId,
                    user_id: user.id,
                    user_email: user.email,
                    comment: commentText.trim()
                })
                .select()
                .single();

            if (error) {
                console.error("Error adding comment:", error);
                alert("Failed to add comment. Please try again.");
                return;
            }

            // Update local state with the new comment
            setComments(prev => {
                const activityComments = [...(prev[activityId] || []), data];
                return {
                    ...prev,
                    [activityId]: activityComments
                };
            });

            // Clear the comment input
            setNewComments(prev => ({
                ...prev,
                [activityId]: ""
            }));
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment. Please try again.");
        } finally {
            setSubmittingComment(null);
        }
    };

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
                            This user doesn&apos;t exist or has no public debts to display
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

                {/* Debt Activity Timeline */}
                <h2 className="text-2xl font-bold mb-4 flex items-center">
                    <Activity className="mr-2 h-6 w-6" />
                    Debt Activity
                </h2>

                {activities.length === 0 ? (
                    <div className="text-center py-8 bg-slate-50 rounded-lg mb-8">
                        <p className="text-slate-500">No debt activity to display</p>
                    </div>
                ) : (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>Activity Timeline</CardTitle>
                            <CardDescription>Track debt creation and balance changes</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                {activities.map((activity) => (
                                    <div key={activity.id} className="relative pl-8 pb-6 border-l-2 border-slate-200 last:border-0">
                                        <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                                        <div className="mb-1 text-sm text-slate-500">
                                            {format(parseISO(activity.recorded_at), 'MMMM d, yyyy h:mm a')}
                                        </div>
                                        <div className="font-medium">
                                            {activity.type === 'creation'
                                                ? `Added new debt: ${activity.debt_name}`
                                                : `Updated balance for: ${activity.debt_name}`}
                                        </div>
                                        <div className="text-lg font-bold mb-2">
                                            {formatCurrency(activity.amount)}
                                        </div>

                                        {/* Comments section */}
                                        <div className="mt-3">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="flex items-center text-slate-500 hover:text-slate-700"
                                                onClick={() => toggleActivityExpansion(activity.id)}
                                            >
                                                <MessageSquare className="h-4 w-4 mr-1" />
                                                {comments[activity.id]?.length || 0} Comments
                                            </Button>

                                            {expandedActivities[activity.id] && (
                                                <div className="mt-2 space-y-3">
                                                    {/* Existing comments */}
                                                    {comments[activity.id]?.length > 0 ? (
                                                        <div className="space-y-2 mb-3">
                                                            {comments[activity.id].map(comment => (
                                                                <div key={comment.id} className="bg-slate-50 p-3 rounded-md">
                                                                    <div className="flex justify-between items-start">
                                                                        <div className="font-medium text-sm">{comment.user_email}</div>
                                                                        <div className="text-xs text-slate-500">
                                                                            {formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true })}
                                                                        </div>
                                                                    </div>
                                                                    <div className="text-sm mt-1">{comment.comment}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm text-slate-500 italic">No comments yet</div>
                                                    )}

                                                    {/* Add comment form */}
                                                    {user && (
                                                        <div className="flex space-x-2">
                                                            <Textarea
                                                                placeholder="Add a comment..."
                                                                value={newComments[activity.id] || ''}
                                                                onChange={(e) => handleCommentChange(activity.id, e.target.value)}
                                                                className="resize-none text-sm min-h-[60px]"
                                                            />
                                                            <Button
                                                                size="icon"
                                                                onClick={() => handleAddComment(activity.id)}
                                                                disabled={!newComments[activity.id]?.trim() || submittingComment === activity.id}
                                                            >
                                                                {submittingComment === activity.id ? (
                                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                                ) : (
                                                                    <Send className="h-4 w-4" />
                                                                )}
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

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