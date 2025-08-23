// src/Components/Profile/SkillsPage.jsx
import React, { useEffect, useState } from "react";
import { useDarkTheme } from "../DarkThemeContext";
import * as api from '../../api';

/**
 * SkillsPage — full component
 * - Loads profile on mount and seeds UI from server
 * - Keeps your original UI/markup and styles exactly
 * - Sanitizes arrays before saving and refreshes UI from server response
 */

/* --- defaults / samples (kept identical to your original) --- */
const defaultSkills = {
  technical: ["React", "TypeScript", "Node.js", "Python", "AWS", "Docker"],
  soft: ["Leadership", "Communication", "Problem Solving", "Team Management"],
  languages: ["English (Native)", "Spanish (Conversational)", "French (Basic)"],
};

const sampleExperience = [
  {
    id: "exp1",
    company: "TechCorp Inc.",
    position: "Senior Software Engineer",
    startDate: "2021-03",
    endDate: "",
    current: true,
    description: "Lead development of cloud-native applications using React and Node.js",
  },
];

const sampleEducation = [
  {
    id: "edu1",
    institution: "University of California, Berkeley",
    degree: "Bachelor of Science",
    fieldOfStudy: "Computer Science",
    gpa: "3.8",
    startDate: "2015-09",
    endDate: "2019-05",
  },
];

const sampleCerts = [
  {
    id: "cert1",
    name: "AWS Certified Solutions Architect",
    issuingOrg: "Amazon Web Services",
    issueDate: "2022-08",
    expiryDate: "2025-08",
    credentialId: "AWS-12345",
  },
];

/* --- helpers --- */
function uniqId(prefix = "") {
  return `${prefix}${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`;
}

/* When loading server-side subdocs, attach a stable local id for rendering */
function withLocalIds(arr = [], prefix = "") {
  if (!Array.isArray(arr)) return [];
  return arr.map(item => {
    if (!item || typeof item !== 'object') return item;
    return { ...item, id: item._id ? String(item._id) : (item.id || uniqId(prefix)) };
  });
}

/* remove UI-only ids and drop empty objects before saving */
function stripIdsAndFilterEmpty(arr) {
  if (!Array.isArray(arr)) return [];
  return arr
    .map((item) => {
      const { id, _id, ...rest } = item || {};
      return rest;
    })
    .filter((obj) => {
      return Object.values(obj).some((v) => {
        if (v === null || v === undefined) return false;
        if (typeof v === "string") return v.trim() !== "";
        if (Array.isArray(v)) return v.length > 0;
        if (typeof v === "object") {
          return Object.values(v).some((x) => {
            if (x === null || x === undefined) return false;
            if (typeof x === "string") return x.trim() !== "";
            if (Array.isArray(x)) return x.length > 0;
            return true;
          });
        }
        return true;
      });
    });
}

/* small card wrapper for consistent style (kept identical) */
function Panel({ title, children, right }) {
  return (
    <section className="rounded-lg border p-4 bg-white/80 dark:bg-gray-800/80 dark:border-gray-700 border-gray-200">
      <div className="flex items-start justify-between gap-4">
        <h3 className="font-medium text-sm text-slate-800 dark:text-slate-100">{title}</h3>
        <div>{right}</div>
      </div>
      <div className="mt-3">{children}</div>
    </section>
  );
}

