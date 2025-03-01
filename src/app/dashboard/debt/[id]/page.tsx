"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useDebts, Debt } from "@/contexts/debt-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, EyeOff, Pencil, Save, Trash } from "lucide-react";
import { DebtProfile } from "@/components/debt/debt-profile";
import { DebtHistoryChart } from "@/components/debt/debt-history-chart";

export default function DebtDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { updateBalance, updateDebt, deleteDebt, getDebt } = useDebts();
    const [debt, setDebt] = useState<Debt | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [newBalance, setNewBalance] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const debtId = params.id as string;

    useEffect(() => {
        const fetchDebt = async () => {
            setLoading(true);
            try {
                const debtData = await getDebt(debtId);
                if (debtData) {
                    setDebt(debtData);
                    setIsPrivate(debtData.private);
                }
            } catch (error) {
                console.error("Error fetching debt:", error);
            } finally {
                setLoading(false);
            }
        };

        if (debtId) {
            fetchDebt();
        }
    }, [debtId, getDebt]);

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
                <div className="container py-8">Loading debt details...</div>
            </ProtectedRoute>
        );
    }

    if (!debt) {
        return (
            <ProtectedRoute>
                <div className="container py-8">
                    <h1 className="text-2xl font-bold mb-4">Debt Not Found</h1>
                    <p>The debt you're looking for doesn't exist or you don't have permission to view it.</p>
                    <Button onClick={handleBack} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="container py-8">
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
                                        <p className="text-2xl font-bold">${debt.amount.toLocaleString()}</p>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DebtProfile debt={debt} />
                    <DebtHistoryChart debtId={debtId} />
                </div>
            </div>
        </ProtectedRoute>
    );
} 