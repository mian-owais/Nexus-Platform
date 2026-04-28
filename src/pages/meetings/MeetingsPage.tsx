import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Calendar as BigCalendar, dateFnsLocalizer, Event } from 'react-big-calendar';
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

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

type MeetingStatus = 'scheduled' | 'confirmed' | 'cancelled' | 'completed';

interface MeetingDto {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  status: MeetingStatus;
}

interface CalendarMeetingEvent extends Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: MeetingDto;
}

const tokenHeaders = () => {
  const token = localStorage.getItem('business_nexus_access_token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

export const MeetingsPage: React.FC = () => {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState<MeetingDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`${API_BASE_URL}/meetings`, {
          headers: tokenHeaders(),
        });
        setMeetings(response.data.data || []);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            'Failed to load meetings. Please make sure backend is running.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchMeetings();
    }
  }, [user]);

  const events = useMemo<CalendarMeetingEvent[]>(
    () =>
      meetings.map((meeting) => ({
        id: meeting._id,
        title: meeting.title,
        start: new Date(meeting.startTime),
        end: new Date(meeting.endTime),
        resource: meeting,
      })),
    [meetings]
  );

  const confirmedCount = meetings.filter((m) => m.status === 'confirmed').length;
  const declinedOrCancelledCount = meetings.filter(
    (m) => m.status === 'cancelled'
  ).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meetings Calendar</h1>
          <p className="text-gray-600">Synced with your backend meeting schedule</p>
        </div>
        <Calendar className="text-primary-600" size={28} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardBody className="flex items-center gap-3">
            <CheckCircle size={20} className="text-success-600" />
            <div>
              <p className="text-sm text-gray-500">Confirmed Meetings</p>
              <p className="text-xl font-semibold text-gray-900">{confirmedCount}</p>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex items-center gap-3">
            <XCircle size={20} className="text-error-600" />
            <div>
              <p className="text-sm text-gray-500">Cancelled Meetings</p>
              <p className="text-xl font-semibold text-gray-900">{declinedOrCancelledCount}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Calendar View</h2>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <p className="text-gray-600">Loading meetings...</p>
          ) : error ? (
            <p className="text-error-600">{error}</p>
          ) : (
            <div style={{ height: 600 }}>
              <BigCalendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                views={['month', 'week', 'day']}
                defaultView="week"
                popup
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};
