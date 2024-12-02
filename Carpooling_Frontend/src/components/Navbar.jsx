import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <div className='bg-green-400 flex min-h-[10vh] items-center justify-between'>
            <div className='p-5'>
                <h1 className='text-white text-4xl font-bold'>RideBuddy</h1>
            </div>
            <div>
                <nav>
                    <ul className='flex items-center justify-around'>
                        <li className='p-5 mx-5'><NavLink to="/home">Home</NavLink></li>
                        <li className='p-5 mx-5'><NavLink to="/about">About</NavLink></li>
                        <li className='p-5 mx-5'><NavLink to="/find-ride">Find a Ride</NavLink></li>
                        <li className='p-5 mx-5'><NavLink to="/create-ride">Create Ride</NavLink></li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Navbar;