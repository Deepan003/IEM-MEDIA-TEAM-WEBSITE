import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import FormInput from './FormInput'; // Import our new component

const EventFormModal = ({ onClose }) => {
    const [dateType, setDateType] = useState('Single Day');
    const [externalLinks, setExternalLinks] = useState([{ label: '', url: '' }]);
    const [bannerPreview, setBannerPreview] = useState(null);

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerPreview(URL.createObjectURL(file));
        }
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...externalLinks];
        newLinks[index][field] = value;
        setExternalLinks(newLinks);
    };

    const addLink = () => {
        setExternalLinks([...externalLinks, { label: '', url: '' }]);
    };

    const removeLink = (index) => {
        const newLinks = externalLinks.filter((_, i) => i !== index);
        setExternalLinks(newLinks);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: "100vh" }}
                animate={{ y: 0 }}
                exit={{ y: "100vh" }}
                transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                className="bg-slate-900 rounded-2xl w-full max-w-2xl h-[90vh] flex flex-col border border-slate-700 shadow-2xl shadow-purple-500/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-800">
                    <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Form Body */}
                <div className="flex-grow p-6 overflow-y-auto space-y-6">
                    <FormInput id="eventName" label="Event Name" placeholder="e.g., Annual Tech Fest 2025" />
                    
                    {/* Event Banner Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Event Banner</label>
                        <label htmlFor="file-upload" className="mt-2 cursor-pointer flex justify-center items-center w-full h-48 px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md hover:border-purple-500 transition-colors">
                            {bannerPreview ? (
                                <img src={bannerPreview} alt="Banner Preview" className="h-full object-contain rounded-md" />
                            ) : (
                                <div className="space-y-1 text-center">
                                    <ImageIcon className="mx-auto h-12 w-12 text-slate-500" />
                                    <p className="text-sm text-slate-400">Drag & drop or <span className="font-semibold text-purple-400">click to upload</span></p>
                                </div>
                            )}
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleBannerChange} accept="image/*" />
                        </label>
                    </div>

                    {/* Date Fields */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
                            <button type="button" onClick={() => setDateType('Single Day')} className={`w-full py-2 rounded-md transition-colors text-sm font-semibold ${dateType === 'Single Day' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Single Day</button>
                            <button type="button" onClick={() => setDateType('Date Range')} className={`w-full py-2 rounded-md transition-colors text-sm font-semibold ${dateType === 'Date Range' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Date Range</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <FormInput id="startDate" label={dateType === 'Single Day' ? 'Event Date' : 'Start Date'} type="date" />
                            {dateType === 'Date Range' && (
                                <FormInput id="endDate" label="End Date" type="date" />
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                        <textarea id="description" rows={4} className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" placeholder="Provide details about the event..."></textarea>
                    </div>

                    <FormInput id="location" label="Location" placeholder="e.g., IEM Gurukul Campus Auditorium" />

                    {/* External Links */}
                    <div>
                         <h3 className="text-md font-semibold text-white mb-2">External Links</h3>
                         <div className="space-y-3">
                            {externalLinks.map((link, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <input type="text" placeholder="Label (e.g., Payment)" value={link.label} onChange={(e) => handleLinkChange(index, 'label', e.target.value)} className="w-1/3 p-2 bg-slate-800 border-2 border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                                    <input type="url" placeholder="https://example.com" value={link.url} onChange={(e) => handleLinkChange(index, 'url', e.target.value)} className="flex-grow p-2 bg-slate-800 border-2 border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"/>
                                    <button type="button" onClick={() => removeLink(index)} className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors"><Trash2 size={18} /></button>
                                </div>
                            ))}
                         </div>
                         <button type="button" onClick={addLink} className="mt-3 flex items-center gap-2 text-sm text-purple-400 font-semibold hover:text-purple-300 transition-colors"><Plus size={16}/> Add Link</button>
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 border-t border-slate-800 flex justify-end gap-4">
                    <button type="button" onClick={onClose} className="py-2.5 px-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors">Cancel</button>
                    <button type="submit" className="py-2.5 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold transition-shadow hover:shadow-lg hover:shadow-purple-500/50">Create Event</button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default EventFormModal;