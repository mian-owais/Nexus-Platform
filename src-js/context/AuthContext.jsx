import { jsx as _jsx } from "react/jsx-runtime";
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
// Create Auth Context
const AuthContext = createContext(undefined);
// Local storage keys
const USER_STORAGE_KEY = 'business_nexus_user';
const ACCESS_TOKEN_KEY = 'business_nexus_access_token';
const REFRESH_TOKEN_KEY = 'business_nexus_refresh_token';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const authHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
});
// Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    // Check for stored user on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);
    const login = async (email, password, role) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, {
                email,
                password,
                role,
            });
            const { user: apiUser, token, refreshToken } = response.data.data;
            const normalizedUser = {
                id: apiUser.id,
                name: apiUser.name,
                email: apiUser.email,
                role: apiUser.role,
                avatarUrl: apiUser.avatarUrl || '',
                bio: apiUser.bio || '',
                isOnline: apiUser.isOnline,
                createdAt: apiUser.createdAt,
            };
            setUser(normalizedUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
            localStorage.setItem(ACCESS_TOKEN_KEY, token);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            toast.success('Successfully logged in');
        }
        catch (error) {
            const message = error?.response?.data?.message ||
                'Login failed. Please check your credentials.';
            toast.error(message);
            throw new Error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const register = async (name, email, password, role) => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, {
                name,
                email,
                password,
                role,
            });
            const { user: apiUser, token, refreshToken } = response.data.data;
            const normalizedUser = {
                id: apiUser.id,
                name: apiUser.name,
                email: apiUser.email,
                role: apiUser.role,
                avatarUrl: apiUser.avatarUrl || '',
                bio: apiUser.bio || '',
                isOnline: apiUser.isOnline,
                createdAt: apiUser.createdAt,
            };
            setUser(normalizedUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
            localStorage.setItem(ACCESS_TOKEN_KEY, token);
            localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
            toast.success('Account created successfully');
        }
        catch (error) {
            const message = error?.response?.data?.message ||
                'Registration failed. Please try again.';
            toast.error(message);
            throw new Error(message);
        }
        finally {
            setIsLoading(false);
        }
    };
    const forgotPassword = async (email) => {
        toast.success(`Password reset request captured for ${email}`);
    };
    const resetPassword = async (token, newPassword) => {
        if (!token || !newPassword) {
            throw new Error('Token and new password are required');
        }
        toast.success('Password reset flow is ready for backend endpoint integration');
    };
    const logout = () => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            axios
                .post(`${API_BASE_URL}/auth/logout`, {}, { headers: authHeaders(token) })
                .catch(() => {
                // Client-side logout should still complete even if API call fails.
            });
        }
        setUser(null);
        localStorage.removeItem(USER_STORAGE_KEY);
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        toast.success('Logged out successfully');
    };
    const updateProfile = async (userId, updates) => {
        try {
            const token = localStorage.getItem(ACCESS_TOKEN_KEY);
            if (!token) {
                throw new Error('Session expired. Please log in again.');
            }
            const response = await axios.put(`${API_BASE_URL}/users/${userId}`, {
                name: updates.name,
                bio: updates.bio,
                avatarUrl: updates.avatarUrl,
            }, {
                headers: authHeaders(token),
            });
            const updated = response.data.data.user;
            const normalizedUser = {
                id: updated._id || updated.id,
                name: updated.name,
                email: updated.email,
                role: updated.role,
                avatarUrl: updated.avatarUrl || '',
                bio: updated.bio || '',
                isOnline: updated.isOnline,
                createdAt: updated.createdAt,
            };
            setUser(normalizedUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(normalizedUser));
            toast.success('Profile updated successfully');
        }
        catch (error) {
            const message = error?.response?.data?.message ||
                'Profile update failed';
            toast.error(message);
            throw new Error(message);
        }
    };
    const value = {
        user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updateProfile,
        isAuthenticated: !!user,
        isLoading
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
// Custom hook for using auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
