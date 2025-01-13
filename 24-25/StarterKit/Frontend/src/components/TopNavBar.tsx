import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '~hooks/useAuth';
import { authService } from '~services/authService';

export default function TopNavBar() {
    const { isAuthenticated, logout, token } = useAuth();
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const user = { username: 'John Doe' }; // TODO: Replace with actual user data from auth context
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        if(token === null) return;
        authService.checkAdmin(token).then((response) => {
            setIsAdmin(response.isAdmin);
        });
    }, [token]);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="bg-grey dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="hidden w-full text-gray-600 dark:text-gray-300 md:flex md:items-center">
                        <Link to="/" className="hover:text-gray-800 dark:hover:text-white">Home</Link>
                        {isAdmin && (
                            <Link to="/admin" className="ml-4 hover:text-gray-800 dark:hover:text-white">Admin Dashboard</Link>
                        )}
                    </div>
                    
                    <div className="w-full text-gray-700 dark:text-white md:text-center text-2xl font-semibold">
                        <Link to="/">EventHub</Link>
                    </div>

                    <div className="flex items-center justify-end w-full">
                        {isAuthenticated ? (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <span className="mr-2 text-gray-700 dark:text-white">
                                        {user?.username}
                                    </span>
                                    <img
                                        className="h-8 w-8 rounded-full object-cover"
                                        src="images/profile.png"
                                        alt="profile"
                                    />
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-grey dark:bg-gray-700 rounded-md shadow-lg py-1">
                                        <Link 
                                            to="/profile" 
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            Profile
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center">
                                <Link 
                                    to="/login"
                                    className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 mx-2"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register"
                                    className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 mx-2"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}