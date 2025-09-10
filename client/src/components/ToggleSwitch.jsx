import React from 'react';
import { motion } from 'framer-motion';

const ToggleSwitch = ({ enabled, onChange, label }) => {
    return (
        <label htmlFor={label} className="flex items-center cursor-pointer">
            <div className="relative">
                <input id={label} type="checkbox" className="sr-only" checked={enabled} onChange={onChange} />
                <motion.div
                    className="block w-14 h-8 rounded-full"
                    animate={{ backgroundColor: enabled ? '#8B5CF6' : '#475569' }}
                    transition={{ duration: 0.2 }}
                />
                <motion.div
                    className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full shadow"
                    layout
                    transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                    style={{ x: enabled ? '1.25rem' : '0rem' }}
                />
            </div>
            <div className="ml-3 text-white font-medium">{label}</div>
        </label>
    );
};

export default ToggleSwitch;