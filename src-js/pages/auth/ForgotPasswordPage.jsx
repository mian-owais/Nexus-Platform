import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
export const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { forgotPassword } = useAuth();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await forgotPassword(email);
            setIsSubmitted(true);
        }
        catch (error) {
            // Error is handled by the AuthContext
        }
        finally {
            setIsLoading(false);
        }
    };
    if (isSubmitted) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsxs("div", { className: "text-center", children: [_jsx(Mail, { className: "mx-auto h-12 w-12 text-primary-600" }), _jsx("h2", { className: "mt-6 text-3xl font-extrabold text-gray-900", children: "Check your email" }), _jsxs("p", { className: "mt-2 text-sm text-gray-600", children: ["We've sent password reset instructions to ", email] })] }), _jsx("div", { className: "mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: _jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-sm text-gray-500", children: "Didn't receive the email? Check your spam folder or try again." }), _jsx(Button, { variant: "outline", fullWidth: true, onClick: () => setIsSubmitted(false), children: "Try again" }), _jsx(Link, { to: "/login", children: _jsx(Button, { variant: "ghost", fullWidth: true, leftIcon: _jsx(ArrowLeft, { size: 18 }), children: "Back to login" }) })] }) })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsxs("div", { className: "text-center", children: [_jsx(Mail, { className: "mx-auto h-12 w-12 text-primary-600" }), _jsx("h2", { className: "mt-6 text-3xl font-extrabold text-gray-900", children: "Forgot your password?" }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Enter your email address and we'll send you instructions to reset your password." })] }), _jsx("div", { className: "mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsx(Input, { label: "Email address", type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, fullWidth: true, startAdornment: _jsx(Mail, { size: 18 }) }), _jsx(Button, { type: "submit", fullWidth: true, isLoading: isLoading, children: "Send reset instructions" }), _jsx(Link, { to: "/login", children: _jsx(Button, { variant: "ghost", fullWidth: true, leftIcon: _jsx(ArrowLeft, { size: 18 }), children: "Back to login" }) })] }) })] }) }));
};
