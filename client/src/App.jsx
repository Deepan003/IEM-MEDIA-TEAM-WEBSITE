import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardLayout from './layouts/DashboardLayout';
import { useAuth } from './hooks/useAuth';
import './index.css';

// Lead Pages
import MemberRoster from './pages/LeadDashboard/MemberRoster';
import EventManagement from './pages/LeadDashboard/EventManagement';
import SingleEventDashboard from './pages/LeadDashboard/SingleEventDashboard';

// Photographer Pages
import EventsPage from './pages/PhotographerDashboard/EventsPage';
import MyAssignments from './pages/PhotographerDashboard/MyAssignments';
import EventDetailsPage from './pages/PhotographerDashboard/EventDetailsPage'; // 1. Imported the new page

// Common Pages
import AnnouncementsPage from './pages/Global/AnnouncementsPage';
import SettingsPage from './pages/PhotographerDashboard/SettingsPage';


const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" />;
};

function App() {
    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />

                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <DashboardLayout />
                        </PrivateRoute>
                    }
                >
                    {/* Default dashboard route */}
                    <Route index element={<Navigate to={user?.role === 'lead' || user?.role === 'admin' ? 'roster' : 'events'} />} />

                    {/* Lead & Admin Routes */}
                    { (user?.role === 'lead' || user?.role === 'admin') && (
                        <>
                            <Route path="roster" element={<MemberRoster />} />
                            <Route path="events" element={<EventManagement />} />
                            {/* This is the route for the single event management dashboard */}
                            <Route path="event/:eventId" element={<SingleEventDashboard />} />
                        </>
                    )}

                    {/* Photographer Routes */}
                    { user?.role === 'photographer' && (
                        <>
                           <Route path="events" element={<EventsPage />} />
                           <Route path="assignments" element={<MyAssignments />} />
                        </>
                    )}
                    
                    {/* Common Routes for All Logged-in Users */}
                    <Route path="announcements" element={<AnnouncementsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    {/* 2. Added the new route here */}
                    <Route path="event-details/:eventId" element={<EventDetailsPage />} />

                </Route>

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;