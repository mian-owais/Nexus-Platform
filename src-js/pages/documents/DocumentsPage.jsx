import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { FileText, Upload, Download, Trash2, Share2 } from 'lucide-react';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
const documents = [
    {
        id: 1,
        name: 'Pitch Deck 2024.pdf',
        type: 'PDF',
        size: '2.4 MB',
        lastModified: '2024-02-15',
        shared: true
    },
    {
        id: 2,
        name: 'Financial Projections.xlsx',
        type: 'Spreadsheet',
        size: '1.8 MB',
        lastModified: '2024-02-10',
        shared: false
    },
    {
        id: 3,
        name: 'Business Plan.docx',
        type: 'Document',
        size: '3.2 MB',
        lastModified: '2024-02-05',
        shared: true
    },
    {
        id: 4,
        name: 'Market Research.pdf',
        type: 'PDF',
        size: '5.1 MB',
        lastModified: '2024-01-28',
        shared: false
    }
];
export const DocumentsPage = () => {
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Documents" }), _jsx("p", { className: "text-gray-600", children: "Manage your startup's important files" })] }), _jsx(Button, { leftIcon: _jsx(Upload, { size: 18 }), children: "Upload Document" })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-4 gap-6", children: [_jsxs(Card, { className: "lg:col-span-1", children: [_jsx(CardHeader, { children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Storage" }) }), _jsxs(CardBody, { className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Used" }), _jsx("span", { className: "font-medium text-gray-900", children: "12.5 GB" })] }), _jsx("div", { className: "h-2 bg-gray-200 rounded-full", children: _jsx("div", { className: "h-2 bg-primary-600 rounded-full", style: { width: '65%' } }) }), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Available" }), _jsx("span", { className: "font-medium text-gray-900", children: "7.5 GB" })] })] }), _jsxs("div", { className: "pt-4 border-t border-gray-200", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 mb-2", children: "Quick Access" }), _jsxs("div", { className: "space-y-2", children: [_jsx("button", { className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md", children: "Recent Files" }), _jsx("button", { className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md", children: "Shared with Me" }), _jsx("button", { className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md", children: "Starred" }), _jsx("button", { className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md", children: "Trash" })] })] })] })] }), _jsx("div", { className: "lg:col-span-3", children: _jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-lg font-medium text-gray-900", children: "All Documents" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { variant: "outline", size: "sm", children: "Sort by" }), _jsx(Button, { variant: "outline", size: "sm", children: "Filter" })] })] }), _jsx(CardBody, { children: _jsx("div", { className: "space-y-2", children: documents.map(doc => (_jsxs("div", { className: "flex items-center p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200", children: [_jsx("div", { className: "p-2 bg-primary-50 rounded-lg mr-4", children: _jsx(FileText, { size: 24, className: "text-primary-600" }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "text-sm font-medium text-gray-900 truncate", children: doc.name }), doc.shared && (_jsx(Badge, { variant: "secondary", size: "sm", children: "Shared" }))] }), _jsxs("div", { className: "flex items-center gap-4 mt-1 text-sm text-gray-500", children: [_jsx("span", { children: doc.type }), _jsx("span", { children: doc.size }), _jsxs("span", { children: ["Modified ", doc.lastModified] })] })] }), _jsxs("div", { className: "flex items-center gap-2 ml-4", children: [_jsx(Button, { variant: "ghost", size: "sm", className: "p-2", "aria-label": "Download", children: _jsx(Download, { size: 18 }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "p-2", "aria-label": "Share", children: _jsx(Share2, { size: 18 }) }), _jsx(Button, { variant: "ghost", size: "sm", className: "p-2 text-error-600 hover:text-error-700", "aria-label": "Delete", children: _jsx(Trash2, { size: 18 }) })] })] }, doc.id))) }) })] }) })] })] }));
};
