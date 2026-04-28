import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { EntrepreneurCard } from '../../components/entrepreneur/EntrepreneurCard';
import { entrepreneurs } from '../../data/users';
export const EntrepreneursPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIndustries, setSelectedIndustries] = useState([]);
    const [selectedFundingRange, setSelectedFundingRange] = useState([]);
    // Get unique industries and funding ranges
    const allIndustries = Array.from(new Set(entrepreneurs.map(e => e.industry)));
    const fundingRanges = ['< $500K', '$500K - $1M', '$1M - $5M', '> $5M'];
    // Filter entrepreneurs based on search and filters
    const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
        const matchesSearch = searchQuery === '' ||
            entrepreneur.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entrepreneur.startupName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entrepreneur.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
            entrepreneur.pitchSummary.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesIndustry = selectedIndustries.length === 0 ||
            selectedIndustries.includes(entrepreneur.industry);
        // Simple funding range filter based on the amount string
        const matchesFunding = selectedFundingRange.length === 0 ||
            selectedFundingRange.some(range => {
                const amount = parseInt(entrepreneur.fundingNeeded.replace(/[^0-9]/g, ''));
                switch (range) {
                    case '< $500K': return amount < 500;
                    case '$500K - $1M': return amount >= 500 && amount <= 1000;
                    case '$1M - $5M': return amount > 1000 && amount <= 5000;
                    case '> $5M': return amount > 5000;
                    default: return true;
                }
            });
        return matchesSearch && matchesIndustry && matchesFunding;
    });
    const toggleIndustry = (industry) => {
        setSelectedIndustries(prev => prev.includes(industry)
            ? prev.filter(i => i !== industry)
            : [...prev, industry]);
    };
    const toggleFundingRange = (range) => {
        setSelectedFundingRange(prev => prev.includes(range)
            ? prev.filter(r => r !== range)
            : [...prev, range]);
    };
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Find Startups" }), _jsx("p", { className: "text-gray-600", children: "Discover promising startups looking for investment" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsx("div", { className: "space-y-6", children: _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Filters" }) }), _jsxs(CardBody, { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: "Industry" }), _jsx("div", { className: "space-y-2", children: allIndustries.map(industry => (_jsx("button", { onClick: () => toggleIndustry(industry), className: `block w-full text-left px-3 py-2 rounded-md text-sm ${selectedIndustries.includes(industry)
                                                            ? 'bg-primary-50 text-primary-700'
                                                            : 'text-gray-700 hover:bg-gray-50'}`, children: industry }, industry))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: "Funding Range" }), _jsx("div", { className: "space-y-2", children: fundingRanges.map(range => (_jsx("button", { onClick: () => toggleFundingRange(range), className: `block w-full text-left px-3 py-2 rounded-md text-sm ${selectedFundingRange.includes(range)
                                                            ? 'bg-primary-50 text-primary-700'
                                                            : 'text-gray-700 hover:bg-gray-50'}`, children: range }, range))) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: "Location" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("button", { className: "flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(MapPin, { size: 16, className: "mr-2" }), "San Francisco, CA"] }), _jsxs("button", { className: "flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(MapPin, { size: 16, className: "mr-2" }), "New York, NY"] }), _jsxs("button", { className: "flex items-center w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(MapPin, { size: 16, className: "mr-2" }), "Boston, MA"] })] })] })] })] }) }), _jsxs("div", { className: "lg:col-span-3 space-y-6", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx(Input, { placeholder: "Search startups by name, industry, or keywords...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), startAdornment: _jsx(Search, { size: 18 }), fullWidth: true }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Filter, { size: 18, className: "text-gray-500" }), _jsxs("span", { className: "text-sm text-gray-600", children: [filteredEntrepreneurs.length, " results"] })] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: filteredEntrepreneurs.map(entrepreneur => (_jsx(EntrepreneurCard, { entrepreneur: entrepreneur }, entrepreneur.id))) })] })] })] }));
};
