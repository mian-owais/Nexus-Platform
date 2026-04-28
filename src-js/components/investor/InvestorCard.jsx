import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, ExternalLink } from 'lucide-react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
export const InvestorCard = ({ investor, showActions = true }) => {
    const navigate = useNavigate();
    const handleViewProfile = () => {
        navigate(`/profile/investor/${investor.id}`);
    };
    const handleMessage = (e) => {
        e.stopPropagation(); // Prevent card click
        navigate(`/chat/${investor.id}`);
    };
    return (_jsxs(Card, { hoverable: true, className: "transition-all duration-300 h-full", onClick: handleViewProfile, children: [_jsxs(CardBody, { className: "flex flex-col", children: [_jsxs("div", { className: "flex items-start", children: [_jsx(Avatar, { src: investor.avatarUrl, alt: investor.name, size: "lg", status: investor.isOnline ? 'online' : 'offline', className: "mr-4" }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-1", children: investor.name }), _jsxs("p", { className: "text-sm text-gray-500 mb-2", children: ["Investor \u2022 ", investor.totalInvestments, " investments"] }), _jsx("div", { className: "flex flex-wrap gap-2 mb-3", children: investor.investmentStage.map((stage, index) => (_jsx(Badge, { variant: "secondary", size: "sm", children: stage }, index))) })] })] }), _jsxs("div", { className: "mt-3", children: [_jsx("h4", { className: "text-sm font-medium text-gray-900 mb-1", children: "Investment Interests" }), _jsx("div", { className: "flex flex-wrap gap-2", children: investor.investmentInterests.map((interest, index) => (_jsx(Badge, { variant: "primary", size: "sm", children: interest }, index))) })] }), _jsx("div", { className: "mt-4", children: _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: investor.bio }) }), _jsx("div", { className: "mt-3 flex justify-between items-center", children: _jsxs("div", { children: [_jsx("span", { className: "text-xs text-gray-500", children: "Investment Range" }), _jsxs("p", { className: "text-sm font-medium text-gray-900", children: [investor.minimumInvestment, " - ", investor.maximumInvestment] })] }) })] }), showActions && (_jsxs(CardFooter, { className: "border-t border-gray-100 bg-gray-50 flex justify-between", children: [_jsx(Button, { variant: "outline", size: "sm", leftIcon: _jsx(MessageCircle, { size: 16 }), onClick: handleMessage, children: "Message" }), _jsx(Button, { variant: "primary", size: "sm", rightIcon: _jsx(ExternalLink, { size: 16 }), onClick: handleViewProfile, children: "View Profile" })] }))] }));
};
