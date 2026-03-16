import React from "react";
import { motion } from "framer-motion";
import {
  ClipboardList, Paintbrush, Code2, Share2, PenTool,
  CheckCircle2, Briefcase, Star, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const roles = [
  {
    icon: ClipboardList,
    title: "Project Manager",
    color: "#B2C9AD",
    tagline: "The team's anchor and the business's main contact.",
    description:
      "The Project Manager serves as the primary point of contact between the student team and the business owner. They run team meetings, track deadlines, delegate tasks, and ensure the project stays within scope and is delivered on time.",
    responsibilities: [
      "Schedule and lead kickoff, progress, and handoff meetings",
      "Maintain the project timeline and task tracker",
      "Communicate regularly with the business owner to gather feedback",
      "Escalate blockers to program mentors when needed",
      "Deliver the final project debrief and handoff documentation",
    ],
    skills: ["Communication", "Organization", "Leadership", "Problem-solving"],
    studentGain: "Portfolio-ready project management experience, leadership references, and a documented case study suitable for internship or job applications.",
  },
  {
    icon: Paintbrush,
    title: "Web Designer",
    color: "#8FAF88",
    tagline: "The visual voice of the business online.",
    description:
      "The Web Designer is responsible for the visual identity of the website: layout, color scheme, typography, and overall aesthetic. They work closely with the business owner to ensure the design authentically reflects their brand, and create mockups or wireframes before development begins.",
    responsibilities: [
      "Conduct a brand review session with the business owner",
      "Create wireframes and mockup prototypes for approval",
      "Define a consistent visual style guide for the project",
      "Collaborate with the developer to ensure designs are implemented accurately",
      "Review the final site for visual consistency before launch",
    ],
    skills: ["Visual design", "Typography", "Canva or Figma", "Brand thinking", "Attention to detail"],
    studentGain: "A real client project for their design portfolio, experience with brand identity work, and familiarity with translating business needs into visual systems.",
  },
  {
    icon: Code2,
    title: "Web Developer",
    color: "#B2C9AD",
    tagline: "The builder behind the scenes.",
    description:
      "The Web Developer takes the designer's mockups and builds the functional website. They handle technical aspects including page structure, mobile responsiveness, form functionality, and basic SEO setup, and they ensure the site is easy for the business owner to update independently after handoff.",
    responsibilities: [
      "Build the website using the agreed-upon platform",
      "Implement responsive design across desktop and mobile",
      "Configure contact forms, buttons, and interactive elements",
      "Apply basic on-page SEO settings (titles, descriptions, alt text)",
      "Document how to use and update the site for the business owner",
    ],
    skills: ["HTML/CSS", "CMS platforms (WordPress, Squarespace, Wix)", "Mobile responsiveness", "Basic SEO"],
    studentGain: "A live, public-facing portfolio project, hands-on experience with client-facing technical work, and documentation writing practice.",
  },
  {
    icon: Share2,
    title: "Social Media Strategist",
    color: "#8FAF88",
    tagline: "The strategist behind every post.",
    description:
      "The Social Media Strategist audits the business's existing social media presence, sets up or optimizes profiles on relevant platforms, creates an initial content calendar, writes sample captions, and trains the business owner on how to maintain their presence going forward.",
    responsibilities: [
      "Audit existing social media accounts or set up new ones",
      "Research the business's competitors and audience online",
      "Define a posting strategy and platform priorities",
      "Build a 30-day content calendar with post ideas and captions",
      "Train the business owner on posting, scheduling, and engagement",
    ],
    skills: ["Social media platforms", "Content planning", "Audience research", "Copywriting", "Analytics basics"],
    studentGain: "A documented social media strategy case study, experience training a non-technical client, and platform-specific knowledge valued in marketing roles.",
  },
  {
    icon: PenTool,
    title: "Content Creator",
    color: "#B2C9AD",
    tagline: "The storyteller who brings the business to life.",
    description:
      "The Content Creator is responsible for gathering and producing the actual content that lives on the website and social media: writing copy, sourcing or taking photos, and creating simple graphics using tools like Canva, ensuring everything reflects the business's voice and appeals to their target audience.",
    responsibilities: [
      "Interview the business owner to capture their story and voice",
      "Write all website copy (homepage, about, services, contact pages)",
      "Photograph the business, products, or team (with permission)",
      "Design simple branded graphics using Canva",
      "Create sample social media posts that the owner can build from",
    ],
    skills: ["Writing and editing", "Photography basics", "Canva", "Brand voice", "Storytelling"],
    studentGain: "Published writing and visual content samples, experience with client voice matching, and a content portfolio demonstrating cross-platform work.",
  },
];

function RoleCard({ role, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-md"
    >
      <div className="p-6 md:p-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${role.color}20` }}>
            <role.icon className="w-5 h-5" style={{ color: role.color }} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2D2D2D]">{role.title}</h3>
            <p className="text-sm text-[#6B6B6B] mt-0.5">{role.tagline}</p>
          </div>
        </div>

        <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">{role.description}</p>

        {/* Responsibilities */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-3">Key Responsibilities</h4>
          <ul className="space-y-2">
            {role.responsibilities.map((r, i) => (
              <li key={i} className="flex gap-3 text-sm text-[#4A4A4A]">
                <CheckCircle2 className="w-4 h-4 text-[#B2C9AD] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Skills & gain — 2 column on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-gray-100">
          <div>
            <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#B2C9AD]" aria-hidden="true" />
              Key Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {role.skills.map((s, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-[#EDF3EB] text-[#4A4A4A] rounded-full font-medium">{s}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-[#B2C9AD]" aria-hidden="true" />
              What Students Gain
            </h4>
            <p className="text-xs text-[#6B6B6B] leading-relaxed">{role.studentGain}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function StudentTeams() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="teams-heading">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B2C9AD]/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-4">
                Student-Structured Teams
              </p>
              <h1 id="teams-heading" className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight">
                Every role has a{" "}
                <span className="text-[#8FAF88]">purpose and an owner.</span>
              </h1>
              <p className="mt-5 text-lg text-[#6B6B6B] max-w-xl leading-relaxed">
                Our teams are deliberately structured to mirror real professional environments. Students aren't just helping. They're leading, building, writing, and strategizing with accountability to a real client.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Role breakdown */}
      <section className="py-12 md:py-20 bg-white" aria-labelledby="roles-heading">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 id="roles-heading" className="sr-only">Team Roles</h2>

          {/* Quick overview chips */}
          <div className="flex flex-wrap gap-3 mb-10">
            {roles.map((r) => (
              <div key={r.title} className="flex items-center gap-2 px-4 py-2 bg-[#FAFAF8] border border-gray-100 rounded-full text-sm text-[#4A4A4A] font-medium">
                <r.icon className="w-3.5 h-3.5 text-[#8FAF88]" aria-hidden="true" />
                {r.title}
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {roles.map((role, index) => (
              <RoleCard key={role.title} role={role} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4">
            Interested in joining a team?
          </h2>
          <p className="text-[#6B6B6B] mb-8">
            Apply as a student and tell us which role you're most drawn to. We match students to roles based on interest, skills, and growth goals.
          </p>
          <Link
            to={createPageUrl("GetInvolved")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#B2C9AD]/25"
          >
            Apply as a Student
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}