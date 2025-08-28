// src/components/NewApplicationForm.jsx
import React, { useEffect, useState } from "react";
import { TbBrain } from "react-icons/tb";
import { useDarkTheme } from "../../Components/DarkThemeContext";

/**
 * NewApplicationForm — width-reduced while preserving element sizes
 * - Keeps font sizes, paddings, radii and visual styles from the prior "exact-match" version
 * - Only reduces modal width and label column for a tighter horizontal layout
 *
 * To tweak: change MODAL_WIDTH_PX or LABEL_W_PX at top.
 *
 * Note: Install react-icons if you haven't already:
 *   npm install react-icons
 */

export default function NewApplicationForm({
  open = true,
  onClose = () => {},
  onSubmit = () => {},
}) {
  // Narrower modal but same element sizes
  const MODAL_WIDTH_PX = 460; // reduce modal width
  const LABEL_W_PX = 110; // tighten label column

  // Teal sampled from your screenshot
  const BRAND_TEAL = "#08a0aa";

  // access theme (not strictly required because provider toggles html.dark,
  // but exposed in case you want to change behavior programmatically)
  const { isDark } = useDarkTheme();

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("Applied");
  const [fitScore, setFitScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [nextAction, setNextAction] = useState("");
  const [highPriority, setHighPriority] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    onSubmit({
      company,
      role,
      status,
      fitScore: Number(fitScore),
      progress: Number(progress),
      nextAction,
      highPriority,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" aria-hidden={false}>
      {/* overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
        style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
      />

      {/* modal */}
      <div
        className="relative z-10 jt-modal"
        role="dialog"
        aria-modal="true"
        style={{
          width: MODAL_WIDTH_PX,
          maxWidth: "94%",
          maxHeight: 857,
        }}
      >
        <style>{`
          /* Theme variables: light defaults, .dark overrides applied by DarkThemeProvider */
          :root {
            --card-bg: #ffffff;
            --modal-border: rgba(15,23,42,0.06);
            --modal-shadow: 0 18px 36px rgba(11,15,22,0.35);
            --text: #0f172a;
            --muted: #64748b;
            --muted-soft: #94a3b8;
            --input-border: rgba(203,213,225,0.95);
            --input-bg: #ffffff;
            --ai-pill-bg: #fbfdfe;
            --ai-pill-border: rgba(226,232,240,0.78);
            --ai-pill-text: #64748b;
          }
          /* .dark will be toggled on <html> by DarkThemeProvider */
          .dark {
            --card-bg: #0f172a;            /* slate-900 */
            --modal-border: rgba(255,255,255,0.04);
            --modal-shadow: 0 18px 36px rgba(2,6,23,0.6);
            --text: #e5e7eb;               /* gray-200 */
            --muted: #cbd5e1;              /* muted lighter */
            --muted-soft: #94a3b8;
            --input-border: rgba(148,163,184,0.08);
            --input-bg: #071024;           /* dark input surface */
            --ai-pill-bg: rgba(255,255,255,0.03);
            --ai-pill-border: rgba(255,255,255,0.04);
            --ai-pill-text: #cbd5e1;
          }

          /* Scoped CSS tuned to screenshot (narrower modal but same element sizes) */
          .jt-modal {
            border-radius: 12px;
            border: 1px solid var(--modal-border);
            box-shadow: var(--modal-shadow);
            overflow: hidden;
            background: var(--card-bg);
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
            -webkit-font-smoothing:antialiased;
            -moz-osx-font-smoothing:grayscale;
          }

          .jt-modal .jt-form {
            max-height: calc(857px - 72px);
            overflow: auto;
            padding-left: 22px;
            padding-right: 22px;
            padding-bottom: 18px;
          }

          .jt-header { padding: 16px 22px 8px 22px; }

          .jt-modal h3 { font-size: 16px; margin:0; font-weight: 600; color: var(--text); line-height: 1.1; }
          .jt-modal p.desc { margin:4px 0 0 0; font-size: 12px; color: var(--muted); }

          .jt-row { display:flex; align-items:flex-start; gap:12px; padding:6px 0; }
          .jt-row-center { display:flex; align-items:center; gap:12px; padding:6px 0; }
          .jt-right { flex:1; }

          .jt-label {
            width: ${LABEL_W_PX}px;
            min-width: ${LABEL_W_PX}px;
            padding-top: 2px;
            font-size: 12px;
            color: var(--text);
            display: inline-block;
            box-sizing: border-box;
          }

          .jt-input,
          .jt-select,
          .jt-textarea {
            width: 100%;
            border-radius: 8px;
            border: 1px solid var(--input-border);
            padding: 8px 10px;
            font-size: 13px;
            color: var(--text);
            background: var(--input-bg);
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
            transition: box-shadow .12s ease, border-color .12s ease, transform .06s ease;
            box-sizing: border-box;
          }

          .jt-input::placeholder, .jt-textarea::placeholder { color: var(--muted-soft); font-size: 13px; }

          /* Company specific - slightly thicker border like screenshot */
          .jt-company { border-width: 1.6px; border-radius: 10px; }

          /* Focus states (teal ring with subtle alpha) */
          .jt-input:focus,
          .jt-select:focus,
          .jt-textarea:focus {
            outline: none;
            border-color: ${BRAND_TEAL};
            box-shadow: 0 0 0 3px ${BRAND_TEAL}14, inset 0 1px 0 rgba(255,255,255,0.06);
          }

          /* AI pill (muted, centered) */
          .ai-pill {
            display:inline-flex;
            align-items:center;
            gap:8px;
            padding:6px 10px;
            border-radius: 10px;
            border: 1px solid var(--ai-pill-border);
            background: var(--ai-pill-bg);
            color: var(--ai-pill-text);
            font-size: 12px;
            box-shadow: 0 1px 0 rgba(15,23,42,0.02);
            user-select: none;
            max-width: 100%;
            box-sizing: border-box;
          }

          /* priority control - circular radio */
          .priority-btn {
            display:inline-flex;
            align-items:center;
            gap:10px;
            cursor:pointer;
            background:transparent;
            border:none;
            padding:0;
          }
          .priority-circle {
            width: 14px;
            height: 14px;
            border-radius: 999px;
            border: 2px solid #cbd5e1;
            display:inline-flex;
            align-items:center;
            justify-content:center;
            transition: border-color .12s ease, transform .12s ease;
            box-sizing: border-box;
          }
          .priority-dot {
            width: 6px;
            height: 6px;
            border-radius: 999px;
            background: ${BRAND_TEAL};
            transform: scale(0);
            transition: transform .14s cubic-bezier(.2,.9,.2,1);
          }
          .priority-checked .priority-circle { border-color: ${BRAND_TEAL}; transform: scale(1.02); }
          .priority-checked .priority-dot { transform: scale(1); }

          /* CTA */
          .cta {
            background: ${BRAND_TEAL};
            color: #ffffff;
            border-radius: 8px;
            padding: 8px 12px;
            box-shadow: 0 6px 14px ${BRAND_TEAL}26;
            border:none;
            font-weight: 600;
            font-size: 13px;
            cursor:pointer;
            transition: transform .06s ease, filter .06s ease;
          }
          .cta:active { transform: translateY(1px) }
          .cta:focus { outline:none; box-shadow: 0 0 0 3px ${BRAND_TEAL}14; }

          /* compact scrollbars */
          .jt-form::-webkit-scrollbar { width:7px; height:7px }
          .jt-form::-webkit-scrollbar-thumb { background: rgba(15,23,42,0.06); border-radius:7px }
        `}</style>

        {/* header */}
        <div className="jt-header">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <h3>Add New Application</h3>
              <p className="desc">Add a new job application to track your progress.</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                marginLeft: 8,
                marginTop: -6,
                width: 28,
                height: 28,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                color: "var(--muted)",
              }}
              title="Close"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" style={{ stroke: "currentColor" }}>
                <path d="M18 6L6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 6L18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* form */}
        <form onSubmit={submit} className="jt-form jt-form" noValidate>
          {/* Company */}
          <div className="jt-row">
            <label className="jt-label">Company <span style={{ color: "#ef4444" }}>*</span></label>
            <div className="jt-right">
              <input
                className="jt-input jt-company"
                placeholder="e.g. Google"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                aria-label="Company"
                required
                autoFocus
                style={{ fontSize: 13 }}
              />
            </div>
          </div>

          {/* Role */}
          <div className="jt-row">
            <label className="jt-label">Role <span style={{ color: "#ef4444" }}>*</span></label>
            <div className="jt-right">
              <input
                className="jt-input"
                placeholder="e.g. Senior Frontend Developer"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                aria-label="Role"
                required
                style={{ fontSize: 13 }}
              />
            </div>
          </div>

          {/* Status */}
          <div className="jt-row-center">
            <label className="jt-label">Status</label>
            <div className="jt-right">
              <select
                className="jt-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                aria-label="Status"
                style={{ appearance: "none", backgroundImage: "none" }}
              >
                <option>Applied</option>
                <option>Interviewing</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          {/* AI pill centered under status */}
          <div className="jt-row" style={{ marginTop: 4 }}>
            <div style={{ width: LABEL_W_PX }} />
            <div className="jt-right" style={{ display: "flex", justifyContent: "center" }}>
              <div className="ai-pill" title="AI Predict Match & Progress (demo)">
                {/* react-icons Tabler brain icon (inherits color via currentColor) */}
                <TbBrain size={14} style={{ verticalAlign: "middle", color: "currentColor" }} aria-hidden />

                <span style={{ lineHeight: 1, marginLeft: 6 }}>AI Predict Match & Progress</span>
              </div>
            </div>
          </div>

          {/* Fit Score */}
          <div className="jt-row-center">
            <label className="jt-label">Fit Score (%)</label>
            <div className="jt-right">
              <input
                type="number"
                min={0}
                max={100}
                className="jt-input"
                value={fitScore}
                onChange={(e) => setFitScore(e.target.value)}
                aria-label="Fit Score"
              />
            </div>
          </div>

          {/* Progress */}
          <div className="jt-row-center">
            <label className="jt-label">Progress (%)</label>
            <div className="jt-right">
              <input
                type="number"
                min={0}
                max={100}
                className="jt-input"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                aria-label="Progress"
              />
            </div>
          </div>

          {/* Next Action */}
          <div className="jt-row">
            <label className="jt-label">Next Action</label>
            <div className="jt-right">
              <textarea
                rows={3}
                className="jt-textarea"
                placeholder="e.g. Prepare for technical interview, Follow up on application..."
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
                aria-label="Next Action"
              />
            </div>
          </div>

          {/* High Priority */}
          <div className="jt-row-center">
            <label className="jt-label">High Priority</label>
            <div className="jt-right">
              <button
                type="button"
                className={`priority-btn ${highPriority ? "priority-checked" : ""}`}
                onClick={() => setHighPriority((v) => !v)}
                aria-pressed={highPriority}
                aria-label="Toggle high priority"
                style={{ background: "transparent" }}
              >
                <span className="priority-circle" aria-hidden>
                  <span className="priority-dot" />
                </span>
                <span style={{ color: "#475569", fontSize: 13 }}>
                  Mark this application as high priority
                </span>
              </button>
            </div>
          </div>

          {/* CTA aligned bottom-right */}
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8 }}>
            <button type="submit" className="cta" aria-label="Add Application">
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
