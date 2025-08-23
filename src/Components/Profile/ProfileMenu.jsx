// src/Components/Profile/ProfileMenu.jsx
import React, { useEffect, useState } from 'react';
import { User, UploadCloud, Briefcase, LogOut } from 'lucide-react';
import { useDarkTheme } from '../DarkThemeContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileMenu({ onClose = () => {}, onNavigate = null }) {
  const { isDark } = useDarkTheme();
  const navigate = useNavigate();
  const auth = useAuth();

  const [loadingUser, setLoadingUser] = useState(true);

  // keep local copy of user for display (reactive to context)
  const user = auth?.user ?? null;

  useEffect(() => {
    // small spinner state while auth.loading might still be true
    setLoadingUser(false);
  }, [auth?.loading]);

  const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : (auth.loading ? 'Loading...' : 'Guest');

  const panelBg = isDark ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-100 text-gray-900';
  const itemHover = isDark ? 'hover:bg-slate-900' : 'hover:bg-gray-50';
  const iconDefault = isDark ? 'text-gray-300' : 'text-gray-600';
  const textDefault = isDark ? 'text-gray-100' : 'text-gray-900';
  const subText = isDark ? 'text-gray-300' : 'text-gray-500';

  const go = (id) => {
    onClose();
    if (typeof onNavigate === 'function') {
      onNavigate(id === 'profile' ? '' : id);
      return;
    }
    if (id === 'profile') navigate('/profile');
    else navigate(`/profile?section=${encodeURIComponent(id)}`);
  };

  // Sign out: call auth.logout(), which will redirect to /login immediately
  const [signingOut, setSigningOut] = useState(false);
  const handleSignOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await auth.logout({ redirect: true }); // redirect true will navigate to /login
    } catch (err) {
      console.error('Logout error', err);
    } finally {
      setSigningOut(false);
      onClose();
    }
  };

  return (
    <div role="menu" aria-label="Profile menu" className={`w-72 rounded-lg shadow-lg overflow-hidden border ${panelBg}`}>
      <div className="px-4 py-3">
        <div className={`text-sm font-semibold ${textDefault}`}>{fullName}</div>
        <div className={`text-xs ${subText} mt-0.5`}>{user?.email ?? (auth.loading ? 'Loading...' : 'guest@example.com')}</div>
      </div>

      <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`} />

      <nav className="py-1" role="none">
        <button
          onClick={() => go('profile')}
          role="menuitem"
          className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left ${itemHover}`}
        >
          <User className={`w-4 h-4 ${iconDefault}`} />
          <span className={textDefault}>Profile Settings</span>
        </button>

        {/* NAVIGATE to Upload UI first (no immediate file picker/upload) */}
        <button
          onClick={() => go('upload')}
          role="menuitem"
          className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left ${itemHover}`}
        >
          <UploadCloud className={`w-4 h-4 ${iconDefault}`} />
          <span className={textDefault}>Upload CV / Resume</span>
        </button>

        <button
          onClick={() => go('skills')}
          role="menuitem"
          className={`w-full flex items-center gap-3 px-4 py-2 text-sm text-left ${itemHover}`}
        >
          <Briefcase className={`w-4 h-4 ${iconDefault}`} />
          <span className={textDefault}>Skills & Experience</span>
        </button>
      </nav>

      <div className={`border-t ${isDark ? 'border-slate-700' : 'border-gray-100'}`} />

      <div className="px-4 py-3">
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className={`w-full flex items-center gap-3 text-sm px-3 py-2 rounded ${isDark ? 'hover:bg-slate-900' : 'hover:bg-red-50'} ${signingOut ? 'opacity-70 cursor-wait' : ''}`}
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span className="font-medium text-red-600">{signingOut ? 'Signing out…' : 'Sign out'}</span>
        </button>
      </div>
    </div>
  );
}
