"use client";

import { ProtectedRoute } from "@/components/auth/protected-route";
import { AddDebtForm } from "@/components/debt/add-debt-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AddDebtPage() {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    <div className="flex items-center space-x-2">
                        <Link href="/dashboard">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </Link>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-semibold tracking-tight">Add New Debt</h1>
                        <p className="text-slate-500">
                            Enter the details of your debt to start tracking it
                        </p>
                    </div>

                    <AddDebtForm />
                </div>
            </div>
        </ProtectedRoute>
    );
} 