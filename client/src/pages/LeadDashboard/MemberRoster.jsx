import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserX, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { getMembers, banUser, deleteUser } from '../../services/api'; // 1. Import API functions

const MemberCard = ({ member, onBan, onDelete }) => (
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
            <img src={member.profilePic || `https://i.pravatar.cc/150?u=${member._id}`} alt={member.fullName} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        </div>
        <div className="relative p-4 flex flex-col justify-end h-64">
            <h3 className="text-xl font-bold text-white">{member.fullName}</h3>
            <p className="text-sm text-purple-300">{member.department} - {member.year}rd Year</p>
            {member.isBanned && <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">BANNED</div>}
        </div>
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
             <button onClick={() => onBan(member._id)} className="p-3 bg-yellow-500/20 text-yellow-400 rounded-full hover:bg-yellow-500/40 transition-colors" title={member.isBanned ? 'Unban User' : 'Ban User'}>
                <UserX />
             </button>
             <button onClick={() => onDelete(member._id)} className="p-3 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40 transition-colors" title="Delete User">
                <Trash2 />
            </button>
        </div>
    </motion.div>
);

const MemberRoster = () => {
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. Function to fetch members from the API
    const fetchMembers = async () => {
        try {
            setLoading(true);
            const res = await getMembers();
            setMembers(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch members. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // 3. useEffect hook to call fetchMembers when the component mounts
    useEffect(() => {
        fetchMembers();
    }, []);

    // 4. Update handlers to call API and refresh data
    const handleBan = async (id) => {
        if (window.confirm('Are you sure you want to toggle the ban status for this user?')) {
            try {
                await banUser(id);
                fetchMembers(); // Re-fetch the list to show the change
            } catch (err) {
                console.error("Failed to ban user:", err);
                alert("Could not update ban status.");
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to permanently delete this user? This action cannot be undone.')) {
            try {
                await deleteUser(id);
                fetchMembers(); // Re-fetch the list to show the change
            } catch (err) {
                console.error("Failed to delete user:", err);
                alert("Could not delete user.");
            }
        }
    };

    // 5. Add loading and error states to the UI
    if (loading) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-purple-400" size={48} /></div>;
    }
    
    if (error) {
        return <div className="flex justify-center items-center h-64 text-red-400 bg-red-500/10 rounded-lg p-4"><AlertTriangle className="mr-3"/> {error}</div>;
    }

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Media Team Roster</h1>
            <p className="text-slate-400 mb-6">Manage all registered photographers and leads.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                 <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                    <input type="text" placeholder="Search by name..." className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border-2 border-slate-700 rounded-lg text-white"/>
                </div>
            </div>
            <AnimatePresence>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {members.map(member => (
                        <MemberCard key={member._id} member={member} onBan={handleBan} onDelete={handleDelete} />
                    ))}
                </div>
            </AnimatePresence>
        </motion.div>
    );
};

export default MemberRoster;