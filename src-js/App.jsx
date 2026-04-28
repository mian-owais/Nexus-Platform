import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { EntrepreneurDashboard } from './pages/dashboard/EntrepreneurDashboard';
import { InvestorDashboard } from './pages/dashboard/InvestorDashboard';
import { EntrepreneurProfile } from './pages/profile/EntrepreneurProfile';
import { InvestorProfile } from './pages/profile/InvestorProfile';
import { InvestorsPage } from './pages/investors/InvestorsPage';
import { EntrepreneursPage } from './pages/entrepreneurs/EntrepreneursPage';
import { MessagesPage } from './pages/messages/MessagesPage';
import { NotificationsPage } from './pages/notifications/NotificationsPage';
import { DocumentsPage } from './pages/documents/DocumentsPage';
import { SettingsPage } from './pages/settings/SettingsPage';
import { HelpPage } from './pages/help/HelpPage';
import { DealsPage } from './pages/deals/DealsPage';
import { MeetingsPage } from './pages/meetings/MeetingsPage';
import { ChatPage } from './pages/chat/ChatPage';
function App() {
    return (_jsx(AuthProvider, { children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(LoginPage, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterPage, {}) }), _jsxs(Route, { path: "/dashboard", element: _jsx(DashboardLayout, {}), children: [_jsx(Route, { path: "entrepreneur", element: _jsx(EntrepreneurDashboard, {}) }), _jsx(Route, { path: "investor", element: _jsx(InvestorDashboard, {}) })] }), _jsxs(Route, { path: "/profile", element: _jsx(DashboardLayout, {}), children: [_jsx(Route, { path: "entrepreneur/:id", element: _jsx(EntrepreneurProfile, {}) }), _jsx(Route, { path: "investor/:id", element: _jsx(InvestorProfile, {}) })] }), _jsx(Route, { path: "/investors", element: _jsx(DashboardLayout, {}), children: _jsx(Route, { index: true, element: _jsx(InvestorsPage, {}) }) }), _jsx(Route, { path: "/entrepreneurs", element: _jsx(DashboardLayout, {}), children: _jsx(Route, { index: true, element: _jsx(EntrepreneursPage, {}) }) }), _jsx(Route, { path: "/messages", element: _jsx(DashboardLayout, {}), children: _jsx(Route, { index: true, element: _jsx(MessagesPage, {}) }) }), _jsx(Route, { path: "/notifications", element: _jsx(DashboardLayout, {}), children: _jsx(Route, { index: true, element: _jsx(NotificationsPage, {}) }) }), _jsx(Route, { path: "/documents", element: _jsx(DashboardLayout, {}), children: _jsx(Route, { index: true, element: _jsx(DocumentsPage, {}) }) }), _jsx(Route, { path: "/meetings", element: _jsx(DashboardLayout, {}), children: _jsx(Route, { index: true, element: _jsx(MeetingsPage, {}) }) }), _jsx(Route, { path: "/settings", element: _jsx(DashboardLayout, {}), children: _jsx(Route, { index: true, element: _jsx(SettingsPage, {}) }) }), _jsx(Route, { path: "/help", element: _jsx(DashboardLayout, {}), children: _jsx(Route, { index: true, element: _jsx(HelpPage, {}) }) }), _jsx(Route, { path: "/deals", element: _jsx(DashboardLayout, {}), children: _jsx(Route, { index: true, element: _jsx(DealsPage, {}) }) }), _jsxs(Route, { path: "/chat", element: _jsx(DashboardLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(ChatPage, {}) }), _jsx(Route, { path: ":userId", element: _jsx(ChatPage, {}) })] }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/login", replace: true }) })] }) }) }));
}
export default App;
