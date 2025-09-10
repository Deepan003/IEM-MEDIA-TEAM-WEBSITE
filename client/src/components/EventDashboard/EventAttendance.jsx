import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ToggleSwitch from '../ToggleSwitch'; // Import our new component

const statusStyles = {
    Present: 'bg-green-500/20 text-green-300',
    Absent: 'bg-red-500/20 text-red-300',
    'Not Marked': 'bg-slate-600/50 text-slate-400',
};

const AttendanceRow = ({ participant, status, onStatusChange }) => (
    <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
        <div className="flex items-center gap-4">
            <img src={participant.profilePic} alt={participant.fullName} className="w-12 h-12 rounded-full object-cover" />
            <div>
                <p className="font-bold text-white">{participant.fullName}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyles[status]}`}>
                    {status}
                </span>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <button 
                onClick={() => onStatusChange(participant._id, 'Present')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${status === 'Present' ? 'bg-green-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
                Present
            </button>
            <button 
                onClick={() => onStatusChange(participant._id, 'Absent')}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${status === 'Absent' ? 'bg-red-500 text-white' : 'bg-slate-700 hover:bg-slate-600'}`}
            >
                Absent
            </button>
        </div>
    </div>
);


const EventAttendance = ({ event }) => {
    const [settings, setSettings] = useState(event.attendance);
    const [attendanceRecords, setAttendanceRecords] = useState(event.attendance.records);

    const handleToggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleStatusChange = (userId, newStatus) => {
        setAttendanceRecords(prev => 
            prev.map(record => 
                record.user._id === userId ? { ...record, status: newStatus } : record
            )
        );
    };

    return (
        <div>
            {/* Settings Panel */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold text-white mb-4">Attendance Settings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <ToggleSwitch enabled={settings.enabled} onChange={() => handleToggle('enabled')} label="Enable Attendance" />
                    <ToggleSwitch enabled={settings.selfMarking} onChange={() => handleToggle('selfMarking')} label="Allow Self-Marking" />
                    <ToggleSwitch enabled={settings.geofencing.enabled} onChange={() => setSettings(prev => ({...prev, geofencing: {...prev.geofencing, enabled: !prev.geofencing.enabled}}))} label="Enable Geofencing" />
                </div>
            </div>

            {/* Attendance List */}
            <div className="space-y-3">
                {event.participants.map(participant => {
                    const record = attendanceRecords.find(r => r.user._id === participant._id);
                    return (
                        <AttendanceRow 
                            key={participant._id} 
                            participant={participant}
                            status={record ? record.status : 'Not Marked'}
                            onStatusChange={handleStatusChange}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default EventAttendance;