
import React, { useState, useEffect } from 'react';
import { ChefHatIcon, SunIcon, MoonIcon } from './IconComponents';

const Header: React.FC = () => {
    // Initialize theme based on localStorage or system preference, default to light
    const [theme, setTheme] = useState(() => {
        if (typeof window === 'undefined') {
            return 'light';
        }
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return 'dark';
        }
        return 'light';
    });

    // Effect to apply theme class to <html> and save to localStorage
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="bg-white/80 dark:bg-gray-900/80 shadow-md backdrop-blur-sm sticky top-0 z-20 transition-colors duration-300">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center">
                    <ChefHatIcon className="w-10 h-10 text-green-500" />
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white ml-3">
                        IngreAI-dient
                    </h1>
                </div>
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 dark:focus:ring-offset-gray-900 transition-all"
                    aria-label="Toggle theme"
                >
                    {theme === 'light' ? (
                        <MoonIcon className="w-6 h-6" />
                    ) : (
                        <SunIcon className="w-6 h-6 text-yellow-400" />
                    )}
                </button>
            </div>
        </header>
    );
};

export default Header;
