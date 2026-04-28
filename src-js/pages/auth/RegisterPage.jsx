import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, CircleDollarSign, Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
export const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('entrepreneur');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        // Validate passwords match
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        setIsLoading(true);
        try {
            await register(name, email, password, role);
            // Redirect based on user role
            navigate(role === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
        }
        catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "w-12 h-12 bg-primary-600 rounded-md flex items-center justify-center", children: _jsxs("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg", className: "text-white", children: [_jsx("path", { d: "M20 7H4C2.89543 7 2 7.89543 2 9V19C2 20.1046 2.89543 21 4 21H20C21.1046 21 22 20.1046 22 19V9C22 7.89543 21.1046 7 20 7Z", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" })] }) }) }), _jsx("h2", { className: "mt-6 text-center text-3xl font-extrabold text-gray-900", children: "Create your account" }), _jsx("p", { className: "mt-2 text-center text-sm text-gray-600", children: "Join Business Nexus to connect with partners" })] }), _jsx("div", { className: "mt-8 sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs("div", { className: "bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: [error && (_jsxs("div", { className: "mb-4 bg-error-50 border border-error-500 text-error-700 px-4 py-3 rounded-md flex items-start", children: [_jsx(AlertCircle, { size: 18, className: "mr-2 mt-0.5" }), _jsx("span", { children: error })] })), _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "I am registering as a" }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("button", { type: "button", className: `py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${role === 'entrepreneur'
                                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`, onClick: () => setRole('entrepreneur'), children: [_jsx(Building2, { size: 18, className: "mr-2" }), "Entrepreneur"] }), _jsxs("button", { type: "button", className: `py-3 px-4 border rounded-md flex items-center justify-center transition-colors ${role === 'investor'
                                                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`, onClick: () => setRole('investor'), children: [_jsx(CircleDollarSign, { size: 18, className: "mr-2" }), "Investor"] })] })] }), _jsx(Input, { label: "Full name", type: "text", value: name, onChange: (e) => setName(e.target.value), required: true, fullWidth: true, startAdornment: _jsx(User, { size: 18 }) }), _jsx(Input, { label: "Email address", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, fullWidth: true, startAdornment: _jsx(Mail, { size: 18 }) }), _jsx(Input, { label: "Password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, fullWidth: true, startAdornment: _jsx(Lock, { size: 18 }) }), _jsx(Input, { label: "Confirm password", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, fullWidth: true, startAdornment: _jsx(Lock, { size: 18 }) }), _jsxs("div", { className: "flex items-center", children: [_jsx("input", { id: "terms", name: "terms", type: "checkbox", required: true, className: "h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" }), _jsxs("label", { htmlFor: "terms", className: "ml-2 block text-sm text-gray-900", children: ["I agree to the", ' ', _jsx("a", { href: "#", className: "font-medium text-primary-600 hover:text-primary-500", children: "Terms of Service" }), ' ', "and", ' ', _jsx("a", { href: "#", className: "font-medium text-primary-600 hover:text-primary-500", children: "Privacy Policy" })] })] }), _jsx(Button, { type: "submit", fullWidth: true, isLoading: isLoading, children: "Create account" })] }), _jsxs("div", { className: "mt-6", children: [_jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-gray-300" }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2 bg-white text-gray-500", children: "Or" }) })] }), _jsx("div", { className: "mt-2 text-center", children: _jsxs("p", { className: "text-sm text-gray-600", children: ["Already have an account?", ' ', _jsx(Link, { to: "/login", className: "font-medium text-primary-600 hover:text-primary-500", children: "Sign in" })] }) })] })] }) })] }));
};
