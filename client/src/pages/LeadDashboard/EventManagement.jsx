import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, List } from 'lucide-react';
import EventCard from '../../components/EventCard';
import EventFormModal from '../../components/EventFormModal';

// MOCK DATA until we connect the API
const mockEvents = [
    { _id: '1', eventName: 'Annual Tech Fest 2025', date: { type: 'Date Range', startDate: new Date('2025-09-20'), endDate: new Date('2025-09-22') }, banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600', visibility: 'Members Only' },
    { _id: '2', eventName: 'Freshers Welcome', date: { type: 'Single Day', startDate: new Date('2025-10-05') }, banner: 'https://images.unsplash.com/photo-15052386803448bb6?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600', visibility: 'Public' },
    { _id: '3', eventName: 'Photography Workshop', date: { type: 'Single Day', startDate: new Date('2025-11-12') }, banner: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600', visibility: 'Private' },
];

const EventManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Event Management</h1>
                    <p className="mt-1 text-slate-400">Create, publish, and manage all club events.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:shadow-purple-500/50 transition-shadow"
                >
                    <Plus size={20} />
                    Create New Event
                </motion.button>
            </div>

            {/* View Toggles */}
            <div className="flex justify-end gap-2 mb-4">
                 <button onClick={() => setViewMode('grid')} className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}><LayoutGrid/></button>
                 <button onClick={() => setViewMode('list')} className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}><List/></button>
            </div>


            {/* Events Grid/List */}
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                {mockEvents.map(event => (
                    <EventCard key={event._id} event={event} isManagement={true} />
                ))}
            </div>

            {/* This now correctly renders the modal when isModalOpen is true */}
            <AnimatePresence>
                {isModalOpen && <EventFormModal onClose={() => setIsModalOpen(false)} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default EventManagement;