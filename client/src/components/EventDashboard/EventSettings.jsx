import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SettingsCard = ({ title, description, children }) => (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="text-sm text-slate-400 mt-1 mb-4">{description}</p>
        {children}
    </div>
);

const RadioPill = ({ id, name, label, value, checked, onChange }) => (
    <div>
        <input 
            type="radio" 
            id={id} 
            name={name} 
            value={value} 
            checked={checked} 
            onChange={onChange}
            className="hidden peer"
        />
        <label 
            htmlFor={id} 
            className="block cursor-pointer px-4 py-2 text-center rounded-md transition-colors border border-slate-600 peer-checked:bg-purple-600 peer-checked:border-purple-600 peer-checked:text-white text-slate-300 hover:bg-slate-700"
        >
            {label}
        </label>
    </div>
);


const EventSettings = ({ event }) => {
    const [visibility, setVisibility] = useState(event.visibility);
    const [accessibility, setAccessibility] = useState(event.accessibility);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SettingsCard
                title="Visibility"
                description="Control who can see this event on the events page."
            >
                <div className="grid grid-cols-2 gap-3">
                    <RadioPill id="vis-public" name="visibility" label="Public" value="Public" checked={visibility === 'Public'} onChange={(e) => setVisibility(e.target.value)} />
                    <RadioPill id="vis-members" name="visibility" label="Members Only" value="Members Only" checked={visibility === 'Members Only'} onChange={(e) => setVisibility(e.target.value)} />
                    <RadioPill id="vis-participants" name="visibility" label="Participants Only" value="Participants Only" checked={visibility === 'Participants Only'} onChange={(e) => setVisibility(e.target.value)} />
                    <RadioPill id="vis-private" name="visibility" label="Private" value="Private" checked={visibility === 'Private'} onChange={(e) => setVisibility(e.target.value)} />
                </div>
            </SettingsCard>

            <SettingsCard
                title="Registration (Accessibility)"
                description="Control how members can join this event."
            >
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <RadioPill id="acc-open" name="accessibility" label="Open" value="Open" checked={accessibility === 'Open'} onChange={(e) => setAccessibility(e.target.value)} />
                    <RadioPill id="acc-invite" name="accessibility" label="Invite-Only" value="Invite-Only" checked={accessibility === 'Invite-Only'} onChange={(e) => setAccessibility(e.target.value)} />
                    <RadioPill id="acc-hybrid" name="accessibility" label="Hybrid" value="Hybrid" checked={accessibility === 'Hybrid'} onChange={(e) => setAccessibility(e.target.value)} />
                </div>
            </SettingsCard>

            <div className="lg:col-span-2 flex justify-end">
                 <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-8 rounded-lg"
                 >
                    Save Changes
                 </motion.button>
            </div>
        </div>
    );
};

export default EventSettings;