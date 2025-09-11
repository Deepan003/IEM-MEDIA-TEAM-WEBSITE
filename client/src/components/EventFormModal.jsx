import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Plus, Trash2, Loader2, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import FormInput from './FormInput';
import { createEvent } from '../services/api'; // Import the API function

const EventFormModal = ({ onClose, refreshEvents }) => {
    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        location: { address: '' },
        date: { type: 'Single Day', startDate: '', endDate: '' },
        externalLinks: [{ label: '', url: '' }],
        // banner: null // We'll handle file upload separately
    });
    const [isLoading, setIsLoading] = useState(false);
    const [bannerPreview, setBannerPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'address') {
            setFormData(prev => ({ ...prev, location: { address: value } }));
        } else if (name === 'startDate' || name === 'endDate') {
            setFormData(prev => ({ ...prev, date: { ...prev.date, [name]: value } }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleDateTypeChange = (type) => {
        setFormData(prev => ({ ...prev, date: { ...prev.date, type } }));
    };

    const handleLinkChange = (index, field, value) => {
        const newLinks = [...formData.externalLinks];
        newLinks[index][field] = value;
        setFormData(prev => ({ ...prev, externalLinks: newLinks }));
    };

    const addLink = () => {
        setFormData(prev => ({
            ...prev,
            externalLinks: [...prev.externalLinks, { label: '', url: '' }]
        }));
    };

    const removeLink = (index) => {
        setFormData(prev => ({
            ...prev,
            externalLinks: prev.externalLinks.filter((_, i) => i !== index)
        }));
    };

    const handleBannerChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setBannerPreview(URL.createObjectURL(file));
            // In a real app, you would typically upload this file to a service
            // and get a URL back. For now, we'll just use the preview.
            // setFormData(prev => ({ ...prev, banner: file }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // NOTE: In a real-world scenario, you would first upload the banner image
            // to a cloud storage service (like Cloudinary or AWS S3), get the URL,
            // and then save that URL in the 'banner' field of your eventData.
            // For now, we are skipping the file upload part.
            
            const eventData = { ...formData };
            // delete eventData.banner; // Remove the file object before sending

            await createEvent(eventData);
            alert('Event created successfully!');
            refreshEvents(); // Refresh the event list on the parent page
            onClose();       // Close the modal
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('Error: Could not create event. Check console for details.');
        } finally {
            setIsLoading(false);
        }
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
                <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-slate-800 flex-shrink-0">
                        <h2 className="text-2xl font-bold text-white">Create New Event</h2>
                        <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-slate-700 transition-colors">
                            <X size={24} className="text-slate-400" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <div className="flex-grow p-6 overflow-y-auto space-y-6">
                        <FormInput id="eventName" name="eventName" label="Event Name" value={formData.eventName} onChange={handleChange} placeholder="e.g., Annual Tech Fest 2025" />
                        
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

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                            <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
                                <button type="button" onClick={() => handleDateTypeChange('Single Day')} className={`w-full py-2 rounded-md transition-colors text-sm font-semibold ${formData.date.type === 'Single Day' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Single Day</button>
                                <button type="button" onClick={() => handleDateTypeChange('Date Range')} className={`w-full py-2 rounded-md transition-colors text-sm font-semibold ${formData.date.type === 'Date Range' ? 'bg-purple-600 text-white' : 'text-slate-300 hover:bg-slate-700'}`}>Date Range</button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                <FormInput id="startDate" name="startDate" label={formData.date.type === 'Single Day' ? 'Event Date' : 'Start Date'} type="date" value={formData.date.startDate} onChange={handleChange} />
                                {formData.date.type === 'Date Range' && (
                                    <FormInput id="endDate" name="endDate" label="End Date" type="date" value={formData.date.endDate} onChange={handleChange} />
                                )}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                            <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full p-4 bg-slate-800 border-2 border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors" placeholder="Provide details about the event..."></textarea>
                        </div>

                        <FormInput id="address" name="address" label="Location" value={formData.location.address} onChange={handleChange} placeholder="e.g., IEM Gurukul Campus Auditorium" />

                        <div>
                            <h3 className="text-md font-semibold text-white mb-2">External Links</h3>
                            <div className="space-y-3">
                                {formData.externalLinks.map((link, index) => (
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
                    <div className="p-6 border-t border-slate-800 flex justify-end gap-4 flex-shrink-0">
                        <button type="button" onClick={onClose} className="py-2.5 px-6 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold transition-colors">Cancel</button>
                        <button type="submit" disabled={isLoading} className="py-2.5 px-6 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold transition-shadow hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center w-36">
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Create Event'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EventFormModal;