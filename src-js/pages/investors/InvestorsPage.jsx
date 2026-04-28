import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { InvestorCard } from '../../components/investor/InvestorCard';
import { investors } from '../../data/users';
export const InvestorsPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStages, setSelectedStages] = useState([]);
    const [selectedInterests, setSelectedInterests] = useState([]);
    // Get unique investment stages and interests
    const allStages = Array.from(new Set(investors.flatMap(i => i.investmentStage)));
    const allInterests = Array.from(new Set(investors.flatMap(i => i.investmentInterests)));
    // Filter investors based on search and filters
    const filteredInvestors = investors.filter(investor => {
        const matchesSearch = searchQuery === '' ||
            investor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            investor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
            investor.investmentInterests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesStages = selectedStages.length === 0 ||
            investor.investmentStage.some(stage => selectedStages.includes(stage));
        const matchesInterests = selectedInterests.length === 0 ||
            investor.investmentInterests.some(interest => selectedInterests.includes(interest));
        return matchesSearch && matchesStages && matchesInterests;
    });
    const toggleStage = (stage) => {
        setSelectedStages(prev => prev.includes(stage)
            ? prev.filter(s => s !== stage)
            : [...prev, stage]);
    };
    const toggleInterest = (interest) => {
        setSelectedInterests(prev => prev.includes(interest)
            ? prev.filter(i => i !== interest)
            : [...prev, interest]);
    };
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Find Investors" }), _jsx("p", { className: "text-gray-600", children: "Connect with investors who match your startup's needs" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Filters" }) }), _jsxs(CardBody, { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: "Investment Stage" }), _jsx("div", { className: "space-y-2", children: allStages.map(stage => (_jsx("button", { onClick: () => toggleStage(stage), className: `block w-full text-left px-3 py-2 rounded-md text-sm ${selectedStages.includes(stage)
                                                            ? 'bg-primary-50 text-primary-700'
                                                            : 'text-gray-700 hover:bg-gray-50'}`, children: stage }, stage))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: "Investment Interests" }), _jsx("div", { className: "flex flex-wrap gap-2", children: allInterests.map(interest => (_jsx(Badge, { variant: selectedInterests.includes(interest) ? 'primary' : 'gray', className: "cursor-pointer", onClick: () => toggleInterest(interest), children: interest }, interest))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: "Location" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("button", { className: "flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(MapPin, { size: 16, className: "mr-2" }), "San Francisco, CA"] }), _jsxs("button", { className: "flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(MapPin, { size: 16, className: "mr-2" }), "New York, NY"] }), _jsxs("button", { className: "flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(MapPin, { size: 16, className: "mr-2" }), "Boston, MA"] })] })] })] })] }) }), _jsxs("div", { className: "lg:col-span-3 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Input, { placeholder: "Search investors by name, interests, or keywords...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), startAdornment: _jsx(Search, { size: 18 }), fullWidth: true }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { size: 18, className: "text-gray-500" }), _jsxs("span", { className: "text-sm text-gray-600", children: [filteredInvestors.length, " results"] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: filteredInvestors.map(investor => (_jsx(InvestorCard, { investor: investor }, investor.id))) })] })] })] }));
};
