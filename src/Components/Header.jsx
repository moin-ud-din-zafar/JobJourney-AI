import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Sun, Moon, Bell } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDarkTheme } from './DarkThemeContext';
import ProfileMenu from './Profile/ProfileMenu';
import { me, logout } from '../api'; // Import API functions to get user data

export default function Header({ onMenuClick }) {
  const { isDark, toggleTheme } = useDarkTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [profileOpen, setProfileOpen] = useState(false);
  const profileBtnRef = useRef(null);
  const menuRef = useRef(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage if available, or fetch from backend
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      me()
        .then((userData) => {
          localStorage.setItem('user', JSON.stringify(userData)); // Store user data in localStorage
          setUser(userData);
        })
        .catch((error) => console.error('Error fetching user data:', error));
    }
  }, []);

  const isProfilePage = location.pathname.startsWith('/profile');

  useEffect(() => {
    function onDocMouseDown(e) {
      const btn = profileBtnRef.current;
      const menu = menuRef.current;
      if (!btn || !menu) return;
      if (btn.contains(e.target)) return;
      if (!menu.contains(e.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setProfileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const light = {
    header: 'flex items-center justify-between p-4 bg-white border-b border-gray-100 shadow-sm z-10',
    hamburgerBtn: 'p-2 bg-gray-100 rounded-lg md:hidden',
    hamburgerBtnMd: 'p-2 bg-gray-100 rounded-lg hidden md:inline-flex',
    logoText: 'text-lg font-bold text-gray-900',
    searchIcon: 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5',
    searchInput: 'w-full rounded-lg py-2 pl-10 pr-4 border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-100',
    iconBtn: 'p-2 bg-gray-100 rounded-lg transition',
    icon: 'text-gray-700',
    notifWrap: 'relative p-2 bg-gray-100 rounded-lg',
    nameText: 'text-lg font-bold text-gray-900',
  };

  const dark = {
    header: 'flex items-center justify-between p-4 bg-black border-b border-slate-800 shadow-sm z-10',
    hamburgerBtn: 'p-2 bg-slate-800 rounded-lg md:hidden',
    hamburgerBtnMd: 'p-2 bg-slate-800 rounded-lg hidden md:inline-flex',
    logoText: 'text-lg font-bold text-white',
    searchIcon: 'absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5',
    searchInput: 'w-full rounded-lg py-2 pl-10 pr-4 border border-slate-700 bg-slate-900 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-100',
    iconBtn: 'p-2 bg-slate-800 rounded-lg transition',
    icon: 'text-gray-200',
    notifWrap: 'relative p-2 bg-slate-800 rounded-lg',
    nameText: 'text-lg font-bold text-gray-100',
  };

  const s = isDark ? dark : light;

  const handleMenuNavigate = (pathOrId) => {
    setProfileOpen(false);
    const section = pathOrId.toLowerCase();
    if (typeof onMenuClick === 'function') {
      onMenuClick('profile', section);
    } else {
      navigate(`/profile?section=${encodeURIComponent(section)}`);
    }
  };

  const handleSignOut = () => {
    logout();  // Logout from backend if required
    localStorage.removeItem('user');  // Clear localStorage user data
    setProfileOpen(false);
    navigate('/login');  // Redirect to login after sign-out
  };

  return (
    <header className={s.header}>
      <div className="flex items-center space-x-4">
        <button onClick={() => onMenuClick && onMenuClick()} className={s.hamburgerBtn} aria-label="Open menu">
          <Menu className={`w-5 h-5 ${s.icon}`} />
        </button>
        <button onClick={() => onMenuClick && onMenuClick()} className={s.hamburgerBtnMd} aria-label="Toggle sidebar">
          <Menu className={`w-5 h-5 ${s.icon}`} />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-bold">
            JT
          </div>

          {isProfilePage && user ? (
            <span className={s.nameText}>Hi, {user.firstName}</span>
          ) : (
            <span className={s.logoText}>JobTracker AI</span>
          )}
        </div>
      </div>

      {!isProfilePage && (
        <div className="hidden md:flex flex-1 mx-4 max-w-md">
          <div className="relative w-full">
            <Search className={`${s.searchIcon}`} />
            <input className={s.searchInput} placeholder="Search applications, companies..." aria-label="Search" />
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 relative">
        <button onClick={toggleTheme} className={s.iconBtn} aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-700" />}
        </button>

        <div className={s.notifWrap}>
          <Bell className={`w-5 h-5 ${s.icon}`} />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">3</span>
        </div>

        <div className="relative">
          <button
            ref={profileBtnRef}
            onClick={() => setProfileOpen(v => !v)}
            aria-haspopup="true"
            aria-expanded={profileOpen}
            className="w-8 h-8 bg-teal-600 rounded-full flex items-center justify-center text-white font-medium focus:outline-none"
            aria-label="Open profile menu"
          >
            JD
          </button>

          {profileOpen && (
            <div ref={menuRef} className="absolute right-0 mt-2 z-50">
              <ProfileMenu
                user={user}
                onClose={() => setProfileOpen(false)}
                onNavigate={(path) => handleMenuNavigate(path)}
                onSignOut={handleSignOut}
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
