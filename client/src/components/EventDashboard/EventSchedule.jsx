import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ChevronDown, MapPin, Clock, Trash2, UserPlus, GripVertical } from 'lucide-react';
import { format } from 'date-fns';

// --- Room/Task Component ---
const RoomTask = ({ room, participants }) => {
    const assignedMembers = room.assignments.map(a => participants.find(p => p._id === a.user._id)).filter(Boolean);

    return (
        <div className="flex items-center justify-between p-3 bg-slate-700/50 rounded-md">
            <div className="flex items-center gap-2">
                <GripVertical className="text-slate-500 cursor-grab" size={16} />
                <p className="font-semibold text-white">{room.name}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                    {assignedMembers.map(member => (
                        <img key={member._id} src={member.profilePic} alt={member.fullName} className="w-7 h-7 rounded-full border-2 border-slate-600"/>
                    ))}
                </div>
                <button className="flex items-center gap-1 text-xs font-semibold text-purple-400 hover:text-purple-300">
                    <UserPlus size={14} /> Assign
                </button>
            </div>
        </div>
    );
};


// --- Sub-Event Card Component ---
const SubEventCard = ({ subEvent, participants }) => {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="bg-slate-800 rounded-lg border border-slate-700">
            {/* Header */}
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-4">
                <div>
                    <h4 className="font-bold text-lg text-white text-left">{subEvent.name}</h4>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                        <span className="flex items-center gap-1.5"><Clock size={12}/> {format(new Date(subEvent.date), 'MMM dd, yyyy')}</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-full"><Trash2 size={16} /></button>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronDown className="text-slate-400" />
                    </motion.div>
                </div>
            </button>

            {/* Collapsible Content */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3">
                            {subEvent.rooms.map(room => (
                                <RoomTask key={room._id} room={room} participants={participants} />
                            ))}
                        </div>
                        <div className="p-4 border-t border-slate-700/50">
                            <button className="w-full text-center text-sm font-semibold text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2">
                                <Plus size={16} /> Add Room / Task
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};


// --- Main Schedule Component ---
const EventSchedule = ({ event }) => {
    const [subEvents, setSubEvents] = useState(event.subEvents || []);
    
    return (
        <div>
            <div className="flex justify-end mb-4">
                <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                    <Plus size={18} />
                    Add Sub-Event
                </button>
            </div>
            <div className="space-y-4">
                {subEvents.map(subEvent => (
                    <SubEventCard key={subEvent._id} subEvent={subEvent} participants={event.participants}/>
                ))}
            </div>
        </div>
    );
};

export default EventSchedule;