"use client";

import { useState, useEffect } from "react";
import { useDebts, DebtHistory } from "@/contexts/debt-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DebtHistoryChartProps {
    debtId: string;
}

export function DebtHistoryChart({ debtId }: DebtHistoryChartProps) {
    const { getDebtHistory } = useDebts();
    const [historyData, setHistoryData] = useState<DebtHistory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            setLoading(true);
            try {
                const history = await getDebtHistory(debtId);
                setHistoryData(history);
            } catch (error) {
                console.error("Error fetching debt history:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [debtId, getDebtHistory]);

    // Format the data for the chart
    const chartData = historyData.map((entry) => ({
        date: new Date(entry.recorded_at).toLocaleDateString(),
        amount: entry.amount,
        timestamp: new Date(entry.recorded_at).getTime(), // For sorting
    }));

    // Sort by timestamp
    chartData.sort((a, b) => a.timestamp - b.timestamp);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Balance History</CardTitle>
                    <CardDescription>Loading history data...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    if (historyData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Balance History</CardTitle>
                    <CardDescription>No history data available yet</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-slate-500 py-8">
                        Update your balance to start tracking changes over time
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Balance History</CardTitle>
                <CardDescription>Track how your debt balance changes over time</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
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
                                    // Shorten date format if there are many points
                                    return chartData.length > 5 ? value.split('/').slice(0, 2).join('/') : value;
                                }}
                            />
                            <YAxis
                                tick={{ fontSize: 12 }}
                                tickFormatter={(value) => `$${value}`}
                            />
                            <Tooltip
                                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Balance"]}
                                labelFormatter={(label) => `Date: ${label}`}
                            />
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#8884d8"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Balance History</h4>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {chartData.map((entry, index) => (
                            <div key={index} className="flex justify-between text-sm border-b pb-1">
                                <span>{entry.date}</span>
                                <span className="font-medium">${entry.amount.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 