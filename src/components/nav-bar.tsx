'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { LightbulbIcon } from 'lucide-react'

export function NavBar() {
    const { user, signOut } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.push('/')
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    return (
        <header className="px-4 lg:px-6 h-16 flex items-center border-b">
            <Link className="flex items-center justify-center" href="/">
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
                {user ? (
                    <>
                        <Link
                            className="text-sm font-medium hover:underline underline-offset-4"
                            href="/dashboard"
                        >
                            Dashboard
                        </Link>
                        <Button
                            variant="ghost"
                            className="text-sm font-medium"
                            onClick={handleSignOut}
                        >
                            Sign Out
                        </Button>
                    </>
                ) : (
                    <Link href="/auth">
                        <Button variant="default" size="sm">
                            Sign In
                        </Button>
                    </Link>
                )}
            </nav>
        </header>
    )
} 