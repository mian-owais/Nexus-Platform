import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getConversationsForUser } from '../../data/messages';
import { ChatUserList } from '../../components/chat/ChatUserList';
// import { MessageCircle } from 'lucide-react';
export const MessagesPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    if (!user)
        return null;
    const conversations = getConversationsForUser(user.id);
    return (_jsx("div", { className: "h-[calc(100vh-8rem)] bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in", children: conversations.length > 0 ? (_jsx(ChatUserList, { conversations: conversations })) : (_jsxs("div", { className: "h-full flex flex-col items-center justify-center p-8", children: [_jsx("div", { className: "bg-gray-100 p-6 rounded-full mb-4" }), _jsx("h2", { className: "text-xl font-medium text-gray-900", children: "No messages yet" }), _jsx("p", { className: "text-gray-600 text-center mt-2", children: "Start connecting with entrepreneurs and investors to begin conversations" })] })) }));
};
