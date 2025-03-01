"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useDebts, DebtHistory } from "@/contexts/debt-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, EyeOff, Pencil, Save, Trash, DollarSign, Eye, PiggyBank } from "lucide-react";
import { DebtActivityComments } from "@/components/debt/debt-activity-comments";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";

export default function DebtDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { updateBalance, updateDebt, deleteDebt, getDebt, getDebtHistory } = useDebts();
    const [debt, setDebt] = useState<any>(null);
    const [history, setHistory] = useState<DebtHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newBalance, setNewBalance] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const debtId = params.id as string;

    useEffect(() => {
        const fetchDebtDetails = async () => {
            setLoading(true);
            try {
                const debtData = await getDebt(debtId);
                setDebt(debtData);
                setIsPrivate(debtData?.private || false);

                const historyData = await getDebtHistory(debtId);
                setHistory(historyData);
            } catch (error) {
                console.error("Error fetching debt details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (debtId) {
            fetchDebtDetails();
        }
    }, [debtId, getDebt, getDebtHistory]);

    const handleUpdateBalance = async () => {
        if (!debt || !newBalance) return;

        try {
            const amount = parseFloat(newBalance);
            await updateBalance(debt.id, amount);

            // Update local state
            setDebt({
                ...debt,
                amount,
                updated_at: new Date().toISOString(),
            });

            setNewBalance("");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating balance:", error);
        }
    };

    const handleTogglePrivacy = async () => {
        if (!debt) return;

        try {
            await updateDebt(debt.id, { private: !isPrivate });

            // Update local state
            setDebt({
                ...debt,
                private: !isPrivate,
                updated_at: new Date().toISOString(),
            });

            setIsPrivate(!isPrivate);
        } catch (error) {
            console.error("Error updating privacy:", error);
        }
    };

    const handleDelete = async () => {
        if (!debt) return;

        setIsDeleting(true);
        try {
            await deleteDebt(debt.id);
            router.push("/dashboard");
        } catch (error) {
            console.error("Error deleting debt:", error);
            setIsDeleting(false);
        }
    };

    const handleBack = () => {
        router.push("/dashboard");
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="container mx-auto max-w-4xl py-8">Loading debt details...</div>
            </ProtectedRoute>
        );
    }

    if (!debt) {
        return (
            <ProtectedRoute>
                <div className="container mx-auto max-w-4xl py-8">
                    <h1 className="text-2xl font-bold mb-4">Debt Not Found</h1>
                    <p>The debt you're looking for doesn't exist or you don't have permission to view it.</p>
                    <Button onClick={handleBack} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </ProtectedRoute>
        );
    }

    // Prepare data for the chart
    const chartData = history.map(item => ({
        date: format(new Date(item.recorded_at), 'MMM d, yyyy'),
        amount: item.amount,
        timestamp: new Date(item.recorded_at).getTime()
    })).sort((a, b) => a.timestamp - b.timestamp);

    // Calculate original amount from the first history entry or use current amount
    const originalAmount = history.length > 0
        ? history[0].amount
        : debt.amount;

    return (
        <ProtectedRoute>
            <div className="container mx-auto max-w-4xl py-8">
                <Button onClick={handleBack} variant="outline" className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">{debt.name}</h1>
                    {debt.private && (
                        <div className="flex items-center text-slate-500">
                            <EyeOff className="h-5 w-5 mr-1" />
                            <span>Private</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Update Balance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col space-y-4">
                                {isEditing ? (
                                    <>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg">$</span>
                                            <Input
                                                type="number"
                                                value={newBalance}
                                                onChange={(e) => setNewBalance(e.target.value)}
                                                placeholder="Enter new balance"
                                                className="max-w-xs"
                                            />
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button onClick={handleUpdateBalance} disabled={!newBalance}>
                                                <Save className="mr-2 h-4 w-4" /> Save
                                            </Button>
                                            <Button variant="outline" onClick={() => setIsEditing(false)}>
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-2xl font-bold">{formatCurrency(debt.amount)}</p>
                                        <Button onClick={() => setIsEditing(true)}>
                                            <Pencil className="mr-2 h-4 w-4" /> Update Balance
                                        </Button>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Privacy Settings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="private-mode"
                                    checked={isPrivate}
                                    onCheckedChange={handleTogglePrivacy}
                                />
                                <Label htmlFor="private-mode" className="flex items-center cursor-pointer">
                                    <EyeOff className="mr-2 h-4 w-4" /> Private Mode
                                </Label>
                            </div>
                            <p className="text-sm text-slate-500 mt-2">
                                When enabled, this debt will be hidden from public views and summaries.
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-red-500">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="w-full"
                            >
                                <Trash className="mr-2 h-4 w-4" />
                                {isDeleting ? "Deleting..." : "Delete This Debt"}
                            </Button>
                            <p className="text-sm text-slate-500 mt-2">
                                This action cannot be undone. All data associated with this debt will be permanently removed.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold">{debt.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        {debt.private ? (
                                            <span className="flex items-center text-amber-600">
                                                <EyeOff className="mr-1 h-4 w-4" /> Private
                                            </span>
                                        ) : (
                                            <span className="flex items-center text-green-600">
                                                <Eye className="mr-1 h-4 w-4" /> Public
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="text-3xl font-bold text-right">
                                    {formatCurrency(debt.amount)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
                                    <div className="flex items-center">
                                        <DollarSign className="mr-2 h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Original Amount</p>
                                            <p>{formatCurrency(originalAmount)}</p>
                                        </div>
                                    </div>
                                </div>

                                {chartData.length > 1 && (
                                    <div className="mt-6">
                                        <h3 className="text-lg font-medium mb-4">Balance History</h3>
                                        <div className="h-[300px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={chartData}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis
                                                        dataKey="date"
                                                        tick={{ fontSize: 12 }}
                                                        interval="preserveStartEnd"
                                                    />
                                                    <YAxis
                                                        tickFormatter={(value) => formatCurrency(value)}
                                                        width={80}
                                                    />
                                                    <Tooltip
                                                        formatter={(value) => [formatCurrency(value as number), "Amount"]}
                                                        labelFormatter={(label) => `Date: ${label}`}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="amount"
                                                        stroke="#8884d8"
                                                        strokeWidth={2}
                                                        dot={{ r: 4 }}
                                                        activeDot={{ r: 6 }}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="mt-6">
                            <DebtActivityComments debtId={debtId} />
                        </div>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <PiggyBank className="mr-2 h-5 w-5" />
                                    Activity Log
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {history.length === 0 ? (
                                    <p className="text-center text-sm text-slate-500 py-4">No activity recorded yet</p>
                                ) : (
                                    <div className="space-y-4">
                                        {[...history].reverse().map((item, index) => (
                                            <div key={item.id} className="border-b pb-4 last:border-b-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-medium">
                                                            {formatCurrency(item.amount)}
                                                        </p>
                                                        <p className="text-sm text-slate-500">
                                                            {format(new Date(item.recorded_at), 'MMM d, yyyy h:mm a')}
                                                        </p>
                                                    </div>
                                                    {index === 0 && (
                                                        <div className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                                            Latest
                                                        </div>
                                                    )}
                                                </div>
                                                <DebtActivityComments debtId={debtId} historyId={item.id} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
} 