// src/Components/Profile/UploadCV.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useDarkTheme } from "../DarkThemeContext";
import { FileText, Star } from "lucide-react";
import apiClient, * as api from '../../api'; // client + helpers

/* Utility helpers */
function prettyFileSize(bytes) {
  if (bytes == null) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function guessTypeFromName(name) {
  const n = (name || '').toLowerCase();
  if (n.includes("resume")) return "resume";
  if (n.includes("cover") || n.includes("letter")) return "cover-letter";
  return "other";
}
function mapServerDocToUI(doc) {
  const typeFromServer = (doc && (doc.docType || doc.type || '')).toString();
  const guessed = guessTypeFromName(doc.originalname ?? doc.filename ?? '');
  const type = typeFromServer ? typeFromServer : guessed;
  return {
    id: String(doc._id ?? doc.id ?? doc.filename ?? Date.now()),
    type,
    title: doc.originalname ?? doc.filename ?? 'document',
    subtitle: doc.mimetype ?? '',
    size: prettyFileSize(doc.size),
    modified: doc.createdAt ? new Date(doc.createdAt).toLocaleDateString() : '',
    tags: [],
    raw: doc,
  };
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

export default function UploadCV() {
  const { isDark } = useDarkTheme();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const [docs, setDocs] = useState([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [chooserVisible, setChooserVisible] = useState(false);
  const [selectedDocType, setSelectedDocType] = useState(null); // 'resume' | 'cover-letter' | 'other'

  async function loadDocs() {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProfile();
      const profile = data?.profile;
      const serverDocs = Array.isArray(profile?.documents) ? profile.documents : [];
      setDocs(serverDocs.map(mapServerDocToUI));
      return serverDocs;
    } catch (err) {
      console.error('[UploadCV] loadDocs error', err);
      setError(err?.response?.data?.error || 'Failed to load documents');
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('choose') === '1' || params.get('open') === '1') {
      setChooserVisible(true);
    }
  }, [location.search]);

  function openChooser() {
    setChooserVisible(true);
  }

  function openFileDialogWithType(type) {
    setSelectedDocType(type || 'other');
    // small timeout so state is set before click
    setTimeout(() => {
      if (fileInputRef.current) fileInputRef.current.click();
    }, 30);
  }

  async function pollForNewDoc(prevDocs, uploadedMeta, maxAttempts = 6, delayMs = 300) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      let serverDocs = [];
      try {
        const data = await api.getProfile();
        serverDocs = Array.isArray(data?.profile?.documents) ? data.profile.documents : [];
      } catch (e) {
        serverDocs = [];
      }

      if (serverDocs.length > (prevDocs?.length || 0)) {
        return serverDocs;
      }

      if (uploadedMeta) {
        const found = serverDocs.find(d => {
          if (!d) return false;
          const name = (d.originalname ?? d.filename ?? '').toString();
          const sizeMatch = uploadedMeta.size ? Number(d.size) === Number(uploadedMeta.size) : true;
          const nameMatch =
            (uploadedMeta.originalname && name === uploadedMeta.originalname) ||
            (uploadedMeta.filename && name === uploadedMeta.filename) ||
            (uploadedMeta.originalname && name.includes(uploadedMeta.originalname)) ||
            (uploadedMeta.filename && name.includes(uploadedMeta.filename));
          return nameMatch && sizeMatch;
        });
        if (found) {
          return serverDocs;
        }
      }

      await sleep(delayMs);
    }

    try {
      const data = await api.getProfile();
      return Array.isArray(data?.profile?.documents) ? data.profile.documents : (prevDocs || []);
    } catch (e) {
      return prevDocs || [];
    }
  }

  async function handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const prevDocs = docs.slice().map(d => d.raw);

    try {
      setError('');
      setUploading(true);
      setUploadProgress(1);

      // Use the helper in api which no longer forces Content-Type
      const res = await api.uploadDocument(file, selectedDocType || '', (pct) => {
        setUploadProgress(pct);
      });

      // returned doc or profile
      const returnedDoc = res?.doc ?? (Array.isArray(res?.profile?.documents) ? res.profile.documents[res.profile.documents.length - 1] : null);
      const uploadedMeta = returnedDoc ? {
        originalname: returnedDoc.originalname ?? returnedDoc.filename,
        filename: returnedDoc.filename,
        size: returnedDoc.size,
        _id: returnedDoc._id ?? returnedDoc.id
      } : { originalname: file.name, filename: file.name, size: file.size };

      // poll to make sure server list updated (handles eventual consistency)
      const updatedServerDocs = await pollForNewDoc(prevDocs, uploadedMeta, 6, 300);

      setDocs(Array.isArray(updatedServerDocs) ? updatedServerDocs.map(mapServerDocToUI) : prevDocs.map(mapServerDocToUI));
      setChooserVisible(false);
      setSelectedDocType(null);
    } catch (err) {
      console.error('[UploadCV] Upload failed', err);
      setError(err?.response?.data?.error || 'Upload failed');
      try { alert(err?.response?.data?.error || 'Upload failed'); } catch (e) {}
    } finally {
      setTimeout(() => setUploadProgress(0), 300);
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  function handleFileInput(e) {
    handleFiles(e.target.files);
  }

  async function handleView(doc) {
    setError('');
    try {
      const { blob } = await api.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error('[UploadCV] View failed', err);
      setError(err?.response?.data?.error || 'Failed to view document');
      alert(err?.response?.data?.error || 'Failed to view document');
    }
  }

  async function handleDownload(doc) {
    setError('');
    try {
      const { blob, filename } = await api.downloadDocument(doc.id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || doc.title || 'file';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
    } catch (err) {
      console.error('[UploadCV] Download failed', err);
      setError(err?.response?.data?.error || 'Failed to download document');
      alert(err?.response?.data?.error || 'Failed to download document');
    }
  }

  async function handleDelete(doc) {
    if (!confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    setError('');
    try {
      const res = await api.deleteDocument(doc.id);
      await loadDocs();
    } catch (err) {
      console.error('[UploadCV] Delete failed', err);
      setError(err?.response?.data?.error || 'Delete failed');
      alert(err?.response?.data?.error || 'Delete failed');
    }
  }

  const filterOptions = [
    { key: "all", label: `All Documents (${docs.length})` },
    { key: "resume", label: `Resumes (${docs.filter((d) => d.type === "resume").length})` },
    { key: "cover-letter", label: `Cover Letters (${docs.filter((d) => d.type === "cover-letter").length})` },
  ];

  const filteredDocs = docs.filter((d) => {
    const matchesFilter = activeFilter === "all" ? true : d.type === activeFilter;
    const q = (query || '').toLowerCase();
    const matchesQuery = !q || (d.title || '').toLowerCase().includes(q) || (d.subtitle || '').toLowerCase().includes(q);
    return matchesFilter && matchesQuery;
  });

  const baseCardBg = isDark ? "bg-gray-800" : "bg-white";
  const baseText = isDark ? "text-gray-200" : "text-gray-800";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const panelBorder = isDark ? "border-gray-700" : "border-gray-200";
  const panelBg = isDark ? "bg-gray-900" : "bg-gray-50";

  return (
    <div className={`p-6 space-y-6 ${isDark ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      <div>
        <h2 className={`text-2xl font-semibold ${baseText}`}>My Documents</h2>
        <p className={`mt-1 ${mutedText}`}>Manage your resumes, cover letters, certificates, and other documents.</p>
      </div>

      <div className={`rounded-lg border ${panelBorder} ${panelBg} p-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <button
                onClick={openChooser}
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md shadow-sm"
                aria-haspopup="true"
                aria-expanded={chooserVisible}
                disabled={uploading}
              >
                Upload New Document
              </button>

              {chooserVisible && (
                <div className={`absolute left-0 mt-2 w-[260px] p-3 rounded-md shadow-md border ${isDark ? 'bg-slate-800 border-slate-700 text-gray-100' : 'bg-white border-gray-200 text-gray-900'}`}>
                  <div className="text-sm mb-2">What would you like to upload?</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openFileDialogWithType('resume')}
                      className="flex-1 px-3 py-2 rounded border hover:bg-gray-50 text-sm"
                    >
                      Resume
                    </button>
                    <button
                      onClick={() => openFileDialogWithType('cover-letter')}
                      className="flex-1 px-3 py-2 rounded border hover:bg-gray-50 text-sm"
                    >
                      Cover letter
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    <button onClick={() => setChooserVisible(false)} className="underline">Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <button className="px-3 py-2 border rounded-md text-sm" onClick={() => alert("Create Resume - hook up your flow")}>
              Create Resume
            </button>
            <button className="px-3 py-2 border rounded-md text-sm" onClick={() => alert("Create Cover Letter - hook up your flow")}>
              Create Cover Letter
            </button>
          </div>

          <div className="w-full sm:w-auto mt-3 sm:mt-0">
            {uploading && (
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-teal-600" style={{ width: `${uploadProgress}%`, transition: 'width 200ms ease' }} />
              </div>
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.zip"
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center w-full sm:w-1/2 bg-transparent border rounded-md px-3 py-2">
          <input
            className="w-full bg-transparent outline-none text-sm"
            placeholder="Search documents, tags, or descriptions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {filterOptions.map((f) => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`text-sm px-3 py-1 rounded-full border ${activeFilter === f.key ? "bg-teal-600 text-white border-teal-600" : "bg-transparent " + panelBorder + " " + mutedText}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="space-y-6">
        {loading && <div className={`${baseText}`}>Loading documents…</div>}

        {!loading && filteredDocs.length === 0 && (
          <div className={`rounded-lg border ${panelBorder} ${baseCardBg} p-6 ${baseText}`}>No documents found.</div>
        )}

        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className={`flex flex-col rounded-lg border ${panelBorder} p-6 sm:p-4 ${baseCardBg} sm:max-w-lg sm:mb-4 min-h-[180px] sm:min-h-0 justify-between overflow-hidden`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="rounded-md p-3 sm:p-2 bg-gray-100/60 flex-shrink-0">
                    <FileText className="w-6 h-6 sm:w-5 sm:h-5" />
                  </div>

                  <div className="min-w-0">
                    <div className={`font-medium ${baseText} text-sm sm:text-base truncate`}>{doc.title}</div>
                    <div className={`text-sm mt-1 ${mutedText} sm:text-xs truncate`}>{doc.subtitle}</div>
                    <div className="text-xs mt-1">{doc.type}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button title="Star" className="p-1 rounded-md hover:bg-gray-100">
                  <Star className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm sm:text-sm gap-3">
              <div className={`${mutedText} min-w-0`}>
                <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                  Size: <span className={`ml-1 ${baseText}`}>{doc.size}</span>
                </div>
                <div className="mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                  Modified: <span className={`ml-1 ${baseText}`}>{doc.modified}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 w-full sm:w-auto">
                <button className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto text-center" onClick={() => handleView(doc)}>View</button>
                <button className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto text-center" onClick={() => handleDownload(doc)}>Download</button>
                <button className="px-2 py-2 border rounded-md text-sm w-full sm:w-auto text-center text-red-600" onClick={() => handleDelete(doc)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
