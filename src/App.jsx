import { useState, useMemo } from 'react'

// ─────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────

const FRANCHISES = [
  { id: 1, name: 'Sunrise Learning Centre', location: 'Vancouver, BC', revenue: 48500, quality: 94, training: 98, health: 'Green', trend: '+12%', trendUp: true },
  { id: 2, name: 'Maple Academy', location: 'Toronto, ON', revenue: 52300, quality: 88, training: 85, health: 'Green', trend: '+8%', trendUp: true },
  { id: 3, name: 'Pacific Kids Hub', location: 'Surrey, BC', revenue: 31200, quality: 71, training: 62, health: 'Yellow', trend: '-3%', trendUp: false },
  { id: 4, name: 'Ridgewood Learning', location: 'Calgary, AB', revenue: 44100, quality: 91, training: 95, health: 'Green', trend: '+15%', trendUp: true },
  { id: 5, name: 'Downtown Discovery', location: 'Montreal, QC', revenue: 28900, quality: 63, training: 48, health: 'Red', trend: '-11%', trendUp: false },
  { id: 6, name: 'Westside Scholars', location: 'Edmonton, AB', revenue: 39700, quality: 85, training: 78, health: 'Yellow', trend: '+2%', trendUp: true },
  { id: 7, name: 'Northgate Academy', location: 'Ottawa, ON', revenue: 55200, quality: 96, training: 100, health: 'Green', trend: '+18%', trendUp: true },
  { id: 8, name: 'Harmony Learning Co.', location: 'Victoria, BC', revenue: 33600, quality: 79, training: 71, health: 'Yellow', trend: '+5%', trendUp: true },
]

const REVENUE_DATA = {
  '30days': [
    { month: 'Wk 1', revenue: 87000, target: 85000 },
    { month: 'Wk 2', revenue: 92000, target: 88000 },
    { month: 'Wk 3', revenue: 88000, target: 90000 },
    { month: 'Wk 4', revenue: 96000, target: 92000 },
  ],
  '3months': [
    { month: 'Feb', revenue: 342000, target: 330000 },
    { month: 'Mar', revenue: 371000, target: 355000 },
    { month: 'Apr', revenue: 389000, target: 375000 },
  ],
  '12months': [
    { month: 'May', revenue: 310000, target: 295000 },
    { month: 'Jun', revenue: 325000, target: 305000 },
    { month: 'Jul', revenue: 318000, target: 310000 },
    { month: 'Aug', revenue: 342000, target: 320000 },
    { month: 'Sep', revenue: 361000, target: 335000 },
    { month: 'Oct', revenue: 355000, target: 345000 },
    { month: 'Nov', revenue: 378000, target: 355000 },
    { month: 'Dec', revenue: 391000, target: 365000 },
    { month: 'Jan', revenue: 348000, target: 370000 },
    { month: 'Feb', revenue: 362000, target: 375000 },
    { month: 'Mar', revenue: 371000, target: 380000 },
    { month: 'Apr', revenue: 389000, target: 385000 },
  ],
}

const QC_SUBMISSIONS = [
  { id: 1, franchise: 'Sunrise Learning Centre', classType: 'Math Explorers', date: 'May 7, 2026', status: 'Pending' },
  { id: 2, franchise: 'Maple Academy', classType: 'Reading Rainbow', date: 'May 6, 2026', status: 'Pending' },
  { id: 3, franchise: 'Pacific Kids Hub', classType: 'Science Lab Jr.', date: 'May 5, 2026', status: 'Reviewed' },
  { id: 4, franchise: 'Ridgewood Learning', classType: 'Art & Creativity', date: 'May 4, 2026', status: 'Approved' },
  { id: 5, franchise: 'Downtown Discovery', classType: 'Math Explorers', date: 'May 3, 2026', status: 'Pending' },
  { id: 6, franchise: 'Westside Scholars', classType: 'Music & Motion', date: 'May 2, 2026', status: 'Approved' },
  { id: 7, franchise: 'Northgate Academy', classType: 'Reading Rainbow', date: 'May 1, 2026', status: 'Approved' },
]

const MESSAGES = [
  { id: 1, sender: 'Pacific Kids Hub', subject: 'Q2 Royalty Payment Dispute', category: 'Royalty', priority: 'High', time: '10:23 AM', status: 'awaiting-hq', body: 'Hi HQ Team,\n\nI wanted to follow up on the Q2 royalty calculation we discussed last week. After reviewing the numbers, I believe there may be a discrepancy in how the gross revenue was calculated for March.\n\nOur internal records show $31,200 but the statement shows $34,800. Could you please review and confirm?\n\nThank you,\nPacific Kids Hub Management' },
  { id: 2, sender: 'Downtown Discovery', subject: 'Curriculum Materials Delay', category: 'Curriculum', priority: 'High', time: '9:14 AM', status: 'awaiting-hq', body: 'Hello,\n\nOur Spring 2026 curriculum kit was expected to arrive by April 28th but still has not been delivered. We have three classes scheduled this week that rely on these materials.\n\nCan you provide an updated tracking number or expedite a replacement shipment?\n\nUrgently,\nDowntown Discovery' },
  { id: 3, sender: 'Westside Scholars', subject: 'Staff Training Schedule Request', category: 'Training', priority: 'Normal', time: 'Yesterday', status: 'awaiting-hq', body: 'Hi,\n\nWe recently hired two new teachers and would like to schedule them for the standard onboarding training program. They are available starting May 15th.\n\nPlease let us know which session dates work and what materials they should pre-read.\n\nThanks,\nWestside Scholars' },
  { id: 4, sender: 'HQ Operations', subject: 'Q3 Marketing Campaign Assets Ready', category: 'Marketing', priority: 'Normal', time: 'Yesterday', status: 'awaiting-franchisee', body: 'Dear Franchise Partners,\n\nThe Q3 marketing campaign assets are now ready for download in the resource portal. This includes social media templates, flyers, and email copy for the Back-to-School promotion.\n\nPlease confirm receipt and planned launch dates by May 15th.\n\nBest,\nHQ Marketing Team' },
  { id: 5, sender: 'HQ Finance', subject: 'Annual Audit Documents Due May 31', category: 'Operations', priority: 'High', time: 'May 7', status: 'awaiting-franchisee', body: 'Important Reminder,\n\nThis is a reminder that annual financial audit documentation is due by May 31, 2026. Please ensure you submit:\n\n• Certified P&L statements\n• Bank reconciliation reports\n• Lease agreements (if updated)\n\nSubmit via the secure portal. Late submissions incur a $500 administrative fee.\n\nHQ Finance' },
  { id: 6, sender: 'Maple Academy', subject: 'Re: Enrollment Software Issue Resolved', category: 'Technical', priority: 'Normal', time: 'May 6', status: 'resolved', body: 'Hi Support,\n\nThank you for the quick fix! The enrollment portal is now working correctly and we were able to complete all pending registrations.\n\nWe appreciate the fast response.\n\nBest,\nMaple Academy' },
  { id: 7, sender: 'Ridgewood Learning', subject: 'New Lease Agreement — Approved', category: 'Operations', priority: 'Normal', time: 'May 5', status: 'resolved', body: 'Hello,\n\nWe have reviewed the updated lease terms for our new location at 4521 Macleod Trail SE and are pleased to move forward. We will sign by end of week.\n\nThank you for your support throughout the process.\n\nRidgewood Learning Management' },
]

