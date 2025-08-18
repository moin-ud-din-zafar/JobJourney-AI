// src/App.jsx
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';

import Sidebar from './Components/Sidebar';
import ProfileSidebar from './Components/Profile/ProfileSidebar'; // Profile Sidebar
import Dashboard from './Pages/Dashboard';
import JobLibrary from './Pages/JobLibrary';
import ResumeGenerator from './Pages/ResumeGenerator';
import ResumeTailor from './Pages/ResumeTailor';
import TailoredVersions from './Pages/TailoredVersions';
import Notifications from './Pages/Notifications';
import Analytics from './Pages/Analytics';
import Settings from './Pages/Settings';
import Profile from './Pages/Profile'; // Full Profile Page

import Welcome from './Pages/Welcome';
import Login from './Components/Auth/Login';
import Signup from './Components/Auth/Signup';

import { DarkThemeProvider } from './Components/DarkThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // path: adjust if different

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, logout } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track which sidebar is currently active (main or profile)
  const [activeSidebar, setActiveSidebar] = useState('main'); // 'main' | 'profile'
  const [profileSidebarSection, setProfileSidebarSection] = useState('profile'); // Initial section for profile sidebar

  // Unified menu handler:
  const handleMenuClick = (typeOrNothing, section) => {
    if (!typeOrNothing) {
      // Toggle the sidebar when hamburger button is clicked
      if (activeSidebar === 'main') {
        if (window.matchMedia('(min-width: 1280px)').matches) {
          setSidebarCollapsed((c) => !c);
        } else {
          setMobileOpen(!mobileOpen); // Open/close the mobile sidebar
        }
      } else if (activeSidebar === 'profile') {
        // Toggle the profile sidebar when clicked
        if (window.matchMedia('(min-width: 1280px)').matches) {
          setSidebarCollapsed((c) => !c);
        } else {
          setMobileOpen(!mobileOpen);
        }
      }
      return;
    }

    // When profile menu is clicked, switch to profile sidebar and load the selected section
    if (typeOrNothing === 'profile') {
      setActiveSidebar('profile');
      setProfileSidebarSection(section || 'profile');
      setMobileOpen(false); // Close mobile sidebar if necessary
      navigate(`/profile?section=${section || 'profile'}`); // Load the correct profile page immediately
      return;
    }

    // Otherwise, default behavior: open main sidebar
    setActiveSidebar('main');
    setMobileOpen(true);
  };

  // Called by Login/Signup components after successful auth
  const handleLogin = () => {
    // AuthContext should already have user set; just navigate to home
    navigate('/');
  };

  const handleLogout = async () => {
    // call auth logout to remove token & user
    try {
      await logout();
    } catch (err) {
      console.warn('Logout error (ignored):', err);
    } finally {
      setMobileOpen(false);
      setActiveSidebar('main');
      navigate('/login', { replace: true });
    }
  };

  // Close mobile sidebar when the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Resize listener to close mobile sidebar when screen width changes
  useEffect(() => {
    const onResize = () => {
      if (window.matchMedia('(min-width: 1280px)').matches) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // While auth is checking (app startup), show a simple loading placeholder
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="mb-2">Checking session…</div>
          <div className="loader w-8 h-8 border-4 border-teal-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const isAuthenticated = Boolean(user);

  return (
    <DarkThemeProvider>
      <div className="flex h-screen overflow-hidden min-h-screen bg-white dark:bg-black text-gray-900 dark:text-gray-200 transition-colors duration-150">
        {isAuthenticated && (
          <>
            {/* Render MAIN Sidebar or PROFILE Sidebar in the same position */}
            {activeSidebar === 'main' && (
              <Sidebar
                isCollapsed={sidebarCollapsed}
                isMobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
                onLogout={handleLogout}
              />
            )}

            {activeSidebar === 'profile' && (
              <ProfileSidebar
                isCollapsed={sidebarCollapsed}
                isMobileOpen={mobileOpen}
                onClose={() => setMobileOpen(false)}
                onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
                onLogout={handleLogout}
                user={user}
                initialSection={profileSidebarSection}
              />
            )}
          </>
        )}

        <div
          className={`flex-1 flex flex-col h-screen overflow-auto transition-all duration-300
            ${isAuthenticated ? (sidebarCollapsed ? 'xl:ml-16' : 'xl:ml-64') : ''}`}
        >
          <Routes>
            {!isAuthenticated ? (
              <>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
                <Route path="/signup" element={<Signup onSignup={handleLogin} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Dashboard onMenuClick={handleMenuClick} onLogout={handleLogout} />} />
                <Route path="/jobs" element={<JobLibrary onMenuClick={handleMenuClick} />} />
                <Route path="/resume-generator" element={<ResumeGenerator onMenuClick={handleMenuClick} />} />
                <Route path="/resume-tailor" element={<ResumeTailor onMenuClick={handleMenuClick} />} />
                <Route path="/tailored-versions" element={<TailoredVersions onMenuClick={handleMenuClick} />} />
                <Route path="/notifications" element={<Notifications onMenuClick={handleMenuClick} />} />
                <Route path="/analytics" element={<Analytics onMenuClick={handleMenuClick} />} />
                <Route path="/settings" element={<Settings onMenuClick={handleMenuClick} />} />
                <Route path="/profile" element={<Profile onMenuClick={handleMenuClick} />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>
      </div>
    </DarkThemeProvider>
  );
}

export default function App() {
  // Wrap the whole app with AuthProvider so anything inside can use useAuth()
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
