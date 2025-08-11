// Step definitions ― used by StepTracker & header
export const steps = [
  { num: 1, title: 'Paste JD',          desc: 'Enter job description' },
  { num: 2, title: 'Analyze & Compare', desc: 'AI analysis results'  },
  { num: 3, title: 'Review & Generate', desc: 'Tailored resume output' },
];

// Dummy analysis cards for Step 2 top row
export const analysisCards = [
  {
    key: 'overall',
    iconColor: 'teal',
    value: '87%',
    label: 'Overall Match',
    pct: 87,
  },
  {
    key: 'matched',
    iconColor: 'green',
    value: '12',
    label: 'Skills Matched',
    pct: 80,
  },
  {
    key: 'toAdd',
    iconColor: 'gray',
    value: '5',
    label: 'Skills to Add',
    pct: 30,
  },
];

// Dummy skills lists for Step 2 details
export const matchingSkills = [
  { name: 'React',       year: '3+ yrs', pct: 95 },
  { name: 'TypeScript',  year: '2+ yrs', pct: 90 },
  { name: 'Node.js',     year: '2+ yrs', pct: 85 },
  { name: 'JavaScript',  year: '4+ yrs', pct: 92 },
  { name: 'Git',         year: '3+ yrs', pct: 88 },
];

export const missingSkills = [
  { name: 'AWS',        level: 'High',   note: 'Listed 3 times'    },
  { name: 'Docker',     level: 'Medium', note: 'DevOps req'       },
  { name: 'Kubernetes', level: 'Medium', note: 'Orchestration'     },
  { name: 'GraphQL',    level: 'Low',    note: 'Nice to have'      },
  { name: 'Jest',       level: 'High',   note: 'Testing'           },
];

// Dummy keyword lists for Step 2 footer
export const matchedKeywords  = ['React', 'TypeScript', 'JavaScript', 'CSS', 'Git'];
export const missingKeywords  = ['GraphQL', 'Docker', 'AWS'];
export const extraKeywords    = ['Vue', 'Angular', 'PHP'];

// Job summary for Step 2
export const jobSummary = {
  title: 'Senior Frontend Developer',
  company: 'TechCorp',
  bullets: [
    'Build responsive web applications',
    'Collaborate with design team',
    'Write clean, maintainable code',
    'Mentor junior developers',
  ],
};
