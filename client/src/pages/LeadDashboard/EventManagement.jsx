import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, List, Loader2, AlertTriangle } from 'lucide-react';
import EventCard from '../../components/EventCard';
import EventFormModal from '../../components/EventFormModal';
import { getEvents } from '../../services/api';

const EventManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            const res = await getEvents();
            setEvents(res.data);
            setError(null);
        } catch (err) {
            setError("Failed to fetch events.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-white">Event Management</h1>
                    <p className="mt-1 text-slate-400">Create, publish, and manage all club events.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(true)}
                    className="mt-4 sm:mt-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-lg"
                >
                    <Plus size={20} />
                    Create New Event
                </motion.button>
            </div>
            
            {loading && <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-purple-400" size={48} /></div>}
            {error && <div className="flex justify-center items-center h-64 text-red-400 bg-red-500/10 rounded-lg p-4"><AlertTriangle className="mr-3"/> {error}</div>}
            
            {!loading && !error && (
                 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {events.map(event => (
                        <EventCard key={event._id} event={event} isManagement={true} />
                    ))}
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && <EventFormModal onClose={() => setIsModalOpen(false)} refreshEvents={fetchEvents} />}
            </AnimatePresence>
        </motion.div>
    );
};

export default EventManagement;