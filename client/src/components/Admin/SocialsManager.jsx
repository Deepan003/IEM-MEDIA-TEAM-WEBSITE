import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, Plus, Trash2, Instagram, Facebook, Youtube } from 'lucide-react';

// MOCK DATA - In a real app, this would be fetched from the API
const mockSocials = [
    { _id: 'soc1', platform: 'Instagram', url: 'https://instagram.com/iem_photography_club' },
    { _id: 'soc2', platform: 'Facebook', url: 'https://facebook.com/iem.pc' },
];

const platformIcons = {
    Instagram: <Instagram size={20} />,
    Facebook: <Facebook size={20} />,
    YouTube: <Youtube size={20} />,
    Default: <LinkIcon size={20} />,
};

const SocialsManager = () => {
    const [socials, setSocials] = useState(mockSocials);

    return (
        <div className="mt-8 pt-6 border-t border-slate-700">
            <h2 className="text-2xl font-bold text-white">Manage Social Links</h2>
            <p className="text-sm text-slate-400 mt-1 mb-6">These links will be displayed in the website footer for all users.</p>
            
            <div className="space-y-4">
                {socials.map((social, index) => (
                    <motion.div
                        key={social._id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                    >
                        <div className="p-3 bg-slate-700 rounded-lg text-purple-300">
                            {platformIcons[social.platform] || platformIcons.Default}
                        </div>
                        <input 
                            type="text" 
                            value={social.platform} 
                            placeholder="Platform (e.g., Instagram)"
                            className="w-1/3 p-2 bg-slate-800 border-2 border-slate-700 rounded-lg"
                        />
                        <input 
                            type="url" 
                            value={social.url} 
                            placeholder="https://..."
                            className="flex-grow p-2 bg-slate-800 border-2 border-slate-700 rounded-lg"
                        />
                        <button className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors">
                            <Trash2 size={18} />
                        </button>
                    </motion.div>
                ))}
            </div>

            <button className="mt-4 flex items-center gap-2 text-sm text-purple-400 font-semibold hover:text-purple-300 transition-colors">
                <Plus size={16} /> Add Social Link
            </button>
        </div>
    );
};

export default SocialsManager;