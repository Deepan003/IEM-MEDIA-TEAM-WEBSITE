import React from 'react';

const DashboardPage = () => {
    const handleLogout = () => {
        // We will add the logout logic here later
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to login page
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-blue-400 mb-4">Welcome!</h1>
                <p className="text-lg text-gray-300 mb-8">You have successfully logged in.</p>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default DashboardPage;