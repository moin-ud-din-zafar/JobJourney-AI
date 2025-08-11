import React, { useState, useEffect, useRef } from "react";
import { useDarkTheme } from "../DarkThemeContext"; // For theme handling
import { FileText, Star } from "lucide-react"; // Icons for better visual representation

const initialDocs = [
  {
    id: "d1",
    type: "resume",
    title: "Senior_Software_Engineer_Resume_2024.pdf",
    subtitle: "Main resume for senior software engineering positions",
    size: "245 KB",
    modified: "1/20/2024",
    tags: ["latest", "tech", "senior"],
  },
  {
    id: "d2",
    type: "resume",
    title: "Startup_Resume_Tailored.pdf",
    subtitle: "Resume tailored for startup companies",
    size: "238 KB",
    modified: "1/18/2024",
    tags: ["startup", "tailored"],
  },
  {
    id: "d3",
    type: "cover-letter",
    title: "Cover_Letter_Template.docx",
    subtitle: "General cover letter template",
    size: "58 KB",
    modified: "1/12/2024",
    tags: ["template", "general"],
  },
];

export default function UploadCV() {
  const { isDark } = useDarkTheme();
  const fileInputRef = useRef(null);
  const [docs, setDocs] = useState(initialDocs);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    let t;
    if (uploading) {
      setUploadProgress(5);
      t = setInterval(() => {
        setUploadProgress((p) => {
          if (p >= 100) {
            clearInterval(t);
            setUploading(false);
            setTimeout(() => setUploadProgress(0), 400);
            return 100;
          }
          return Math.min(100, p + Math.floor(Math.random() * 15) + 5);
        });
      }, 300);
    }
    return () => clearInterval(t);
  }, [uploading]);

  function openFileDialog() {
    fileInputRef.current?.click();
  }

  function handleFiles(files) {
    if (!files || files.length === 0) return;
    const file = files[0];
    const newDoc = {
      id: `d${Date.now()}`,
      type: guessTypeFromName(file.name),
      title: file.name,
      subtitle: "Uploaded document",
      size: prettyFileSize(file.size),
      modified: new Date().toLocaleDateString(),
      tags: [],
    };
    setUploading(true);
    const waitAndAdd = setInterval(() => {
      if (!uploading) {
        setDocs((prev) => [newDoc, ...prev]);
        clearInterval(waitAndAdd);
      }
    }, 300);
  }

  function handleFileInput(e) {
    handleFiles(e.target.files);
  }

  function deleteDoc(id) {
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  function prettyFileSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function guessTypeFromName(name) {
    const n = name.toLowerCase();
    if (n.includes("resume")) return "resume";
    if (n.includes("cover") || n.includes("letter")) return "cover-letter";
    return "other";
  }

  const filterOptions = [
    { key: "all", label: `All Documents (${docs.length})` },
    { key: "resume", label: `Resumes (${docs.filter((d) => d.type === "resume").length})` },
    { key: "cover-letter", label: `Cover Letters (${docs.filter((d) => d.type === "cover-letter").length})` },
  ];

  const filteredDocs = docs.filter((d) => {
    const matchesFilter = activeFilter === "all" ? true : d.type === activeFilter;
    const matchesQuery =
      d.title.toLowerCase().includes(query.toLowerCase()) ||
      (d.subtitle || "").toLowerCase().includes(query.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const baseCardBg = isDark ? "bg-gray-800" : "bg-white";
  const baseText = isDark ? "text-gray-200" : "text-gray-800";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const panelBorder = isDark ? "border-gray-700" : "border-gray-200";
  const panelBg = isDark ? "bg-gray-900" : "bg-gray-50";

  return (
    <div className={`p-6 space-y-6 ${isDark ? "bg-gray-900" : "bg-gray-50"} min-h-screen`}>
      {/* Page header */}
      <div>
        <h2 className={`text-2xl font-semibold ${baseText}`}>My Documents</h2>
        <p className={`mt-1 ${mutedText}`}>Manage your resumes, cover letters, certificates, and other job-related documents</p>
      </div>

      {/* Quick Actions */}
      <div className={`rounded-lg border ${panelBorder} ${panelBg} p-4`}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={openFileDialog}
              className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md shadow-sm"
            >
              Upload New Document
            </button>
            <button className="px-3 py-2 border rounded-md text-sm" onClick={() => alert("Create Resume - hook up your flow")}>
              Create Resume
            </button>
            <button className="px-3 py-2 border rounded-md text-sm" onClick={() => alert("Create Cover Letter - hook up your flow")}>
              Create Cover Letter
            </button>
          </div>
        </div>

        {/* hidden file input */}
        <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.zip" className="hidden" onChange={handleFileInput} />
      </div>

      {/* Search + Filters */}
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

      {/* Documents List */}
      <div className="space-y-6">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            /* MOBILE-specific increases: more padding, min height, larger icon/text, stacked actions.
               sm: restores original sizes so tablets/large screens are unchanged. */
            className={`flex flex-col rounded-lg border ${panelBorder} p-6 sm:p-4 ${baseCardBg} sm:max-w-lg sm:mb-4 min-h-[180px] sm:min-h-0 justify-between overflow-hidden`}
          >
            {/* Make left column flexible and allow shrink (min-w-0) so text can truncate correctly */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  {/* keep icon fixed size and don't let it shrink */}
                  <div className="rounded-md p-3 sm:p-2 bg-gray-100/60 flex-shrink-0">
                    <FileText className="w-6 h-6 sm:w-5 sm:h-5" />
                  </div>

                  {/* title/subtitle wrapper that can shrink - needed for text truncation */}
                  <div className="min-w-0">
                    {/* truncate so long filenames show ellipsis on mobile; remains same on sm+ */}
                    <div className={`font-medium ${baseText} text-sm sm:text-base truncate`}>{doc.title}</div>
                    <div className={`text-sm mt-1 ${mutedText} sm:text-xs truncate`}>{doc.subtitle}</div>
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

              {/* On mobile the buttons stack and take full width; on sm+ they are inline and auto width */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 w-full sm:w-auto">
                <button
                  className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto text-center"
                  onClick={() => alert("View " + doc.title)}
                >
                  View
                </button>
                <button
                  className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto text-center"
                  onClick={() => alert("Download " + doc.title)}
                >
                  Download
                </button>
                <button
                  className="px-2 py-2 border rounded-md text-sm w-full sm:w-auto text-center text-red-600"
                  onClick={() => deleteDoc(doc.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
