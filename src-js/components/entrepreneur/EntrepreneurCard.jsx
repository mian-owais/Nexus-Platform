import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
export const EntrepreneurCard = ({ entrepreneur, showActions = true }) => {
    const navigate = useNavigate();
    const handleViewProfile = () => {
        navigate(`/profile/entrepreneur/${entrepreneur.id}`);
    };
    const handleMessage = (e) => {
        e.stopPropagation(); // Prevent card click
        navigate(`/chat/${entrepreneur.id}`);
    };
    return (_jsxs(Card, { hoverable: true, className: "transition-all duration-300 h-full", onClick: handleViewProfile, children: [_jsxs(CardBody, { className: "flex flex-col", children: [_jsxs("div", { className: "flex items-start", children: [_jsx(Avatar, { src: entrepreneur.avatarUrl, alt: entrepreneur.name, size: "lg", status: entrepreneur.isOnline ? 'online' : 'offline', className: "mr-4" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-1", children: entrepreneur.name }), _jsx("p", { className: "text-sm text-gray-500 mb-2", children: entrepreneur.startupName }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-3", children: [_jsx(Badge, { variant: "primary", size: "sm", children: entrepreneur.industry }), _jsx(Badge, { variant: "gray", size: "sm", children: entrepreneur.location }), _jsxs(Badge, { variant: "accent", size: "sm", children: ["Founded ", entrepreneur.foundedYear] })] })] })] }), _jsxs("div", { className: "mt-3", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-1", children: "Pitch Summary" }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-3", children: entrepreneur.pitchSummary })] }), _jsxs("div", { className: "mt-3 flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500", children: "Funding Need" }), _jsx("p", { className: "text-sm font-medium text-gray-900", children: entrepreneur.fundingNeeded })] }), _jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500", children: "Team Size" }), _jsxs("p", { className: "text-sm font-medium text-gray-900", children: [entrepreneur.teamSize, " people"] })] })] })] }), showActions && (_jsxs(CardFooter, { className: "border-t border-gray-100 bg-gray-50 flex justify-between", children: [_jsx(Button, { variant: "outline", size: "sm", leftIcon: _jsx(MessageCircle, { size: 16 }), onClick: handleMessage, children: "Message" }), _jsx(Button, { variant: "primary", size: "sm", rightIcon: _jsx(ExternalLink, { size: 16 }), onClick: handleViewProfile, children: "View Profile" })] }))] }));
};
