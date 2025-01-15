import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '~hooks/useAuth';
import { authService } from '~services/authService';

export default function TopNavBar() {
    const { isAuthenticated, logout, token, userInfo } = useAuth();
    const navigate = useNavigate();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(token === null) return;
        authService.checkAdmin(token).then((response) => {
            setIsAdmin(response.isAdmin);
        });
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="bg-grey dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="hidden w-full text-gray-600 dark:text-gray-300 md:flex md:items-center">
                        <a href="/" className="hover:text-gray-800 dark:hover:text-white">Home</a>
                        {isAdmin && (
                            <a href="/admin" className="ml-4 hover:text-gray-800 dark:hover:text-white">Admin Dashboard</a>
                        )}
                    </div>
                    
                    <div className="w-full text-gray-700 dark:text-white md:text-center text-2xl font-semibold">
                        <a href="/">EventHub</a>
                    </div>

                    <div className="flex items-center justify-end w-full">
                        {isAuthenticated ? (
                            <div className="relative" ref={menuRef}>
                                <button 
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <span className="mr-2 text-gray-700 dark:text-white">
                                        {userInfo?.username}
                                    </span>
                                    <img
                                        className="h-8 w-8 rounded-full object-cover"
                                        src="/images/profile.png"
                                        alt="profile"
                                    />
                                </button>

                                {isProfileMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-grey dark:bg-gray-700 rounded-md shadow-lg py-1">
                                        <a 
                                            href="/profile" 
                                            className="block px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                                        >
                                            Profile
                                        </a>
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
                                <a 
                                    href="/login"
                                    className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 mx-2"
                                >
                                    Login
                                </a>
                                <a 
                                    href="/register"
                                    className="text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 mx-2"
                                >
                                    Register
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}