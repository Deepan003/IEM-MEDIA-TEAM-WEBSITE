import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Link as LinkIcon, Sun, Moon, Camera, Trash2, Plus } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import FormInput from '../../components/FormInput';
import ToggleSwitch from '../../components/ToggleSwitch';
import SocialsManager from '../../components/Admin/SocialsManager'; // 1. Imported the new component

// MOCK DATA - Represents the currently logged-in user's data
const mockUser = {
    profilePic: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    fullName: 'Deepan Roy',
    email: 'deepan.roy@example.com',
    year: 3,
    department: 'CSE',
    device: 'Sony A7 III',
    lenses: '24-70mm f/2.8, 85mm f/1.8',
    socials: [
        { platform: 'Instagram', url: 'https://instagram.com/deepanroy' },
        { platform: 'Portfolio', url: 'https://deepanroy.com' }
    ]
};

const TabButton = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-semibold text-sm rounded-md transition-colors relative ${
            isActive ? 'text-white' : 'text-slate-400 hover:text-white'
        }`}
    >
        {label}
        {isActive && (
            <motion.div
                layoutId="activeSettingsTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        )}
    </button>
);

const SettingsPage = () => {
    const { user } = useAuth();
    const canManageSocials = user?.role === 'admin' || user?.role === 'lead';
    const [activeTab, setActiveTab] = useState('profile');
    const [isDarkMode, setIsDarkMode] = useState(true);

    const [formData, setFormData] = useState(mockUser);

    const handleThemeChange = () => {
        setIsDarkMode(!isDarkMode);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <img src={formData.profilePic} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-slate-600" />
                                <button className="absolute bottom-0 right-0 p-2 bg-purple-600 rounded-full text-white hover:bg-purple-500 transition-colors">
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h3 className="text-xl font-bold mt-4">{formData.fullName}</h3>
                            <p className="text-slate-400">{formData.email}</p>
                        </div>
                        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <FormInput id="year" label="Year" type="number" value={formData.year} required={false} />
                            <FormInput id="department" label="Department" value={formData.department} required={false} />
                            <div className="sm:col-span-2">
                                <FormInput id="device" label="Primary Camera/Device" value={formData.device} required={false} />
                            </div>
                             <div className="sm:col-span-2">
                                <FormInput id="lenses" label="Lenses" value={formData.lenses} required={false} />
                            </div>
                        </div>
                    </div>
                );
            case 'appearance':
                 return (
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Theme</h3>
                        <div className="p-4 bg-slate-800 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isDarkMode ? <Moon/> : <Sun/>}
                                <span>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
                            </div>
                            <ToggleSwitch enabled={isDarkMode} onChange={handleThemeChange} label="ThemeToggle"/>
                        </div>
                    </div>
                 );
            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h1 className="text-4xl font-extrabold tracking-tight text-white">Settings</h1>
            <p className="mt-1 text-slate-400 mb-8">Manage your profile, preferences, and account settings.</p>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg">
                {/* Tab Navigation */}
                <div className="flex border-b border-slate-700 px-4">
                    <TabButton label="Profile" isActive={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                    <TabButton label="Appearance" isActive={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} />
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* 2. Added the SocialsManager conditionally */}
                {canManageSocials && activeTab === 'profile' && <SocialsManager />}
                
                 <div className="p-4 border-t border-slate-700 bg-slate-800/30 flex justify-end rounded-b-lg">
                    <button className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SettingsPage;