"use client";

import { useState, useEffect } from "react";
import { useDebts, Debt, DebtHistory } from "@/contexts/debt-context";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ArrowLeft,
    EyeOff,
    Pencil,
    Save,
    Trash,
    DollarSign,
    Eye,
    PiggyBank,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import confetti from "canvas-confetti";

interface DebtDetailsModalProps {
    debt: Debt;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function DebtDetailsModal({
    debt,
    isOpen,
    onOpenChange,
}: DebtDetailsModalProps) {
    const { updateBalance, updateDebt, deleteDebt, getDebtHistory } = useDebts();
    const [history, setHistory] = useState<DebtHistory[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newBalance, setNewBalance] = useState("");
    const [isPrivate, setIsPrivate] = useState(debt.private);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const historyData = await getDebtHistory(debt.id);
                setHistory(historyData);
            } catch (error) {
                console.error("Error fetching debt history:", error);
            }
        };

        if (isOpen) {
            fetchHistory();
        }
    }, [debt.id, getDebtHistory, isOpen]);
    // Create a full-screen canvas for confetti
    const triggerConfetti = () => {
        // Create a full-screen canvas for confetti
        const myCanvas = document.createElement("canvas");
        myCanvas.style.position = "fixed";
        myCanvas.style.top = "0";
        myCanvas.style.left = "0";
        myCanvas.style.width = "100vw";
        myCanvas.style.height = "100vh";
        myCanvas.style.pointerEvents = "none";
        myCanvas.style.zIndex = "9999";
        document.body.appendChild(myCanvas);

        const myConfetti = confetti.create(myCanvas, {
            resize: true,
            useWorker: true,
        });

        // Fire confetti
        const duration = 2000;
        const end = Date.now() + duration;

        const frame = () => {
            myConfetti({
                particleCount: 3,
                angle: 60,
                spread: 85,
                origin: { x: 0 },
                colors: ["#ff0000", "#00ff00", "#0000ff"],
            });
            myConfetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ["#ff0000", "#00ff00", "#0000ff"],
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            } else {
                // Remove canvas after animation
                setTimeout(() => {
                    document.body.removeChild(myCanvas);
                }, 1000);
            }
        };

        frame();
    };

    useEffect(() => {
        triggerConfetti();
    }, []);

    const handleUpdateBalance = async () => {
        if (!newBalance) return;

        try {
            const amount = parseFloat(newBalance);

            // Check if new balance is less than current balance
            if (amount < debt.amount) {
                triggerConfetti();
            }

            await updateBalance(debt.id, amount);
            setNewBalance("");
            setIsEditing(false);
            // Refresh history after update
            const historyData = await getDebtHistory(debt.id);
            setHistory(historyData);
        } catch (error) {
            console.error("Error updating balance:", error);
        }
    };

    const handleTogglePrivacy = async () => {
        try {
            await updateDebt(debt.id, { private: !isPrivate });
            setIsPrivate(!isPrivate);
        } catch (error) {
            console.error("Error updating privacy:", error);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteDebt(debt.id);
            onOpenChange(false);
        } catch (error) {
            console.error("Error deleting debt:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    // Prepare data for the chart
    const chartData = history
        .map((item) => ({
            date: format(new Date(item.recorded_at), "MMM d, yyyy"),
            amount: item.amount,
            timestamp: new Date(item.recorded_at).getTime(),
        }))
        .sort((a, b) => a.timestamp - b.timestamp);

    // Calculate original amount from the first history entry or use current amount
    const originalAmount = history.length > 0 ? history[0].amount : debt.amount;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl">
                <DialogHeader>
                    <DialogTitle className="flex justify-between items-center">
                        <span className="text-2xl">{debt.name}</span>
                        {debt.private && (
                            <div className="flex items-center text-slate-500">
                                <EyeOff className="h-5 w-5 mr-1" />
                                <span>Private</span>
                            </div>
                        )}
                    </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-2xl font-bold">
                                        {debt.name}
                                    </CardTitle>
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
                                        <h3 className="text-lg font-medium mb-4">
                                            Balance History
                                        </h3>
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
                                                        formatter={(value) => [
                                                            formatCurrency(value as number),
                                                            "Amount",
                                                        ]}
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
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
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
                                            <Button
                                                onClick={handleUpdateBalance}
                                                disabled={!newBalance}
                                            >
                                                <Save className="mr-2 h-4 w-4" /> Save
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setIsEditing(false)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <Button onClick={() => setIsEditing(true)} className="w-full">
                                        <Pencil className="mr-2 h-4 w-4" /> Update Balance
                                    </Button>
                                )}

                                <div className="space-y-2">
                                    <Label className="flex items-center space-x-2">
                                        <Switch
                                            checked={isPrivate}
                                            onCheckedChange={handleTogglePrivacy}
                                        />
                                        <span>Private Mode</span>
                                    </Label>
                                    <p className="text-sm text-slate-500">
                                        When enabled, this debt will be hidden from public views
                                    </p>
                                </div>

                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="w-full"
                                >
                                    <Trash className="mr-2 h-4 w-4" />
                                    {isDeleting ? "Deleting..." : "Delete Debt"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
