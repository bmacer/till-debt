"use client";

import { useState, useEffect } from "react";
import { useDebts } from "@/contexts/debt-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingDown, Star, Trophy, Medal } from "lucide-react";

export function AchievementBadges() {
    const { debts, getDebtHistory } = useDebts();
    const [achievements, setAchievements] = useState<{
        firstDebtCreated: boolean;
        firstDebtAdjusted: boolean;
        debtPaidOff: boolean;
        consistentPayments: boolean;
    }>({
        firstDebtCreated: false,
        firstDebtAdjusted: false,
        debtPaidOff: false,
        consistentPayments: false,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAchievements = async () => {
            if (!debts.length) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Check for first debt created
                const firstDebtCreated = debts.length > 0;

                // Check for first debt adjusted
                let firstDebtAdjusted = false;
                let debtPaidOff = false;

                // Get history for all debts
                const allHistoryPromises = debts.map(debt => getDebtHistory(debt.id));
                const allHistoryResults = await Promise.all(allHistoryPromises);

                // Check if any debt has history entries (meaning it was adjusted)
                firstDebtAdjusted = allHistoryResults.some(history => history.length > 1);

                // Check if any debt was paid off (has a 0 balance entry after having a non-zero balance)
                for (let i = 0; i < allHistoryResults.length; i++) {
                    const history = allHistoryResults[i];
                    if (history.length > 1) {
                        // Check if the most recent entry is 0 and a previous entry was > 0
                        const hasNonZeroEntry = history.slice(0, -1).some(entry => entry.amount > 0);
                        const latestIsZero = history[history.length - 1].amount === 0;

                        if (hasNonZeroEntry && latestIsZero) {
                            debtPaidOff = true;
                            break;
                        }
                    }
                }

                // Check for consistent payments (3+ consecutive decreases in balance)
                let consistentPayments = false;
                for (const history of allHistoryResults) {
                    if (history.length >= 4) { // Need at least 4 entries to have 3 consecutive decreases
                        let consecutiveDecreases = 0;
                        for (let i = 1; i < history.length; i++) {
                            if (history[i].amount < history[i - 1].amount) {
                                consecutiveDecreases++;
                                if (consecutiveDecreases >= 3) {
                                    consistentPayments = true;
                                    break;
                                }
                            } else {
                                consecutiveDecreases = 0;
                            }
                        }
                        if (consistentPayments) break;
                    }
                }

                setAchievements({
                    firstDebtCreated,
                    firstDebtAdjusted,
                    debtPaidOff,
                    consistentPayments,
                });
            } catch (error) {
                console.error("Error checking achievements:", error);
            } finally {
                setLoading(false);
            }
        };

        checkAchievements();
    }, [debts, getDebtHistory]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Your Achievements</CardTitle>
                    <CardDescription>Loading your achievements...</CardDescription>
                </CardHeader>
            </Card>
        );
    }

    // If no achievements, don't show the section
    if (!achievements.firstDebtCreated &&
        !achievements.firstDebtAdjusted &&
        !achievements.debtPaidOff &&
        !achievements.consistentPayments) {
        return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center">
                    <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
                    Your Achievements
                </CardTitle>
                <CardDescription>Track your debt management milestones</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {achievements.firstDebtCreated && (
                        <div className="flex flex-col items-center p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                            <Award className="h-8 w-8 text-blue-500 mb-2" />
                            <span className="text-sm font-medium text-center">First Debt Created</span>
                            <span className="text-xs text-slate-500">You&apos;ve started your journey!</span>
                        </div>
                    )}

                    {achievements.firstDebtAdjusted && (
                        <div className="flex flex-col items-center p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                            <TrendingDown className="h-8 w-8 text-green-500 mb-2" />
                            <span className="text-sm font-medium text-center">First Debt Adjusted</span>
                            <span className="text-xs text-slate-500">You&apos;re making progress!</span>
                        </div>
                    )}

                    {achievements.debtPaidOff && (
                        <div className="flex flex-col items-center p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                            <Star className="h-8 w-8 text-yellow-500 mb-2" />
                            <span className="text-sm font-medium text-center">Debt Paid Off</span>
                            <span className="text-xs text-slate-500">Congratulations!</span>
                        </div>
                    )}

                    {achievements.consistentPayments && (
                        <div className="flex flex-col items-center p-3 border rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                            <Medal className="h-8 w-8 text-purple-500 mb-2" />
                            <span className="text-sm font-medium text-center">Consistent Payments</span>
                            <span className="text-xs text-slate-500">You&apos;re on a streak!</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
} 