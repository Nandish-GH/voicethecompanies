import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Quote, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { localClient } from "@/api/localClient";

export default function TestimonialsPreview() {
  const { data: testimonials = [] } = useQuery({
    queryKey: ["testimonials-preview"],
    queryFn: () => localClient.entities.Testimonial.list("-created_date"),
    initialData: [],
  });

  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <section className="py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="testimonials-heading">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-3">
              Voices of Impact
            </p>
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl font-bold text-[#2D2D2D] tracking-tight">
              What People Are Saying
            </h2>
          </div>
          <Link
            to={createPageUrl("Impact")}
            className="inline-flex items-center gap-2 text-[#8FAF88] hover:text-[#6B9563] font-semibold text-sm transition-colors"
          >
            View All Impact Stories
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        {featuredTestimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featuredTestimonials.map((testimonial, index) => (
              <motion.blockquote
                key={testimonial.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                <Quote className="w-8 h-8 text-[#D4E4D0] mb-4 flex-shrink-0" aria-hidden="true" />
                <p className="text-[#4A4A4A] text-sm leading-relaxed flex-1">
                  "{testimonial.quote}"
                </p>
                <footer className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-semibold text-[#2D2D2D] text-sm">{testimonial.author_name}</p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">
                    {testimonial.business_name || (testimonial.role === "student" ? "Student" : "Business Owner")}
                  </p>
                </footer>
              </motion.blockquote>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center">
            <p className="text-sm font-semibold text-[#2D2D2D]">Testimonials will be published as each cohort completes projects.</p>
            <p className="text-sm text-[#6B6B6B] mt-2">Check back soon for verified stories from participating students and business owners.</p>
          </div>
        )}
      </div>
    </section>
  );
}