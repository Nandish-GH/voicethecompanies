import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle, BarChart2, RefreshCw, Star,
  Calendar, MapPin, Video, Users, CheckCircle2, ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { localClient } from "@/api/localClient";

const workshops = [
  {
    icon: MessageCircle,
    timing: "1 Month After Completion",
    badge: "Workshop 1",
    title: "Post-Launch Check-In",
    description:
      "Your project is live. Now what? This session gives business owners a dedicated space to ask questions, troubleshoot anything that's come up since launch, and get personalized guidance from their student team or a program mentor.",
    agenda: [
      "Review the live website and social media pages together",
      "Address any questions about updating content or posting",
      "Troubleshoot any technical issues encountered since launch",
      "Confirm login access and tool familiarity",
      "Set a simple 30-day digital maintenance checklist",
    ],
    format: "Virtual or In-Person",
    formatIcon: Video,
    duration: "20 minutes",
    available: true,
  },
  {
    icon: BarChart2,
    timing: "3 Months After Completion",
    badge: "Workshop 2",
    title: "Analytics Review",
    description:
      "Data is only useful if you understand it. In this session, owners review real analytics from their own platforms with guided interpretation, understanding what's working, what to adjust, and how to act on the numbers.",
    agenda: [
      "Review the first 90 days of website traffic in Google Analytics",
      "Review social media reach, engagement, and follower growth",
      "Compare results to the goals set during the needs assessment",
      "Identify one or two simple improvements to act on",
      "Introduce the concept of a monthly analytics habit",
    ],
    format: "Virtual",
    formatIcon: Video,
    duration: "30 minutes",
    available: true,
  },
  {
    icon: RefreshCw,
    timing: "6 Months After Completion",
    badge: "Workshop 3",
    title: "Platform Updates",
    description:
      "Digital tools change constantly. This session ensures businesses are never left behind by major updates to platforms like Instagram, Google Business, or their website builder. We cover what changed and how to adapt.",
    agenda: [
      "Review any major platform or algorithm changes since the project launch",
      "Walk through updated interface features in Instagram, Facebook, or Google Business",
      "Check for any website builder or plugin updates that require attention",
      "Discuss new content formats or features worth adopting",
      "Q&A and open troubleshooting",
    ],
    format: "Hybrid (In-Person + Virtual)",
    formatIcon: MapPin,
    duration: "45 minutes",
    available: true,
  },
];

function WorkshopCard({ workshop, index }) {
  const [interested, setInterested] = useState(false);
  const [collectingEmail, setCollectingEmail] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleInterest = async () => {
    const email = emailInput.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");

    try {
      await localClient.integrations.Core.SendEmail({
        to: "2009nandish@gmail.com",
        subject: `Workshop Interest: ${workshop.title}`,
        body: `${email} is interested in this workshop.\n\nWorkshop: ${workshop.title}\nTiming: ${workshop.timing}\nFormat: ${workshop.format}\nDuration: ${workshop.duration}`,
      });

      await localClient.entities.WorkshopInterest.create({
        name: email.split("@")[0],
        email,
        subject: `Workshop Interest - ${workshop.title}`,
        message: `${email} is interested in ${workshop.title} (${workshop.timing}).`,
        inquiry_type: "workshop",
        workshop_title: workshop.title,
        workshop_timing: workshop.timing,
        workshop_format: workshop.format,
        workshop_duration: workshop.duration,
        status: "new",
      });

      setInterested(true);
      setCollectingEmail(false);
      setEmailInput("");
    } catch (error) {
      setSubmitError(error?.message || "Could not send your interest right now.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-md"
    >
      <div className="p-6 md:p-8">
        {/* Header row */}
        <div className="flex items-start gap-5 mb-6">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#EDF3EB] flex items-center justify-center">
            <workshop.icon className="w-5 h-5 text-[#8FAF88]" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold text-[#B2C9AD] tracking-widest uppercase">{workshop.badge}</span>
              <span className="text-xs text-[#6B6B6B] px-2 py-0.5 bg-[#FAFAF8] border border-gray-100 rounded-full flex items-center gap-1">
                <Calendar className="w-3 h-3" aria-hidden="true" />
                {workshop.timing}
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#2D2D2D]">{workshop.title}</h3>
          </div>
        </div>

        <p className="text-sm text-[#4A4A4A] leading-relaxed mb-6">{workshop.description}</p>

        {/* Agenda */}
        <div className="mb-6">
          <h4 className="text-xs font-bold text-[#2D2D2D] uppercase tracking-wider mb-3">What We Cover</h4>
          <ul className="space-y-2">
            {workshop.agenda.map((item, i) => (
              <li key={i} className="flex gap-3 text-sm text-[#4A4A4A]">
                <CheckCircle2 className="w-4 h-4 text-[#B2C9AD] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Meta + button row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-5 border-t border-gray-100">
          <div className="flex flex-wrap gap-4 text-xs text-[#6B6B6B]">
            <span className="flex items-center gap-1.5">
              <workshop.formatIcon className="w-3.5 h-3.5 text-[#B2C9AD]" aria-hidden="true" />
              {workshop.format}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#B2C9AD]" aria-hidden="true" />
              {workshop.duration}
            </span>
          </div>
          {!interested ? (
            collectingEmail ? (
              <div className="flex w-full sm:w-auto items-center gap-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@email.com"
                  className="min-w-0 w-full sm:w-56 h-10 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#B2C9AD]"
                  disabled={submitting}
                />
                <button
                  onClick={handleInterest}
                  disabled={submitting}
                  className="h-10 px-4 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send"}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setSubmitError("");
                  setCollectingEmail(true);
                }}
                className="flex-shrink-0 px-5 py-2.5 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-xl text-sm transition-colors"
              >
                I'm Interested
              </button>
            )
          ) : (
            <div className="flex items-center gap-2 text-sm text-[#8FAF88] font-semibold">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
              Interest sent!
            </div>
          )}
        </div>
        {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}
      </div>
    </motion.div>
  );
}

export default function Workshops() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="workshops-heading">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B2C9AD]/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-4">
                Follow-Up Workshops
              </p>
              <h1 id="workshops-heading" className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight">
                Our support doesn't{" "}
                <span className="text-[#8FAF88]">stop at launch.</span>
              </h1>
              <p className="mt-5 text-lg text-[#6B6B6B] max-w-xl leading-relaxed">
                Every business we work with receives ongoing support through four structured workshops over the course of a year. We believe in long-term digital independence, not one-time drop-offs.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Timeline overview */}
      <section className="py-10 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {workshops.map((w, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-[#FAFAF8] border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#EDF3EB] flex items-center justify-center mx-auto mb-2">
                  <w.icon className="w-4 h-4 text-[#8FAF88]" aria-hidden="true" />
                </div>
                <p className="text-xs font-bold text-[#8FAF88] uppercase tracking-wider">{w.badge}</p>
                <p className="text-xs text-[#6B6B6B] mt-1">{w.timing}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Cards */}
      <section className="py-12 md:py-20 bg-white" aria-labelledby="workshop-list-heading">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 id="workshop-list-heading" className="sr-only">Workshop Details</h2>
          <div className="space-y-6">
            {workshops.map((w, i) => (
              <WorkshopCard key={i} workshop={w} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-[#FAFAF8]">
        <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4">
            Already a program alumnus?
          </h2>
          <p className="text-[#6B6B6B] mb-8">
            Reach out directly to register for an upcoming workshop or request a project refresh consultation.
          </p>
          <Link
            to={createPageUrl("Partners")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#B2C9AD]/25"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}