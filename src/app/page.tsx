import {
    ArrowRight,
    BarChart3,
    ChevronRight,
    CreditCard,
    LineChart,
    PiggyBank,
    Shield,
    TrendingDown,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-slate-50 to-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-slate-900">
                                        Till Debt Do Us Part
                                    </h1>
                                    <p className="max-w-[600px] text-slate-500 md:text-xl">
                                        Track, manage, and conquer your debt journey with a supportive community by your side.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href="/sign-up">
                                        <Button size="lg" className="bg-primary hover:bg-primary/90">
                                            Start Your Journey
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link href="/sign-in">
                                        <Button variant="outline" size="lg">
                                            Sign In
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="relative h-[350px] lg:h-[550px] rounded-xl overflow-hidden">
                                <Image
                                    alt="Financial Freedom"
                                    className="object-cover"
                                    fill
                                    priority
                                    src="/hero-debt-freedom.jpg"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="w-full py-12 md:py-24 bg-white" id="features">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2 max-w-[800px]">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-slate-900">
                                    Take Control of Your Financial Future
                                </h2>
                                <p className="text-slate-500 md:text-xl">
                                    Our platform provides everything you need to track, manage, and eliminate your debt.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <BarChart3 className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Track Your Progress</CardTitle>
                                    <CardDescription>
                                        Visualize your debt payoff journey with intuitive charts and metrics
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500">
                                        Watch your debt decrease over time and celebrate milestones along the way.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <Users className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Community Support</CardTitle>
                                    <CardDescription>
                                        Connect with others on similar journeys
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500">
                                        Share your progress, get advice, and find motivation from people who understand.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <PiggyBank className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Achievement Badges</CardTitle>
                                    <CardDescription>
                                        Earn rewards for your financial progress
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500">
                                        Stay motivated with badges and achievements as you reach debt payoff milestones.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <Shield className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Privacy Controls</CardTitle>
                                    <CardDescription>
                                        Choose what to share and what to keep private
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500">
                                        Control which debts are visible to the community and which remain private.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <LineChart className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Debt History</CardTitle>
                                    <CardDescription>
                                        Track balance changes over time
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500">
                                        See your complete payment history and watch your balance decrease with each update.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader>
                                    <CreditCard className="h-10 w-10 text-primary mb-2" />
                                    <CardTitle>Multiple Debt Types</CardTitle>
                                    <CardDescription>
                                        Track all your debts in one place
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-500">
                                        From credit cards to student loans, manage all your debts with a unified dashboard.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="w-full py-12 md:py-24 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                            <div className="space-y-2 max-w-[800px]">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-slate-900">
                                    How It Works
                                </h2>
                                <p className="text-slate-500 md:text-xl">
                                    Getting started on your debt-free journey is simple
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-8 md:grid-cols-3 mx-auto max-w-5xl">
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">1</div>
                                </div>
                                <h3 className="text-xl font-bold">Create Your Account</h3>
                                <p className="text-slate-500">Sign up for free and set up your personal debt dashboard</p>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">2</div>
                                </div>
                                <h3 className="text-xl font-bold">Add Your Debts</h3>
                                <p className="text-slate-500">Enter your current debts and set privacy preferences</p>
                            </div>
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="bg-primary/10 p-3 rounded-full">
                                    <div className="bg-primary text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold">3</div>
                                </div>
                                <h3 className="text-xl font-bold">Track & Connect</h3>
                                <p className="text-slate-500">Update your progress and engage with the community</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full py-12 md:py-24 bg-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
                            <div className="space-y-2 max-w-[800px]">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl text-slate-900">
                                    Success Stories
                                </h2>
                                <p className="text-slate-500 md:text-xl">
                                    See how others have transformed their financial lives
                                </p>
                            </div>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mx-auto max-w-6xl">
                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="rounded-full bg-slate-100 w-12 h-12 flex items-center justify-center">
                                                <span className="font-bold text-primary">JD</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold">John D.</h3>
                                                <p className="text-sm text-slate-500">Paid off $32,000 in 18 months</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 italic">
                                            &quot;This platform kept me accountable and motivated. Seeing my progress visualized made all the difference in staying on track.&quot;
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="rounded-full bg-slate-100 w-12 h-12 flex items-center justify-center">
                                                <span className="font-bold text-primary">SM</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold">Sarah M.</h3>
                                                <p className="text-sm text-slate-500">Eliminated $45,000 in student loans</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 italic">
                                            &quot;The community support was incredible. Having others cheer me on made the journey less lonely and more achievable.&quot;
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border-slate-200 shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex flex-col space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <div className="rounded-full bg-slate-100 w-12 h-12 flex items-center justify-center">
                                                <span className="font-bold text-primary">RJ</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold">Robert & Jamie</h3>
                                                <p className="text-sm text-slate-500">Debt-free after 3 years</p>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 italic">
                                            &quot;As a couple, we needed a way to track our combined debt journey. This platform made it simple to see our progress together.&quot;
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-12 md:py-24 bg-primary text-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col items-center text-center space-y-4 mx-auto max-w-3xl">
                            <TrendingDown className="h-16 w-16 mb-4" />
                            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                Ready to Break Free From Debt?
                            </h2>
                            <p className="text-primary-foreground/80 md:text-xl max-w-[800px]">
                                Join thousands of others who are taking control of their financial future.
                                Start your journey to debt freedom today.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-6">
                                <Link href="/sign-up">
                                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                                        Create Your Free Account
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                                <Link href="/explore">
                                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-primary">
                                        Explore Community
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="w-full py-6 bg-slate-900 text-slate-200">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <PiggyBank className="h-6 w-6" />
                                <span className="text-lg font-bold">Till Debt Do Us Part</span>
                            </div>
                            <p className="text-sm text-slate-400">
                                Your partner in the journey to financial freedom.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-4">Quick Links</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                                <li><Link href="/explore" className="hover:text-white transition-colors">Explore</Link></li>
                                <li><Link href="/sign-in" className="hover:text-white transition-colors">Sign In</Link></li>
                                <li><Link href="/sign-up" className="hover:text-white transition-colors">Sign Up</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-4">Resources</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition-colors">Debt Payoff Strategies</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Financial Education</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Success Stories</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">FAQ</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium mb-4">Legal</h3>
                            <ul className="space-y-2 text-sm">
                                <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                                <li><Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-xs text-slate-400">
                            © {new Date().getFullYear()} Till Debt Do Us Part. All rights reserved.
                        </p>
                        <div className="flex space-x-4 mt-4 md:mt-0">
                            <Link href="#" className="text-slate-400 hover:text-white">
                                <span className="sr-only">Twitter</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-white">
                                <span className="sr-only">Instagram</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </Link>
                            <Link href="#" className="text-slate-400 hover:text-white">
                                <span className="sr-only">Facebook</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
