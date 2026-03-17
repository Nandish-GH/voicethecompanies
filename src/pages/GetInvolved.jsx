import React, { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Store } from "lucide-react";
import StudentForm from "../components/forms/StudentForm";
import BusinessForm from "../components/forms/BusinessForm";

const tracks = [
  {
    id: "student",
    icon: GraduationCap,
    title: "I'm a Student",
    subtitle: "Apply to join a project team",
    description: "Gain real-world experience in web design, development, project management, or content creation while helping local businesses grow.",
  },
  {
    id: "business",
    icon: Store,
    title: "I'm a Business Owner",
    subtitle: "Request digital services",
    description: "Get a professional website and social media presence built by a talented student team, completely free of charge.",
  },
];

export default function GetInvolved() {
  const [activeTrack, setActiveTrack] = useState(null);

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="involved-heading">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#B2C9AD]/8 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-4">
                Get Involved
              </p>
              <h1 id="involved-heading" className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight">
                Ready to make a difference?
              </h1>
              <p className="mt-4 text-lg text-[#6B6B6B] max-w-xl mx-auto">
                Choose your path below. Whether you're a student or a business owner, there's a place for you in our community.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Track Selection */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {/* Track Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {tracks.map((track, index) => (
              <motion.button
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                onClick={() => setActiveTrack(track.id)}
                className={`text-left p-8 rounded-2xl border-2 transition-all duration-300 group ${
                  activeTrack === track.id
                    ? "border-[#B2C9AD] bg-[#EDF3EB]/50 shadow-lg"
                    : "border-gray-100 hover:border-[#D4E4D0] hover:shadow-md bg-white"
                }`}
                aria-pressed={activeTrack === track.id}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                  activeTrack === track.id ? "bg-[#B2C9AD]" : "bg-[#EDF3EB] group-hover:bg-[#D4E4D0]"
                }`}>
                  <track.icon className={`w-6 h-6 transition-colors duration-300 ${
                    activeTrack === track.id ? "text-white" : "text-[#8FAF88]"
                  }`} aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2D2D] mb-1">{track.title}</h3>
                <p className="text-sm font-medium text-[#8FAF88] mb-3">{track.subtitle}</p>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{track.description}</p>
              </motion.button>
            ))}
          </div>

          {/* Form */}
          {activeTrack && (
            <motion.div
              key={activeTrack}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">
                {activeTrack === "student" ? "Student Application" : "Business Service Request"}
              </h2>
              <p className="text-sm text-[#6B6B6B] mb-6">
                Prefer email? Contact us directly at{" "}
                <a
                  href={`mailto:2009nandish@gmail.com?subject=${encodeURIComponent(
                    activeTrack === "student" ? "Student Application" : "Business Service Request"
                  )}`}
                  className="text-[#8FAF88] font-semibold underline underline-offset-4 hover:text-[#6F8F68]"
                >
                  2009nandish@gmail.com
                </a>
                .
              </p>
              {activeTrack === "student" ? <StudentForm /> : <BusinessForm />}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}