// src/hooks/useProfile.js
import { useCallback, useEffect, useState } from 'react';
import * as api from '../api';

export default function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.getProfile();
      setProfile(res?.profile ?? null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = useCallback(async (payload) => {
    const res = await api.updateProfile(payload);
    setProfile(res.profile ?? profile);
    return res.profile;
  }, [profile]);

  const uploadDocument = useCallback(async (file) => {
    const res = await api.uploadDocument(file);
    setProfile(res.profile ?? profile);
    return res;
  }, [profile]);

  const deleteDocument = useCallback(async (docId) => {
    const res = await api.deleteDocument(docId);
    setProfile(res.profile ?? profile);
    return res;
  }, [profile]);

  return { profile, loading, error, reload: load, save, uploadDocument, deleteDocument };
}
