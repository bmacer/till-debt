"use client"

import { ArrowDown, ArrowUp, CreditCard, DollarSign, LineChart, PieChart, Wallet } from "lucide-react"
import { Cell, Pie, PieChart as RePieChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DebtProfile() {
  // Sample data
  const debts = [
    { name: "Credit Cards", value: 12500, color: "#94A3B8" },
    { name: "Student Loans", value: 45000, color: "#64748B" },
    { name: "Car Loan", value: 18000, color: "#475569" },
    { name: "Personal Loan", value: 5000, color: "#334155" },
  ]

  const totalDebt = debts.reduce((acc, debt) => acc + debt.value, 0)

  return (
    <div className="h-full min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">My Debt Snapshot</h1>
          <p className="text-slate-500">Track and manage your debt journey</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
              <DollarSign className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalDebt.toLocaleString()}</div>
              <div className="text-xs text-slate-500">+2.5% from last month</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
              <Wallet className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$1,250</div>
              <div className="text-xs text-green-500">-$50 from last month</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Interest Paid (YTD)</CardTitle>
              <LineChart className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,840</div>
              <div className="text-xs text-red-500">+$320 from last month</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Debt-to-Income</CardTitle>
              <PieChart className="h-4 w-4 text-slate-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42%</div>
              <div className="text-xs text-slate-500">Recommended: Below 36%</div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Debt Breakdown</CardTitle>
              <CardDescription>Distribution of your current debts</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[240px] w-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={debts}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {debts.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Debt Details</CardTitle>
              <CardDescription>Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {debts.map((debt) => (
                <div key={debt.name} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{debt.name}</span>
                    <span>${debt.value.toLocaleString()}</span>
                  </div>
                  <Progress value={(debt.value / totalDebt) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <Tabs defaultValue="overview" className="w-full">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle>Recent Activity</CardTitle>
                <TabsList className="grid w-full max-w-[200px] grid-cols-2">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>
              </CardHeader>
              <CardContent>
                <TabsContent value="overview" className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full border p-2">
                      <ArrowUp className="h-4 w-4 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Credit Card Interest Charged</p>
                      <p className="text-xs text-slate-500">Feb 15, 2024</p>
                    </div>
                    <div className="text-sm font-medium text-red-500">+$89.00</div>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full border p-2">
                      <ArrowDown className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Student Loan Payment</p>
                      <p className="text-xs text-slate-500">Feb 12, 2024</p>
                    </div>
                    <div className="text-sm font-medium text-green-500">-$450.00</div>
                  </div>
                </TabsContent>
                <TabsContent value="payments" className="space-y-4">
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full border p-2">
                      <CreditCard className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Next Payment Due</p>
                      <p className="text-xs text-slate-500">Credit Card - Mar 15, 2024</p>
                    </div>
                    <Button size="sm">Pay Now</Button>
                  </div>
                  <div className="flex items-center gap-4 rounded-lg border p-4">
                    <div className="rounded-full border p-2">
                      <CreditCard className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Next Payment Due</p>
                      <p className="text-xs text-slate-500">Car Loan - Mar 1, 2024</p>
                    </div>
                    <Button size="sm">Pay Now</Button>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Payoff Progress</CardTitle>
              <CardDescription>Track your debt freedom journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Total Progress</span>
                  <span className="text-slate-500">35% paid off</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Estimated Debt-Free Date</p>
                    <p className="text-2xl font-bold">June 2027</p>
                  </div>
                  <Button>View Plan</Button>
                </div>
                <p className="text-xs text-slate-500">
                  Based on current payment schedule and interest rates. Paying an extra $100/month could make you
                  debt-free 8 months sooner!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
