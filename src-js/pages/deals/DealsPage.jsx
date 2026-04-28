import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Search, Filter, DollarSign, TrendingUp, Users, Calendar } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
const deals = [
    {
        id: 1,
        startup: {
            name: 'TechWave AI',
            logo: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
            industry: 'FinTech'
        },
        amount: '$1.5M',
        equity: '15%',
        status: 'Due Diligence',
        stage: 'Series A',
        lastActivity: '2024-02-15'
    },
    {
        id: 2,
        startup: {
            name: 'GreenLife Solutions',
            logo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
            industry: 'CleanTech'
        },
        amount: '$2M',
        equity: '20%',
        status: 'Term Sheet',
        stage: 'Seed',
        lastActivity: '2024-02-10'
    },
    {
        id: 3,
        startup: {
            name: 'HealthPulse',
            logo: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
            industry: 'HealthTech'
        },
        amount: '$800K',
        equity: '12%',
        status: 'Negotiation',
        stage: 'Pre-seed',
        lastActivity: '2024-02-05'
    }
];
export const DealsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState([]);
    const statuses = ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'];
    const toggleStatus = (status) => {
        setSelectedStatus(prev => prev.includes(status)
            ? prev.filter(s => s !== status)
            : [...prev, status]);
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'Due Diligence':
                return 'primary';
            case 'Term Sheet':
                return 'secondary';
            case 'Negotiation':
                return 'accent';
            case 'Closed':
                return 'success';
            case 'Passed':
                return 'error';
            default:
                return 'gray';
        }
    };
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Investment Deals" }), _jsx("p", { className: "text-gray-600", children: "Track and manage your investment pipeline" })] }), _jsx(Button, { children: "Add Deal" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx(Card, { children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-primary-100 rounded-lg mr-3", children: _jsx(DollarSign, { size: 20, className: "text-primary-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Total Investment" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: "$4.3M" })] })] }) }) }), _jsx(Card, { children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-secondary-100 rounded-lg mr-3", children: _jsx(TrendingUp, { size: 20, className: "text-secondary-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Active Deals" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: "8" })] })] }) }) }), _jsx(Card, { children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-accent-100 rounded-lg mr-3", children: _jsx(Users, { size: 20, className: "text-accent-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Portfolio Companies" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: "12" })] })] }) }) }), _jsx(Card, { children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-success-100 rounded-lg mr-3", children: _jsx(Calendar, { size: 20, className: "text-success-600" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-600", children: "Closed This Month" }), _jsx("p", { className: "text-lg font-semibold text-gray-900", children: "2" })] })] }) }) })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("div", { className: "w-full md:w-2/3", children: _jsx(Input, { placeholder: "Search deals by startup name or industry...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), startAdornment: _jsx(Search, { size: 18 }), fullWidth: true }) }), _jsx("div", { className: "w-full md:w-1/3", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { size: 18, className: "text-gray-500" }), _jsx("div", { className: "flex flex-wrap gap-2", children: statuses.map(status => (_jsx(Badge, { variant: selectedStatus.includes(status) ? getStatusColor(status) : 'gray', className: "cursor-pointer", onClick: () => toggleStatus(status), children: status }, status))) })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Active Deals" }) }), _jsx(CardBody, { children: _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "border-b border-gray-200", children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Startup" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Amount" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Equity" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Stage" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Last Activity" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: deals.map(deal => (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsxs("div", { className: "flex items-center", children: [_jsx(Avatar, { src: deal.startup.logo, alt: deal.startup.name, size: "sm", className: "flex-shrink-0" }), _jsxs("div", { className: "ml-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-900", children: deal.startup.name }), _jsx("div", { className: "text-sm text-gray-500", children: deal.startup.industry })] })] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-900", children: deal.amount }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-900", children: deal.equity }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: getStatusColor(deal.status), children: deal.status }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-900", children: deal.stage }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx("div", { className: "text-sm text-gray-500", children: new Date(deal.lastActivity).toLocaleDateString() }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-right text-sm font-medium", children: _jsx(Button, { variant: "outline", size: "sm", children: "View Details" }) })] }, deal.id))) })] }) }) })] })] }));
};
