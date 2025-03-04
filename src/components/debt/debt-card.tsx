import { Debt } from "@/contexts/debt-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeOff } from "lucide-react";
import { useState } from "react";
import { DebtDetailsModal } from "./debt-details-modal";

interface DebtCardProps {
    debt: Debt;
}

export function DebtCard({ debt }: DebtCardProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="block transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer"
            >
                <Card className="overflow-hidden h-full border hover:border-primary/50 transition-colors">
                    <CardHeader className="p-4 pb-2">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{debt.name}</CardTitle>
                            {debt.private && (
                                <div className="flex items-center text-slate-500">
                                    <EyeOff className="h-4 w-4 mr-1" />
                                    <span className="text-xs">Private</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                        <div className="text-2xl font-bold">${debt.amount.toLocaleString()}</div>
                        <div className="text-xs text-slate-500 mt-1">
                            Last updated: {new Date(debt.updated_at).toLocaleDateString()}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <DebtDetailsModal
                debt={debt}
                isOpen={isModalOpen}
                onOpenChange={setIsModalOpen}
            />
        </>
    );
} 