const COURSES = [
  { id: 1, title: 'Franchise Operations Fundamentals', progress: 100, required: true, color: 'from-blue-600 to-blue-800', modules: 4, duration: '3.5 hrs' },
  { id: 2, title: 'Curriculum Delivery Mastery', progress: 75, required: true, color: 'from-teal-500 to-teal-700', modules: 6, duration: '5 hrs' },
  { id: 3, title: 'Parent Communication Excellence', progress: 40, required: true, color: 'from-indigo-500 to-indigo-700', modules: 3, duration: '2 hrs' },
  { id: 4, title: 'Quality Standards & Compliance', progress: 20, required: true, color: 'from-slate-600 to-slate-800', modules: 5, duration: '4 hrs' },
  { id: 5, title: 'Marketing Your Franchise', progress: 60, required: false, color: 'from-purple-500 to-purple-700', modules: 4, duration: '3 hrs' },
  { id: 6, title: 'Financial Management Basics', progress: 0, required: false, color: 'from-emerald-600 to-emerald-800', modules: 3, duration: '2.5 hrs' },
]

const COURSE_MODULES = {
  1: [
    { id: 1, title: 'Welcome to the Franchise System', complete: true, lessons: ['Introduction & Orientation', 'Our Mission & Values', 'Franchise Agreement Overview'] },
    { id: 2, title: 'Daily Operations Workflow', complete: true, lessons: ['Morning Opening Procedures', 'Class Scheduling System', 'End-of-Day Closing Procedures'] },
    { id: 3, title: 'Staffing & HR Essentials', complete: true, lessons: ['Hiring Guidelines', 'Staff Onboarding Checklist', 'Performance Review Process'] },
    { id: 4, title: 'Health & Safety Compliance', complete: true, lessons: ['Safety Protocols Overview', 'Emergency Procedures', 'Incident Reporting'] },
  ],
  2: [
    { id: 1, title: 'Curriculum Philosophy', complete: true, lessons: ['Our Teaching Approach', 'Learning Outcomes Framework', 'Age-Appropriate Methods'] },
    { id: 2, title: 'Math Explorers Delivery', complete: true, lessons: ['Lesson Structure Guide', 'Manipulatives Handbook', 'Student Assessment Tools', 'Parent Progress Reports'] },
    { id: 3, title: 'Reading Rainbow Program', complete: true, lessons: ['Phonics Framework', 'Story Time Techniques', 'Reading Level Assessment'] },
    { id: 4, title: 'Science Lab Jr.', complete: false, lessons: ['Lab Safety & Setup', 'Experiment Facilitation', 'Curiosity & Discovery Approach'] },
    { id: 5, title: 'Art & Creativity Module', complete: false, lessons: ['Materials & Setup Guide', 'Creative Process Facilitation', 'Display & Showcase Tips'] },
    { id: 6, title: 'Music & Motion', complete: false, lessons: ['Rhythm & Movement', 'Song Repertoire & Lyrics', 'Instrument Introduction'] },
  ],
  3: [
    { id: 1, title: 'First Impressions', complete: true, lessons: ['Welcome Call Scripts', 'New Family Orientation'] },
    { id: 2, title: 'Progress Communication', complete: false, lessons: ['Report Card Guidelines', 'Parent-Teacher Meeting Prep'] },
    { id: 3, title: 'Managing Difficult Conversations', complete: false, lessons: ['De-escalation Techniques', 'Escalation to HQ Process'] },
  ],
  4: [
    { id: 1, title: 'QC Submission Requirements', complete: true, lessons: ['Photo Standards', 'Submission Deadlines'] },
    { id: 2, title: 'Teaching Quality Standards', complete: false, lessons: ['Classroom Environment Checklist', 'Engagement Benchmarks'] },
    { id: 3, title: 'Compliance Audits', complete: false, lessons: ['Self-Audit Process', 'HQ Audit Preparation'] },
    { id: 4, title: 'Incident Management', complete: false, lessons: ['Reporting Procedures', 'Root Cause Analysis'] },
    { id: 5, title: 'Brand Standards', complete: false, lessons: ['Visual Identity Guide', 'Communication Standards'] },
  ],
  5: [
    { id: 1, title: 'Local Marketing Fundamentals', complete: true, lessons: ['Target Audience Profiles', 'Community Outreach'] },
    { id: 2, title: 'Social Media for Franchisees', complete: true, lessons: ['Platform Best Practices', 'Content Calendar', 'Approved Templates'] },
    { id: 3, title: 'Enrollment Events', complete: false, lessons: ['Open House Planning', 'Trial Class Setup'] },
    { id: 4, title: 'Referral Programs', complete: false, lessons: ['Family Referral System', 'Partner Referral Program'] },
  ],
  6: [
    { id: 1, title: 'Reading Your P&L', complete: false, lessons: ['Revenue vs. Expenses', 'Gross Margin Targets'] },
    { id: 2, title: 'Cash Flow Management', complete: false, lessons: ['Weekly Cash Flow Tracking', 'Managing Seasonality'] },
    { id: 3, title: 'Royalty & Reporting', complete: false, lessons: ['Royalty Calculation Methods', 'Monthly Submission Deadlines'] },
  ],
}

