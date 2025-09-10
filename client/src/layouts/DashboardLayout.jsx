import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Users, Calendar, Megaphone, Settings, LogOut, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from '../components/Footer'; // 1. Footer is imported

const SidebarLink = ({ to, icon, children }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center px-4 py-3 my-1 font-medium transition-all duration-200 rounded-lg ${
                isActive
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg'
                    : 'text-gray-400 hover:bg-slate-700/50 hover:text-white'
            }`
        }
    >
        {icon}
        <span className="ml-3">{children}</span>
    </NavLink>
);

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const leadLinks = [
        { to: '/dashboard/roster', icon: <Users size={20} />, label: 'Media Team Roster' },
        { to: '/dashboard/events', icon: <Calendar size={20} />, label: 'Event Management' },
    ];

    const photographerLinks = [
        { to: '/dashboard/events', icon: <Calendar size={20} />, label: 'Events' },
        { to: '/dashboard/assignments', icon: <Users size={20} />, label: 'My Assignments' },
    ];

    const commonLinks = [
        { to: '/dashboard/announcements', icon: <Megaphone size={20} />, label: 'Announcements' },
        { to: '/dashboard/settings', icon: <Settings size={20} />, label: 'Settings' },
    ];

    const navLinks = user?.role === 'lead' || user?.role === 'admin' ? leadLinks : photographerLinks;

    const sidebarContent = (
        <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 z-40 flex flex-col p-4 lg:fixed"
        >
            <div className="flex items-center mb-8">
                <img src="/images/logo.png" alt="Logo" className="h-10 w-10 rounded-lg" />
                <h1 className="ml-3 text-xl font-bold text-white">IEM-PC</h1>
            </div>
            <nav className="flex-1">
                {navLinks.map(link => <SidebarLink key={link.to} to={link.to} icon={link.icon}>{link.label}</SidebarLink>)}
                <div className="my-4 border-t border-slate-700"></div>
                {commonLinks.map(link => <SidebarLink key={link.to} to={link.to} icon={link.icon}>{link.label}</SidebarLink>)}
            </nav>
            <div>
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 font-medium text-red-400 transition-colors duration-200 rounded-lg hover:bg-red-500/20 hover:text-red-300"
                >
                    <LogOut size={20} />
                    <span className="ml-3">Logout</span>
                </button>
            </div>
        </motion.div>
    );

    return (
        // 2. Added 'flex flex-col' to the main container
        <div className="min-h-screen bg-slate-950 text-gray-200 flex flex-col">
            {/* Mobile Menu Button */}
            <button
                className="fixed top-4 left-4 z-50 p-2 text-white bg-slate-800 rounded-md lg:hidden"
                onClick={() => setSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? <X /> : <Menu />}
            </button>
            
            {/* Sidebar for Mobile */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        {sidebarContent}
                    </>
                )}
            </AnimatePresence>

            {/* Sidebar for Desktop */}
            <div className="hidden lg:block">
                {sidebarContent}
            </div>
            
            {/* 3. Added a wrapper div for main content and footer */}
            <div className="flex-grow flex flex-col lg:ml-64">
                {/* 4. The main content now grows to fill available space */}
                <main className="flex-grow p-4 sm:p-6 lg:p-8">
                    <div className="pt-12 lg:pt-0">
                        <Outlet /> {/* This is where the nested route components will render */}
                    </div>
                </main>
                
                {/* 5. The Footer is placed here, after the main content */}
                <Footer />
            </div>
        </div>
    );
};

export default DashboardLayout;