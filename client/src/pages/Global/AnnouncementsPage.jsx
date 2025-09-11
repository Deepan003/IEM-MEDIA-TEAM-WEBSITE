import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Image as ImageIcon, Send, Loader2, AlertTriangle } from 'lucide-react';
import { getAnnouncements, createAnnouncement } from '../../services/api';

// AnnouncementCard component can stay the same
const AnnouncementCard = ({ announcement, index }) => {
    // ... (no changes needed here)
};


const AnnouncementsPage = () => {
    const { user } = useAuth();
    const canPost = user?.role === 'admin' || user?.role === 'lead';
    
    const [announcements, setAnnouncements] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [posting, setPosting] = useState(false);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const res = await getAnnouncements();
            setAnnouncements(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to load announcements.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handlePost = async () => {
        if (!newPost.trim()) return;
        setPosting(true);
        try {
            await createAnnouncement({ content: newPost });
            setNewPost('');
            fetchAnnouncements(); // Refresh the list
        } catch (err) {
            console.error('Failed to post announcement:', err);
            alert('Could not post announcement.');
        } finally {
            setPosting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
        >
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Announcements</h1>
            <p className="mt-1 text-slate-400 mb-8">Latest news and updates from the club administration.</p>
            
            {canPost && (
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-5 mb-8">
                    <textarea
                        rows={3}
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        placeholder={`What's on your mind, ${user.name.split(' ')[0]}?`}
                        className="w-full bg-slate-800 p-3 rounded-md focus:outline-none"
                    />
                    <div className="flex justify-between items-center mt-3">
                        <button className="p-2 text-slate-400 hover:text-purple-400"><ImageIcon size={20} /></button>
                        <button onClick={handlePost} disabled={posting} className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg w-28">
                            {posting ? <Loader2 className="animate-spin"/> : <><Send size={16} /> Post</>}
                        </button>
                    </div>
                </div>
            )}

            {loading && <div className="flex justify-center p-8"><Loader2 className="animate-spin text-purple-400" size={32}/></div>}
            {error && <div className="text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</div>}

            <div className="space-y-6">
                {!loading && !error && announcements.map((announcement, index) => (
                    <AnnouncementCard key={announcement._id} announcement={announcement} index={index} />
                ))}
            </div>
        </motion.div>
    );
};

export default AnnouncementsPage;