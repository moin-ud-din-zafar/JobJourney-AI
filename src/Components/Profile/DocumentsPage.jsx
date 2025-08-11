import React, { useState } from "react";
import { useDarkTheme } from "../DarkThemeContext";
import { FileText, Star } from "lucide-react";

/**
 * DocumentsPage.jsx
 * - Shows only created CVs (resumes) in a responsive grid.
 * - Fixes mobile overflow by using `min-w-0`, `truncate`, and `flex-shrink-0`.
 * - Mobile cards get slightly taller so content doesn't collide.
 */

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
    id: "d6",
    type: "resume",
    title: "Data_Science_Resume.pdf",
    subtitle: "Resume focused on data science roles",
    size: "190 KB",
    modified: "12/25/2023",
    tags: ["data", "ml"],
  },
];

export default function DocumentsPage() {
  const { isDark } = useDarkTheme();
  const [docs, setDocs] = useState(initialDocs);

  function handleView(doc) {
    // wire to viewer modal / route
    alert(`View: ${doc.title}`);
  }

  function handleDownload(doc) {
    // wire to real download link
    alert(`Download: ${doc.title}`);
  }

  function handleDelete(id) {
    if (!confirm("Delete this document? This action cannot be undone.")) return;
    setDocs((prev) => prev.filter((d) => d.id !== id));
  }

  const baseText = isDark ? "text-gray-200" : "text-gray-800";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";
  const panelBorder = isDark ? "border-gray-700" : "border-gray-200";
  const cardBg = isDark ? "bg-gray-800" : "bg-white";

  // show only resumes (CVs)
  const resumes = docs.filter((d) => d.type === "resume");

  return (
    <div className={`p-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="mb-6">
        <h1 className={`text-2xl font-semibold ${baseText}`}>My CVs</h1>
        <p className={`mt-1 text-sm ${mutedText}`}>
          All of your created resumes/CVs — quick access to view, download, or delete.
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className={`rounded-lg border ${panelBorder} p-6 ${cardBg} text-center`}>
          <div className={`text-sm ${mutedText}`}>
            No CVs found. Create or upload a new resume to get started.
          </div>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {resumes.map((doc) => (
            <div
              key={doc.id}
              className={`flex flex-col rounded-lg border ${panelBorder} p-6 sm:p-4 ${cardBg} sm:max-w-lg sm:mb-4 min-h-[180px] sm:min-h-0 justify-between overflow-hidden`}
            >
              {/* Header Section: Icon + Title + Subtitle */}
              <div className="flex items-start justify-between gap-2">
                {/* Left column: flexible and can shrink */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Icon */}
                    <div className="rounded-md p-3 sm:p-2 bg-gray-100/60 flex-shrink-0">
                      <FileText className="w-6 h-6 sm:w-5 sm:h-5" />
                    </div>

                    {/* Title/Subtitle */}
                    <div className="min-w-0">
                      <div className={`font-medium ${baseText} text-sm sm:text-base truncate`}>{doc.title}</div>
                      <div className={`text-sm mt-1 ${mutedText} sm:text-xs truncate`}>{doc.subtitle}</div>
                    </div>
                  </div>
                </div>

                {/* Star Icon */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button title="Star" className="p-1 rounded-md hover:bg-gray-100">
                    <Star className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Info Section: Size + Modified Date */}
              <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm sm:text-sm gap-3">
                <div className={`${mutedText} min-w-0`}>
                  <div className="whitespace-nowrap overflow-hidden text-ellipsis">
                    Size: <span className={`ml-1 ${baseText}`}>{doc.size}</span>
                  </div>
                  <div className="mt-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    Modified: <span className={`ml-1 ${baseText}`}>{doc.modified}</span>
                  </div>
                </div>

                {/* Action Buttons: Stacked on mobile, inline on larger screens */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2 w-full sm:w-auto">
                  <button
                    className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto text-center"
                    onClick={() => handleView(doc)}
                  >
                    View
                  </button>
                  <button
                    className="px-3 py-2 border rounded-md text-sm w-full sm:w-auto text-center"
                    onClick={() => handleDownload(doc)}
                  >
                    Download
                  </button>
                  <button
                    className="px-2 py-2 border rounded-md text-sm w-full sm:w-auto text-center text-red-600"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
