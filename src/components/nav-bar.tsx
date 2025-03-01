'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'
import { Menu, X, Home, LogOut, User, PiggyBank, Users } from 'lucide-react'

export function NavBar() {
    const { user, signOut } = useAuth()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const pathname = usePathname()

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    const handleSignOut = async () => {
        await signOut()
        closeMenu()
    }

    const isActive = (path: string) => {
        return pathname === path
    }

    return (
        <nav className="bg-white border-b">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center">
                            <PiggyBank className="h-8 w-8 text-primary" />
                            <span className="ml-2 text-xl font-bold">Till Debt Do Us Part</span>
                        </Link>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {user ? (
                            <>
                                <Link href="/dashboard">
                                    <Button
                                        variant={isActive("/dashboard") ? "default" : "ghost"}
                                        className="flex items-center"
                                    >
                                        <Home className="mr-2 h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Link href="/explore">
                                    <Button
                                        variant={isActive("/explore") ? "default" : "ghost"}
                                        className="flex items-center"
                                    >
                                        <Users className="mr-2 h-4 w-4" />
                                        Explore
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    className="flex items-center"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Sign Out
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/sign-in">
                                    <Button variant="ghost">Sign In</Button>
                                </Link>
                                <Link href="/sign-up">
                                    <Button>Sign Up</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center">
                        <button
                            onClick={toggleMenu}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu, show/hide based on menu state */}
            <div className={`md:hidden ${isMenuOpen ? "block" : "hidden"}`}>
                <div className="pt-2 pb-3 space-y-1">
                    {user ? (
                        <>
                            <Link href="/dashboard" onClick={closeMenu}>
                                <Button
                                    variant={isActive("/dashboard") ? "default" : "ghost"}
                                    className="w-full justify-start"
                                >
                                    <Home className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/explore" onClick={closeMenu}>
                                <Button
                                    variant={isActive("/explore") ? "default" : "ghost"}
                                    className="w-full justify-start"
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Explore
                                </Button>
                            </Link>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                                onClick={handleSignOut}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" onClick={closeMenu}>
                                <Button variant="ghost" className="w-full justify-start">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/sign-up" onClick={closeMenu}>
                                <Button className="w-full justify-start">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
} 