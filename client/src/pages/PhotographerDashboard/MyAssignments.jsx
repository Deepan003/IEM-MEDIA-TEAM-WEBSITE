import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Video, Calendar } from 'lucide-react';
import { format } from 'date-fns';

// MOCK DATA - This simulates a fetch of the current user's past assignments.
const mockAssignments = [
    {
        _id: 'assign1',
        eventName: 'Annual Tech Fest 2025',
        eventDate: new Date('2025-09-20'),
        subEventName: 'Day 1: Inauguration & Workshops',
        task: 'Main Stage Photos',
        type: 'photo'
    },
    {
        _id: 'assign2',
        eventName: 'Annual Tech Fest 2025',
        eventDate: new Date('2025-09-20'),
        subEventName: 'Day 1: Inauguration & Workshops',
        task: 'Workshop A Video',
        type: 'video'
    },
    {
        _id: 'assign3',
        eventName: 'Freshers Welcome',
        eventDate: new Date('2025-10-05'),
        subEventName: 'Main Event',
        task: 'Crowd & Ambiance (Floating)',
        type: 'photo'
    },
];

const AssignmentCard = ({ assignment, index }) => {
    const isPhoto = assignment.type === 'photo';
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-slate-800/50 border-l-4 border-purple-500 rounded-r-lg p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center"
        >
            <div>
                <p className="text-xs text-slate-400 mb-1">{assignment.subEventName}</p>
                <h3 className="text-xl font-bold text-white">{assignment.task}</h3>
                <p className="text-purple-300 font-semibold mt-1">{assignment.eventName}</p>
            </div>
            <div className="flex items-center gap-4 mt-4 sm:mt-0">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Calendar size={16} />
                    <span>{format(new Date(assignment.eventDate), 'dd MMM yyyy')}</span>
                </div>
                <div className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full ${isPhoto ? 'bg-sky-500/20 text-sky-300' : 'bg-rose-500/20 text-rose-300'}`}>
                    {isPhoto ? <Camera size={14} /> : <Video size={14} />}
                    <span>{isPhoto ? 'Photo' : 'Video'}</span>
                </div>
            </div>
        </motion.div>
    );
};

const MyAssignments = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-extrabold tracking-tight text-white">My Assignments</h1>
            <p className="mt-1 text-slate-400 mb-8">A history of all your assigned tasks and events.</p>

            <div className="space-y-4">
                {mockAssignments.length > 0 ? (
                    mockAssignments.map((assignment, index) => (
                        <AssignmentCard key={assignment._id} assignment={assignment} index={index} />
                    ))
                ) : (
                    <div className="text-center py-12 bg-slate-800/50 rounded-lg">
                        <p className="text-slate-400">You have no assignments yet.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default MyAssignments;