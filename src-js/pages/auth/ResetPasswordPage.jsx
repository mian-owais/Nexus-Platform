import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
export const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { resetPassword } = useAuth();
    const token = searchParams.get('token');
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!token) {
            return;
        }
        if (password !== confirmPassword) {
            return;
        }
        setIsLoading(true);
        try {
            await resetPassword(token, password);
            navigate('/login');
        }
        catch (error) {
            // Error is handled by the AuthContext
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!token) {
        return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsx("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: _jsxs("div", { className: "text-center", children: [_jsx("h2", { className: "text-3xl font-extrabold text-gray-900", children: "Invalid reset link" }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "This password reset link is invalid or has expired." }), _jsx(Button, { className: "mt-4", onClick: () => navigate('/forgot-password'), children: "Request new reset link" })] }) }) }));
    }
    return (_jsx("div", { className: "min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8", children: _jsxs("div", { className: "sm:mx-auto sm:w-full sm:max-w-md", children: [_jsxs("div", { className: "text-center", children: [_jsx(Lock, { className: "mx-auto h-12 w-12 text-primary-600" }), _jsx("h2", { className: "mt-6 text-3xl font-extrabold text-gray-900", children: "Reset your password" }), _jsx("p", { className: "mt-2 text-sm text-gray-600", children: "Enter your new password below" })] }), _jsx("div", { className: "mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10", children: _jsxs("form", { className: "space-y-6", onSubmit: handleSubmit, children: [_jsx(Input, { label: "New password", type: "password", value: password, onChange: (e) => setPassword(e.target.value), required: true, fullWidth: true, startAdornment: _jsx(Lock, { size: 18 }) }), _jsx(Input, { label: "Confirm new password", type: "password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), required: true, fullWidth: true, startAdornment: _jsx(Lock, { size: 18 }), error: password !== confirmPassword ? 'Passwords do not match' : undefined }), _jsx(Button, { type: "submit", fullWidth: true, isLoading: isLoading, children: "Reset password" })] }) })] }) }));
};