const SOP_DATA = {
  Teaching: [
    { id: 1, title: 'Morning Class Setup Protocol', category: 'Teaching', steps: [
      { id: 1, text: 'Arrive 30 minutes before class start time', photo: false },
      { id: 2, text: 'Verify classroom temperature is between 68–72°F', photo: false },
      { id: 3, text: 'Set up all manipulatives per the lesson plan', photo: true },
      { id: 4, text: 'Prepare student name tags and seating arrangement', photo: false },
      { id: 5, text: 'Test all audio/visual equipment and projector', photo: false },
      { id: 6, text: 'Post daily schedule on the whiteboard', photo: true },
    ]},
    { id: 2, title: 'Post-Class Documentation', category: 'Teaching', steps: [
      { id: 1, text: 'Complete class attendance register in the portal', photo: false },
      { id: 2, text: 'Record any notable student observations or concerns', photo: false },
      { id: 3, text: 'Photograph completed student work samples', photo: true },
      { id: 4, text: 'Submit QC report within 2 hours of class end', photo: false },
    ]},
    { id: 3, title: 'Student Progress Assessment', category: 'Teaching', steps: [
      { id: 1, text: 'Pull student progress report from the system', photo: false },
      { id: 2, text: 'Complete assessment rubric for each student', photo: false },
      { id: 3, text: 'Flag any students needing intervention', photo: false },
      { id: 4, text: 'Prepare parent communication summary', photo: false },
    ]},
  ],
  Sales: [
    { id: 4, title: 'Trial Class Enrollment Process', category: 'Sales', steps: [
      { id: 1, text: 'Greet prospective family within 60 seconds of arrival', photo: false },
      { id: 2, text: 'Complete parent intake form on the enrollment tablet', photo: false },
      { id: 3, text: 'Conduct facility tour following the standard route', photo: false },
      { id: 4, text: 'Present program options and current pricing', photo: false },
      { id: 5, text: 'Offer enrollment incentive per active promotion', photo: false },
      { id: 6, text: 'Follow up with thank-you email within 24 hours', photo: false },
    ]},
    { id: 5, title: 'Phone Inquiry Handling', category: 'Sales', steps: [
      { id: 1, text: 'Answer within 3 rings using the standard greeting', photo: false },
      { id: 2, text: 'Log inquiry details in the CRM system', photo: false },
      { id: 3, text: 'Offer a free trial class booking', photo: false },
      { id: 4, text: 'Send confirmation SMS and email to the prospect', photo: false },
    ]},
  ],
  Operations: [
    { id: 6, title: 'Weekly Facility Inspection', category: 'Operations', steps: [
      { id: 1, text: 'Inspect all classrooms for cleanliness and organization', photo: true },
      { id: 2, text: 'Check supply inventory against reorder thresholds', photo: false },
      { id: 3, text: 'Test fire extinguishers and smoke detector function', photo: false },
      { id: 4, text: 'Review and archive this week\'s class schedules', photo: false },
      { id: 5, text: 'Submit weekly ops report in the HQ portal', photo: false },
    ]},
    { id: 7, title: 'Monthly Financial Reconciliation', category: 'Operations', steps: [
      { id: 1, text: 'Export monthly revenue report from the system', photo: false },
      { id: 2, text: 'Reconcile against bank statement transactions', photo: false },
      { id: 3, text: 'Calculate royalty amount owed to HQ', photo: false },
      { id: 4, text: 'Submit report and payment by the 5th of the month', photo: false },
    ]},
  ],
}

const QC_HISTORY = [
  { date: 'May 1, 2026', classType: 'Math Explorers', status: 'Approved', rating: 4, comment: 'Great setup and engagement. Manipulatives were well-organized.' },
  { date: 'Apr 24, 2026', classType: 'Reading Rainbow', status: 'Approved', rating: 5, comment: 'Exceptional class. Students were fully engaged throughout.' },
  { date: 'Apr 17, 2026', classType: 'Science Lab Jr.', status: 'Changes Requested', rating: 2, comment: 'Please ensure safety goggles are worn during all experiments.' },
  { date: 'Apr 10, 2026', classType: 'Art & Creativity', status: 'Approved', rating: 4, comment: 'Nice work on the display setup. Great parent-facing presentation.' },
  { date: 'Apr 3, 2026', classType: 'Math Explorers', status: 'Approved', rating: 5, comment: 'Outstanding lesson delivery and classroom management.' },
]

// ─────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────

function HealthBadge({ health }) {
  const cls = health === 'Green' ? 'badge badge-green' : health === 'Yellow' ? 'badge badge-yellow' : 'badge badge-red'
  const dot = health === 'Green' ? 'bg-emerald-500' : health === 'Yellow' ? 'bg-amber-500' : 'bg-red-500'
  return <span className={cls}><span className={`w-1.5 h-1.5 rounded-full ${dot} mr-1.5 inline-block`}></span>{health}</span>
}

function StatusBadge({ status }) {
  const map = {
    'Pending': 'badge badge-yellow',
    'Reviewed': 'badge badge-blue',
    'Approved': 'badge badge-green',
    'Changes Requested': 'badge badge-red',
    'Resolved': 'badge badge-slate',
  }
  return <span className={map[status] || 'badge badge-slate'}>{status}</span>
}

function CategoryBadge({ cat }) {
  const map = {
    'Royalty': 'badge badge-red',
    'Curriculum': 'badge badge-blue',
    'Training': 'badge badge-purple',
    'Marketing': 'badge badge-green',
    'Operations': 'badge badge-slate',
    'Technical': 'badge badge-yellow',
    'Other': 'badge badge-slate',
  }
  return <span className={map[cat] || 'badge badge-slate'}>{cat}</span>
}

function Stars({ rating, onChange }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n => (
        <button key={n} onClick={() => onChange && onChange(n)}
          className={`text-xl transition-colors ${n <= rating ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'}`}>
          ★
        </button>
      ))}
    </div>
  )
}

