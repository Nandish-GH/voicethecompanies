import React from "react";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";

export default function StatsSection() {
  return (
    <section className="py-20 md:py-24 bg-[#2D2D2D]" aria-labelledby="stats-heading">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-14 h-14 rounded-2xl bg-[#B2C9AD]/20 flex items-center justify-center mx-auto mb-6">
            <Rocket className="w-6 h-6 text-[#B2C9AD]" aria-hidden="true" />
          </div>
          <h2 id="stats-heading" className="text-2xl md:text-3xl font-bold text-white mb-4">
            We're just getting started.
          </h2>
          <p className="text-gray-400 text-lg leading-relaxed">
            Our program is newly launched and actively taking on its first cohort of businesses and student teams.
            Real outcomes data will be published here as our projects complete — transparently and in full.
          </p>
        </motion.div>
      </div>
    </section>
  );
}