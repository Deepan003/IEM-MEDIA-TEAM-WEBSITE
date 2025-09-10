import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowLeft, Info } from 'lucide-react';
import { format } from 'date-fns';

// MOCK DATA for a single event, same as the one in SingleEventDashboard
const MOCK_SINGLE_EVENT = {
    _id: '1',
    eventName: 'Annual Tech Fest 2025',
    date: { type: 'Date Range', startDate: new Date('2025-09-20'), endDate: new Date('2025-09-22') },
    banner: 'https://images.unsplash.com/photo-1511578314322-379afb476865?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
    description: 'The biggest tech fest of the year, featuring workshops, competitions, and guest speakers from around the world. We need full photo and video coverage for all three days, focusing on keynotes, participant engagement, and the final award ceremony. A great opportunity to build your portfolio.',
    location: { address: 'IEM Gurukul Campus Auditorium' },
    // New fields for this view
    isRegistered: false, // Simulates if the current user is registered
    isAssigned: false, // Simulates if the user has been assigned a task by a lead
};


const EventDetailsPage = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [isRegistered, setIsRegistered] = useState(false);

     useEffect(() => {
        // Simulate fetching event data and registration status
        setEvent(MOCK_SINGLE_EVENT);
        setIsRegistered(MOCK_SINGLE_EVENT.isRegistered);
    }, [eventId]);

    if (!event) return <div>Loading...</div>;

    const disabledRegister = isRegistered && event.isAssigned;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Link to="/dashboard/events" className="flex items-center gap-2 text-purple-400 font-semibold hover:text-purple-300 mb-6">
                <ArrowLeft size={18} /> Back to All Events
            </Link>

            {/* Banner */}
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8">
                <img src={event.banner} alt={event.eventName} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details */}
                <div className="lg:col-span-2">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight">{event.eventName}</h1>
                    <p className="mt-4 text-slate-300 whitespace-pre-wrap">{event.description}</p>
                </div>

                {/* Right Column: Info & Actions */}
                <div className="self-start lg:sticky top-8">
                    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
                         <div className="flex items-center gap-3">
                            <Calendar className="text-purple-400" size={20} />
                            <span className="font-semibold text-white">{format(new Date(event.date.startDate), 'MMM dd, yy')} - {format(new Date(event.date.endDate), 'MMM dd, yy')}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <MapPin className="text-purple-400" size={20} />
                            <span className="font-semibold text-white">{event.location.address}</span>
                        </div>
                        
                        <motion.button
                            onClick={() => setIsRegistered(!isRegistered)}
                            disabled={disabledRegister}
                            whileHover={{ scale: disabledRegister ? 1 : 1.05 }}
                            whileTap={{ scale: disabledRegister ? 1 : 0.95 }}
                            className={`w-full mt-4 font-bold py-3 px-6 rounded-lg transition-all ${
                                isRegistered 
                                ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' 
                                : 'bg-green-600 hover:bg-green-500 text-white'
                            } ${disabledRegister ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isRegistered ? 'Deregister' : 'Register for Event'}
                        </motion.button>

                         {disabledRegister && (
                            <p className="flex items-start gap-2 text-xs text-yellow-400 mt-2 p-2 bg-yellow-500/10 rounded-md">
                                <Info size={16} className="flex-shrink-0 mt-0.5" />
                                You cannot deregister as you have already been assigned a task by a Lead. Please contact them for removal.
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default EventDetailsPage;