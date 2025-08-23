// src/Components/Profile/ProfileSettings.jsx
import React, { useEffect, useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { useDarkTheme } from '../DarkThemeContext';
import * as api from '../../api';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileSettings({ user = {}, onClose = () => {} }) {
  const { isDark } = useDarkTheme();
  const auth = useAuth();

  const [profile, setProfile] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    professionalTitle: '',
    location: '',
    summary: '',
    email: user.email || '',
    phone: '',
    website: '',
    linkedin: '',
    github: '',
    twitter: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxSummary = 500;

  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    // load profile from API (profile stored separately)
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        const data = await api.getProfile();
        const p = data?.profile ?? null;
        if (mounted && p) {
          setProfile(prev => ({
            firstName: prev.firstName || (auth.user?.firstName ?? p.firstName ?? ''),
            lastName: prev.lastName || (auth.user?.lastName ?? p.lastName ?? ''),
            professionalTitle: p.professionalTitle || '',
            location: p.location || '',
            summary: p.summary || '',
            email: auth.user?.email || p.email || prev.email,
            phone: p.phone || '',
            website: p.website || '',
            linkedin: p.linkedin || '',
            github: p.github || '',
            twitter: p.twitter || '',
          }));
          setCharCount((p.summary || '').length);
        } else {
          // keep defaults from props
          setCharCount(prev => prev);
        }
      } catch (err) {
        console.warn('Failed to load profile', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);

    // Build minimal payload for /api/profile
    const payload = {
      professionalTitle: profile.professionalTitle,
      location: profile.location,
      summary: profile.summary,
      phone: profile.phone,
      website: profile.website,
      linkedin: profile.linkedin,
      github: profile.github,
      twitter: profile.twitter,
      // We don't send firstName/lastName into profile if you prefer them on User; if backend auth.me expects user fields,
      // keep name updates on user endpoints. Here we only update profile fields.
    };

    try {
      const res = await api.updateProfile(payload);
      setMessage('✅ Profile saved');
      // optionally update auth.user displayName via auth.setUser if desired
      // if you want to persist firstName/lastName into User, you'd call a user update endpoint (not part of profile)
      // close if desired:
      setTimeout(() => { onClose(); }, 700);
    } catch (err) {
      console.error(err);
      setMessage(err?.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const inputBase = 'mt-1 block w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-teal-100 transition';
  const inputLight = 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
  const inputDark = 'bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-400';

  const cardBg = isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200';
  const sectionTitle = isDark ? 'text-white' : 'text-black';
  const subtleText = isDark ? 'text-gray-300' : 'text-gray-500';

  return (
    <div className={`rounded-2xl ${cardBg} p-6 shadow-xl min-h-full`}>
      <div className="flex items-start justify-between">
        <div>
          <h2 className={`text-2xl font-semibold ${sectionTitle}`}>Profile Settings</h2>
          <p className={`${subtleText} mt-1`}>Manage your personal information and professional profile</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className={`p-2 rounded ${isDark ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`} aria-label="Close">
            <X className={`w-5 h-5 ${isDark ? 'text-gray-200' : 'text-gray-700'}`} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{`${(profile.firstName || 'J')[0] || 'J'}${(profile.lastName || 'P')[0] || 'P'}`}</span>
              )}
            </div>

            <div className="mt-3">
              <label htmlFor="photo-upload" className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium cursor-pointer ${isDark ? 'bg-slate-700 text-gray-100 border-slate-700 hover:bg-slate-700/90' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </label>
              <input id="photo-upload" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <div className="text-xs mt-2 text-gray-400">PNG or JPG up to 2MB</div>
            </div>
          </div>

          <div className="sm:col-span-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${sectionTitle}`}>First Name</label>
                <input
                  name="firstName"
                  value={profile.firstName}
                  onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                  className={`${inputBase} ${isDark ? inputDark : inputLight}`}
                  type="text"
                  required
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${sectionTitle}`}>Last Name</label>
                <input
                  name="lastName"
                  value={profile.lastName}
                  onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                  className={`${inputBase} ${isDark ? inputDark : inputLight}`}
                  type="text"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${sectionTitle}`}>Professional Title</label>
                <input
                  name="professionalTitle"
                  value={profile.professionalTitle}
                  onChange={(e) => setProfile({ ...profile, professionalTitle: e.target.value })}
                  className={`${inputBase} ${isDark ? inputDark : inputLight}`}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${sectionTitle}`}>Location</label>
                <input
                  name="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className={`${inputBase} ${isDark ? inputDark : inputLight}`}
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${sectionTitle}`}>Professional Bio</label>
              <textarea
                name="summary"
                rows={4}
                value={profile.summary}
                onChange={(e) => { setProfile({ ...profile, summary: e.target.value }); setCharCount(e.target.value.length); }}
                className={`${inputBase} ${isDark ? inputDark : inputLight} resize-none`}
              />
              <div className="flex items-center justify-between text-xs mt-1">
                <div className="text-gray-400">{charCount}/{maxSummary} characters</div>
                <div className="text-gray-400">Tip: keep it concise — recruiters scan quickly</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Professional Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Personal Website</label>
              <input name="website" value={profile.website} onChange={(e) => setProfile({ ...profile, website: e.target.value })} className={`${inputBase} ${isDark ? inputDark : inputLight}`} />
            </div>
            <div>
              <label className="block text-sm font-medium">LinkedIn Profile</label>
              <input name="linkedin" value={profile.linkedin} onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })} className={`${inputBase} ${isDark ? inputDark : inputLight}`} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">GitHub Profile</label>
              <input name="github" value={profile.github} onChange={(e) => setProfile({ ...profile, github: e.target.value })} className={`${inputBase} ${isDark ? inputDark : inputLight}`} />
            </div>
            <div>
              <label className="block text-sm font-medium">Twitter / X Profile</label>
              <input name="twitter" value={profile.twitter} onChange={(e) => setProfile({ ...profile, twitter: e.target.value })} className={`${inputBase} ${isDark ? inputDark : inputLight}`} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">Cancel</button>
          <button type="submit" disabled={saving} className="px-6 py-2 rounded-lg bg-teal-600 text-white">
            {saving ? 'Saving…' : 'Save Profile Changes'}
          </button>
        </div>

        {message && <div className="text-sm mt-2">{message}</div>}
      </form>
    </div>
  );
}
