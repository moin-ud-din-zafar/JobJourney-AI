// src/pages/JobsPage.jsx
import React, { useEffect, useState } from 'react';
import NewApplicationForm from '../components/NewApplicationForm';
import CompactCard from '../components/CompactCard';
import * as api from '../api';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.getJobs();
      setJobs(res.jobs || []);
    } catch (err) {
      console.error('Failed to load jobs', err);
      alert(err?.response?.data?.error || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAddApplication(data) {
    const payload = {
      company: data.company,
      title: data.role,
      status: data.status,
      fit: data.fitScore,
      progress: data.progress,
      nextAction: data.nextAction,
      highPriority: data.highPriority,
      appliedAt: new Date()
    };
    try {
      const res = await api.createJob(payload);
      // Add to local state for instant UI feedback:
      setJobs(prev => [res.job, ...prev]);
      setShowForm(false);
    } catch (err) {
      console.error('create job failed', err);
      alert(err?.response?.data?.error || 'Create failed');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">Applications</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowForm(true)} className="px-4 py-2 bg-teal-600 text-white rounded">New Application</button>
          <button onClick={load} className="px-3 py-2 border rounded">Refresh</button>
        </div>
      </div>

      {showForm && <NewApplicationForm open onClose={() => setShowForm(false)} onSubmit={handleAddApplication} />}

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map(j => (
            <CompactCard
              key={j._id}
              app={{
                company: j.company,
                title: j.title,
                status: j.status,
                fit: j.fit || 0,
                progress: j.progress || 0,
                date: new Date(j.appliedAt || j.createdAt).toLocaleDateString()
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
