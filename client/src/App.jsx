import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import './index.css';

// This is a simple component to protect routes that require a user to be logged in.
// It checks for the token in localStorage.
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <main>
        <Routes>
          {/* The login/register page will be at the root URL */}
          <Route path="/" element={<AuthPage />} />

          {/* The dashboard will be at the /dashboard URL and is protected */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            } 
          />
          
          {/* Any other URL will redirect back to the login page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;