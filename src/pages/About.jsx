import React from "react";
import { motion } from "framer-motion";
import { Target, Lightbulb, Users, Shield, BookOpen, TrendingUp, Handshake } from "lucide-react";
import CTABanner from "../components/shared/CTABanner";

const highlights = [
  {
    icon: Users,
    title: "Structured Student Teams",
    description: "Each team has defined roles across project management, web design, development, and content creation to mirror professional environments.",
  },
  {
    icon: Target,
    title: "Tailored Needs Assessment",
    description: "Every business undergoes a thorough needs assessment so all work is customized to their specific goals and audience.",
  },
  {
    icon: BookOpen,
    title: "Digital Literacy Curriculum",
    description: "We provide video tutorials, written guides, and reference materials so business owners can confidently manage their digital platforms.",
  },
  {
    icon: TrendingUp,
    title: "Follow-Up Workshops",
    description: "Ongoing workshops help businesses stay current as tools and platforms evolve, ensuring lasting digital independence.",
  },
  {
    icon: Shield,
    title: "Measurable Outcomes",
    description: "We track website traffic growth and social media engagement, publishing results alongside testimonials to demonstrate impact.",
  },
  {
    icon: Handshake,
    title: "Community Partnerships",
    description: "Local technology professionals serve as mentors, and grants focused on digital equity and youth education support our mission.",
  },
];

export default function About() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="about-heading">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B2C9AD]/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-4">
                About Us
              </p>
              <h1 id="about-heading" className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight">
                Bridging the digital divide,{" "}
                <span className="text-[#8FAF88]">one business at a time</span>
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 md:py-28 bg-white" aria-labelledby="mission-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EDF3EB] flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-[#8FAF88]" aria-hidden="true" />
                </div>
                <h2 id="mission-heading" className="text-2xl font-bold text-[#2D2D2D]">Our Mission</h2>
              </div>
              <p className="text-[#6B6B6B] leading-relaxed">
                We believe every small business deserves a professional digital presence,
                and every student deserves real-world experience that prepares them for the future.
              </p>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-[#FAFAF8] rounded-2xl p-8 md:p-10 border border-gray-100">
                <p className="text-[#4A4A4A] leading-[1.8] text-base">
                  We are a non-profit organization that connects high school and college students
                  with local small businesses to build professional websites and social media presences.
                  Student teams are structured with defined roles across project management, web design,
                  development, and content creation, and each business undergoes a needs assessment to
                  ensure all work is tailored to their specific goals.
                </p>
                <p className="text-[#4A4A4A] leading-[1.8] text-base mt-4">
                  Beyond the technical deliverables, we equip business owners with a Digital Literacy
                  Curriculum including video tutorials, written guides, and reference materials, so they
                  can confidently manage their digital platforms independently. Follow-up workshops are
                  offered to help businesses stay current as tools and platforms evolve.
                </p>
                <p className="text-[#4A4A4A] leading-[1.8] text-base mt-4">
                  We track key outcomes such as website traffic growth and social media engagement, and
                  regularly publish these results alongside participant testimonials to demonstrate our
                  community impact. Our work is supported through grants focused on digital equity, small
                  business development, and youth education, as well as partnerships with local technology
                  professionals who serve as mentors and lend credibility to our mission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-20 md:py-28 bg-[#FAFAF8]" aria-labelledby="highlights-heading">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-3">
              What Makes Us Different
            </p>
            <h2 id="highlights-heading" className="text-3xl md:text-4xl font-bold text-[#2D2D2D] tracking-tight">
              Our Approach
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="bg-white rounded-2xl p-8 border border-gray-100 hover:border-[#D4E4D0] transition-all duration-300 hover:shadow-lg group"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EDF3EB] group-hover:bg-[#B2C9AD] flex items-center justify-center transition-colors duration-300 mb-5">
                  <item.icon className="w-5 h-5 text-[#8FAF88] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-[#2D2D2D] mb-2">{item.title}</h3>
                <p className="text-sm text-[#6B6B6B] leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Join Our Mission"
        description="We're always looking for passionate students, supportive businesses, and community partners to help us grow."
      />
    </div>
  );
}