import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white" aria-labelledby="hero-heading">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#B2C9AD]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#B2C9AD]/8 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-36 lg:py-44">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDF3EB] text-[#4A4A4A] text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4 text-[#8FAF88]" aria-hidden="true" />
              Empowering communities through digital equity
            </div>
          </motion.div>

          <motion.h1
            id="hero-heading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight"
          >
            Students build websites.{" "}
            <span className="text-[#8FAF88]">
              Small businesses thrive.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-[#6B6B6B] leading-relaxed max-w-2xl"
          >
            We connect high school and college students with local small businesses
            to build professional websites and social media presences — creating
            real-world experience and lasting community impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Link
              to={createPageUrl("GetInvolved")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-[#B2C9AD]/25 hover:shadow-xl hover:shadow-[#B2C9AD]/30 text-base"
            >
              Get Involved
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              to={createPageUrl("About")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-[#D4E4D0] hover:border-[#B2C9AD] text-[#2D2D2D] font-semibold rounded-xl transition-all duration-200 text-base"
            >
              Learn More
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}