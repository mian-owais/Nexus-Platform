import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, PieChart, Filter, Search, PlusCircle } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { useAuth } from '../../context/AuthContext';
import { entrepreneurs } from '../../data/users';
import { getRequestsFromInvestor } from '../../data/collaborationRequests';
export const InvestorDashboard = () => {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    if (!user)
        return null;
    // Get collaboration requests sent by this investor
    const sentRequests = getRequestsFromInvestor(user.id);
    const requestedEntrepreneurIds = sentRequests.map(req => req.entrepreneurId);
    // Filter entrepreneurs based on search and industry filters
    const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
        // Search filter
        const matchesSearch = searchQuery === '' ||
            entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
        // Industry filter
        const matchesIndustry = selectedIndustries.length === 0 ||
            selectedIndustries.includes(entrepreneur.industry);
        return matchesSearch && matchesIndustry;
    });
    // Get unique industries for filter
    const industries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
    // Toggle industry selection
    const toggleIndustry = (industry) => {
        setSelectedIndustries(prevSelected => prevSelected.includes(industry)
            ? prevSelected.filter(i => i !== industry)
            : [...prevSelected, industry]);
    };
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex flex-col sm:flex-row justify-between sm:items-center gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Discover Startups" }), _jsx("p", { className: "text-gray-600", children: "Find and connect with promising entrepreneurs" })] }), _jsx(Link, { to: "/entrepreneurs", children: _jsx(Button, { leftIcon: _jsx(PlusCircle, { size: 18 }), children: "View All Startups" }) })] }), _jsxs("div", { className: "flex flex-col md:flex-row gap-4", children: [_jsx("div", { className: "w-full md:w-2/3", children: _jsx(Input, { placeholder: "Search startups, industries, or keywords...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), fullWidth: true, startAdornment: _jsx(Search, { size: 18 }) }) }), _jsx("div", { className: "w-full md:w-1/3", children: _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Filter, { size: 18, className: "text-gray-500" }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: "Filter by:" }), _jsx("div", { className: "flex flex-wrap gap-2", children: industries.map(industry => (_jsx(Badge, { variant: selectedIndustries.includes(industry) ? 'primary' : 'gray', className: "cursor-pointer", onClick: () => toggleIndustry(industry), children: industry }, industry))) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsx(Card, { className: "bg-primary-50 border border-primary-100", children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-primary-100 rounded-full mr-4", children: _jsx(Users, { size: 20, className: "text-primary-700" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-primary-700", children: "Total Startups" }), _jsx("h3", { className: "text-xl font-semibold text-primary-900", children: entrepreneurs.length })] })] }) }) }), _jsx(Card, { className: "bg-secondary-50 border border-secondary-100", children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-secondary-100 rounded-full mr-4", children: _jsx(PieChart, { size: 20, className: "text-secondary-700" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-secondary-700", children: "Industries" }), _jsx("h3", { className: "text-xl font-semibold text-secondary-900", children: industries.length })] })] }) }) }), _jsx(Card, { className: "bg-accent-50 border border-accent-100", children: _jsx(CardBody, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "p-3 bg-accent-100 rounded-full mr-4", children: _jsx(Users, { size: 20, className: "text-accent-700" }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium text-accent-700", children: "Your Connections" }), _jsx("h3", { className: "text-xl font-semibold text-accent-900", children: sentRequests.filter(req => req.status === 'accepted').length })] })] }) }) })] }), _jsx("div", { children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Featured Startups" }) }), _jsx(CardBody, { children: filteredEntrepreneurs.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", children: filteredEntrepreneurs.map(entrepreneur => (_jsx(EntrepreneurCard, { entrepreneur: entrepreneur }, entrepreneur.id))) })) : (_jsxs("div", { className: "text-center py-8", children: [_jsx("p", { className: "text-gray-600", children: "No startups match your filters" }), _jsx(Button, { variant: "outline", className: "mt-2", onClick: () => {
                                            setSearchQuery('');
                                            setSelectedIndustries([]);
                                        }, children: "Clear filters" })] })) })] }) })] }));
};
