import React from "react";
import { motion } from "framer-motion";
import {
  Globe, Users, Star, MapPin, TrendingUp, Award,
  FileText, ClipboardCheck, Info, CheckCircle2
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import CTABanner from "../components/shared/CTABanner";

const businessMetrics = [
  {
    icon: Globe,
    title: "Website Traffic",
    measurement: "Google Analytics",
    frequency: "Monthly",
    why: "The most direct indicator of increased online visibility. We track sessions, unique visitors, and average time on page before and after the project.",
    collectedHow: "Students install Google Analytics during the build phase and share view access with the business owner and our team.",
    tracked: ["Monthly sessions", "Unique visitors", "Average time on page", "Top traffic sources"],
  },
  {
    icon: TrendingUp,
    title: "Social Media Growth",
    measurement: "Platform Insights",
    frequency: "At 1, 3, and 6 months",
    why: "Shows whether the social media strategy is working over time, not just at launch. We want to see sustained, organic growth.",
    collectedHow: "Business owners complete a short data-sharing form at each checkpoint, submitting screenshot summaries of their platform insights.",
    tracked: ["Follower count", "Post reach", "Engagement rate", "Profile visits"],
  },
  {
    icon: Star,
    title: "Digital Independence",
    measurement: "Post-Workshop Survey",
    frequency: "After each workshop",
    why: "Technical deliverables only matter if the business owner can use them. This survey measures real confidence, not just completion.",
    collectedHow: "A short 5-question survey sent after each follow-up workshop asking owners to rate confidence on a 1 to 5 scale across key tasks.",
    tracked: ["Confidence updating website (1 to 5)", "Confidence posting on social media (1 to 5)", "Confidence reading analytics (1 to 5)", "Overall program satisfaction (1 to 5)"],
  },
  {
    icon: MapPin,
    title: "Local Visibility",
    measurement: "Google Business Profile",
    frequency: "Quarterly",
    why: "Google Business is a primary driver of foot traffic for local businesses. Tracking views and actions shows real-world discoverability.",
    collectedHow: "Business owners share their Google Business Insights report quarterly, which is included in our published outcomes.",
    tracked: ["Profile views", "Direction requests", "Phone calls from listing", "Photo views"],
  },
];

const studentMetrics = [
  {
    icon: FileText,
    title: "Projects Completed",
    measurement: "Program Records",
    frequency: "Per cohort",
    why: "Tracks the cumulative output of our student teams and ensures consistent project completion rates.",
    collectedHow: "Recorded by program coordinators at the time of project launch and handoff.",
    tracked: ["Total projects per student", "Roles held per student", "Projects per cohort"],
  },
  {
    icon: ClipboardCheck,
    title: "Skills Self-Assessment",
    measurement: "Pre/Post Survey",
    frequency: "Before and after each project",
    why: "Demonstrates measurable skill growth across web design, development, communication, and project management.",
    collectedHow: "Students complete a 10-item self-assessment rating proficiency on a 1 to 5 scale before starting and after completing each project.",
    tracked: ["Web design proficiency", "Development skills", "Communication skills", "Project management ability", "Content creation confidence"],
  },
  {
    icon: Award,
    title: "Portfolio & Application Use",
    measurement: "Post-Project Survey",
    frequency: "Per project",
    why: "Shows whether our work is translating into real-world opportunities for students, a key measure of program effectiveness.",
    collectedHow: "Students are asked six months after project completion whether they used the project in a college application, job application, or portfolio.",
    tracked: ["% who included project in portfolio", "% who cited in college application", "% who cited in job/internship application"],
  },
  {
    icon: Users,
    title: "Mentor Evaluations",
    measurement: "Mentor Review Form",
    frequency: "End of each project cycle",
    why: "External evaluations provide an objective measure of student performance that complements self-reported data.",
    collectedHow: "Mentors complete a structured evaluation form rating each student on teamwork, professionalism, and technical execution.",
    tracked: ["Teamwork (1 to 5)", "Professionalism (1 to 5)", "Technical execution (1 to 5)", "Communication quality (1 to 5)"],
  },
];

// Sample/placeholder chart data — labeled clearly as illustrative
const sampleTrafficData = [
  { month: "Pre-Launch", sessions: 120 },
  { month: "Month 1", sessions: 310 },
  { month: "Month 2", sessions: 420 },
  { month: "Month 3", sessions: 580 },
];

const sampleSkillsData = [
  { skill: "Web Design", before: 2.1, after: 4.2 },
  { skill: "Development", before: 2.4, after: 4.0 },
  { skill: "Communication", before: 3.0, after: 4.5 },
  { skill: "PM", before: 2.2, after: 4.1 },
  { skill: "Content", before: 2.8, after: 4.3 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-[#2D2D2D] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-xs">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

function MetricCard({ metric, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-md p-6 md:p-8"
    >
      <div className="flex items-start gap-4 mb-5">
        <div className="w-11 h-11 rounded-xl bg-[#EDF3EB] flex items-center justify-center flex-shrink-0">
          <metric.icon className="w-5 h-5 text-[#8FAF88]" aria-hidden="true" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#2D2D2D]">{metric.title}</h3>
          <div className="flex flex-wrap gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 bg-[#EDF3EB] text-[#6B6B6B] rounded-full">{metric.measurement}</span>
            <span className="text-xs px-2 py-0.5 bg-[#FAFAF8] border border-gray-100 text-[#6B6B6B] rounded-full">{metric.frequency}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-[#4A4A4A] leading-relaxed mb-4">{metric.why}</p>

      <div className="text-xs text-[#6B6B6B] bg-[#FAFAF8] rounded-xl p-3 mb-4 leading-relaxed">
        <strong className="text-[#4A4A4A]">How we collect it:</strong> {metric.collectedHow}
      </div>

      <div>
        <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-2">What we track</h4>
        <ul className="space-y-1.5">
          {metric.tracked.map((t, i) => (
            <li key={i} className="flex gap-2 text-xs text-[#4A4A4A]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B2C9AD] flex-shrink-0 mt-0.5" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function MeasurableOutcomes() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="outcomes-heading">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B2C9AD]/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-4">
                Measurable Outcomes
              </p>
              <h1 id="outcomes-heading" className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight">
                We measure what{" "}
                <span className="text-[#8FAF88]">actually matters.</span>
              </h1>
              <p className="mt-5 text-lg text-[#6B6B6B] max-w-xl leading-relaxed">
                Every metric we track is tied to a real outcome: for businesses, for students, and for the community. Here is exactly what we measure, how we measure it, and why it matters.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Transparency note */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex gap-4 p-6 bg-[#EDF3EB] rounded-2xl border border-[#D4E4D0]">
            <Info className="w-5 h-5 text-[#8FAF88] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              <strong>A note on our data:</strong> As a newly launched program, the charts below are illustrative examples showing the format we use to report outcomes. As our first cohort of projects completes, real data will replace these samples. We are committed to publishing only verified, participant-sourced numbers, never estimates or projections.
            </p>
          </div>
        </div>
      </section>

      {/* Sample Dashboard Charts */}
      <section className="py-12 bg-white" aria-labelledby="dashboard-heading">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-8 text-center">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8FAF88] mb-2">Sample Outcomes Dashboard</p>
            <h2 id="dashboard-heading" className="text-2xl md:text-3xl font-bold text-[#2D2D2D]">How We Report Results</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Traffic chart */}
            <div className="bg-[#FAFAF8] rounded-2xl border border-gray-100 p-6">
              <p className="text-sm font-bold text-[#2D2D2D] mb-1">Website Traffic Growth</p>
              <p className="text-xs text-[#6B6B6B] mb-6">Monthly sessions before and after launch (illustrative example)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sampleTrafficData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="sessions" name="Sessions" fill="#B2C9AD" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Skills chart */}
            <div className="bg-[#FAFAF8] rounded-2xl border border-gray-100 p-6">
              <p className="text-sm font-bold text-[#2D2D2D] mb-1">Student Skills Growth</p>
              <p className="text-xs text-[#6B6B6B] mb-6">Average self-assessment score before vs. after (1 to 5 scale, illustrative example)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={sampleSkillsData} barSize={16}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="skill" tick={{ fontSize: 10, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 5]} tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="before" name="Before" fill="#D4E4D0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="after" name="After" fill="#8FAF88" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Confidence scores */}
            <div className="bg-[#FAFAF8] rounded-2xl border border-gray-100 p-6">
              <p className="text-sm font-bold text-[#2D2D2D] mb-1">Business Owner Confidence</p>
              <p className="text-xs text-[#6B6B6B] mb-5">Self-reported confidence rating (1 to 5) after each workshop (illustrative example)</p>
              <div className="space-y-3">
                {[
                  { label: "Managing website", score: 4.1, max: 5 },
                  { label: "Posting on social media", score: 4.4, max: 5 },
                  { label: "Reading analytics", score: 3.7, max: 5 },
                  { label: "Overall satisfaction", score: 4.6, max: 5 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-[#4A4A4A] mb-1">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.score} / 5</span>
                    </div>
                    <div className="h-2 bg-[#EDF3EB] rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-[#B2C9AD] rounded-full transition-all duration-700"
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                        role="progressbar"
                        aria-valuenow={item.score}
                        aria-valuemin={0}
                        aria-valuemax={item.max}
                        aria-label={`${item.label}: ${item.score} out of ${item.max}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor evaluations */}
            <div className="bg-[#FAFAF8] rounded-2xl border border-gray-100 p-6">
              <p className="text-sm font-bold text-[#2D2D2D] mb-1">Mentor Evaluation Averages</p>
              <p className="text-xs text-[#6B6B6B] mb-5">Average mentor ratings per category (1 to 5, illustrative example)</p>
              <div className="space-y-3">
                {[
                  { label: "Teamwork", score: 4.5, max: 5 },
                  { label: "Professionalism", score: 4.3, max: 5 },
                  { label: "Technical execution", score: 4.0, max: 5 },
                  { label: "Communication quality", score: 4.6, max: 5 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs text-[#4A4A4A] mb-1">
                      <span>{item.label}</span>
                      <span className="font-semibold">{item.score} / 5</span>
                    </div>
                    <div className="h-2 bg-[#EDF3EB] rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-[#8FAF88] rounded-full transition-all duration-700"
                        style={{ width: `${(item.score / item.max) * 100}%` }}
                        role="progressbar"
                        aria-valuenow={item.score}
                        aria-valuemin={0}
                        aria-valuemax={item.max}
                        aria-label={`${item.label}: ${item.score} out of ${item.max}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Business Outcomes */}
      <section className="py-16 md:py-20 bg-[#FAFAF8]" aria-labelledby="business-outcomes-heading">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8FAF88] mb-2">Category 01</p>
            <h2 id="business-outcomes-heading" className="text-2xl md:text-3xl font-bold text-[#2D2D2D]">
              Business Outcomes
            </h2>
            <p className="text-[#6B6B6B] mt-2">Tracking the real-world impact on participating small businesses.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {businessMetrics.map((m, i) => <MetricCard key={m.title} metric={m} index={i} />)}
          </div>
        </div>
      </section>

      {/* Student Outcomes */}
      <section className="py-16 md:py-20 bg-white" aria-labelledby="student-outcomes-heading">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8FAF88] mb-2">Category 02</p>
            <h2 id="student-outcomes-heading" className="text-2xl md:text-3xl font-bold text-[#2D2D2D]">
              Student Outcomes
            </h2>
            <p className="text-[#6B6B6B] mt-2">Demonstrating the professional and educational value of participation for students.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {studentMetrics.map((m, i) => <MetricCard key={m.title} metric={m} index={i} />)}
          </div>
        </div>
      </section>

      <CTABanner
        title="Interested in our data?"
        description="Funders, partners, and grant committees can request our full outcomes report. Reach out and we'll share what we have."
        buttonText="Contact Us"
        buttonPage="Partners"
      />
    </div>
  );
}