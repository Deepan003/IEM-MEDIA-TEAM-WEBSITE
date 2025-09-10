import React from 'react';
import { motion } from 'framer-motion';
import EventCard from '../../components/EventCard';
import { useAuth } from '../../hooks/useAuth';

// MOCK DATA - In a real app, this would be fetched from the API
const mockEvents = [
    { _id: '1', eventName: 'Annual Tech Fest 2025', date: { type: 'Date Range', startDate: new Date('2025-09-20'), endDate: new Date('2025-09-22') }, banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600', visibility: 'Members Only' },
    { _id: '2', eventName: 'Freshers Welcome', date: { type: 'Single Day', startDate: new Date('2025-10-05') }, banner: 'https://images.unsplash.com/photo-1505238680356-667803448bb6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600', visibility: 'Public' },
];


const EventsPage = () => {
    const { user } = useAuth();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
                Welcome, <span className="text-purple-400">{user?.name.split(' ')[0]}</span>!
            </h1>
            <p className="mt-1 text-slate-400 mb-8">Here are the upcoming events. Find one that interests you and register.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockEvents.map(event => (
                    // We pass `isManagement={false}` to show the "View Details" button
                    <EventCard key={event._id} event={event} isManagement={false} />
                ))}
            </div>
        </motion.div>
    );
};

export default EventsPage;

