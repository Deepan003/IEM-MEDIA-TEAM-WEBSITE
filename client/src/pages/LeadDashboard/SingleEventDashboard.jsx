import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Users, Calendar, CheckSquare } from 'lucide-react';
import EventSettings from '../../components/EventDashboard/EventSettings';
import EventParticipants from '../../components/EventDashboard/EventParticipants';
import EventSchedule from '../../components/EventDashboard/EventSchedule';
import EventAttendance from '../../components/EventDashboard/EventAttendance'; // 1. Imported the new component

// MOCK DATA for a single event
const MOCK_SINGLE_EVENT = {
    _id: '1',
    eventName: 'Annual Tech Fest 2025',
    date: { type: 'Date Range', startDate: new Date('2025-09-20'), endDate: new Date('2025-09-22') },
    banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
    visibility: 'Members Only',
    accessibility: 'Open',
    description: 'The biggest tech fest of the year, featuring workshops, competitions, and guest speakers. We need full photo and video coverage.',
    location: { address: 'IEM Gurukul Campus Auditorium' },
    participants: [
        { _id: 1, fullName: 'Deepan Roy', profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', role: 'Event Lead' },
        { _id: 2, fullName: 'Jane Smith', profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', role: 'Photographer' },
        { _id: 3, fullName: 'John Doe', profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', role: 'Videographer' },
        { _id: 4, fullName: 'Alice Johnson', profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704g', role: 'Photographer' },
    ],
    subEvents: [
        { 
            _id: 'sub1', 
            name: 'Day 1: Inauguration & Workshops', 
            date: new Date('2025-09-20'),
            rooms: [
                { _id: 'room1', name: 'Main Stage Photos', assignments: [{ user: { _id: 2, fullName: 'Jane Smith' }}] },
                { _id: 'room2', name: 'Workshop A Video', assignments: [{ user: { _id: 3, fullName: 'John Doe' }}] },
            ] 
        },
        { 
            _id: 'sub2', 
            name: 'Day 2: Competitions', 
            date: new Date('2025-09-21'),
            rooms: [] 
        },
    ],
    // 2. Corrected mock data structure
    attendance: {
        enabled: true,
        selfMarking: false,
        geofencing: {
            enabled: false,
            radius: 50 // in meters
        },
        records: [
            { user: { _id: 1 }, status: 'Present' },
            { user: { _id: 2 }, status: 'Absent' },
            { user: { _id: 3 }, status: 'Present' },
            { user: { _id: 4 }, status: 'Not Marked' },
        ]
    }
};

const TabButton = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-md transition-colors ${
            isActive ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-700/50'
        }`}
    >
        {icon}
        {label}
    </button>
);

const SingleEventDashboard = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('settings');

    useEffect(() => {
        // Simulate fetching event data
        console.log(`Fetching data for event ID: ${eventId}`);
        setEvent(MOCK_SINGLE_EVENT);
    }, [eventId]);

    if (!event) {
        return <div className="text-center p-8">Loading event...</div>;
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'settings':
                return <EventSettings event={event} />;
            case 'participants':
                return <EventParticipants event={event} />;
            case 'schedule':
                return <EventSchedule event={event} />;
            case 'attendance':
                // 3. Added the component here
                return <EventAttendance event={event} />; 
            default:
                return null;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Event Banner and Header */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                <img src={event.banner} alt={event.eventName} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{event.eventName}</h1>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-2 bg-slate-800 rounded-lg mb-8">
                <TabButton label="Settings" icon={<Settings size={16}/>} isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                <TabButton label="Participants" icon={<Users size={16}/>} isActive={activeTab === 'participants'} onClick={() => setActiveTab('participants')} />
                <TabButton label="Schedule & Assign" icon={<Calendar size={16}/>} isActive={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} />
                <TabButton label="Attendance" icon={<CheckSquare size={16}/>} isActive={activeTab === 'attendance'} onClick={() => setActiveTab('attendance')} />
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {renderContent()}
            </motion.div>
        </motion.div>
    );
};

export default SingleEventDashboard;