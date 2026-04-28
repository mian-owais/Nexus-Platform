import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Phone, Video, Info, Smile } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ChatMessage } from '../../components/chat/ChatMessage';
import { ChatUserList } from '../../components/chat/ChatUserList';
import { useAuth } from '../../context/AuthContext';
import { findUserById } from '../../data/users';
import { getMessagesBetweenUsers, sendMessage, getConversationsForUser } from '../../data/messages';
import { MessageCircle } from 'lucide-react';
export const ChatPage = () => {
    const { userId } = useParams();
    const { user: currentUser } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState([]);
    const messagesEndRef = useRef(null);
    const chatPartner = userId ? findUserById(userId) : null;
    useEffect(() => {
        // Load conversations
        if (currentUser) {
            setConversations(getConversationsForUser(currentUser.id));
        }
    }, [currentUser]);
    useEffect(() => {
        // Load messages between users
        if (currentUser && userId) {
            setMessages(getMessagesBetweenUsers(currentUser.id, userId));
        }
    }, [currentUser, userId]);
    useEffect(() => {
        // Scroll to bottom of messages
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUser || !userId)
            return;
        const message = sendMessage({
            senderId: currentUser.id,
            receiverId: userId,
            content: newMessage
        });
        setMessages([...messages, message]);
        setNewMessage('');
        // Update conversations
        setConversations(getConversationsForUser(currentUser.id));
    };
    if (!currentUser)
        return null;
    return (_jsxs("div", { className: "flex h-[calc(100vh-4rem)] bg-white border border-gray-200 rounded-lg overflow-hidden animate-fade-in", children: [_jsx("div", { className: "hidden md:block w-1/3 lg:w-1/4 border-r border-gray-200", children: _jsx(ChatUserList, { conversations: conversations }) }), _jsx("div", { className: "flex-1 flex flex-col", children: chatPartner ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "border-b border-gray-200 p-4 flex justify-between items-center", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Avatar, { src: chatPartner.avatarUrl, alt: chatPartner.name, size: "md", status: chatPartner.isOnline ? 'online' : 'offline', className: "mr-3" }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-medium text-gray-900", children: chatPartner.name }), _jsx("p", { className: "text-sm text-gray-500", children: chatPartner.isOnline ? 'Online' : 'Last seen recently' })] })] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "ghost", size: "sm", className: "rounded-full p-2", "aria-label": "Voice call", children: _jsx(Phone, { size: 18 }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "rounded-full p-2", "aria-label": "Video call", children: _jsx(Video, { size: 18 }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "rounded-full p-2", "aria-label": "Info", children: _jsx(Info, { size: 18 }) })] })] }), _jsx("div", { className: "flex-1 p-4 overflow-y-auto bg-gray-50", children: messages.length > 0 ? (_jsxs("div", { className: "space-y-4", children: [messages.map(message => (_jsx(ChatMessage, { message: message, isCurrentUser: message.senderId === currentUser.id }, message.id))), _jsx("div", { ref: messagesEndRef })] })) : (_jsxs("div", { className: "h-full flex flex-col items-center justify-center", children: [_jsx("div", { className: "bg-gray-100 p-4 rounded-full mb-4", children: _jsx(MessageCircle, { size: 32, className: "text-gray-400" }) }), _jsx("h3", { className: "text-lg font-medium text-gray-700", children: "No messages yet" }), _jsx("p", { className: "text-gray-500 mt-1", children: "Send a message to start the conversation" })] })) }), _jsx("div", { className: "border-t border-gray-200 p-4", children: _jsxs("form", { onSubmit: handleSendMessage, className: "flex space-x-2", children: [_jsx(Button, { type: "button", variant: "ghost", size: "sm", className: "rounded-full p-2", "aria-label": "Add emoji", children: _jsx(Smile, { size: 20 }) }), _jsx(Input, { type: "text", placeholder: "Type a message...", value: newMessage, onChange: (e) => setNewMessage(e.target.value), fullWidth: true, className: "flex-1" }), _jsx(Button, { type: "submit", size: "sm", disabled: !newMessage.trim(), className: "rounded-full p-2 w-10 h-10 flex items-center justify-center", "aria-label": "Send message", children: _jsx(Send, { size: 18 }) })] }) })] })) : (_jsxs("div", { className: "h-full flex flex-col items-center justify-center p-4", children: [_jsx("div", { className: "bg-gray-100 p-6 rounded-full mb-4", children: _jsx(MessageCircle, { size: 48, className: "text-gray-400" }) }), _jsx("h2", { className: "text-xl font-medium text-gray-700", children: "Select a conversation" }), _jsx("p", { className: "text-gray-500 mt-2 text-center", children: "Choose a contact from the list to start chatting" })] })) })] }));
};
