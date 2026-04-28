import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../ui/Avatar';
import { findUserById } from '../../data/users';
export const ChatMessage = ({ message, isCurrentUser }) => {
    const user = findUserById(message.senderId);
    if (!user)
        return null;
    return (_jsxs("div", { className: `flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`, children: [!isCurrentUser && (_jsx(Avatar, { src: user.avatarUrl, alt: user.name, size: "sm", className: "mr-2 self-end" })), _jsxs("div", { className: `flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`, children: [_jsx("div", { className: `max-w-xs sm:max-w-md px-4 py-2 rounded-lg ${isCurrentUser
                            ? 'bg-primary-600 text-white rounded-br-none'
                            : 'bg-gray-100 text-gray-800 rounded-bl-none'}`, children: _jsx("p", { className: "text-sm", children: message.content }) }), _jsx("span", { className: "text-xs text-gray-500 mt-1", children: formatDistanceToNow(new Date(message.timestamp), { addSuffix: true }) })] }), isCurrentUser && (_jsx(Avatar, { src: user.avatarUrl, alt: user.name, size: "sm", className: "ml-2 self-end" }))] }));
};
