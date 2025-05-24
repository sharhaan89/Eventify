import React, { useState, useEffect } from "react"
import { NavLink, useNavigate, useLocation } from "react-router-dom"

const API_URL = import.meta.env.VITE_API_URL

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isCurrentUserManager, setIsCurrentUserManager] = useState(false)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                const response = await fetch(`${API_URL}/users/current`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                if (response.ok) {
                    const userData = await response.json()
                    setIsLoggedIn(true)
                    setIsCurrentUserManager(userData.role === 'Manager')
                } else {
                    // User is not logged in or token is invalid
                    setIsLoggedIn(false)
                    setIsCurrentUserManager(false)
                }
            } catch (error) {
                console.error('Error fetching user data:', error)
                setIsLoggedIn(false)
                setIsCurrentUserManager(false)
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [location.pathname]) // Re-fetch when route changes

    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/users/logout`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (response.ok) {
                // Successfully logged out, update state
                setIsLoggedIn(false)
                setIsCurrentUserManager(false)
                
                // Redirect to home page after logout
                navigate('/')
            } else {
                console.error('Logout failed')
            }
        } catch (error) {
            console.error('Error during logout:', error)
        }
    }

    const handleLogin = () => {
        // Navigate to login page
        navigate('/users/login')
    }

    // Show loading state while fetching user data
    if (loading) {
        return (
            <nav>
                <div className="fixed top-0 right-0 z-50 w-full bg-black">
                    <div className="container">
                        <div className="flex justify-between items-center">
                            <div className="flex px-10">
                                <NavLink to="/"><span className="py-4 text-3xl font-bold text-rose-600 fo">Eventify</span></NavLink>
                            </div>
                            <div className="text-white px-6 flex items-center gap-6 text-0.5xl py-4">
                                <span>Loading...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    if (isLoggedIn) {
        if (isCurrentUserManager) return (
            <nav>
                <div className="fixed top-0 right-0 z-50 w-full bg-black">
                    <div className="container">
                        <div className="flex justify-between items-center">
                        <div className="flex px-10">
                            <NavLink to="/"><span className="py-4 text-3xl font-bold text-rose-600 fo">Eventify</span></NavLink>
                        </div>
                        <div className="text-white px-6 flex items-center gap-6 text-0.5xl py-4">
                            <ul className="flex items-center gap-6 text-0.5xl py-4">
                                <li>
                                    <NavLink to="/events/all">Events</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/events/registered">Your Events</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/events/create">Create</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/events/dashboard">Dashboard</NavLink>
                                </li>
                            </ul>
                            <button 
                                className="px-5 text-white text-0.5xl border-2 border-white px-3 py-1 rounded-md"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
        else if (!isCurrentUserManager) return (
            <nav>
                <div className="fixed top-0 right-0 z-50 w-full bg-black">
                    <div className="container">
                        <div className="flex justify-between items-center">
                        <div className="flex px-10">
                            <NavLink to="/"><span className="py-4 text-3xl font-bold text-rose-600 fo">Eventify</span></NavLink>
                        </div>
                        <div className="text-white px-6 flex items-center gap-6 text-0.5xl py-4">
                            <ul className="flex items-center gap-6 text-0.5xl py-4">
                                <li>
                                    <NavLink to="/events/all">Events</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/events/registered">Your Events</NavLink>
                                </li>
                            </ul>
                            <button 
                                className="px-5 text-white text-0.5xl border-2 border-white px-3 py-1 rounded-md"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }

    else if(!isLoggedIn){
        return(<nav>
            <div className="fixed top-0 right-0 z-50 w-full bg-black">
                <div className="container">
                    <div className="flex justify-between items-center">
                        <div className="flex px-10">
                            <NavLink to="/"><span className="py-4 text-3xl font-bold text-rose-600 fo">Eventify</span></NavLink>
                        </div>
                        <div className="text-white px-6 flex items-center gap-6 text-0.5xl py-4">
                            <ul className="flex items-center gap-6 text-0.5xl py-4">
                                <li>
                                    <NavLink to="/events/all">Events</NavLink>
                                </li>
                                <li>
                                    <NavLink to="/events/registered">Your Events</NavLink>
                                </li>
                            </ul>
                            <button 
                                className="px-5 text-white text-0.5xl border-2 border-white px-3 py-1 rounded-md"
                                onClick={handleLogin}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>)
    }
}