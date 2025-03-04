"use client";

import { useState, useEffect } from "react";
import { useDebts, DebtComment } from "@/contexts/debt-context";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { TrendingDown, MessageSquare, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow, format } from "date-fns";
import { useAuth } from "@/contexts/auth-context";

export function TotalDebtChart() {
    const { user } = useAuth();
    const {
        debts,
        getDebtHistory,
        getDebtComments,
        addDebtComment,
        deleteDebtComment,
    } = useDebts();
    const [historyData, setHistoryData] = useState<
        { date: string; amount: number; timestamp: number }[]
    >([]);
    const [loading, setLoading] = useState(true);
    const [activityLog, setActivityLog] = useState<
        {
            date: string;
            debtName: string;
            amount: number;
            change: string;
            debtId: string;
            historyId: string;
            timestamp: number;
        }[]
    >([]);
    const [debtProgress, setDebtProgress] = useState<{
        currentDebt: number;
        maxDebt: number;
        percentGone: number;
    }>({
        currentDebt: 0,
        maxDebt: 0,
        percentGone: 0,
    });
    const [comments, setComments] = useState<Record<string, DebtComment[]>>({});
    const [newComments, setNewComments] = useState<Record<string, string>>({});
    const [submittingComment, setSubmittingComment] = useState<string | null>(
        null
    );
    const [expandedActivities, setExpandedActivities] = useState<
        Record<string, boolean>
    >({});

    useEffect(() => {
        const fetchAllDebtHistory = async () => {
            if (!debts.length) return;

            setLoading(true);
            try {
                // Fetch history for each debt
                const allHistoryPromises = debts.map((debt) => getDebtHistory(debt.id));
                const allHistoryResults = await Promise.all(allHistoryPromises);

                // Combine all history data with debt names
                const combinedHistory: {
                    date: Date;
                    amount: number;
                    debtId: string;
                    debtName: string;
                    historyId: string;
                }[] = [];

                allHistoryResults.forEach((history, index) => {
                    const debtName = debts[index].name;
                    const debtId = debts[index].id;

                    history.forEach((entry) => {
                        combinedHistory.push({
                            date: new Date(entry.recorded_at),
                            amount: entry.amount,
                            debtId,
                            debtName,
                            historyId: entry.id,
                        });
                    });
                });

                // Sort by date
                combinedHistory.sort((a, b) => a.date.getTime() - b.date.getTime());

                // Create activity log
                const activityLogData: {
                    date: string;
                    debtName: string;
                    amount: number;
                    change: string;
                    debtId: string;
                    historyId: string;
                    timestamp: number;
                }[] = [];
                const debtAmounts: { [key: string]: number } = {};

                combinedHistory.forEach((entry, index) => {
                    const prevAmount = debtAmounts[entry.debtId] || 0;
                    const change = entry.amount - prevAmount;
                    debtAmounts[entry.debtId] = entry.amount;

                    if (index === 0 || change !== 0) {
                        activityLogData.push({
                            date: entry.date.toLocaleDateString(),
                            debtName: entry.debtName,
                            amount: entry.amount,
                            change:
                                change === 0
                                    ? "Added"
                                    : change > 0
                                        ? `+$${change.toFixed(2)}`
                                        : `-$${Math.abs(change).toFixed(2)}`,
                            debtId: entry.debtId,
                            historyId: entry.historyId,
                            timestamp: entry.date.getTime(),
                        });
                    }
                });

                // Find all unique dates in the combined history
                const allDates = new Set<string>();
                combinedHistory.forEach((entry) => {
                    allDates.add(entry.date.toISOString().split("T")[0]);
                });

                // Sort dates chronologically
                const sortedDates = Array.from(allDates).sort();

                // Create chart data with proper debt totals for each date
                const chartData: { date: string; amount: number; timestamp: number }[] =
                    [];

                // Track the latest known amount for each debt
                const latestDebtAmounts: { [key: string]: number } = {};

                sortedDates.forEach((dateStr) => {
                    // Get all entries for this date
                    const entriesForDate = combinedHistory.filter(
                        (entry) => entry.date.toISOString().split("T")[0] === dateStr
                    );

                    // Update the latest amounts for debts that changed on this date
                    entriesForDate.forEach((entry) => {
                        latestDebtAmounts[entry.debtId] = entry.amount;
                    });

                    // Calculate total debt for this date using the latest known amounts
                    const totalDebt = Object.values(latestDebtAmounts).reduce(
                        (sum, amount) => sum + amount,
                        0
                    );

                    // Add to chart data
                    const date = new Date(dateStr);
                    chartData.push({
                        date: date.toLocaleDateString(),
                        amount: totalDebt,
                        timestamp: date.getTime(),
                    });
                });

                // Ensure chart data is sorted by timestamp
                chartData.sort((a, b) => a.timestamp - b.timestamp);

                // Calculate debt progress metrics
                if (chartData.length > 0) {
                    const currentDebt = chartData[chartData.length - 1].amount;
                    const maxDebt = Math.max(...chartData.map((data) => data.amount));
                    const percentGone =
                        maxDebt > 0
                            ? Math.round(((maxDebt - currentDebt) / maxDebt) * 100)
                            : 0;

                    setDebtProgress({
                        currentDebt,
                        maxDebt,
                        percentGone,
                    });
                }

                // Initialize all activities as expanded
                const initialExpandedState: Record<string, boolean> = {};
                activityLogData.forEach((activity) => {
                    initialExpandedState[activity.historyId] = true;
                });
                setExpandedActivities(initialExpandedState);

                // Fetch comments for all activities
                const commentsData: Record<string, DebtComment[]> = {};
                for (const activity of activityLogData) {
                    try {
                        const activityComments = await getDebtComments(activity.debtId);
                        const filteredComments = activityComments.filter(
                            (comment) => comment.debt_history_id === activity.historyId
                        );
                        if (filteredComments.length > 0) {
                            commentsData[activity.historyId] = filteredComments;
                        }
                    } catch (error) {
                        console.error(
                            `Error fetching comments for activity ${activity.historyId}:`,
                            error
                        );
                    }
                }

                setComments(commentsData);
                setHistoryData(chartData);
                setActivityLog(activityLogData.reverse()); // Most recent first
            } catch (error) {
                console.error("Error fetching debt history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllDebtHistory();
    }, [debts, getDebtHistory, getDebtComments]);

    const handleCommentChange = (activityId: string, value: string) => {
        setNewComments((prev) => ({
            ...prev,
            [activityId]: value,
        }));
    };

    const toggleActivityExpansion = (activityId: string) => {
        setExpandedActivities((prev) => ({
            ...prev,
            [activityId]: !prev[activityId],
        }));
    };

    const handleAddComment = async (debtId: string, historyId: string) => {
        if (!user) {
            alert("You must be logged in to add comments");
            return;
        }

        const commentText = newComments[historyId];
        if (!commentText?.trim()) return;

        setSubmittingComment(historyId);

        try {
            await addDebtComment(debtId, commentText.trim(), historyId);

            // Refresh comments for this activity
            const updatedComments = await getDebtComments(debtId);
            const filteredComments = updatedComments.filter(
                (comment) => comment.debt_history_id === historyId
            );

            setComments((prev) => ({
                ...prev,
                [historyId]: filteredComments,
            }));

            // Clear the comment input
            setNewComments((prev) => ({
                ...prev,
                [historyId]: "",
            }));
        } catch (error) {
            console.error("Error adding comment:", error);
            alert("Failed to add comment. Please try again.");
        } finally {
            setSubmittingComment(null);
        }
    };

    const handleDeleteComment = async (
        commentId: string,
        debtId: string,
        historyId: string
    ) => {
        try {
            await deleteDebtComment(commentId);

            // Refresh comments for this activity
            const updatedComments = await getDebtComments(debtId);
            const filteredComments = updatedComments.filter(
                (comment) => comment.debt_history_id === historyId
            );

            setComments((prev) => ({
                ...prev,
                [historyId]: filteredComments,
            }));
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment. Please try again.");
        }
    };

    if (loading && debts.length > 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Debt Over Time</CardTitle>
                    <CardDescription>Loading history data...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (historyData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Debt Over Time</CardTitle>
                    <CardDescription>No history data available yet</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-slate-500 py-8">
                        Update your debt balances to start tracking changes over time
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <TrendingDown className="mr-2 h-5 w-5 text-green-500" />% Debt Gone
                    </CardTitle>
                    <CardDescription>
                        Track your progress in paying down debt
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">
                                Current: {formatCurrency(debtProgress.currentDebt)}
                            </span>
                            <span className="text-sm font-medium">
                                Max: {formatCurrency(debtProgress.maxDebt)}
                            </span>
                        </div>
                        <Progress value={debtProgress.percentGone} className="h-3" />
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-slate-500">0%</span>
                            <span
                                className={`text-lg font-bold ${debtProgress.percentGone > 50
                                    ? "text-green-600"
                                    : "text-blue-600"
                                    }`}
                            >
                                {debtProgress.percentGone}% Gone
                            </span>
                            <span className="text-sm text-slate-500">100%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Debt Activity Log</CardTitle>
                    <CardDescription>
                        Recent changes to your debt balances
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {activityLog.length === 0 ? (
                        <p className="text-center text-slate-500 py-4">
                            No activity recorded yet
                        </p>
                    ) : (
                        <div className="space-y-6">
                            {activityLog.map((activity) => (
                                <div
                                    key={activity.historyId}
                                    className="relative pl-8 pb-6 border-l-2 border-slate-200 last:border-0"
                                >
                                    <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-primary"></div>
                                    <div className="mb-1 text-sm text-slate-500">
                                        {format(
                                            new Date(activity.timestamp),
                                            "MMMM d, yyyy h:mm a"
                                        )}
                                    </div>
                                    <div className="font-medium">
                                        {activity.change === "Added"
                                            ? `Added new debt: ${activity.debtName}`
                                            : `Updated balance for: ${activity.debtName}`}
                                    </div>
                                    <div className="text-lg font-bold mb-2">
                                        {formatCurrency(activity.amount)}
                                        <span
                                            className={`ml-2 text-sm ${activity.change === "Added"
                                                ? "text-blue-500"
                                                : activity.change.startsWith("+")
                                                    ? "text-red-500"
                                                    : "text-green-500"
                                                }`}
                                        >
                                            {activity.change !== "Added" && activity.change}
                                        </span>
                                    </div>

                                    {/* Comments section */}
                                    <div className="mt-3">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center text-slate-500 hover:text-slate-700"
                                            onClick={() =>
                                                toggleActivityExpansion(activity.historyId)
                                            }
                                        >
                                            <MessageSquare className="h-4 w-4 mr-1" />
                                            {expandedActivities[activity.historyId] === false
                                                ? `Show ${comments[activity.historyId]?.length || 0
                                                } Comments`
                                                : `Hide ${comments[activity.historyId]?.length || 0
                                                } Comments`}
                                        </Button>

                                        {expandedActivities[activity.historyId] !== false && (
                                            <div className="mt-2 space-y-3">
                                                {/* Existing comments */}
                                                {comments[activity.historyId]?.length > 0 ? (
                                                    <div className="space-y-2 mb-3">
                                                        {comments[activity.historyId].map((comment) => (
                                                            <div
                                                                key={comment.id}
                                                                className="bg-slate-50 p-3 rounded-md"
                                                            >
                                                                <div className="flex justify-between items-start">
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm whitespace-pre-wrap">
                                                                            {comment.comment}
                                                                        </p>
                                                                        <p className="text-xs text-slate-500">
                                                                            {formatDistanceToNow(
                                                                                new Date(comment.created_at),
                                                                                { addSuffix: true }
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        onClick={() =>
                                                                            handleDeleteComment(
                                                                                comment.id,
                                                                                activity.debtId,
                                                                                activity.historyId
                                                                            )
                                                                        }
                                                                        className="h-6 w-6 text-slate-400 hover:text-red-500"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-sm text-slate-500 italic">
                                                        No comments yet
                                                    </div>
                                                )}

                                                {/* Add comment form */}
                                                {user && (
                                                    <div className="flex space-x-2">
                                                        <Textarea
                                                            placeholder="Add a comment..."
                                                            value={newComments[activity.historyId] || ""}
                                                            onChange={(e) =>
                                                                handleCommentChange(
                                                                    activity.historyId,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="resize-none text-sm min-h-[60px]"
                                                        />
                                                        <Button
                                                            size="icon"
                                                            onClick={() =>
                                                                handleAddComment(
                                                                    activity.debtId,
                                                                    activity.historyId
                                                                )
                                                            }
                                                            disabled={
                                                                !newComments[activity.historyId]?.trim() ||
                                                                submittingComment === activity.historyId
                                                            }
                                                        >
                                                            {submittingComment === activity.historyId ? (
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
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Debt Over Time</CardTitle>
                    <CardDescription>
                        Track how your total debt changes over time
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={historyData}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => {
                                        return historyData.length > 5
                                            ? value.split("/").slice(0, 2).join("/")
                                            : value;
                                    }}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => formatCurrency(value)}
                                />
                                <Tooltip
                                    formatter={(value) => [
                                        formatCurrency(value as number),
                                        "Total Debt",
                                    ]}
                                    labelFormatter={(label) => `Date: ${label}`}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#8884d8"
                                    fill="#8884d8"
                                    fillOpacity={0.3}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
