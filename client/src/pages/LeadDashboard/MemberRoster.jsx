import React from 'react';
import { motion } from 'framer-motion';
import { Search, UserX, Trash2 } from 'lucide-react';

// Mock data - replace with API call
const mockMembers = [
    { _id: 1, fullName: 'Deepan Roy', department: 'CSE', year: 3, isBanned: false, profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
    { _id: 2, fullName: 'Jane Smith', department: 'ECE', year: 2, isBanned: true, profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704e' },
    // ... more members
];

const MemberCard = ({ member }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
        style={{ transformStyle: 'preserve-3d' }}
    >
        <div 
            className="absolute inset-0 transition-transform duration-500 group-hover:[transform:perspective(1000px)_rotateY(-7deg)]"
        >
            <img src={member.profilePic} alt={member.fullName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="relative p-4 flex flex-col justify-end h-64">
            <h3 className="text-xl font-bold text-white">{member.fullName}</h3>
            <p className="text-sm text-purple-300">{member.department} - {member.year}rd Year</p>
            {member.isBanned && <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">BANNED</div>}
        </div>
        
        {/* Hover Actions */}
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button className="p-3 bg-yellow-500/20 text-yellow-400 rounded-full hover:bg-yellow-500/40 transition-colors">
                <UserX />
             </button>
             <button className="p-3 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors">
                <Trash2 />
            </button>
        </div>
    </motion.div>
);


const MemberRoster = () => {
    // In a real app, you would use useState and useEffect to fetch members
    const members = mockMembers;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Media Team Roster</h1>
            <p className="text-slate-400 mb-6">Manage all registered photographers and leads.</p>

            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                 <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border-2 border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
                <select className="bg-slate-800 border-2 border-slate-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Filter by Year</option>
                </select>
                 <select className="bg-slate-800 border-2 border-slate-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option>Filter by Department</option>
                </select>
            </div>

            {/* Member Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {members.map(member => (
                    <MemberCard key={member._id} member={member} />
                ))}
            </div>
        </motion.div>
    );
};

export default MemberRoster;