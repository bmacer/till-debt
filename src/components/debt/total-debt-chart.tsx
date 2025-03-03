"use client";

import { useState, useEffect } from "react";
import { useDebts } from "@/contexts/debt-context";
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
import { DebtActivityComments } from "@/components/debt/debt-activity-comments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/utils";

export function TotalDebtChart() {
    const { debts, getDebtHistory } = useDebts();
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
        }[]
    >([]);

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
                        });
                    }
                });

                // Group by date to get total debt per day
                const dateEntries: { [key: string]: { total: number; date: Date } } =
                    {};

                combinedHistory.forEach((entry) => {
                    const dateStr = entry.date.toISOString().split("T")[0];

                    if (!dateEntries[dateStr]) {
                        dateEntries[dateStr] = {
                            total: 0,
                            date: entry.date,
                        };
                    }
                });

                // For each date, calculate the total debt by summing the latest amount for each debt
                Object.keys(dateEntries).forEach((dateStr) => {
                    const currentDebtAmounts: { [key: string]: number } = {};

                    // Find the latest amount for each debt up to this date
                    combinedHistory.forEach((entry) => {
                        const entryDateStr = entry.date.toISOString().split("T")[0];
                        if (entryDateStr <= dateStr) {
                            currentDebtAmounts[entry.debtId] = entry.amount;
                        }
                    });

                    // Sum up all debt amounts for this date
                    const totalDebt = Object.values(currentDebtAmounts).reduce(
                        (sum, amount) => sum + amount,
                        0
                    );
                    dateEntries[dateStr].total = totalDebt;
                });

                // Convert to chart data format
                const chartData = Object.entries(dateEntries).map(([, data]) => ({
                    date: data.date.toLocaleDateString(),
                    amount: data.total,
                    timestamp: data.date.getTime(),
                }));

                setHistoryData(chartData);
                setActivityLog(activityLogData.reverse()); // Most recent first
            } catch (error) {
                console.error("Error fetching debt history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllDebtHistory();
    }, [debts, getDebtHistory]);

    if (loading && debts.length > 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Total Debt Over Time</CardTitle>
                    <CardDescription>Loading history data...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (historyData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Total Debt Over Time</CardTitle>
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
                    <CardTitle>Total Debt Over Time</CardTitle>
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

            <Tabs defaultValue="activity">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="activity">Activity Log</TabsTrigger>
                    <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>
                <TabsContent value="activity">
                    <Card>
                        <CardHeader>
                            <CardTitle>Debt Activity Log</CardTitle>
                            <CardDescription>
                                Recent changes to your debt balances
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 max-h-[300px] overflow-y-auto">
                                {activityLog.length === 0 ? (
                                    <p className="text-center text-slate-500 py-4">
                                        No activity recorded yet
                                    </p>
                                ) : (
                                    activityLog.map((entry, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between py-2 border-b"
                                        >
                                            <div>
                                                <p className="font-medium">{entry.debtName}</p>
                                                <p className="text-sm text-slate-500">{entry.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">
                                                    {formatCurrency(entry.amount)}
                                                </p>
                                                <p
                                                    className={`text-sm ${entry.change === "Added"
                                                            ? "text-blue-500"
                                                            : entry.change.startsWith("+")
                                                                ? "text-red-500"
                                                                : "text-green-500"
                                                        }`}
                                                >
                                                    {entry.change}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="comments">
                    {debts.length > 0 && <DebtActivityComments debtId={debts[0].id} />}
                </TabsContent>
            </Tabs>
        </div>
    );
}