function ProgressBar({ pct, color = 'bg-[#1e3a5f]' }) {
  return (
    <div className="w-full bg-slate-100 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  )
}

function KpiCard({ label, value, sub, icon, trend, trendUp }) {
  return (
    <div className="card">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${trendUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-[#1e3a5f]">{value}</div>
      <div className="text-sm font-medium text-slate-700 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-slate-400 mt-1">{sub}</div>}
    </div>
  )
}

// SVG Area Chart
function AreaChart({ data }) {
  const W = 700, H = 180, PL = 60, PR = 20, PT = 10, PB = 30
  const cW = W - PL - PR
  const cH = H - PT - PB
  const vals = data.flatMap(d => [d.revenue, d.target])
  const maxV = Math.max(...vals) * 1.05
  const minV = Math.min(...vals) * 0.9
  const xS = i => (i / (data.length - 1)) * cW
  const yS = v => cH - ((v - minV) / (maxV - minV)) * cH
  const fmtK = v => v >= 1000000 ? `$${(v/1000000).toFixed(1)}M` : `$${(v/1000).toFixed(0)}K`
  const area = data.map((d,i) => `${i===0?'M':'L'}${xS(i).toFixed(1)},${yS(d.revenue).toFixed(1)}`).join(' ')
    + ` L${xS(data.length-1).toFixed(1)},${cH} L0,${cH} Z`
  const line = data.map((d,i) => `${i===0?'M':'L'}${xS(i).toFixed(1)},${yS(d.revenue).toFixed(1)}`).join(' ')
  const tgt  = data.map((d,i) => `${i===0?'M':'L'}${xS(i).toFixed(1)},${yS(d.target).toFixed(1)}`).join(' ')
  const gridLines = 4
  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="block">
      <defs>
        <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1e3a5f" stopOpacity="0.25"/>
          <stop offset="100%" stopColor="#1e3a5f" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      <g transform={`translate(${PL},${PT})`}>
        {/* Grid lines */}
        {Array.from({length:gridLines}).map((_,i) => {
          const y = (i / (gridLines-1)) * cH
          const val = maxV - (i / (gridLines-1)) * (maxV - minV)
          return (
            <g key={i}>
              <line x1="0" y1={y.toFixed(1)} x2={cW} y2={y.toFixed(1)} stroke="#e2e8f0" strokeWidth="1"/>
              <text x="-8" y={y+4} textAnchor="end" fontSize="10" fill="#94a3b8">{fmtK(val)}</text>
            </g>
          )
        })}
        {/* Area */}
        <path d={area} fill="url(#areaG)"/>
        {/* Revenue line */}
        <path d={line} fill="none" stroke="#1e3a5f" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
        {/* Target line */}
        <path d={tgt} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="6,3"/>
        {/* Data points */}
        {data.map((d,i) => (
          <circle key={i} cx={xS(i).toFixed(1)} cy={yS(d.revenue).toFixed(1)} r="3.5" fill="#1e3a5f" stroke="white" strokeWidth="1.5"/>
        ))}
        {/* X labels */}
        {data.map((d,i) => (
          <text key={i} x={xS(i).toFixed(1)} y={cH+22} textAnchor="middle" fontSize="10" fill="#94a3b8">{d.month}</text>
        ))}
      </g>
    </svg>
  )
}

// Slider for ratings
function RatingSlider({ label, value, onChange }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-slate-600 mb-1">
        <span className="font-medium">{label}</span>
        <span className="font-bold text-[#1e3a5f]">{value}/5</span>
      </div>
      <input type="range" min="0" max="5" step="0.5" value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1e3a5f]"/>
    </div>
  )
}

// ─────────────────────────────────────────────
// HQ MODULE 1: NETWORK ANALYTICS
// ─────────────────────────────────────────────

