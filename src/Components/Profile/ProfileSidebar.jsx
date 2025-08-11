import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User, UploadCloud, Briefcase, FileText, Settings, LogOut, X } from 'lucide-react';
import { useDarkTheme } from '../DarkThemeContext';

const items = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'upload', label: 'Upload CV / Resume', icon: UploadCloud },
  { id: 'skills', label: 'Skills & Experience', icon: Briefcase },
  { id: 'documents', label: 'My Documents', icon: FileText },
  { id: 'account', label: 'Account Settings', icon: Settings },
];

export default function ProfileSidebar({
  isCollapsed = false,
  isMobileOpen = false,
  onClose = () => {},
  onToggleCollapse = () => {},
  onLogout = () => {},
  user = {},
  initialSection = 'profile',
}) {
  const { isDark } = useDarkTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const light = {
    overlayBackdrop: 'absolute inset-0 bg-black/40',
    panel: 'absolute inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40',
    header: 'p-4 flex items-center justify-between border-b text-gray-900 font-bold',
    navItemDefault: 'flex items-center w-full py-2 px-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-gray-100 text-gray-800',
    navItemActive: 'flex items-center w-full py-2 px-3 rounded-lg transition-colors duration-200 ease-in-out bg-teal-100 text-teal-700',
    desktopAside: 'hidden xl:block xl:fixed xl:inset-y-0 xl:left-0 z-20 bg-white shadow-lg transition-all duration-300 ease-in-out',
    desktopHeader: 'p-4 font-bold text-lg border-b flex items-center justify-between',
    mobileCloseBtn: 'p-2 rounded-md text-gray-700 hover:bg-gray-100',
    logoutBtn: 'w-full text-left mt-4 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700',
    userSub: 'text-xs text-gray-500',
  };

  const dark = {
    overlayBackdrop: 'absolute inset-0 bg-black/60',
    panel: 'absolute inset-y-0 left-0 w-64 bg-black shadow-lg transform transition-transform duration-300 ease-in-out z-40',
    header: 'p-4 flex items-center justify-between border-b border-slate-800 text-white font-bold',
    navItemDefault: 'flex items-center w-full py-2 px-3 rounded-lg transition-colors duration-200 ease-in-out hover:bg-slate-800 text-gray-200',
    navItemActive: 'flex items-center w-full py-2 px-3 rounded-lg transition-colors duration-200 ease-in-out bg-teal-900/20 text-teal-300',
    desktopAside: 'hidden xl:block xl:fixed xl:inset-y-0 xl:left-0 z-20 bg-black shadow-lg transition-all duration-300 ease-in-out',
    desktopHeader: 'p-4 font-bold text-lg border-b flex items-center justify-between text-white border-slate-800',
    mobileCloseBtn: 'p-2 rounded-md text-gray-200 hover:bg-slate-800',
    logoutBtn: 'w-full text-left mt-4 px-3 py-2 rounded-lg hover:bg-slate-800 text-gray-200',
    userSub: 'text-xs text-gray-400',
  };

  const s = isDark ? dark : light;

  const getActive = () => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section) return section;
    // default to 'profile' when there's no section parameter
    return 'profile';
  };

  const active = getActive();

  const go = (id) => {
    const url = id === 'profile' ? '/profile?section=profile' : `/profile?section=${encodeURIComponent(id)}`;
    navigate(url); // update the URL to ensure the correct section is displayed
    if (isMobileOpen) onClose(); // close mobile sidebar if it's open
  };

  return (
    <>
      {/* Mobile/tablet overlay */}
      <div
        className={`fixed inset-0 z-30 xl:hidden transition-opacity ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!isMobileOpen}
      >
        <div onClick={onClose} className={s.overlayBackdrop} />
        <aside className={`${s.panel} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className={s.header}>
            <div className="flex items-center gap-3">
              <div className="font-bold">Profile</div>
            </div>
            <button onClick={onClose} className={s.mobileCloseBtn} aria-label="Close profile panel">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            <div className="px-2 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
                  {((user.firstName || 'J')[0] || 'J') + ((user.lastName || 'P')[0] || 'P')}
                </div>
                <div className="min-w-0">
                  <div className="font-medium">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'John Peterson'}</div>
                  <div className={s.userSub}>{user.email || 'john.peterson@email.com'}</div>
                </div>
              </div>
            </div>

            <div className="border-t" />
            {items.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => go(id)} className={active === id ? s.navItemActive : s.navItemDefault}>
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="ml-3 font-medium">{label}</span>
              </button>
            ))}
            <div className="border-t mt-2" />
            <button onClick={() => { onLogout(); onClose(); }} className={s.logoutBtn}>
              <LogOut className="w-5 h-5 inline-block mr-3 text-red-600" />
              <span className="font-medium text-red-600">Sign out</span>
            </button>
          </nav>
        </aside>
      </div>

      {/* Desktop / Tablet: permanent sidebar */}
      <aside className={`${s.desktopAside} ${isCollapsed ? 'xl:w-16' : 'xl:w-64'}`}>
        <div className={`${isCollapsed ? 'p-4 font-bold text-lg border-b flex items-center justify-center' : s.desktopHeader}`}>
          {!isCollapsed ? 'Profile' : 'PF'}
        </div>

        <nav className="p-4 space-y-1">
          <div className="px-2 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
                {((user.firstName || 'J')[0] || 'J') + ((user.lastName || 'P')[0] || 'P')}
              </div>
              {!isCollapsed && (
                <div className="min-w-0">
                  <div className="font-medium">{user.firstName ? `${user.firstName} ${user.lastName || ''}` : 'John Peterson'}</div>
                  <div className={s.userSub}>{user.email || 'john.peterson@email.com'}</div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-2" />
          {items.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => go(id)} className={(active === id ? s.navItemActive : s.navItemDefault) + ' flex items-center w-full'}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span className="ml-3 font-medium">{label}</span>}
            </button>
          ))}

          <div className="mt-4">
            <button onClick={onLogout} className={(s.logoutBtn) + (isCollapsed ? ' flex items-center justify-center' : '')}>
              <LogOut className="w-5 h-5 inline-block mr-3 text-red-600" />
              {!isCollapsed && <span className="font-medium text-red-600">Sign out</span>}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
