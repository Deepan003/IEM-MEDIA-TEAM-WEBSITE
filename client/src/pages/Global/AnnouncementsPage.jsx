import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Image as ImageIcon, Send } from 'lucide-react';

// MOCK DATA - Simulates a fetch from your announcements API endpoint
const mockAnnouncements = [
    {
        _id: 'anno1',
        author: { fullName: 'Admin User', profilePic: 'https://i.pravatar.cc/150?u=admin' },
        content: 'Welcome everyone to the new academic year! We have a lot of exciting events planned, starting with the Freshers Welcome next month. Make sure to register!',
        image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1600',
        createdAt: new Date('2025-09-10T10:00:00Z'),
    },
    {
        _id: 'anno2',
        author: { fullName: 'Deepan Roy', profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        content: 'The results for the annual photography competition are out! Congratulations to all the winners. Check the main notice board for the full list.',
        image: null,
        createdAt: new Date('2025-09-08T15:30:00Z'),
    },
];

const AnnouncementCard = ({ announcement, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-5"
        >
            <div className="flex items-center mb-4">
                <img src={announcement.author.profilePic} alt={announcement.author.fullName} className="w-11 h-11 rounded-full object-cover" />
                <div className="ml-4">
                    <p className="font-bold text-white">{announcement.author.fullName}</p>
                    <p className="text-xs text-slate-400">
                        {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                    </p>
                </div>
            </div>
            <p className="text-slate-300 whitespace-pre-wrap mb-4">{announcement.content}</p>
            {announcement.image && (
                <div className="mt-4 rounded-lg overflow-hidden">
                    <img src={announcement.image} alt="Announcement visual" className="w-full h-auto object-cover" />
                </div>
            )}
        </motion.div>
    );
};

const AnnouncementsPage = () => {
    const { user } = useAuth();
    const canPost = user?.role === 'admin' || user?.role === 'lead';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
        >
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Announcements</h1>
            <p className="mt-1 text-slate-400 mb-8">Latest news and updates from the club administration.</p>
            
            {/* Post Creation Form - Only for Admins/Leads */}
            {canPost && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 mb-8">
                    <textarea
                        rows={3}
                        placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
                        className="w-full bg-slate-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-slate-400 resize-none"
                    />
                    <div className="flex justify-between items-center mt-3">
                        <button className="p-2 text-slate-400 hover:text-purple-400 transition-colors">
                            <ImageIcon size={20} />
                        </button>
                        <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
                            <Send size={16} />
                            Post
                        </button>
                    </div>
                </div>
            )}

            {/* Announcements Feed */}
            <div className="space-y-6">
                {mockAnnouncements.map((announcement, index) => (
                    <AnnouncementCard key={announcement._id} announcement={announcement} index={index} />
                ))}
            </div>
        </motion.div>
    );
};

export default AnnouncementsPage;