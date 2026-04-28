import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Building2, CircleDollarSign, Users, MessageCircle, Bell, FileText, Settings, HelpCircle, Calendar } from 'lucide-react';
const SidebarItem = ({ to, icon, text }) => {
    return (_jsxs(NavLink, { to: to, className: ({ isActive }) => `flex items-center py-2.5 px-4 rounded-md transition-colors duration-200 ${isActive
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`, children: [_jsx("span", { className: "mr-3", children: icon }), _jsx("span", { className: "text-sm font-medium", children: text })] }));
};
export const Sidebar = () => {
    const { user } = useAuth();
    if (!user)
        return null;
    // Define sidebar items based on user role
    const entrepreneurItems = [
        { to: '/dashboard/entrepreneur', icon: _jsx(Home, { size: 20 }), text: 'Dashboard' },
        { to: '/profile/entrepreneur/' + user.id, icon: _jsx(Building2, { size: 20 }), text: 'My Startup' },
        { to: '/investors', icon: _jsx(CircleDollarSign, { size: 20 }), text: 'Find Investors' },
        { to: '/messages', icon: _jsx(MessageCircle, { size: 20 }), text: 'Messages' },
        { to: '/meetings', icon: _jsx(Calendar, { size: 20 }), text: 'Meetings' },
        { to: '/notifications', icon: _jsx(Bell, { size: 20 }), text: 'Notifications' },
        { to: '/documents', icon: _jsx(FileText, { size: 20 }), text: 'Documents' },
    ];
    const investorItems = [
        { to: '/dashboard/investor', icon: _jsx(Home, { size: 20 }), text: 'Dashboard' },
        { to: '/profile/investor/' + user.id, icon: _jsx(CircleDollarSign, { size: 20 }), text: 'My Portfolio' },
        { to: '/entrepreneurs', icon: _jsx(Users, { size: 20 }), text: 'Find Startups' },
        { to: '/messages', icon: _jsx(MessageCircle, { size: 20 }), text: 'Messages' },
        { to: '/meetings', icon: _jsx(Calendar, { size: 20 }), text: 'Meetings' },
        { to: '/notifications', icon: _jsx(Bell, { size: 20 }), text: 'Notifications' },
        { to: '/deals', icon: _jsx(FileText, { size: 20 }), text: 'Deals' },
    ];
    const sidebarItems = user.role === 'entrepreneur' ? entrepreneurItems : investorItems;
    // Common items at the bottom
    const commonItems = [
        { to: '/settings', icon: _jsx(Settings, { size: 20 }), text: 'Settings' },
        { to: '/help', icon: _jsx(HelpCircle, { size: 20 }), text: 'Help & Support' },
    ];
    return (_jsx("div", { className: "w-64 bg-white h-full border-r border-gray-200 hidden md:block", children: _jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "flex-1 py-4 overflow-y-auto", children: [_jsx("div", { className: "px-3 space-y-1", children: sidebarItems.map((item, index) => (_jsx(SidebarItem, { to: item.to, icon: item.icon, text: item.text }, index))) }), _jsxs("div", { className: "mt-8 px-3", children: [_jsx("h3", { className: "px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider", children: "Settings" }), _jsx("div", { className: "mt-2 space-y-1", children: commonItems.map((item, index) => (_jsx(SidebarItem, { to: item.to, icon: item.icon, text: item.text }, index))) })] })] }), _jsx("div", { className: "p-4 border-t border-gray-200", children: _jsxs("div", { className: "bg-gray-50 rounded-md p-3", children: [_jsx("p", { className: "text-xs text-gray-600", children: "Need assistance?" }), _jsx("h4", { className: "text-sm font-medium text-gray-900 mt-1", children: "Contact Support" }), _jsx("a", { href: "mailto:support@businessnexus.com", className: "mt-2 inline-flex items-center text-xs font-medium text-primary-600 hover:text-primary-500", children: "support@businessnexus.com" })] }) })] }) }));
};
