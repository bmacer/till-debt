import {
    ArrowRight,
    Award,
    BookOpen,
    Heart,
    LightbulbIcon,
    Shield,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Component() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="px-4 lg:px-6 h-16 flex items-center border-b">
                <Link className="flex items-center justify-center" href="#">
                    <LightbulbIcon className="h-6 w-6 text-primary" />
                    <span className="ml-2 text-lg font-bold">RoadToDebtFree.com</span>
                </Link>
                <nav className="ml-auto flex gap-4 sm:gap-6">
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="#features"
                    >
                        Features
                    </Link>
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="#stories"
                    >
                        Success Stories
                    </Link>
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="#about"
                    >
                        About Us
                    </Link>
                    <Link
                        className="text-sm font-medium hover:underline underline-offset-4"
                        href="#contact"
                    >
                        Contact
                    </Link>
                </nav>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                                        Till Debt Do Us Part
                                    </h1>
                                    <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
                                        Join thousands of others on their journey to financial
                                        freedom. Share stories, track progress, and break free from
                                        debt together.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button size="lg">
                                        Start Your Journey
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="lg">
                                        Explore Success Stories
                                    </Button>
                                </div>
                            </div>
                            <Image
                                alt="Hero"
                                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:aspect-square"
                                height="550"
                                src="/hero.jpg"
                                width="550"
                            />
                        </div>
                    </div>
                </section>
                <section
                    className="w-full py-12 md:py-24 lg:py-32 bg-gray-50"
                    id="features"
                >
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                    Your Path to Financial Freedom
                                </h2>
                                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    We provide the tools, community, and support you need to
                                    achieve your debt-free dreams.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
                            <Card>
                                <CardContent className="flex flex-col items-center space-y-4 p-6">
                                    <Users className="h-12 w-12 text-primary" />
                                    <h3 className="text-xl font-bold">Supportive Community</h3>
                                    <p className="text-center text-gray-500">
                                        Connect with others on the same journey, share experiences,
                                        and get motivated.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center space-y-4 p-6">
                                    <Shield className="h-12 w-12 text-primary" />
                                    <h3 className="text-xl font-bold">Proven Strategies</h3>
                                    <p className="text-center text-gray-500">
                                        Access debt-reduction strategies and tools that actually
                                        work.
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="flex flex-col items-center space-y-4 p-6">
                                    <BookOpen className="h-12 w-12 text-primary" />
                                    <h3 className="text-xl font-bold">Expert Resources</h3>
                                    <p className="text-center text-gray-500">
                                        Learn from financial experts and access educational
                                        resources.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32" id="stories">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                    Success Stories
                                </h2>
                                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Real people, real results. Get inspired by those who've
                                    achieved their debt-free goals.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i}>
                                    <CardContent className="flex gap-4 p-6">
                                        <Award className="h-12 w-12 text-primary" />
                                        <div className="space-y-2">
                                            <h3 className="font-bold">Sarah & John's Story</h3>
                                            <p className="text-sm text-gray-500">
                                                "We paid off $45,000 in 18 months using the debt
                                                snowball method. The community here kept us motivated
                                                throughout our journey."
                                            </p>
                                            <p className="text-sm font-medium">
                                                Debt-free since 2023
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>
                <section
                    className="w-full py-12 md:py-24 lg:py-32 bg-gray-50"
                    id="about"
                >
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                                        About Us
                                    </h2>
                                    <p className="max-w-[600px] text-gray-500 md:text-xl">
                                        We started RoadToDebtFree.com because we believe everyone
                                        deserves financial freedom. Our platform combines practical
                                        tools with community support to help you achieve your
                                        debt-free dreams.
                                    </p>
                                    <p className="max-w-[600px] text-gray-500 md:text-xl">
                                        Founded by former debtors who've been through the journey
                                        themselves, we understand the challenges and emotions
                                        involved in becoming debt-free.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Button variant="outline" size="lg">
                                        Learn More About Our Mission
                                    </Button>
                                </div>
                            </div>
                            <Image
                                alt="About Us"
                                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:aspect-square"
                                height="550"
                                src="/me.jpg"
                                width="550"
                            />
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32 border-t">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                                    Ready to Start Your Journey?
                                </h2>
                                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Join our community today and take the first step towards
                                    financial freedom.
                                </p>
                            </div>
                            <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                <Button size="lg">
                                    Get Started Now
                                    <Heart className="ml-2 h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500">
                    © 2024 RoadToDebtFree.com. All rights reserved.
                </p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
