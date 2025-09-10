import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const formatDate = (dateInfo) => {
    if (!dateInfo || !dateInfo.startDate) return 'Date TBD';
    if (dateInfo.type === 'Single Day') {
        return format(new Date(dateInfo.startDate), 'MMM dd, yyyy');
    }
    return `${format(new Date(dateInfo.startDate), 'MMM dd')} - ${format(new Date(dateInfo.endDate), 'MMM dd, yyyy')}`;
};

const visibilityStyles = {
    'Public': 'bg-green-500/20 text-green-300',
    'Members Only': 'bg-blue-500/20 text-blue-300',
    'Participants Only': 'bg-yellow-500/20 text-yellow-300',
    'Private': 'bg-red-500/20 text-red-300',
};

const EventCard = ({ event, isManagement = false }) => {
    const navigate = useNavigate();

    // Handler for the "Manage" button (for leads)
    const handleManageClick = () => {
        navigate(`/dashboard/event/${event._id}`);
    };
    
    // New handler for the "View Details" button (for photographers)
    const handleViewDetailsClick = () => {
        navigate(`/dashboard/event-details/${event._id}`);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 cursor-pointer h-full flex flex-col"
        >
            <div className="h-40 overflow-hidden">
                <img src={event.banner} alt={event.eventName} className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-white mb-1 flex-1">{event.eventName}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${visibilityStyles[event.visibility] || 'bg-gray-500/20 text-gray-300'}`}>
                        {event.visibility}
                    </span>
                </div>
                <p className="text-sm text-purple-300 font-medium mb-4">{formatDate(event.date)}</p>
                <div className="mt-auto pt-4 border-t border-slate-700">
                    {isManagement ? (
                        <div className="flex gap-2">
                            <button 
                                onClick={handleManageClick}
                                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                            >
                                Manage
                            </button>
                            <button className="w-full bg-red-500/20 hover:bg-red-500/40 text-red-300 font-semibold py-2 px-4 rounded-md transition-colors">Delete</button>
                        </div>
                    ) : (
                         <button 
                            onClick={handleViewDetailsClick}
                            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-md transition-colors"
                         >
                            View Details
                         </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default EventCard;