/* --- component --- */
export default function SkillsPage() {
  const { isDark } = useDarkTheme();

  // keep your original defaults but we will replace them after loading
  const [skills, setSkills] = useState(defaultSkills);
  const [skillCategory, setSkillCategory] = useState("technical");
  const [skillInput, setSkillInput] = useState("");

  // sections (start from samples to keep design identical until server loads)
  const [experiences, setExperiences] = useState(sampleExperience);
  const [educations, setEducations] = useState(sampleEducation);
  const [certificates, setCertificates] = useState(sampleCerts);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load profile on mount and seed local state from server values (if any)
  useEffect(() => {
    let mounted = true;
    async function loadProfile() {
      setLoading(true);
      try {
        const res = await api.getProfile();
        const profile = res?.profile ?? null;
        if (!mounted) return;
        if (profile) {
          setSkills({
            technical: (profile.skills && Array.isArray(profile.skills.technical)) ? profile.skills.technical : defaultSkills.technical,
            soft: (profile.skills && Array.isArray(profile.skills.soft)) ? profile.skills.soft : defaultSkills.soft,
            languages: (profile.skills && Array.isArray(profile.skills.languages)) ? profile.skills.languages : defaultSkills.languages,
          });
          setExperiences(withLocalIds(profile.experiences || [], 'exp'));
          setEducations(withLocalIds(profile.educations || [], 'edu'));
          setCertificates(withLocalIds(profile.certificates || [], 'cert'));
        } else {
          // no profile yet -> leave defaults (samples)
          setSkills(defaultSkills);
          setExperiences(sampleExperience);
          setEducations(sampleEducation);
          setCertificates(sampleCerts);
        }
      } catch (err) {
        console.error('Failed to load profile', err);
        // keep current UI defaults if load fails
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadProfile();
    return () => { mounted = false; };
  }, []);

  /* --- Skills handlers (unchanged behavior) --- */
  function addSkill() {
    const value = skillInput.trim();
    if (!value) return;
    setSkills((prev) => {
      const next = { ...prev };
      if (!next[skillCategory].includes(value)) next[skillCategory] = [value, ...next[skillCategory]];
      return next;
    });
    setSkillInput("");
  }

  function removeSkill(category, value) {
    setSkills((prev) => {
      const next = { ...prev };
      next[category] = next[category].filter((s) => s !== value);
      return next;
    });
  }

  /* --- Experience handlers --- */
  function addExperience() {
    setExperiences((prev) => [
      {
        id: uniqId("exp"),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
      ...prev,
    ]);
  }

  function updateExperience(id, key, value) {
    setExperiences((prev) => prev.map((e) => (e.id === id ? { ...e, [key]: value } : e)));
  }

  function removeExperience(id) {
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  }

  /* --- Education handlers --- */
  function addEducation() {
    setEducations((prev) => [
      {
        id: uniqId("edu"),
        institution: "",
        degree: "",
        fieldOfStudy: "",
        gpa: "",
        startDate: "",
        endDate: "",
      },
      ...prev,
    ]);
  }

  function updateEducation(id, key, value) {
    setEducations((prev) => prev.map((e) => (e.id === id ? { ...e, [key]: value } : e)));
  }

  function removeEducation(id) {
    setEducations((prev) => prev.filter((e) => e.id !== id));
  }

  /* --- Certificates handlers --- */
  function addCertificate() {
    setCertificates((prev) => [
      {
        id: uniqId("cert"),
        name: "",
        issuingOrg: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
      },
      ...prev,
    ]);
  }

  function updateCertificate(id, key, value) {
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  }

  function removeCertificate(id) {
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  }

  /* --- Save handler (wired to backend) --- */
  async function handleSave() {
    const payload = {
      skills,
      experiences: stripIdsAndFilterEmpty(experiences),
      educations: stripIdsAndFilterEmpty(educations),
      certificates: stripIdsAndFilterEmpty(certificates),
    };

    console.log("UPDATING profile payload →", payload);

    setSaving(true);
    try {
      const res = await api.updateProfile(payload);
      console.log("Saved Skills & Experience (server response):", res);
      alert("Saved to server.");

      // Refresh local state from returned profile to keep ids and DB canonical values
      const profile = res?.profile;
      if (profile) {
        setSkills({
          technical: (profile.skills && Array.isArray(profile.skills.technical)) ? profile.skills.technical : defaultSkills.technical,
          soft: (profile.skills && Array.isArray(profile.skills.soft)) ? profile.skills.soft : defaultSkills.soft,
          languages: (profile.skills && Array.isArray(profile.skills.languages)) ? profile.skills.languages : defaultSkills.languages,
        });
        setExperiences(withLocalIds(profile.experiences || [], 'exp'));
        setEducations(withLocalIds(profile.educations || [], 'edu'));
        setCertificates(withLocalIds(profile.certificates || [], 'cert'));
      }
    } catch (err) {
      console.error("Save failed", err);
      alert(err?.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const baseText = isDark ? "text-gray-100" : "text-gray-900";
  const mutedText = isDark ? "text-gray-400" : "text-gray-500";

  /* --- UI (exactly your original layout / markup) --- */
  return (
    <div className={`p-6 space-y-6 min-h-screen ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div>
        <h2 className={`text-2xl font-semibold ${baseText}`}>Skills & Experience</h2>
        <p className={`mt-1 ${mutedText}`}>Showcase your technical skills, experience, education and certifications.</p>
      </div>

      {/* SKILLS */}
      <Panel
        title="Skills"
        right={
          <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
            <span className="text-xs">Organize your strengths</span>
          </div>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* controls */}
          <div className="md:col-span-1 space-y-3">
            <div>
              <label htmlFor="skill-category" className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                id="skill-category"
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm min-w-[110px] bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                aria-label="Select skill category"
              >
                <option value="technical">Technical</option>
                <option value="soft">Soft Skills</option>
                <option value="languages">Languages</option>
              </select>
            </div>

            <div>
              <label htmlFor="skill-input" className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                New skill
              </label>
              <div className="flex gap-2">
                <input
                  id="skill-input"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  placeholder="Add a skill..."
                  className="flex-1 px-3 py-2 border rounded-md text-sm min-w-0 bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                />

                <button
                  onClick={addSkill}
                  className="px-3 py-2 bg-teal-600 text-white rounded-md text-sm hover:brightness-105"
                  aria-label="Add skill"
                >
                  Add
                </button>
              </div>
            </div>

            <p className={`text-xs ${mutedText}`}>Press Enter or click Add to create a skill.</p>
          </div>

          {/* lists */}
          <div className="md:col-span-2 space-y-4">
            {[
              { key: "technical", title: "Technical Skills" },
              { key: "soft", title: "Soft Skills" },
              { key: "languages", title: "Languages" },
            ].map((section) => (
              <div key={section.key}>
                <h4 className={`text-sm font-medium ${baseText} mb-2`}>{section.title}</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  {(!skills || !skills[section.key] || skills[section.key].length === 0) && (
                    <div className={`text-xs ${mutedText}`}>No {section.title.toLowerCase()} yet.</div>
                  )}
                  {(skills && skills[section.key] || []).map((s) => (
                    <div
                      key={s}
                      className="flex items-center gap-2 px-3 py-1 border rounded-full text-sm whitespace-nowrap border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 min-w-0"
                    >
                      <span className={`${baseText} truncate`}>{s}</span>
                      <button
                        onClick={() => removeSkill(section.key, s)}
                        className="text-xs text-gray-400 hover:text-gray-600"
                        aria-label={`Remove skill ${s}`}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Panel>

      {/* EXPERIENCE */}
      <Panel
        title="Work Experience"
        right={
          <div>
            <button
              onClick={addExperience}
              className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 hover:shadow-sm"
            >
              + Add Experience
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {experiences.map((exp) => {
            const companyId = `${exp.id}-company`;
            const positionId = `${exp.id}-position`;
            const startId = `${exp.id}-start`;
            const endId = `${exp.id}-end`;
            const currentId = `${exp.id}-current`;
            const descId = `${exp.id}-desc`;

            return (
              <article
                key={exp.id}
                className="rounded-md border p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={companyId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                        Company
                      </label>
                      <input
                        id={companyId}
                        placeholder="Company"
                        value={exp.company}
                        onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label htmlFor={positionId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                        Position
                      </label>
                      <input
                        id={positionId}
                        placeholder="Position"
                        value={exp.position}
                        onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label htmlFor={startId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                          Start date
                        </label>
                        <input
                          id={startId}
                          type="month"
                          value={exp.startDate}
                          onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                      </div>

                      <div>
                        <label htmlFor={endId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                          End date
                        </label>
                        <input
                          id={endId}
                          type="month"
                          value={exp.endDate}
                          onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                          disabled={exp.current}
                          className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 disabled:opacity-60"
                        />
                      </div>

                      <div>
                        <label htmlFor={currentId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                          Current role
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            id={currentId}
                            type="checkbox"
                            checked={!!exp.current}
                            onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">This is my current role</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-56 flex-shrink-0 flex flex-col">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Brief description</div>
                  </div>
                </div>

                <div className="mt-3">
                  <label htmlFor={descId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    id={descId}
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm h-28 resize-y bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                  />
                </div>

                <div className="mt-3 flex justify-end">
                  <button onClick={() => removeExperience(exp.id)} className="text-sm text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>

      {/* EDUCATION */}
      <Panel
        title="Education"
        right={
          <div>
            <button
              onClick={addEducation}
              className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 hover:shadow-sm"
            >
              + Add Education
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {educations.map((edu) => {
            const instId = `${edu.id}-institution`;
            const degreeId = `${edu.id}-degree`;
            const fieldId = `${edu.id}-field`;
            const gpaId = `${edu.id}-gpa`;
            const startId = `${edu.id}-start`;
            const endId = `${edu.id}-end`;

            return (
              <article
                key={edu.id}
                className="rounded-md border p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={instId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                        Institution
                      </label>
                      <input
                        id={instId}
                        placeholder="Institution"
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label htmlFor={degreeId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                        Degree
                      </label>
                      <input
                        id={degreeId}
                        placeholder="Degree"
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label htmlFor={fieldId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                        Field of study
                      </label>
                      <input
                        id={fieldId}
                        placeholder="Field of Study"
                        value={edu.fieldOfStudy}
                        onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label htmlFor={gpaId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                        GPA (optional)
                      </label>
                      <input
                        id={gpaId}
                        placeholder="GPA (Optional)"
                        value={edu.gpa}
                        onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={startId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                          Start date
                        </label>
                        <input
                          id={startId}
                          type="month"
                          value={edu.startDate}
                          onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                      </div>

                      <div>
                        <label htmlFor={endId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                          End date
                        </label>
                        <input
                          id={endId}
                          type="month"
                          value={edu.endDate}
                          onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="w-full lg:w-40 flex-shrink-0 flex flex-col justify-end">
                    <div className="mt-3 lg:mt-0 flex justify-end">
                      <button onClick={() => removeEducation(edu.id)} className="text-red-600 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>

      {/* CERTIFICATIONS */}
      <Panel
        title="Certifications"
        right={
          <div>
            <button
              onClick={addCertificate}
              className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 hover:shadow-sm"
            >
              + Add Certification
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          {certificates.map((c) => {
            const nameId = `${c.id}-name`;
            const orgId = `${c.id}-org`;
            const issueId = `${c.id}-issue`;
            const expiryId = `${c.id}-expiry`;
            const credId = `${c.id}-cred`;

            return (
              <article
                key={c.id}
                className="rounded-md border p-4 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              >
                <div className="flex flex-col lg:flex-row gap-4 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={nameId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                        Certification name
                      </label>
                      <input
                        id={nameId}
                        placeholder="Certification Name"
                        value={c.name}
                        onChange={(e) => updateCertificate(c.id, "name", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div>
                      <label htmlFor={orgId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                        Issuing organization
                      </label>
                      <input
                        id={orgId}
                        placeholder="Issuing Organization"
                        value={c.issuingOrg}
                        onChange={(e) => updateCertificate(c.id, "issuingOrg", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>

                    <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={issueId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                          Issued
                        </label>
                        <input
                          id={issueId}
                          type="month"
                          value={c.issueDate}
                          onChange={(e) => updateCertificate(c.id, "issueDate", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                      </div>

                      <div>
                        <label htmlFor={expiryId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                          Expiry
                        </label>
                        <input
                          id={expiryId}
                          type="month"
                          value={c.expiryDate}
                          onChange={(e) => updateCertificate(c.id, "expiryDate", e.target.value)}
                          className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor={credId} className="text-xs mb-1 block text-gray-700 dark:text-gray-300">
                        Credential ID (optional)
                      </label>
                      <input
                        id={credId}
                        placeholder="Credential ID (Optional)"
                        value={c.credentialId}
                        onChange={(e) => updateCertificate(c.id, "credentialId", e.target.value)}
                        className="w-full px-3 py-2 border rounded-md text-sm bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
                      />
                    </div>
                  </div>

                  <div className="w-full lg:w-40 flex-shrink-0 flex flex-col justify-end">
                    <div className="mt-3 lg:mt-0 flex justify-end">
                      <button onClick={() => removeCertificate(c.id)} className="text-red-600 text-sm">
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-5 py-2 rounded-md text-sm ${saving ? "bg-gray-400 text-white cursor-wait" : "bg-teal-600 text-white hover:brightness-105"}`}
          aria-label="Save Skills and Experience"
        >
          {saving ? "Saving…" : "Save Skills & Experience"}
        </button>
      </div>
    </div>
  );
}
