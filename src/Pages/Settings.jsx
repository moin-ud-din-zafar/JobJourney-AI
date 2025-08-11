// src/Pages/Settings.jsx
import React, { useState } from 'react'
import { User, Camera, CreditCard, Database, Trash2 } from 'lucide-react'
import Header from '../Components/Header'
import Footer from '../Components/Footer'
import { useDarkTheme } from '../Components/DarkThemeContext'

export default function Settings({ onMenuClick }) {
  const { isDark } = useDarkTheme()

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    summary: 'Experienced software developer with 5+ years in React and Node.js...'
  })
  const [notifications, setNotifications] = useState({
    email: true,
    reminders: true,
    statusUpdates: true,
    newMatches: false,
    weeklyReports: true
  })
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  })

  const handleChange = e => {
    const { name, value } = e.target
    setProfile(prev => ({ ...prev, [name]: value }))
  }
  const toggleNotif = key => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
  }
  const handlePwdChange = e => {
    const { name, value } = e.target
    setPasswords(prev => ({ ...prev, [name]: value }))
  }

  // Theme mapping (Dashboard pattern)
  const light = {
    pageBg: 'bg-gray-50',
    panelBg: 'bg-white',
    cardBorder: 'border-gray-200',
    heading: 'text-gray-900',
    label: 'text-gray-700',
    input: 'mt-1 block w-full border border-gray-300 rounded-lg shadow-sm bg-white text-gray-900',
    inputFocus: 'focus:ring-teal-500 focus:border-teal-500',
    btnPrimary: 'mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg',
    btnSecondary: 'bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50',
    smallText: 'text-sm text-gray-500',
    muted: 'text-gray-400',
    panelHover: 'hover:bg-gray-50',
    toggleOn: 'bg-teal-600',
    toggleOff: 'bg-gray-200',
    toggleThumb: 'bg-white',
    dangerBtn: 'w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2',
    icon: 'text-gray-700',
  }

  const dark = {
    pageBg: 'bg-slate-900',
    panelBg: 'bg-slate-800',
    cardBorder: 'border-slate-700',
    heading: 'text-gray-100',
    label: 'text-gray-200',
    input: 'mt-1 block w-full border border-slate-700 rounded-lg shadow-sm bg-slate-800 text-gray-100',
    inputFocus: 'focus:ring-teal-500 focus:border-teal-500',
    btnPrimary: 'mt-6 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg',
    btnSecondary: 'bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-700 text-gray-200',
    smallText: 'text-sm text-gray-300',
    muted: 'text-gray-400',
    panelHover: 'hover:bg-slate-700',
    toggleOn: 'bg-teal-600',
    toggleOff: 'bg-slate-700',
    toggleThumb: 'bg-white',
    dangerBtn: 'w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2',
    icon: 'text-gray-300',
  }

  const s = isDark ? dark : light

  return (
    <div className={`flex flex-col min-h-screen ${s.pageBg}`}>
      <Header onMenuClick={onMenuClick} />
      <main className={`flex-1 py-10 px-6 lg:px-16 transition-colors duration-150`}>
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Title */}
          <div>
            <h1 className={`text-3xl font-bold ${s.heading}`}>Settings</h1>
            <p className={`${s.smallText}`}>Manage your account and application preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile & Data */}
            <div className="col-span-2 space-y-6">
              {/* Profile Information */}
              <div className={`${s.panelBg} rounded-lg border ${s.cardBorder} p-6`}>
                <div className="flex items-center space-x-3 mb-6">
                  <User className={`w-6 h-6 ${s.icon}`} />
                  <h2 className={`text-xl font-semibold ${s.heading}`}>Profile Information</h2>
                </div>
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center text-white font-bold text-xl">
                    JP
                  </div>
                  <div>
                    <label
                      htmlFor="photo-upload"
                      className={`inline-flex items-center px-4 py-2 border rounded-lg text-sm font-medium ${s.label} ${s.panelBg} ${s.panelHover} cursor-pointer`}
                    >
                      <Camera className="w-4 h-4 mr-2" /> Upload Photo
                    </label>
                    <input id="photo-upload" type="file" accept="image/png, image/jpeg" className="hidden" />
                    <div className={`text-xs ${s.muted} mt-1`}>PNG or JPG up to 2MB</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${s.label}`}>First Name</label>
                    <input
                      name="firstName"
                      value={profile.firstName}
                      onChange={handleChange}
                      className={`${s.input} ${s.inputFocus}`}
                      type="text"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${s.label}`}>Last Name</label>
                    <input
                      name="lastName"
                      value={profile.lastName}
                      onChange={handleChange}
                      className={`${s.input} ${s.inputFocus}`}
                      type="text"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className={`block text-sm font-medium ${s.label}`}>Email</label>
                  <input
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className={`${s.input} ${s.inputFocus}`}
                    type="email"
                  />
                </div>

                <div className="mt-4">
                  <label className={`block text-sm font-medium ${s.label}`}>Phone</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className={`${s.input} ${s.inputFocus}`}
                    type="text"
                  />
                </div>

                <div className="mt-4">
                  <label className={`block text-sm font-medium ${s.label}`}>Location</label>
                  <input
                    name="location"
                    value={profile.location}
                    onChange={handleChange}
                    className={`${s.input} ${s.inputFocus}`}
                    type="text"
                  />
                </div>

                <div className="mt-4">
                  <label className={`block text-sm font-medium ${s.label}`}>Professional Summary</label>
                  <textarea
                    name="summary"
                    rows={4}
                    value={profile.summary}
                    onChange={handleChange}
                    className={`${s.input} ${s.inputFocus} resize-none`}
                  />
                </div>

                <button className={`${s.btnPrimary}`}>
                  Save Changes
                </button>
              </div>

              {/* Notifications Settings */}
              <div className={`${s.panelBg} rounded-lg border ${s.cardBorder} p-6`}>
                <h2 className={`text-xl font-semibold ${s.heading} mb-4`}>Notifications</h2>
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                  { key: 'reminders', label: 'Interview Reminders', desc: 'Get notified before scheduled interviews' },
                  { key: 'statusUpdates', label: 'Application Status Updates', desc: 'Updates when application status changes' },
                  { key: 'newMatches', label: 'New Job Matches', desc: 'Notifications for relevant job openings' },
                  { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Weekly summary of your job search activity' }
                ].map(n => (
                  <div key={n.key} className="flex items-center justify-between mb-4">
                    <div>
                      <div className={`font-medium ${s.heading}`}>{n.label}</div>
                      <div className={`${s.smallText}`}>{n.desc}</div>
                    </div>

                    <button
                      onClick={() => toggleNotif(n.key)}
                      className={`w-12 h-6 rounded-full focus:outline-none ${notifications[n.key] ? s.toggleOn : s.toggleOff}`}
                      aria-pressed={!!notifications[n.key]}
                    >
                      <span
                        className={`block w-5 h-5 ${s.toggleThumb} rounded-full shadow transform transition-transform ${notifications[n.key] ? 'translate-x-6' : 'translate-x-0'}`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              {/* Privacy & Security */}
              <div className={`${s.panelBg} rounded-lg border ${s.cardBorder} p-6`}>
                <h2 className={`text-xl font-semibold ${s.heading} mb-4`}>Privacy & Security</h2>
                <div className="space-y-4 mb-4">
                  <div>
                    <label className={`block text-sm font-medium ${s.label}`}>Current Password</label>
                    <input
                      name="current"
                      type="password"
                      value={passwords.current}
                      onChange={handlePwdChange}
                      className={`${s.input} ${s.inputFocus}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${s.label}`}>New Password</label>
                    <input
                      name="new"
                      type="password"
                      value={passwords.new}
                      onChange={handlePwdChange}
                      className={`${s.input} ${s.inputFocus}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${s.label}`}>Confirm New Password</label>
                    <input
                      name="confirm"
                      type="password"
                      value={passwords.confirm}
                      onChange={handlePwdChange}
                      className={`${s.input} ${s.inputFocus}`}
                    />
                  </div>
                </div>
                <button className={`${s.btnSecondary}`}>
                  Update Password
                </button>
                <div className="mt-6 flex items-center justify-between">
                  <div className={`text-sm ${s.smallText}`}>Two-Factor Authentication</div>
                  <button className={`${s.btnSecondary}`}>Enable</button>
                </div>
              </div>
            </div>

            {/* Right Panels */}
            <div className="space-y-6">
              {/* Current Plan */}
              <div className={`${s.panelBg} rounded-lg border ${s.cardBorder} p-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className={`text-xl font-semibold ${s.heading}`}>Current Plan</h2>
                    <div className={`${s.smallText}`}>Pro Plan</div>
                  </div>
                </div>
                <div className={`text-center mb-4`}>
                  <div className={`text-4xl font-bold ${s.heading}`}>$29<span className={`text-base font-normal ${s.smallText}`}>/month</span></div>
                  <div className={`${s.smallText}`}>Unlimited applications and AI features</div>
                </div>
                <ul className={`space-y-2 text-sm ${s.heading} mb-4`}>
                  <li className="flex justify-between"><span>Applications</span><span>Unlimited</span></li>
                  <li className="flex justify-between"><span>Resume Versions</span><span>Unlimited</span></li>
                  <li className="flex justify-between"><span>AI Tailoring</span><span>Included</span></li>
                  <li className="flex justify-between"><span>Analytics</span><span>Advanced</span></li>
                </ul>
                <button className="w-full border border-gray-300 rounded-lg py-2 hover:bg-gray-50 text-sm font-medium">
                  Manage Subscription
                </button>
              </div>

              {/* Data Management */}
              <div className={`${s.panelBg} rounded-lg border ${s.cardBorder} p-6`}>
                <h2 className={`text-xl font-semibold ${s.heading} mb-4`}>Data Management</h2>
                <button className={`w-full mb-2 ${s.btnSecondary} flex items-center justify-center space-x-2`}>
                  <Database className={`w-4 h-4 ${s.icon}`} />
                  <span>Export Data</span>
                </button>
                <button className={`w-full mb-4 ${s.btnSecondary} flex items-center justify-center space-x-2`}>
                  <CreditCard className={`w-4 h-4 ${s.icon}`} />
                  <span>Import Data</span>
                </button>
                <button className={`${s.dangerBtn} flex items-center justify-center space-x-2`}>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Account</span>
                </button>
                <p className={`${s.smallText} mt-2`}>This action cannot be undone. All your data will be permanently deleted.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
