import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Search, UserCheck, Trash2, Shield } from 'lucide-react';

// MOCK DATA - In a real app, this would come from your event object and a separate list of all club members.
const mockParticipants = [
    { _id: 1, fullName: 'Deepan Roy', profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', role: 'Event Lead' },
    { _id: 2, fullName: 'Jane Smith', profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704e', role: 'Photographer' },
    { _id: 3, fullName: 'John Doe', profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704f', role: 'Videographer' },
];

const ParticipantRow = ({ participant }) => (
    <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg hover:bg-slate-700/50 transition-colors"
    >
        <div className="flex items-center gap-4">
            <img src={participant.profilePic} alt={participant.fullName} className="w-12 h-12 rounded-full object-cover" />
            <div>
                <p className="font-bold text-white">{participant.fullName}</p>
                <p className="text-sm text-slate-400">{participant.role}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button className="p-2 text-purple-400 hover:bg-purple-500/20 rounded-full transition-colors" title="Promote to Event Lead">
                <Shield size={18} />
            </button>
            <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors" title="Remove from Event">
                <Trash2 size={18} />
            </button>
        </div>
    </motion.div>
);

const EventParticipants = ({ event }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side: Participant List */}
            <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">
                    Event Participants ({mockParticipants.length})
                </h3>
                <div className="space-y-3">
                    {mockParticipants.map(p => <ParticipantRow key={p._id} participant={p} />)}
                </div>
            </div>

            {/* Right side: Add Members */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 self-start">
                 <h3 className="text-xl font-bold text-white mb-4">Add Members</h3>
                 <p className="text-sm text-slate-400 mb-4">Search for members to add them to this event. This is useful for 'Invite-Only' or 'Hybrid' events.</p>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border-2 border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                {/* Search results would appear here */}
                 <div className="mt-4 max-h-60 overflow-y-auto space-y-2">
                    {/* Example search result */}
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-700/50">
                        <div className="flex items-center gap-3">
                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704g" alt="Alice" className="w-10 h-10 rounded-full" />
                            <p className="font-semibold">Alice Johnson</p>
                        </div>
                        <button className="p-2 text-green-400 hover:bg-green-500/20 rounded-full transition-colors">
                            <UserPlus size={18} />
                        </button>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default EventParticipants;