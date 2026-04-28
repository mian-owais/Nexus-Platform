import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Bell, Calendar, TrendingUp, AlertCircle, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { CollaborationRequestCard } from '../../components/collaboration/CollaborationRequestCard';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { useAuth } from '../../context/AuthContext';
import { getRequestsForEntrepreneur } from '../../data/collaborationRequests';
import { investors } from '../../data/users';
export const EntrepreneurDashboard = () => {
    const { user } = useAuth();
    const [collaborationRequests, setCollaborationRequests] = useState([]);
    const [recommendedInvestors, setRecommendedInvestors] = useState(investors.slice(0, 3));
    useEffect(() => {
        if (user) {
            // Load collaboration requests
            const requests = getRequestsForEntrepreneur(user.id);
            setCollaborationRequests(requests);
        }
    }, [user]);
    const handleRequestStatusUpdate = (requestId, status) => {
        setCollaborationRequests(prevRequests => prevRequests.map(req => req.id === requestId ? { ...req, status } : req));
    };
    if (!user)
        return null;
    const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsxs("h1", { className: "text-2xl font-bold text-gray-900", children: ["Welcome, ", user.name] }), _jsx("p", { className: "text-gray-600", children: "Here's what's happening with your startup today" })] }), _jsx(Link, { to: "/investors", children: _jsx(Button, { leftIcon: _jsx(PlusCircle, { size: 18 }), children: "Find Investors" }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx(Card, { className: "bg-primary-50 border border-primary-100", children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-primary-100 rounded-full mr-4", children: _jsx(Bell, { size: 20, className: "text-primary-700" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-primary-700", children: "Pending Requests" }), _jsx("h3", { className: "text-xl font-semibold text-primary-900", children: pendingRequests.length })] })] }) }) }), _jsx(Card, { className: "bg-secondary-50 border border-secondary-100", children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-secondary-100 rounded-full mr-4", children: _jsx(Users, { size: 20, className: "text-secondary-700" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-secondary-700", children: "Total Connections" }), _jsx("h3", { className: "text-xl font-semibold text-secondary-900", children: collaborationRequests.filter(req => req.status === 'accepted').length })] })] }) }) }), _jsx(Card, { className: "bg-accent-50 border border-accent-100", children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-accent-100 rounded-full mr-4", children: _jsx(Calendar, { size: 20, className: "text-accent-700" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-accent-700", children: "Upcoming Meetings" }), _jsx("h3", { className: "text-xl font-semibold text-accent-900", children: "2" })] })] }) }) }), _jsx(Card, { className: "bg-success-50 border border-success-100", children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-green-100 rounded-full mr-4", children: _jsx(TrendingUp, { size: 20, className: "text-success-700" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-success-700", children: "Profile Views" }), _jsx("h3", { className: "text-xl font-semibold text-success-900", children: "24" })] })] }) }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2 space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Collaboration Requests" }), _jsxs(Badge, { variant: "primary", children: [pendingRequests.length, " pending"] })] }), _jsx(CardBody, { children: collaborationRequests.length > 0 ? (_jsx("div", { className: "space-y-4", children: collaborationRequests.map(request => (_jsx(CollaborationRequestCard, { request: request, onStatusUpdate: handleRequestStatusUpdate }, request.id))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4", children: _jsx(AlertCircle, { size: 24, className: "text-gray-500" }) }), _jsx("p", { className: "text-gray-600", children: "No collaboration requests yet" }), _jsx("p", { className: "text-sm text-gray-500 mt-1", children: "When investors are interested in your startup, their requests will appear here" })] })) })] }) }), _jsx("div", { className: "space-y-4", children: _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Recommended Investors" }), _jsx(Link, { to: "/investors", className: "text-sm font-medium text-primary-600 hover:text-primary-500", children: "View all" })] }), _jsx(CardBody, { className: "space-y-4", children: recommendedInvestors.map(investor => (_jsx(InvestorCard, { investor: investor, showActions: false }, investor.id))) })] }) })] })] }));
};
