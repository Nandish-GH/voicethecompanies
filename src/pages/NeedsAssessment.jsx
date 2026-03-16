import React from "react";
import { motion } from "framer-motion";
import {
  Building2, Target, Laptop, Palette, Info, CheckCircle2, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const categories = [
  {
    icon: Building2,
    number: "01",
    title: "Business Background",
    description:
      "We start by learning who you are and where you currently stand online. This helps us understand your context before making any recommendations.",
    questions: [
      { q: "Business name and industry", note: "Helps us tailor the project to your sector's norms and audience." },
      { q: "Years in operation", note: "Longer-established businesses often have brand recognition to build on; newer ones may need to build from scratch." },
      { q: "Target customer demographic", note: "Age, location, and lifestyle inform platform choices and design decisions." },
      { q: "Do you currently have a website?", note: "If yes, we review it before the project begins. If no, we start fresh." },
      { q: "Are you active on social media? Which platforms?", note: "We audit existing accounts rather than starting over when possible." },
      { q: "Do you have a Google Business listing?", note: "One of the most impactful free tools for local visibility." },
    ],
  },
  {
    icon: Target,
    number: "02",
    title: "Goals & Vision",
    description:
      "Understanding what success looks like for you is the most important part of the assessment. We don't assume. We ask.",
    questions: [
      { q: "What do you hope to achieve through this program?", note: "Examples include more foot traffic, online sales, brand awareness, or community visibility." },
      { q: "What does success look like to you in six months?", note: "This becomes a benchmark for our impact tracking." },
      { q: "Are there specific outcomes you want to avoid?", note: "Sometimes it's just as important to know what you're not aiming for." },
      { q: "Do you have a timeline or seasonal urgency?", note: "A bakery launching before the holidays needs a different timeline than a year-round service business." },
    ],
  },
  {
    icon: Laptop,
    number: "03",
    title: "Technical Capacity",
    description:
      "We design every project around your real-world ability to maintain it afterward. There's no point building something you can't use.",
    questions: [
      { q: "What devices do you use regularly? (phone, tablet, laptop, desktop)", note: "Affects how we build and optimize the site." },
      { q: "What software or apps are you comfortable using?", note: "Helps us choose tools you'll actually adopt." },
      { q: "Do you have existing login credentials for any platforms?", note: "Prevents duplicate accounts and messy ownership issues." },
      { q: "Who on your team will manage digital platforms after the project ends?", note: "We train whoever is responsible, not just the business owner." },
      { q: "How much time per week can you realistically dedicate to your online presence?", note: "Informs our recommendations for content cadence and platform complexity." },
    ],
  },
  {
    icon: Palette,
    number: "04",
    title: "Design & Brand Preferences",
    description:
      "Your online presence should feel like you. We gather visual and tonal preferences to make sure the final product reflects your business authentically.",
    questions: [
      { q: "Do you have an existing logo or brand colors?", note: "If yes, we build around them. If no, our designer can develop a simple brand identity." },
      { q: "What tone do you want your online presence to reflect?", note: "Examples: professional, casual, community-focused, playful, premium, approachable." },
      { q: "Are there any websites or social media pages you admire?", note: "Reference examples save hours of guesswork and ensure alignment." },
      { q: "Are there any design styles or approaches you strongly dislike?", note: "Equally useful for guiding the team." },
    ],
  },
];

export default function NeedsAssessment() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="assessment-heading">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#B2C9AD]/8 rounded-full blur-3xl -translate-x-1/4 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-4">
                Tailored Needs Assessment
              </p>
              <h1 id="assessment-heading" className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight">
                We don't assume.{" "}
                <span className="text-[#8FAF88]">We ask first.</span>
              </h1>
              <p className="mt-5 text-lg text-[#6B6B6B] max-w-xl leading-relaxed">
                Every participating business completes a structured intake process before any student team is assigned. This ensures every project is scoped, designed, and built around your specific situation and goals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Intro banner */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="flex gap-4 p-6 bg-[#EDF3EB] rounded-2xl border border-[#D4E4D0]">
            <Info className="w-5 h-5 text-[#8FAF88] flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-[#4A4A4A] leading-relaxed">
              <strong>How it works:</strong> After a business submits a service request, our program coordinators review the intake form and schedule a short conversation to complete the needs assessment. Responses are used to match the business with the right student team and to define the project scope before any work begins. Nothing is assumed. Everything is confirmed with you directly.
            </p>
          </div>
        </div>
      </section>

      {/* Assessment Categories */}
      <section className="py-12 md:py-20 bg-white" aria-labelledby="assessment-categories-heading">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 id="assessment-categories-heading" className="sr-only">Assessment Categories</h2>
          <div className="space-y-6">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: index * 0.07 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-md"
              >
                {/* Card header */}
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#EDF3EB] flex items-center justify-center">
                    <cat.icon className="w-5 h-5 text-[#8FAF88]" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-[#B2C9AD] tracking-widest uppercase">Section {cat.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#2D2D2D]">{cat.title}</h3>
                    <p className="text-sm text-[#6B6B6B] mt-1 leading-relaxed">{cat.description}</p>
                  </div>
                </div>

                {/* Questions */}
                <div className="p-6 md:p-8">
                  <ul className="space-y-4">
                    {cat.questions.map((item, qi) => (
                      <li key={qi} className="flex gap-3">
                        <CheckCircle2 className="w-4 h-4 text-[#B2C9AD] flex-shrink-0 mt-1" aria-hidden="true" />
                        <div>
                          <p className="text-sm font-semibold text-[#2D2D2D]">{item.q}</p>
                          <p className="text-xs text-[#6B6B6B] mt-0.5 leading-relaxed">{item.note}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4">
            Ready to request services for your business?
          </h2>
          <p className="text-[#6B6B6B] mb-8 leading-relaxed">
            Submit a service request and we'll reach out to schedule your needs assessment. The entire process is free, conversational, and takes less than an hour.
          </p>
          <Link
            to={createPageUrl("GetInvolved")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#B2C9AD]/25 hover:shadow-xl"
          >
            Request Services
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}