function NetworkAnalytics() {
  const [dateRange, setDateRange] = useState('12months')
  const data = REVENUE_DATA[dateRange]
  const totalRev = FRANCHISES.reduce((a,f) => a+f.revenue, 0)
  const avgQuality = Math.round(FRANCHISES.reduce((a,f) => a+f.quality, 0) / FRANCHISES.length)
  const avgTraining = Math.round(FRANCHISES.reduce((a,f) => a+f.training, 0) / FRANCHISES.length)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1e3a5f]">Network Analytics Dashboard</h2>
          <p className="text-sm text-slate-500 mt-0.5">Performance overview across all franchise locations</p>
        </div>
        <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
          {[['30days','30 Days'],['3months','3 Months'],['12months','12 Months']].map(([v,l]) => (
            <button key={v} onClick={() => setDateRange(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${dateRange===v ? 'bg-white text-[#1e3a5f] shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Active Franchises" value="8" sub="2 under performance review" icon="🏫" trend="2 new YTD" trendUp={true}/>
        <KpiCard label="Monthly Revenue" value={`$${(totalRev/1000).toFixed(0)}K`} sub="Combined network revenue" icon="💰" trend="11%" trendUp={true}/>
        <KpiCard label="Avg Quality Score" value={`${avgQuality}/100`} sub="Network-wide average" icon="⭐" trend="4pts" trendUp={true}/>
        <KpiCard label="Training Completion" value={`${avgTraining}%`} sub="Required courses only" icon="🎓" trend="8%" trendUp={true}/>
      </div>

      {/* Revenue Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Network Revenue</h3>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-4 h-0.5 bg-[#1e3a5f] inline-block rounded"></span>Actual</span>
            <span className="flex items-center gap-1.5"><span className="w-4 h-0 border-t-2 border-dashed border-amber-400 inline-block"></span>Target</span>
          </div>
        </div>
        <AreaChart data={data}/>
      </div>

      {/* Franchise Table */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Franchise Performance</h3>
          <button className="text-xs text-[#1e3a5f] font-medium hover:underline">Export CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Franchise','Location','Revenue','Quality Score','Training %','Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FRANCHISES.map((f,i) => (
                <tr key={f.id} className={`border-b border-slate-50 hover:bg-slate-50 transition-colors ${i%2===0?'':'bg-white'}`}>
                  <td className="px-4 py-3 font-medium text-slate-800">{f.name}</td>
                  <td className="px-4 py-3 text-slate-500">{f.location}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700">${f.revenue.toLocaleString()}
                    <span className={`ml-2 text-xs font-medium ${f.trendUp?'text-emerald-600':'text-red-500'}`}>{f.trend}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${f.quality>=85?'text-emerald-600':f.quality>=70?'text-amber-600':'text-red-600'}`}>{f.quality}</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${f.quality>=85?'bg-emerald-500':f.quality>=70?'bg-amber-500':'bg-red-500'}`} style={{width:`${f.quality}%`}}/>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-700">{f.training}%</span>
                      <div className="w-16 bg-slate-100 rounded-full h-1.5">
                        <div className={`h-1.5 rounded-full ${f.training>=85?'bg-emerald-500':f.training>=70?'bg-amber-500':'bg-red-500'}`} style={{width:`${f.training}%`}}/>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><HealthBadge health={f.health}/></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// HQ MODULE 2: QUALITY CONTROL REVIEW
// ─────────────────────────────────────────────

function QualityControlReview() {
  const [filter, setFilter] = useState('All')
  const [expanded, setExpanded] = useState(null)
  const [ratings, setRatings] = useState({ env: 4, teach: 3.5, engage: 4 })
  const [comment, setComment] = useState('')
  const [statuses, setStatuses] = useState({})

  const filtered = QC_SUBMISSIONS.filter(s => filter === 'All' || s.status === filter)
  const getStatus = s => statuses[s.id] || s.status

  const photoColors = ['bg-blue-200','bg-teal-200','bg-indigo-200','bg-purple-200','bg-amber-200','bg-rose-200']

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e3a5f]">Quality Control Review Queue</h2>
        <p className="text-sm text-slate-500 mt-0.5">Review and approve franchisee class submissions</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {['All','Pending','Reviewed','Approved'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${filter===f ? 'border-[#1e3a5f] text-[#1e3a5f]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {f}
            {f==='Pending' && <span className="ml-1.5 bg-amber-100 text-amber-700 text-xs px-1.5 py-0.5 rounded-full">
              {QC_SUBMISSIONS.filter(s=>getStatus(s)==='Pending').length}
            </span>}
          </button>
        ))}
      </div>

      {/* Submission List */}
      <div className="space-y-3">
        {filtered.map(sub => {
          const isExp = expanded === sub.id
          const status = getStatus(sub)
          return (
            <div key={sub.id} className="card p-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setExpanded(isExp ? null : sub.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-lg bg-[#1e3a5f]/10 flex items-center justify-center text-sm">📋</div>
                  <div>
                    <div className="font-semibold text-slate-800">{sub.franchise}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{sub.classType} · {sub.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={status}/>
                  <span className="text-slate-400 text-lg">{isExp ? '▲' : '▼'}</span>
                </div>
              </div>

              {isExp && (
                <div className="border-t border-slate-100 px-5 pb-5 pt-4 bg-slate-50/50">
                  {/* Photos */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Submitted Photos (3)</p>
                    <div className="flex gap-3">
                      {photoColors.slice(0,3).map((c,i) => (
                        <div key={i} className={`w-28 h-20 rounded-lg ${c} flex items-center justify-center text-slate-400 text-sm font-medium border border-white shadow-sm`}>
                          Photo {i+1}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sliders */}
                  <div className="mb-5 bg-white rounded-xl p-4 border border-slate-100">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Rating Criteria</p>
                    <RatingSlider label="Environment & Setup" value={ratings.env} onChange={v => setRatings(r=>({...r,env:v}))}/>
                    <RatingSlider label="Teaching Quality" value={ratings.teach} onChange={v => setRatings(r=>({...r,teach:v}))}/>
                    <RatingSlider label="Child Engagement" value={ratings.engage} onChange={v => setRatings(r=>({...r,engage:v}))}/>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-500">Overall Average</span>
                      <div className="flex items-center gap-2">
                        <Stars rating={Math.round(((ratings.env+ratings.teach+ratings.engage)/3))} />
                        <span className="text-sm font-bold text-[#1e3a5f]">{((ratings.env+ratings.teach+ratings.engage)/3).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comment */}
                  <div className="mb-4">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">HQ Feedback</label>
                    <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm text-slate-700 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                      placeholder="Add your feedback for the franchisee..." value={comment} onChange={e=>setComment(e.target.value)}/>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button className="btn-primary flex-1" onClick={() => { setStatuses(s=>({...s,[sub.id]:'Approved'})); setExpanded(null) }}>
                      ✓ Approve
                    </button>
                    <button className="btn-secondary flex-1" onClick={() => { setStatuses(s=>({...s,[sub.id]:'Reviewed'})); setExpanded(null) }}>
                      ↩ Request Changes
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-sm">No submissions in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// HQ MODULE 3: MESSAGES INBOX
// ─────────────────────────────────────────────

function MessagesInbox() {
  const [view, setView] = useState('awaiting-hq')
  const [selected, setSelected] = useState(MESSAGES[0])
  const [reply, setReply] = useState('')
  const [compose, setCompose] = useState(false)
  const [composeData, setComposeData] = useState({ subject:'', category:'Operations', priority:'Normal', body:'' })

  const filtered = MESSAGES.filter(m => m.status === view)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#1e3a5f]">Messages Inbox</h2>
          <p className="text-sm text-slate-500 mt-0.5">Franchise communication centre</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => setCompose(true)}>
          ✏️ Compose
        </button>
      </div>

      {/* Inbox Views */}
      <div className="flex gap-1 border-b border-slate-200">
        {[['awaiting-hq','Awaiting HQ'],['awaiting-franchisee','Awaiting Franchisee'],['resolved','Resolved']].map(([v,l]) => {
          const cnt = MESSAGES.filter(m=>m.status===v).length
          return (
            <button key={v} onClick={() => { setView(v); setSelected(MESSAGES.find(m=>m.status===v)||null) }}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${view===v?'border-[#1e3a5f] text-[#1e3a5f]':'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {l}
              {cnt > 0 && <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${view===v?'bg-[#1e3a5f] text-white':'bg-slate-100 text-slate-600'}`}>{cnt}</span>}
            </button>
          )
        })}
      </div>

      <div className="flex gap-4 h-[520px]">
        {/* Left Panel */}
        <div className="w-80 flex-shrink-0 flex flex-col gap-2 overflow-y-auto pr-1">
          {filtered.map(m => (
            <div key={m.id} onClick={() => setSelected(m)}
              className={`rounded-xl p-3.5 cursor-pointer transition-all border ${selected?.id===m.id ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-sm'}`}>
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className={`text-sm font-semibold truncate ${selected?.id===m.id?'text-white':'text-slate-800'}`}>{m.sender}</span>
                <span className={`text-xs flex-shrink-0 ${selected?.id===m.id?'text-white/70':'text-slate-400'}`}>{m.time}</span>
              </div>
              <p className={`text-xs font-medium mb-2 truncate ${selected?.id===m.id?'text-white/90':'text-slate-700'}`}>{m.subject}</p>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected?.id===m.id?'bg-white/20 text-white':'bg-slate-100 text-slate-600'}`}>{m.category}</span>
                {m.priority==='High' && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${selected?.id===m.id?'bg-red-400/30 text-white':'bg-red-100 text-red-700'}`}>High Priority</span>}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="text-center py-8 text-slate-400 text-sm">No messages</div>}
        </div>

        {/* Right Panel */}
        <div className="flex-1 card flex flex-col min-h-0">
          {selected ? (
            <>
              <div className="border-b border-slate-100 pb-4 mb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{selected.subject}</h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm text-slate-500">From: <strong>{selected.sender}</strong></span>
                      <span className="text-slate-300">·</span>
                      <span className="text-xs text-slate-400">{selected.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CategoryBadge cat={selected.category}/>
                    {selected.priority==='High' && <span className="badge badge-red">High</span>}
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selected.body}</p>
              </div>
              {/* Reply Box */}
              <div className="border-t border-slate-100 pt-4 mt-4">
                <textarea className="w-full border border-slate-200 rounded-lg p-3 text-sm text-slate-700 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                  placeholder="Type your reply..." value={reply} onChange={e=>setReply(e.target.value)}/>
                <div className="flex justify-end mt-2">
                  <button className="btn-primary" onClick={()=>setReply('')}>Send Reply</button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400">
              <div className="text-center">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-sm">Select a message to read</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {compose && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-[#1e3a5f]">New Message</h3>
              <button onClick={()=>setCompose(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Subject</label>
                <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                  value={composeData.subject} onChange={e=>setComposeData(d=>({...d,subject:e.target.value}))} placeholder="Message subject..."/>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Category</label>
                  <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                    value={composeData.category} onChange={e=>setComposeData(d=>({...d,category:e.target.value}))}>
                    {['Curriculum','Operations','Marketing','Training','Royalty','Technical','Other'].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 block mb-1">Priority</label>
                  <div className="flex gap-2 mt-1">
                    {['Normal','High'].map(p => (
                      <button key={p} onClick={()=>setComposeData(d=>({...d,priority:p}))}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium border transition-colors ${composeData.priority===p?'bg-[#1e3a5f] text-white border-[#1e3a5f]':'border-slate-200 text-slate-600 hover:border-slate-300'}`}>{p}</button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">Message</label>
                <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-28 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                  value={composeData.body} onChange={e=>setComposeData(d=>({...d,body:e.target.value}))} placeholder="Write your message..."/>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button className="btn-secondary" onClick={()=>setCompose(false)}>Cancel</button>
              <button className="btn-primary" onClick={()=>setCompose(false)}>Send Message</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// FRANCHISEE MODULE 4: TRAINING ACADEMY
// ─────────────────────────────────────────────

function TrainingAcademy() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [selectedModule, setSelectedModule] = useState(null)
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [lessonTab, setLessonTab] = useState('video')

  if (selectedLesson) {
    return (
      <div className="space-y-4">
        <button onClick={()=>setSelectedLesson(null)} className="flex items-center gap-2 text-sm text-[#1e3a5f] font-medium hover:underline">
          ← Back to Course
        </button>
        <div className="card">
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-1">{selectedLesson}</h2>
          <p className="text-sm text-slate-500 mb-5">{selectedCourse.title} · {selectedModule.title}</p>
          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-200 mb-5">
            {['video','about','resources','transcript'].map(t => (
              <button key={t} onClick={()=>setLessonTab(t)}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 capitalize transition-colors ${lessonTab===t?'border-[#1e3a5f] text-[#1e3a5f]':'border-transparent text-slate-500 hover:text-slate-700'}`}>
                {t}
              </button>
            ))}
          </div>
          {lessonTab==='video' && (
            <div className="rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center aspect-video">
              <iframe className="w-full h-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
                title="Lesson Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture" allowFullScreen/>
            </div>
          )}
          {lessonTab==='about' && (
            <div className="prose text-slate-700 text-sm leading-relaxed">
              <p>This lesson covers the essential concepts for <strong>{selectedLesson}</strong>. You will learn the core principles required for successful franchise operations and delivering outstanding educational experiences to students and families.</p>
              <p className="mt-3">Estimated completion time: <strong>15–20 minutes</strong>. After completing this lesson, you will be assessed with a short quiz to confirm comprehension.</p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-blue-800 font-semibold text-sm">Learning Objectives</p>
                <ul className="mt-2 text-blue-700 text-sm space-y-1 list-disc list-inside">
                  <li>Understand the key procedures and standards</li>
                  <li>Apply frameworks in a real classroom setting</li>
                  <li>Meet HQ compliance requirements</li>
                </ul>
              </div>
            </div>
          )}
          {lessonTab==='resources' && (
            <div className="space-y-3">
              {['Lesson Handout.pdf','Reference Checklist.pdf','Quick-Start Guide.pdf'].map(f => (
                <div key={f} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📄</span>
                    <span className="text-sm font-medium text-slate-700">{f}</span>
                  </div>
                  <button className="text-xs text-[#1e3a5f] font-medium hover:underline">Download</button>
                </div>
              ))}
            </div>
          )}
          {lessonTab==='transcript' && (
            <div className="bg-slate-50 rounded-xl p-4 text-sm text-slate-600 leading-relaxed h-48 overflow-y-auto border border-slate-100">
              <p><strong className="text-slate-800">[00:00]</strong> Welcome to this lesson on {selectedLesson}. In today's session we'll be covering the fundamentals that every franchise partner needs to know.</p>
              <p className="mt-3"><strong className="text-slate-800">[00:15]</strong> Let's begin by looking at the core framework. The system has been designed to ensure consistent quality across all our locations...</p>
              <p className="mt-3"><strong className="text-slate-800">[00:45]</strong> One of the most important aspects to understand is how this integrates with your daily operations workflow...</p>
              <p className="mt-3"><strong className="text-slate-800">[01:30]</strong> Now let's walk through the step-by-step process that you'll use each and every day...</p>
            </div>
          )}
          <div className="mt-5 flex justify-end">
            <button className="btn-primary">Mark Lesson Complete ✓</button>
          </div>
        </div>
      </div>
    )
  }

  if (selectedCourse) {
    const modules = COURSE_MODULES[selectedCourse.id] || []
    return (
      <div className="space-y-4">
        <button onClick={()=>{setSelectedCourse(null);setSelectedModule(null)}} className="flex items-center gap-2 text-sm text-[#1e3a5f] font-medium hover:underline">
          ← Back to Courses
        </button>
        <div className="card">
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedCourse.color} flex-shrink-0`}/>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1e3a5f]">{selectedCourse.title}</h2>
              <div className="flex items-center gap-3 mt-1 mb-3">
                <span className="text-sm text-slate-500">{selectedCourse.modules} modules · {selectedCourse.duration}</span>
                {selectedCourse.required && <span className="badge badge-red">Required</span>}
              </div>
              <ProgressBar pct={selectedCourse.progress}/>
              <p className="text-xs text-slate-400 mt-1">{selectedCourse.progress}% complete</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {modules.map((mod, mi) => (
            <div key={mod.id} className="card p-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-slate-50"
                onClick={() => setSelectedModule(selectedModule?.id===mod.id ? null : mod)}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${mod.complete?'bg-emerald-100 text-emerald-600':'bg-slate-100 text-slate-400'}`}>
                    {mod.complete ? '✓' : `${mi+1}`}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{mod.title}</div>
                    <div className="text-xs text-slate-400">{mod.lessons.length} lessons</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {mod.complete ? <span className="badge badge-green">Complete</span> : <span className="badge badge-slate">In Progress</span>}
                  <span className="text-slate-400">{selectedModule?.id===mod.id?'▲':'▼'}</span>
                </div>
              </div>
              {selectedModule?.id===mod.id && (
                <div className="border-t border-slate-100 bg-slate-50/50">
                  {mod.lessons.map((lesson, li) => (
                    <div key={li} className="flex items-center justify-between px-5 py-3 border-b border-slate-100 last:border-0 hover:bg-white transition-colors cursor-pointer"
                      onClick={() => { setSelectedLesson(lesson); setLessonTab('video') }}>
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${mod.complete ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                          {mod.complete ? '✓' : li+1}
                        </span>
                        <span className="text-sm text-slate-700">{lesson}</span>
                      </div>
                      <span className="text-xs text-[#1e3a5f] font-medium">Start →</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e3a5f]">Training Academy</h2>
        <p className="text-sm text-slate-500 mt-0.5">Your learning path and certification courses</p>
      </div>
      {/* Progress Summary */}
      <div className="card bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/70 text-sm">Overall Training Progress</p>
            <p className="text-3xl font-bold mt-1">64%</p>
            <p className="text-white/70 text-sm mt-1">2 of 4 required courses complete</p>
          </div>
          <div className="text-5xl">🎓</div>
        </div>
        <div className="mt-4 bg-white/20 rounded-full h-2">
          <div className="bg-white h-2 rounded-full" style={{width:'64%'}}/>
        </div>
      </div>
      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {COURSES.map(course => (
          <div key={course.id} className="card cursor-pointer hover:shadow-md transition-shadow group" onClick={()=>setSelectedCourse(course)}>
            <div className={`w-full h-28 rounded-lg bg-gradient-to-br ${course.color} mb-4 flex items-end p-3`}>
              {course.required && <span className="text-xs bg-white/25 text-white px-2 py-0.5 rounded-full font-medium">Required</span>}
            </div>
            <h3 className="font-semibold text-slate-800 text-sm group-hover:text-[#1e3a5f] transition-colors leading-snug">{course.title}</h3>
            <p className="text-xs text-slate-400 mt-1 mb-3">{course.modules} modules · {course.duration}</p>
            <ProgressBar pct={course.progress} color={course.progress===100?'bg-emerald-500':'bg-[#1e3a5f]'}/>
            <p className="text-xs text-slate-400 mt-1.5">{course.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// FRANCHISEE MODULE 5: SOP EXECUTION
// ─────────────────────────────────────────────

function SOPExecution() {
  const [category, setCategory] = useState('Teaching')
  const [selectedSOP, setSelectedSOP] = useState(null)
  const [checks, setChecks] = useState({})
  const [completed, setCompleted] = useState({})

  const sops = SOP_DATA[category] || []
  const toggleCheck = (sopId, stepId) => setChecks(c => ({...c, [`${sopId}-${stepId}`]: !c[`${sopId}-${stepId}`]}))
  const allChecked = sop => sop.steps.every(s => checks[`${sop.id}-${s.id}`])

  if (selectedSOP) {
    const done = completed[selectedSOP.id]
    return (
      <div className="space-y-4">
        <button onClick={()=>setSelectedSOP(null)} className="flex items-center gap-2 text-sm text-[#1e3a5f] font-medium hover:underline">
          ← Back to SOPs
        </button>
        <div className="card">
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-xl font-bold text-[#1e3a5f]">{selectedSOP.title}</h2>
            <span className="badge badge-blue">{selectedSOP.category}</span>
          </div>
          <p className="text-sm text-slate-500 mb-6">{selectedSOP.steps.length} steps · Follow in order</p>

          {done ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">✅</div>
              <h3 className="font-bold text-emerald-700 text-lg">SOP Completed!</h3>
              <p className="text-slate-500 text-sm mt-1">Completed on May 9, 2026 at 2:34 PM</p>
              <div className="mt-4 flex gap-3 justify-center">
                <button className="btn-secondary" onClick={()=>setCompleted(c=>({...c,[selectedSOP.id]:false}))}>Reset Checklist</button>
                <button className="btn-primary">View History</button>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {selectedSOP.steps.map((step, i) => {
                  const key = `${selectedSOP.id}-${step.id}`
                  const checked = checks[key]
                  return (
                    <div key={step.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${checked?'bg-emerald-50 border-emerald-200':'bg-white border-slate-200 hover:border-slate-300'}`}
                      onClick={() => toggleCheck(selectedSOP.id, step.id)}>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checked?'bg-emerald-500 border-emerald-500':'border-slate-300'}`}>
                        {checked && <span className="text-white text-xs">✓</span>}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">STEP {i+1}</span>
                          {step.photo && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">📷 Photo Required</span>}
                        </div>
                        <p className={`text-sm mt-1 ${checked?'line-through text-slate-400':'text-slate-700'}`}>{step.text}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {selectedSOP.steps.filter(s=>checks[`${selectedSOP.id}-${s.id}`]).length} / {selectedSOP.steps.length} steps completed
                </p>
                <button className={`btn-primary ${!allChecked(selectedSOP)?'opacity-50 cursor-not-allowed':''}`}
                  disabled={!allChecked(selectedSOP)}
                  onClick={() => setCompleted(c=>({...c,[selectedSOP.id]:true}))}>
                  Complete SOP ✓
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e3a5f]">SOP Execution</h2>
        <p className="text-sm text-slate-500 mt-0.5">Standard operating procedures and checklists</p>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {['Teaching','Sales','Operations'].map(c => (
          <button key={c} onClick={() => setCategory(c)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${category===c?'border-[#1e3a5f] text-[#1e3a5f]':'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sops.map(sop => {
          const done = completed[sop.id]
          const progress = sop.steps.filter(s=>checks[`${sop.id}-${s.id}`]).length
          return (
            <div key={sop.id} className="card flex items-center justify-between cursor-pointer hover:shadow-md transition-shadow"
              onClick={()=>setSelectedSOP(sop)}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${done?'bg-emerald-100':'bg-[#1e3a5f]/10'}`}>
                  {done ? '✅' : '📋'}
                </div>
                <div>
                  <div className="font-semibold text-slate-800">{sop.title}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{sop.steps.length} steps · {sop.steps.filter(s=>s.photo).length} photo steps</div>
                  {progress > 0 && !done && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5">
                        <div className="bg-[#1e3a5f] h-1.5 rounded-full" style={{width:`${(progress/sop.steps.length)*100}%`}}/>
                      </div>
                      <span className="text-xs text-slate-400">{progress}/{sop.steps.length}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {done ? <span className="badge badge-green">Complete</span> : progress > 0 ? <span className="badge badge-blue">In Progress</span> : <span className="badge badge-slate">Not Started</span>}
                <span className="text-slate-400 text-lg">→</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// FRANCHISEE MODULE 6: QC SUBMISSION
// ─────────────────────────────────────────────

function QCSubmission() {
  const [form, setForm] = useState({ date: '', classType: 'Math Explorers', notes: '' })
  const [dragging, setDragging] = useState(false)
  const [files, setFiles] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (form.date && form.classType) setSubmitted(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#1e3a5f]">Quality Control Submission</h2>
        <p className="text-sm text-slate-500 mt-0.5">Submit class photos and notes for HQ review</p>
      </div>

      {submitted ? (
        <div className="card text-center py-10">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">📤</div>
          <h3 className="font-bold text-emerald-700 text-lg">Submission Received!</h3>
          <p className="text-slate-500 text-sm mt-1 mb-5">Your QC submission for <strong>{form.classType}</strong> on <strong>{form.date}</strong> has been sent to HQ for review.</p>
          <button className="btn-secondary" onClick={() => { setSubmitted(false); setForm({ date:'', classType:'Math Explorers', notes:'' }); setFiles([]) }}>
            Submit Another
          </button>
        </div>
      ) : (
        <div className="card space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Class Date *</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))}/>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">Class Type *</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
                value={form.classType} onChange={e=>setForm(f=>({...f,classType:e.target.value}))}>
                {['Math Explorers','Reading Rainbow','Science Lab Jr.','Art & Creativity','Music & Motion'].map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Class Notes</label>
            <textarea className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm h-24 resize-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/30"
              placeholder="Describe what went well, any challenges, student engagement notes..."
              value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-xs font-semibold text-slate-500 block mb-1.5">Class Photos</label>
            <div
              onDragOver={e=>{e.preventDefault();setDragging(true)}}
              onDragLeave={()=>setDragging(false)}
              onDrop={e=>{e.preventDefault();setDragging(false);setFiles(prev=>[...prev,...Array.from(e.dataTransfer.files).map(f=>f.name)])}}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${dragging?'border-[#1e3a5f] bg-[#1e3a5f]/5':'border-slate-200 hover:border-slate-300'}`}>
              <div className="text-3xl mb-2">📷</div>
              <p className="text-sm font-medium text-slate-700">Drag & drop photos here</p>
              <p className="text-xs text-slate-400 mt-1">or <span className="text-[#1e3a5f] font-medium cursor-pointer hover:underline">browse files</span></p>
              <p className="text-xs text-slate-300 mt-2">PNG, JPG up to 10MB each</p>
              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2 justify-center">
                  {files.map((f,i) => (
                    <span key={i} className="text-xs bg-[#1e3a5f]/10 text-[#1e3a5f] px-2 py-1 rounded-full">{f}</span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button className={`btn-primary px-8 ${!form.date?'opacity-50 cursor-not-allowed':''}`}
              disabled={!form.date} onClick={handleSubmit}>
              Submit for HQ Review →
            </button>
          </div>
        </div>
      )}

      {/* Submission History */}
      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800">Submission History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Date','Class Type','Status','HQ Rating','HQ Comment'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {QC_HISTORY.map((h,i) => (
                <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-4 py-3 text-slate-600">{h.date}</td>
                  <td className="px-4 py-3 font-medium text-slate-800">{h.classType}</td>
                  <td className="px-4 py-3"><StatusBadge status={h.status}/></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(n=><span key={n} className={`text-base ${n<=h.rating?'text-amber-400':'text-slate-200'}`}>★</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs max-w-xs truncate">{h.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────

const HQ_NAV = [
  { id: 'analytics', label: 'Network Analytics', icon: '📊' },
  { id: 'qc', label: 'QC Review Queue', icon: '✅' },
  { id: 'messages', label: 'Messages', icon: '💬' },
]

const F_NAV = [
  { id: 'training', label: 'Training Academy', icon: '🎓' },
  { id: 'sop', label: 'SOP Execution', icon: '📋' },
  { id: 'qcsubmit', label: 'QC Submission', icon: '📤' },
]

export default function App() {
  const [portal, setPortal] = useState('hq')
  const [hqTab, setHqTab] = useState('analytics')
  const [fTab, setFTab] = useState('training')

  const nav = portal === 'hq' ? HQ_NAV : F_NAV
  const activeTab = portal === 'hq' ? hqTab : fTab
  const setTab = portal === 'hq' ? setHqTab : setFTab

  const renderContent = () => {
    if (portal === 'hq') {
      if (hqTab === 'analytics') return <NetworkAnalytics/>
      if (hqTab === 'qc') return <QualityControlReview/>
      if (hqTab === 'messages') return <MessagesInbox/>
    } else {
      if (fTab === 'training') return <TrainingAcademy/>
      if (fTab === 'sop') return <SOPExecution/>
      if (fTab === 'qcsubmit') return <QCSubmission/>
    }
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-3 lg:px-6 py-0 flex items-center justify-between h-14 flex-shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">CF</span>
          </div>
          <div>
            <span className="font-bold text-[#1e3a5f] text-base">CFOSDesk</span>
            <span className="text-slate-300 mx-2">|</span>
            <span className="hidden lg:inline text-xs text-slate-400">Franchise Operations Platform</span>
          </div>
        </div>

        {/* Portal Toggle */}
        <div className="flex items-center bg-slate-100 rounded-xl p-1 gap-1">
          <button onClick={() => setPortal('hq')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${portal==='hq'?'bg-[#1e3a5f] text-white shadow-sm':'text-slate-500 hover:text-slate-700'}`}>
            🏢 HQ Portal
          </button>
          <button onClick={() => setPortal('franchisee')}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${portal==='franchisee'?'bg-[#1e3a5f] text-white shadow-sm':'text-slate-500 hover:text-slate-700'}`}>
            🏫 Franchisee Portal
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-xs font-semibold text-slate-700">{portal==='hq'?'HQ Operations Team':'Sunrise Learning Centre'}</p>
            <p className="text-xs text-slate-400">{portal==='hq'?'Administrator':'Franchisee'}</p>
          </div>
          <div className="w-8 h-8 bg-[#1e3a5f]/10 rounded-full flex items-center justify-center text-sm font-bold text-[#1e3a5f]">
            {portal==='hq'?'HQ':'SL'}
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="hidden lg:flex w-56 bg-[#1e3a5f] flex-shrink-0 flex-col py-5 px-3">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 mb-3">
            {portal==='hq'?'HQ Tools':'My Tools'}
          </p>
          <nav className="flex flex-col gap-1 flex-1">
            {nav.map(item => (
              <div key={item.id} onClick={() => setTab(item.id)}
                className={`sidebar-nav-item ${activeTab===item.id?'active':''}`}>
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </nav>
          {/* Sidebar Footer */}
          <div className="border-t border-white/10 pt-4 px-1">
            <div className="text-xs text-slate-500 text-center">
              <p className="font-medium text-slate-400">VancouverAISolutions</p>
              <p className="mt-0.5">CFOSDesk v1.0</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-3 lg:p-6 pb-20 lg:pb-6">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1e3a5f] flex border-t border-slate-700 z-50 h-16">
        {nav.map(item => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors ${activeTab === item.id ? 'bg-[#2a4a7f] text-white' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] leading-tight text-center px-1">{item.label.split(' ').slice(0, 2).join(' ')}</span>
          </button>
        ))}
      </nav>
      </div>
    </div>
  )
}
