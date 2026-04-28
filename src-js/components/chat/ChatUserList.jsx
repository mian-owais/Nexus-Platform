import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { findUserById } from '../../data/users';
import { useAuth } from '../../context/AuthContext';
export const ChatUserList = ({ conversations }) => {
    const navigate = useNavigate();
    const { userId: activeUserId } = useParams();
    const { user: currentUser } = useAuth();
    if (!currentUser)
        return null;
    const handleSelectUser = (userId) => {
        navigate(`/chat/${userId}`);
    };
    return (_jsx("div", { className: "bg-white border-r border-gray-200 w-full md:w-64 overflow-y-auto", children: _jsxs("div", { className: "py-4", children: [_jsx("h2", { className: "px-4 text-lg font-semibold text-gray-800 mb-4", children: "Messages" }), _jsx("div", { className: "space-y-1", children: conversations.length > 0 ? (conversations.map(conversation => {
                        // Get the other participant (not the current user)
                        const otherParticipantId = conversation.participants.find(id => id !== currentUser.id);
                        if (!otherParticipantId)
                            return null;
                        const otherUser = findUserById(otherParticipantId);
                        if (!otherUser)
                            return null;
                        const lastMessage = conversation.lastMessage;
                        const isActive = activeUserId === otherParticipantId;
                        return (_jsxs("div", { className: `px-4 py-3 flex cursor-pointer transition-colors duration-200 ${isActive
                                ? 'bg-primary-50 border-l-4 border-primary-600'
                                : 'hover:bg-gray-50 border-l-4 border-transparent'}`, onClick: () => handleSelectUser(otherUser.id), children: [_jsx(Avatar, { src: otherUser.avatarUrl, alt: otherUser.name, size: "md", status: otherUser.isOnline ? 'online' : 'offline', className: "mr-3 flex-shrink-0" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex justify-between items-baseline", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 truncate", children: otherUser.name }), lastMessage && (_jsx("span", { className: "text-xs text-gray-500", children: formatDistanceToNow(new Date(lastMessage.timestamp), { addSuffix: false }) }))] }), _jsxs("div", { className: "flex justify-between items-center mt-1", children: [lastMessage && (_jsxs("p", { className: "text-xs text-gray-600 truncate", children: [lastMessage.senderId === currentUser.id ? 'You: ' : '', lastMessage.content] })), lastMessage && !lastMessage.isRead && lastMessage.senderId !== currentUser.id && (_jsx(Badge, { variant: "primary", size: "sm", rounded: true, children: "New" }))] })] })] }, conversation.id));
                    })) : (_jsx("div", { className: "px-4 py-8 text-center", children: _jsx("p", { className: "text-sm text-gray-500", children: "No conversations yet" }) })) })] }) }));
};
