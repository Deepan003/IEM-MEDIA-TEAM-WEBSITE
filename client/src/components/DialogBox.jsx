import React from 'react';

const DialogBox = ({ message, onClose, type = 'success' }) => {
    if (!message) return null;

    const colors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        info: 'bg-blue-500',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 text-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
                <div className={`w-12 h-12 rounded-full ${colors[type]} mx-auto mb-4 flex items-center justify-center`}>
                    <span className="text-2xl">{type === 'success' ? '✓' : '!'}</span>
                </div>
                <p className="text-center text-lg mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default DialogBox;