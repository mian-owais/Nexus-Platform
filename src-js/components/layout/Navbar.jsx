import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu, X, Bell, MessageCircle, User, LogOut, Building2, CircleDollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { Button } from '../ui/Button';
export const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    // User dashboard route based on role
    const dashboardRoute = user?.role === 'entrepreneur'
        ? '/dashboard/entrepreneur'
        : '/dashboard/investor';
    // User profile route based on role and ID
    const profileRoute = user
        ? `/profile/${user.role}/${user.id}`
        : '/login';
    const navLinks = [
        {
            icon: user?.role === 'entrepreneur' ? _jsx(Building2, { size: 18 }) : _jsx(CircleDollarSign, { size: 18 }),
            text: 'Dashboard',
            path: dashboardRoute,
        },
        {
            icon: _jsx(MessageCircle, { size: 18 }),
            text: 'Messages',
            path: user ? '/messages' : '/login',
        },
        {
            icon: _jsx(Bell, { size: 18 }),
            text: 'Notifications',
            path: user ? '/notifications' : '/login',
        },
        {
            icon: _jsx(User, { size: 18 }),
            text: 'Profile',
            path: profileRoute,
        }
    ];
    return (_jsxs("nav", { className: "bg-white shadow-md", children: [_jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsxs("div", { className: "flex justify-between h-16", children: [_jsx("div", { className: "flex-shrink-0 flex items-center", children: _jsxs(Link, { to: "/", className: "flex items-center space-x-2", children: [_jsx("div", { className: "w-8 h-8 bg-primary-600 rounded-md flex items-center justify-center", children: _jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "text-white", children: [_jsx("path", { d: "M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }) }), _jsx("span", { className: "text-lg font-bold text-gray-900", children: "Business Nexus" })] }) }), _jsx("div", { className: "hidden md:flex md:items-center md:ml-6", children: user ? (_jsxs("div", { className: "flex items-center space-x-4", children: [navLinks.map((link, index) => (_jsxs(Link, { to: link.path, className: "inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors duration-200", children: [_jsx("span", { className: "mr-2", children: link.icon }), link.text] }, index))), _jsx(Button, { variant: "ghost", onClick: handleLogout, leftIcon: _jsx(LogOut, { size: 18 }), children: "Logout" }), _jsxs(Link, { to: profileRoute, className: "flex items-center space-x-2 ml-2", children: [_jsx(Avatar, { src: user.avatarUrl, alt: user.name, size: "sm", status: user.isOnline ? 'online' : 'offline' }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: user.name })] })] })) : (_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx(Link, { to: "/login", children: _jsx(Button, { variant: "outline", children: "Log in" }) }), _jsx(Link, { to: "/register", children: _jsx(Button, { children: "Sign up" }) })] })) }), _jsx("div", { className: "md:hidden flex items-center", children: _jsx("button", { onClick: toggleMenu, className: "inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-50 focus:outline-none", children: isMenuOpen ? (_jsx(X, { className: "block h-6 w-6" })) : (_jsx(Menu, { className: "block h-6 w-6" })) }) })] }) }), isMenuOpen && (_jsx("div", { className: "md:hidden bg-white border-b border-gray-200 animate-fade-in", children: _jsx("div", { className: "px-2 pt-2 pb-3 space-y-1 sm:px-3", children: user ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center space-x-3 px-3 py-2", children: [_jsx(Avatar, { src: user.avatarUrl, alt: user.name, size: "sm", status: user.isOnline ? 'online' : 'offline' }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-gray-800", children: user.name }), _jsx("p", { className: "text-xs text-gray-500 capitalize", children: user.role })] })] }), _jsxs("div", { className: "border-t border-gray-200 pt-2", children: [navLinks.map((link, index) => (_jsxs(Link, { to: link.path, className: "flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md", onClick: () => setIsMenuOpen(false), children: [_jsx("span", { className: "mr-3", children: link.icon }), link.text] }, index))), _jsxs("button", { onClick: () => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }, className: "flex w-full items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md", children: [_jsx(LogOut, { size: 18, className: "mr-3" }), "Logout"] })] })] })) : (_jsxs("div", { className: "flex flex-col space-y-2 px-3 py-2", children: [_jsx(Link, { to: "/login", className: "w-full", onClick: () => setIsMenuOpen(false), children: _jsx(Button, { variant: "outline", fullWidth: true, children: "Log in" }) }), _jsx(Link, { to: "/register", className: "w-full", onClick: () => setIsMenuOpen(false), children: _jsx(Button, { fullWidth: true, children: "Sign up" }) })] })) }) }))] }));
};
