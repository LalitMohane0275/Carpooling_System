import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';

function Navbar() {
    // const userId = "123"; // Replace with the actual dynamic user ID from context or props
    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.user.userInfo);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <div className='bg-green-400 flex min-h-[10vh] items-center justify-between'>
            {/* Left Section: Logo */}
            <div className='p-5'>
                <h1 className='text-white text-4xl font-bold'>RideBuddy</h1>
            </div>

            {/* Center Section: Navigation Links */}
            {userInfo ? (
                    <div>
                    <nav>
                        <ul className='flex items-center justify-around'>
                            <li className='p-5 mx-5'>
                                <NavLink to="/home" className="hover:text-white">Home</NavLink>
                            </li>
                            <li className='p-5 mx-5'>
                                <NavLink to="/about" className="hover:text-white">About</NavLink>
                            </li>
                            <li className='p-5 mx-5'>
                                <NavLink to="/find-ride" className="hover:text-white">Find a Ride</NavLink>
                            </li>
                            <li className='p-5 mx-5'>
                                <NavLink to="/create-ride" className="hover:text-white">Create Ride</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            ) : (
                <div>
                    <nav>
                        <ul className='flex items-center justify-center'>
                            <li className='p-5 mx-5'>
                                <NavLink to="/signup" className="hover:text-white">Sign Up</NavLink>
                            </li>
                            <li className='p-5 mx-5'>
                                <NavLink to="/login" className="hover:text-white">Login</NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* Right Section: Profile Picture */}
            {userInfo ? (
                <div className='p-5 mx-5 flex items-center justify-center'>
                    <button onClick={handleLogout} className="mx-5 bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600">
                        Logout
                    </button>
                    <NavLink to={`/user/123`}>
                        <img
                            src="/images/Profile.png" // Replace with actual image path
                            alt="Profile"
                            className="w-12 h-12 rounded-full border-2 border-white hover:scale-105 transition-transform duration-300"
                        />
                    </NavLink>
                </div>
            ):(
                <div className='p-5 mx-5'>
                    profile
                </div>
            )}
        </div>
    );
}

export default Navbar;
