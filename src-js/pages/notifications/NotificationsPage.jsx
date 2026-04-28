import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Bell, MessageCircle, UserPlus, DollarSign } from 'lucide-react';
import { Card, CardBody } from '../../components/ui/Card';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
const notifications = [
    {
        id: 1,
        type: 'message',
        user: {
            name: 'Sarah Johnson',
            avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
        },
        content: 'sent you a message about your startup',
        time: '5 minutes ago',
        unread: true
    },
    {
        id: 2,
        type: 'connection',
        user: {
            name: 'Michael Rodriguez',
            avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
        },
        content: 'accepted your connection request',
        time: '2 hours ago',
        unread: true
    },
    {
        id: 3,
        type: 'investment',
        user: {
            name: 'Jennifer Lee',
            avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg'
        },
        content: 'showed interest in investing in your startup',
        time: '1 day ago',
        unread: false
    }
];
export const NotificationsPage = () => {
    const getNotificationIcon = (type) => {
        switch (type) {
            case 'message':
                return _jsx(MessageCircle, { size: 16, className: "text-primary-600" });
            case 'connection':
                return _jsx(UserPlus, { size: 16, className: "text-secondary-600" });
            case 'investment':
                return _jsx(DollarSign, { size: 16, className: "text-accent-600" });
            default:
                return _jsx(Bell, { size: 16, className: "text-gray-600" });
        }
    };
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Notifications" }), _jsx("p", { className: "text-gray-600", children: "Stay updated with your network activity" })] }), _jsx(Button, { variant: "outline", size: "sm", children: "Mark all as read" })] }), _jsx("div", { className: "space-y-4", children: notifications.map(notification => (_jsx(Card, { className: `transition-colors duration-200 ${notification.unread ? 'bg-primary-50' : ''}`, children: _jsxs(CardBody, { className: "flex items-start p-4", children: [_jsx(Avatar, { src: notification.user.avatar, alt: notification.user.name, size: "md", className: "flex-shrink-0 mr-4" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-medium text-gray-900", children: notification.user.name }), notification.unread && (_jsx(Badge, { variant: "primary", size: "sm", rounded: true, children: "New" }))] }), _jsx("p", { className: "text-gray-600 mt-1", children: notification.content }), _jsxs("div", { className: "flex items-center gap-2 mt-2 text-sm text-gray-500", children: [getNotificationIcon(notification.type), _jsx("span", { children: notification.time })] })] })] }) }, notification.id))) })] }));
};
