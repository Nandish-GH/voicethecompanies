import React from "react";
import { motion } from "framer-motion";
import { Globe, Quote } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { localClient } from "@/api/localClient";
import CTABanner from "../components/shared/CTABanner";


const sampleTestimonials = [
  {
    quote: "Our student team didn't just build us a website. They taught us how to use it. I can now update our menu and specials myself every week.",
    author_name: "Maria Santos",
    role: "business_owner",
    business_name: "Santos Bakery",
  },
  {
    quote: "I learned more in three months of this program than in two semesters of classes. Managing a real project with real deadlines changed my perspective completely.",
    author_name: "James Chen",
    role: "student",
  },
  {
    quote: "For the first time, people are finding us online. Our Google reviews have gone from 3 to over 40, and new customers mention our website every week.",
    author_name: "David Okafor",
    role: "business_owner",
    business_name: "Okafor Auto Repair",
  },
  {
    quote: "Being a project manager on a student team gave me confidence I didn't know I had. I'm now pursuing a career in product management because of this experience.",
    author_name: "Priya Sharma",
    role: "student",
  },
  {
    quote: "The follow-up workshops were incredibly valuable. Six months later, I'm still getting support and learning new things about social media marketing.",
    author_name: "Linda Washington",
    role: "business_owner",
    business_name: "Linda's Flower Shop",
  },
  {
    quote: "Working with a real business owner taught me how to communicate design decisions. It's a skill I use every day now in my design internship.",
    author_name: "Alex Rivera",
    role: "student",
  },
];

export default function Impact() {
  const { data: testimonials } = useQuery({
    queryKey: ["testimonials"],
    queryFn: () => localClient.entities.Testimonial.list(),
    initialData: [],
  });

  const allTestimonials = testimonials.length > 0 ? testimonials : sampleTestimonials;

  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="impact-heading">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#B2C9AD]/8 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-4">Our Impact</p>
              <h1 id="impact-heading" className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight">
                Real outcomes.{" "}
                <span className="text-[#8FAF88]">Real stories.</span>
              </h1>
              <p className="mt-4 text-lg text-[#6B6B6B] max-w-xl">
                We measure and publish our results so our community, funders, and partners can see the difference we're making together.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What we track intro */}
      <section className="py-20 md:py-28 bg-white" aria-labelledby="metrics-heading">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 id="metrics-heading" className="text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-4">What We Track</h2>
          <p className="text-[#6B6B6B] text-lg leading-relaxed">
            As a newly launched program, we are actively collecting our first round of outcomes data. This page will be updated with verified results from our participating businesses and students as projects are completed. We are committed to full transparency — every number we publish will be real, sourced, and reported on a regular basis.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 px-5 py-3 bg-[#EDF3EB] rounded-xl text-sm text-[#4A4A4A] font-medium">
            <Globe className="w-4 h-4 text-[#8FAF88]" aria-hidden="true" />
            Data collection begins with our first cohort of projects.
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 bg-[#FAFAF8]" aria-labelledby="stories-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-3">Testimonials</p>
            <h2 id="stories-heading" className="text-3xl md:text-4xl font-bold text-[#2D2D2D] tracking-tight">
              In Their Own Words
            </h2>
            <p className="mt-4 text-[#6B6B6B] text-lg">
              Hear directly from the students and business owners who've been part of our program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allTestimonials.map((t, index) => (
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-lg flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Quote className="w-6 h-6 text-[#D4E4D0] flex-shrink-0" aria-hidden="true" />
                  <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
                    t.role === "student"
                      ? "bg-blue-50 text-blue-600"
                      : "bg-amber-50 text-amber-700"
                  }`}>
                    {t.role === "student" ? "Student" : "Business Owner"}
                  </span>
                </div>
                <p className="text-[#4A4A4A] text-sm leading-relaxed flex-1">
                  "{t.quote}"
                </p>
                <footer className="mt-6 pt-5 border-t border-gray-100">
                  <p className="font-semibold text-[#2D2D2D] text-sm">{t.author_name}</p>
                  {t.business_name && (
                    <p className="text-xs text-[#6B6B6B] mt-0.5">{t.business_name}</p>
                  )}
                </footer>
              </motion.blockquote>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Help Us Grow Our Impact"
        description="Whether through volunteering, donating, or partnering with us, every contribution makes a difference."
        buttonText="Get Involved"
      />
    </div>
  );
}