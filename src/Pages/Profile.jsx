import React, { useState, useEffect } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useDarkTheme } from '../Components/DarkThemeContext';
import ProfileSettings from '../Components/Profile/ProfileSettings';  // Ensure correct import
import UploadCV from '../Components/Profile/UploadCV';
import SkillsPage from '../Components/Profile/SkillsPage';
import DocumentsPage from '../Components/Profile/DocumentsPage';
import Header from '../Components/Header';
import Footer from '../Components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';

const MENU = [
  { id: 'profile', label: 'Profile' },
  { id: 'upload', label: 'Upload CV / Resume' },
  { id: 'skills', label: 'Skills & Experience' },
  { id: 'documents', label: 'My Documents' },
];

export default function ProfilePage({ onMenuClick }) {
  const { isDark } = useDarkTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // UI state
  const [view, setView] = useState('menu'); // 'menu' | 'content'
  const [active, setActive] = useState('profile');

  // page-level user; replace with auth/user store as needed
  const user = {
    firstName: 'John',
    lastName: 'Peterson',
    email: 'john.peterson@email.com',
  };

  // theme card classes
  const pageBg = isDark ? 'bg-black' : 'bg-gray-50';
  const cardBg = isDark ? 'bg-slate-900 text-gray-100' : 'bg-white text-gray-900';
  const navBg = isDark ? 'bg-slate-800' : 'bg-gray-50';

  // ensure body minHeight remains neutral (keeps layout stable)
  useEffect(() => {
    const prev = document.body.style.minHeight;
    document.body.style.minHeight = '0';
    return () => { document.body.style.minHeight = prev };
  }, []);

  // Read ?section=... to open deep links (e.g. /profile?section=skills)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const section = params.get('section');
    if (section) {
      const normalized = ['profile', 'upload', 'skills', 'documents'].includes(section) ? section : 'profile';
      setActive(normalized);
      setView('content');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView('menu');
      setActive('profile');
    }
  }, [location.search]);

  const openContent = (id) => {
    setActive(id);
    setView('content');
    const url = id === 'profile' ? '/profile' : `/profile?section=${encodeURIComponent(id)}`;
    navigate(url, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onMenuClick('profile', id);  // Ensure profile sidebar opens
  };

  const backToMenu = () => {
    setView('menu');
    setActive('profile');
    navigate('/profile', { replace: true });
    onMenuClick('main');
  };

  const handleClose = () => {
    navigate('/'); 
    onMenuClick('main');
  };

  return (
    <div className="flex-1 flex flex-col h-screen overflow-auto">
      <Header onMenuClick={onMenuClick} />

      <main className={`${pageBg} flex-1 py-6 px-4 sm:px-6 lg:px-16 transition-colors duration-150`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold">Profile</h1>
              <p className="text-sm text-gray-400 mt-1">Manage your profile, CV, documents, and account settings.</p>
            </div>

            <div className="flex items-center gap-2">
              {view === 'content' && active === 'profile' && (
                <button
                  onClick={backToMenu}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded border hover:bg-gray-50"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}

              <button
                onClick={handleClose}
                className="inline-flex items-center gap-2 px-3 py-1 rounded border hover:bg-gray-50"
              >
                <X className="w-4 h-4" />
                Close
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Right content */}
            <section className={`md:col-span-12 p-6 rounded-lg ${isDark ? 'bg-slate-900/60' : 'bg-white/5'}`}>
              {view === 'menu' && (
                <div className="p-6 text-gray-400">
                  <h3 className="text-lg font-medium">Select an item to start editing</h3>
                  <p className="mt-2 text-sm">Use the left menu to choose which profile area you'd like to edit. Each section has a Back option to return to this menu.</p>
                </div>
              )}

              {view === 'content' && active === 'profile' && (
                <ProfileSettings user={user} onClose={backToMenu} embedded />
              )}

              {view === 'content' && active === 'upload' && (
                <UploadCV onDone={() => {}} />
              )}

              {view === 'content' && active === 'skills' && (
                <SkillsPage />
              )}

              {view === 'content' && active === 'documents' && (
                <DocumentsPage />
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
