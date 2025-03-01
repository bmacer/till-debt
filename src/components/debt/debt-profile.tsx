"use client";

import { Debt } from "@/contexts/debt-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EyeOff } from "lucide-react";

interface DebtProfileProps {
    debt: Debt;
}

export function DebtProfile({ debt }: DebtProfileProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>Debt Details</span>
                    {debt.private && (
                        <Badge variant="outline" className="flex items-center gap-1">
                            <EyeOff className="h-3 w-3" /> Private
                        </Badge>
                    )}
                </CardTitle>
                <CardDescription>Information about this debt</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-slate-500">Name</h3>
                        <p className="text-lg font-semibold">{debt.name}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500">Current Balance</h3>
                        <p className="text-2xl font-bold">${debt.amount.toLocaleString()}</p>
                    </div>

                    {debt.description && (
                        <div>
                            <h3 className="text-sm font-medium text-slate-500">Description</h3>
                            <p className="text-base">{debt.description}</p>
                        </div>
                    )}

                    <div>
                        <h3 className="text-sm font-medium text-slate-500">Created</h3>
                        <p className="text-base">{new Date(debt.created_at).toLocaleDateString()}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-slate-500">Last Updated</h3>
                        <p className="text-base">{new Date(debt.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 