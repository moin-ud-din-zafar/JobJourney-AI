import React, { useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { useDarkTheme } from '../DarkThemeContext';

export default function ProfileSettings({ user = {}, onClose = () => {} }) {
  const { isDark } = useDarkTheme();

  const [profile, setProfile] = useState({
    firstName: user.firstName || 'John',
    lastName: user.lastName || 'Peterson',
    professionalTitle: user.professionalTitle || 'Senior Software Engineer',
    location: user.location || 'San Francisco, CA',
    summary: user.summary || 'Passionate software engineer with 8+ years of experience in full-stack development, specializing in React, Node.js, and cloud technologies.',
    email: user.email || 'john.peterson@email.com',
    phone: user.phone || '+1 (555) 123-4567',
  });

  const [charCount, setCharCount] = useState(profile.summary.length);
  const maxSummary = 500;

  const [avatarUrl, setAvatarUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    alert('Profile saved!');
    onClose();
  };

  const inputBase = 'mt-1 block w-full rounded-lg px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-teal-100 transition';
  const inputLight = 'bg-white border-gray-300 text-gray-900 placeholder-gray-400';
  const inputDark = 'bg-slate-800 border-slate-700 text-gray-100 placeholder-gray-400';

  const cardBg = isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200';
  const sectionTitle = isDark ? 'text-white' : 'text-black';  // Black for light, White for dark
  const subtleText = isDark ? 'text-gray-300' : 'text-gray-500'; // Gray for dark, Light gray for light

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
        {/* Profile Photo & Basic Information */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col items-center sm:items-start">
            <div className="w-24 h-24 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{`${profile.firstName[0] || 'J'}${profile.lastName[0] || 'P'}`}</span>
              )}
            </div>

            <div className="mt-3">
              <label
                htmlFor="photo-upload"
                className={`inline-flex items-center px-3 py-2 border rounded-lg text-sm font-medium cursor-pointer ${isDark ? 'bg-slate-700 text-gray-100 border-slate-700 hover:bg-slate-700/90' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}
              >
                <Camera className="w-4 h-4 mr-2" />
                Upload Photo
              </label>
              <input id="photo-upload" type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              <div className="text-xs mt-2 text-gray-400">PNG or JPG up to 2MB</div>
            </div>
          </div>

          <div className="sm:col-span-2 space-y-4">
            {/* First and Last Name */}
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

            {/* Other fields */}
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
                onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
                className={`${inputBase} ${isDark ? inputDark : inputLight} resize-none`}
              />
              <div className="flex items-center justify-between text-xs mt-1">
                <div className="text-gray-400">{charCount}/{maxSummary} characters</div>
                <div className="text-gray-400">Tip: keep it concise — recruiters scan quickly</div>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Links */}
        <div className="space-y-4 mt-6">
          <h3 className="text-lg font-medium">Professional Links</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white">Personal Website</label>
              <input
                name="website"
                value={profile.website}
                onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                className={`${inputBase} ${isDark ? inputDark : inputLight}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">LinkedIn Profile</label>
              <input
                name="linkedin"
                value={profile.linkedin}
                onChange={(e) => setProfile({ ...profile, linkedin: e.target.value })}
                className={`${inputBase} ${isDark ? inputDark : inputLight}`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white">GitHub Profile</label>
              <input
                name="github"
                value={profile.github}
                onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                className={`${inputBase} ${isDark ? inputDark : inputLight}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Twitter / X Profile</label>
              <input
                name="twitter"
                value={profile.twitter}
                onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                className={`${inputBase} ${isDark ? inputDark : inputLight}`}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3 mt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
            Cancel
          </button>
          <button type="submit" className="px-6 py-2 rounded-lg bg-teal-600 text-white">
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
