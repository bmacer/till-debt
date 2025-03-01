'use client'

import { ProtectedRoute } from '@/components/auth/protected-route'
import { useAuth } from '@/contexts/auth-context'
import { useDebts } from '@/contexts/debt-context'
import { Button } from '@/components/ui/button'
import { DebtCard } from '@/components/debt/debt-card'
import { TotalDebtChart } from '@/components/debt/total-debt-chart'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default function DashboardPage() {
    const { user } = useAuth()
    const { debts, loading } = useDebts()

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-6xl space-y-8">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-semibold tracking-tight">Welcome, {user?.email}</h1>
                            <p className="text-slate-500">Track and manage your debt journey</p>
                        </div>
                        <Link href="/dashboard/add-debt">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add New Debt
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center py-8">Loading your debts...</div>
                    ) : debts.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <h2 className="text-xl font-medium">No debts added yet</h2>
                            <p className="text-slate-500">
                                Start tracking your debt by adding your first debt
                            </p>
                            <Link href="/dashboard/add-debt">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Your First Debt
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <>
                            <TotalDebtChart />

                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Your Debts</h2>
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {debts.map((debt) => (
                                        <DebtCard key={debt.id} debt={debt} />
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
} 