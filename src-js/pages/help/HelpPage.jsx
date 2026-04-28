import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Search, Book, MessageCircle, Phone, Mail, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
const faqs = [
    {
        question: 'How do I connect with investors?',
        answer: 'You can browse our investor directory and send connection requests. Once an investor accepts, you can start messaging them directly through our platform.'
    },
    {
        question: 'What should I include in my startup profile?',
        answer: 'Your startup profile should include a compelling pitch, funding needs, team information, market opportunity, and any traction or metrics that demonstrate your progress.'
    },
    {
        question: 'How do I share documents securely?',
        answer: 'You can upload documents to your secure document vault and selectively share them with connected investors. All documents are encrypted and access-controlled.'
    },
    {
        question: 'What are collaboration requests?',
        answer: 'Collaboration requests are formal expressions of interest from investors. They indicate that an investor wants to learn more about your startup and potentially discuss investment opportunities.'
    }
];
export const HelpPage = () => {
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Help & Support" }), _jsx("p", { className: "text-gray-600", children: "Find answers to common questions or get in touch with our support team" })] }), _jsx("div", { className: "max-w-2xl", children: _jsx(Input, { placeholder: "Search help articles...", startAdornment: _jsx(Search, { size: 18 }), fullWidth: true }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6", children: [_jsx(Card, { children: _jsxs(CardBody, { className: "text-center p-6", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4", children: _jsx(Book, { size: 24, className: "text-primary-600" }) }), _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Documentation" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Browse our detailed documentation and guides" }), _jsx(Button, { variant: "outline", className: "mt-4", rightIcon: _jsx(ExternalLink, { size: 16 }), children: "View Docs" })] }) }), _jsx(Card, { children: _jsxs(CardBody, { className: "text-center p-6", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4", children: _jsx(MessageCircle, { size: 24, className: "text-primary-600" }) }), _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Live Chat" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Chat with our support team in real-time" }), _jsx(Button, { className: "mt-4", children: "Start Chat" })] }) }), _jsx(Card, { children: _jsxs(CardBody, { className: "text-center p-6", children: [_jsx("div", { className: "inline-flex items-center justify-center w-12 h-12 bg-primary-50 rounded-lg mb-4", children: _jsx(Phone, { size: 24, className: "text-primary-600" }) }), _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Contact Us" }), _jsx("p", { className: "text-sm text-gray-600 mt-2", children: "Get help via email or phone" }), _jsx(Button, { variant: "outline", className: "mt-4", leftIcon: _jsx(Mail, { size: 16 }), children: "Contact Support" })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Frequently Asked Questions" }) }), _jsx(CardBody, { children: _jsx("div", { className: "space-y-6", children: faqs.map((faq, index) => (_jsxs("div", { className: "border-b border-gray-200 last:border-0 pb-6 last:pb-0", children: [_jsx("h3", { className: "text-base font-medium text-gray-900 mb-2", children: faq.question }), _jsx("p", { className: "text-gray-600", children: faq.answer })] }, index))) }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Still need help?" }) }), _jsx(CardBody, { children: _jsxs("form", { className: "space-y-6 max-w-2xl", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsx(Input, { label: "Name", placeholder: "Your name" }), _jsx(Input, { label: "Email", type: "email", placeholder: "your@email.com" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Message" }), _jsx("textarea", { className: "w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500", rows: 4, placeholder: "How can we help you?" })] }), _jsx("div", { children: _jsx(Button, { children: "Send Message" }) })] }) })] })] }));
};
