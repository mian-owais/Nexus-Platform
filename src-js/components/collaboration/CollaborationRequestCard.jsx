import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, MessageCircle } from 'lucide-react';
import { Card, CardBody, CardFooter } from '../ui/Card';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { findUserById } from '../../data/users';
import { updateRequestStatus } from '../../data/collaborationRequests';
import { formatDistanceToNow } from 'date-fns';
export const CollaborationRequestCard = ({ request, onStatusUpdate }) => {
    const navigate = useNavigate();
    const investor = findUserById(request.investorId);
    if (!investor)
        return null;
    const handleAccept = () => {
        updateRequestStatus(request.id, 'accepted');
        if (onStatusUpdate) {
            onStatusUpdate(request.id, 'accepted');
        }
    };
    const handleReject = () => {
        updateRequestStatus(request.id, 'rejected');
        if (onStatusUpdate) {
            onStatusUpdate(request.id, 'rejected');
        }
    };
    const handleMessage = () => {
        navigate(`/chat/${investor.id}`);
    };
    const handleViewProfile = () => {
        navigate(`/profile/investor/${investor.id}`);
    };
    const getStatusBadge = () => {
        switch (request.status) {
            case 'pending':
                return _jsx(Badge, { variant: "warning", children: "Pending" });
            case 'accepted':
                return _jsx(Badge, { variant: "success", children: "Accepted" });
            case 'rejected':
                return _jsx(Badge, { variant: "error", children: "Declined" });
            default:
                return null;
        }
    };
    return (_jsxs(Card, { className: "transition-all duration-300", children: [_jsxs(CardBody, { className: "flex flex-col", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { className: "flex items-start", children: [_jsx(Avatar, { src: investor.avatarUrl, alt: investor.name, size: "md", status: investor.isOnline ? 'online' : 'offline', className: "mr-3" }), _jsxs("div", { children: [_jsx("h3", { className: "text-md font-semibold text-gray-900", children: investor.name }), _jsx("p", { className: "text-sm text-gray-500", children: formatDistanceToNow(new Date(request.createdAt), { addSuffix: true }) })] })] }), getStatusBadge()] }), _jsx("div", { className: "mt-4", children: _jsx("p", { className: "text-sm text-gray-600", children: request.message }) })] }), _jsx(CardFooter, { className: "border-t border-gray-100 bg-gray-50", children: request.status === 'pending' ? (_jsxs("div", { className: "flex justify-between w-full", children: [_jsxs("div", { className: "space-x-2", children: [_jsx(Button, { variant: "outline", size: "sm", leftIcon: _jsx(X, { size: 16 }), onClick: handleReject, children: "Decline" }), _jsx(Button, { variant: "success", size: "sm", leftIcon: _jsx(Check, { size: 16 }), onClick: handleAccept, children: "Accept" })] }), _jsx(Button, { variant: "primary", size: "sm", leftIcon: _jsx(MessageCircle, { size: 16 }), onClick: handleMessage, children: "Message" })] })) : (_jsxs("div", { className: "flex justify-between w-full", children: [_jsx(Button, { variant: "outline", size: "sm", leftIcon: _jsx(MessageCircle, { size: 16 }), onClick: handleMessage, children: "Message" }), _jsx(Button, { variant: "primary", size: "sm", onClick: handleViewProfile, children: "View Profile" })] })) })] }));
};
