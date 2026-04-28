import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Calendar as BigCalendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
const locales = {
    'en-US': enUS,
};
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const tokenHeaders = () => {
    const token = localStorage.getItem('business_nexus_access_token');
    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
};
export const MeetingsPage = () => {
    const { user } = useAuth();
    const [meetings, setMeetings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchMeetings = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/meetings`, {
                    headers: tokenHeaders(),
                });
                setMeetings(response.data.data || []);
            }
            catch (err) {
                setError(err?.response?.data?.message ||
                    'Failed to load meetings. Please make sure backend is running.');
            }
            finally {
                setIsLoading(false);
            }
        };
        if (user) {
            fetchMeetings();
        }
    }, [user]);
    const events = useMemo(() => meetings.map((meeting) => ({
        id: meeting._id,
        title: meeting.title,
        start: new Date(meeting.startTime),
        end: new Date(meeting.endTime),
        resource: meeting,
    })), [meetings]);
    const confirmedCount = meetings.filter((m) => m.status === 'confirmed').length;
    const declinedOrCancelledCount = meetings.filter((m) => m.status === 'cancelled').length;
    return (_jsxs("div", { className: "space-y-6 animate-fade-in", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900", children: "Meetings Calendar" }), _jsx("p", { className: "text-gray-600", children: "Synced with your backend meeting schedule" })] }), _jsx(Calendar, { className: "text-primary-600", size: 28 })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(Card, { children: _jsxs(CardBody, { className: "flex items-center gap-3", children: [_jsx(CheckCircle, { size: 20, className: "text-success-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Confirmed Meetings" }), _jsx("p", { className: "text-xl font-semibold text-gray-900", children: confirmedCount })] })] }) }), _jsx(Card, { children: _jsxs(CardBody, { className: "flex items-center gap-3", children: [_jsx(XCircle, { size: 20, className: "text-error-600" }), _jsxs("div", { children: [_jsx("p", { className: "text-sm text-gray-500", children: "Cancelled Meetings" }), _jsx("p", { className: "text-xl font-semibold text-gray-900", children: declinedOrCancelledCount })] })] }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { children: _jsx("h2", { className: "text-lg font-medium text-gray-900", children: "Calendar View" }) }), _jsx(CardBody, { children: isLoading ? (_jsx("p", { className: "text-gray-600", children: "Loading meetings..." })) : error ? (_jsx("p", { className: "text-error-600", children: error })) : (_jsx("div", { style: { height: 600 }, children: _jsx(BigCalendar, { localizer: localizer, events: events, startAccessor: "start", endAccessor: "end", views: ['month', 'week', 'day'], defaultView: "week", popup: true }) })) })] })] }));
};
