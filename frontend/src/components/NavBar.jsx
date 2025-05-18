import React from "react"
import { NavLink, useRouteError } from "react-router-dom"

export default function Navbar() {
    return (
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
                        <button className="px-5 text-white text-0.5xl border-2 border-white px-3 py-1 rounded-md">
                                <NavLink to="/users/login">Login</NavLink>
                        </button>
                    </div>
                    </div>
                </div>
            </div>
        </nav>
    )
}
