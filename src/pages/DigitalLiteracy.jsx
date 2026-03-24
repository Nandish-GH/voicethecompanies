import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor, Instagram, Camera, BarChart2, ShieldCheck,
  ChevronDown, ChevronUp, CheckCircle2, FileText, BookOpen
} from "lucide-react";
import CTABanner from "../components/shared/CTABanner";

const lessons = [
  {
    number: "01",
    icon: Monitor,
    title: "Website Ownership Basics",
    tagline: "Understand what you own and how to use it.",
    description:
      "Learn how to confidently log into your website dashboard, understand the difference between hosting and a domain, and make simple text or image edits without worrying about breaking anything.",
    steps: [
      "Log into your website platform (WordPress, Squarespace, Wix, etc.) using your credentials.",
      "Understand the difference between your domain name (your web address) and your hosting (where your files live).",
      "Navigate the dashboard: find where pages, posts, images, and settings are located.",
      "Make a simple text edit: update a phone number, address, or business hour without fear.",
      "Replace or update an image using the media library.",
      "Learn what not to touch (plugin settings, theme files, and advanced configurations).",
      "Set a reminder to change your password every 90 days and keep login credentials in a secure place.",
    ],
    takeaways: [
      "Your website is yours. You have the right to edit it.",
      "Most dashboards are designed for non-technical users.",
      "Small edits rarely break anything when done through the admin panel.",
      "Backing up before big changes gives you a safety net.",
    ],
    guide: "Website Basics Cheat Sheet",
    guidePath: "/digital-literacy/website-ownership-basics.html",
    quiz: [
      {
        question: "What is a domain name?",
        options: [
          "The company that stores your website files",
          "Your website's address on the internet",
          "Your website's admin password",
          "The design template of your website",
        ],
        answer: 1,
      },
      {
        question: "Where do you go to update your business address on a website?",
        options: [
          "Your hosting provider's billing page",
          "The website's admin dashboard or page editor",
          "Google Search Console",
          "Your domain registrar",
        ],
        answer: 1,
      },
      {
        question: "What should you do before making major changes to your website?",
        options: [
          "Delete old content first",
          "Contact your hosting company",
          "Create a backup of your site",
          "Nothing, changes are always reversible",
        ],
        answer: 2,
      },
    ],
  },
  {
    number: "02",
    icon: Instagram,
    title: "Social Media Fundamentals",
    tagline: "Set up, claim, and show up consistently.",
    description:
      "Learn how to set up or claim your business profiles on Instagram, Facebook, and Google Business, write a bio that makes people want to learn more, and post consistently with a simple content calendar.",
    steps: [
      "Search for your business on Instagram, Facebook, and Google. It may already exist and need to be claimed.",
      "Set up a Business Account (not a personal one) on each platform.",
      "Write a clear bio: who you are, what you do, and how to contact you. Keep it under 150 characters.",
      "Add a profile photo (your logo or a clear photo of your storefront or product).",
      "Link all platforms to each other and to your website.",
      "Download the free content calendar template and plan just 3 posts per week to start.",
      "Use scheduling tools like Meta Business Suite to post in advance so you're never scrambling.",
    ],
    takeaways: [
      "Consistency matters more than volume. 3 posts a week beats 10 posts one week and nothing the next.",
      "Your bio is your first impression. Make it specific and clear.",
      "Google Business is often overlooked but drives significant local foot traffic.",
      "You don't need to be on every platform. Start with the two where your customers spend time.",
    ],
    guide: "Social Media Setup Checklist",
    guidePath: "/digital-literacy/social-media-fundamentals.html",
    quiz: [
      {
        question: "What type of account should a business set up on Instagram?",
        options: [
          "A personal account using the owner's name",
          "A creator account",
          "A business account",
          "A private account",
        ],
        answer: 2,
      },
      {
        question: "How many posts per week is a sustainable starting point for most small businesses?",
        options: ["10 or more", "7", "3", "1 per month"],
        answer: 2,
      },
      {
        question: "What does a compelling bio include?",
        options: [
          "A long history of the business",
          "Who you are, what you do, and how to contact you",
          "A list of all your products",
          "Your personal social media handles",
        ],
        answer: 1,
      },
    ],
  },
  {
    number: "03",
    icon: Camera,
    title: "Content Creation Basics",
    tagline: "Create content that looks great without expensive equipment.",
    description:
      "Learn how to take good photos with your smartphone, write short captions that sound like you, and use the free design tool Canva to create simple, professional-looking graphics.",
    steps: [
      "Clean your phone lens before every photo session. It makes a bigger difference than you'd think.",
      "Use natural light whenever possible: shoot near a window or outside during the day.",
      "Follow the rule of thirds: don't always center your subject. Place it slightly off-center for a more professional look.",
      "Take 10 photos of the same thing and choose the best one.",
      "Create a free Canva account at canva.com and explore the Social Media Post templates.",
      "Write captions that start with a hook (a question, a fact, or a bold statement) and end with a call to action.",
      "Keep a folder on your phone of approved brand assets: logo, colors, and approved fonts.",
    ],
    takeaways: [
      "Good lighting is the single most impactful improvement you can make to your photos.",
      "Your caption voice should sound like your business. Don't try to sound like a big corporation.",
      "Canva's free tier has everything most small businesses need.",
      "Batch your content creation: make a week's worth of posts in one 30-minute session.",
    ],
    guide: "Content Creation Quick-Start Guide",
    guidePath: "/digital-literacy/content-creation-basics.html",
    quiz: [
      {
        question: "What is the most important factor in taking a good photo?",
        options: [
          "Having an expensive camera",
          "Using a professional photographer",
          "Good natural lighting",
          "A high follower count",
        ],
        answer: 2,
      },
      {
        question: "What is Canva used for?",
        options: [
          "Editing your website code",
          "Scheduling social media posts",
          "Creating simple graphics and visual content",
          "Analyzing your website traffic",
        ],
        answer: 2,
      },
      {
        question: "A good social media caption should:",
        options: [
          "Be as long as possible with lots of hashtags",
          "Start with a hook and end with a call to action",
          "Only include product prices",
          "Always be written in formal, corporate language",
        ],
        answer: 1,
      },
    ],
  },
  {
    number: "04",
    icon: BarChart2,
    title: "Understanding Website Analytics",
    tagline: "Turn data into simple, confident decisions.",
    description:
      "Learn how to read basic Google Analytics or platform dashboard data, understand what metrics like sessions, bounce rate, and reach actually mean, and use that information to make simple improvements.",
    steps: [
      "Log into Google Analytics (analytics.google.com) or your platform's built-in stats dashboard.",
      "Find the 'Sessions' or 'Visits' report. This tells you how many times people visited your site.",
      "Find 'Unique Visitors'. This tells you how many individual people came, not how many total visits.",
      "Look at 'Bounce Rate'. A high bounce rate means people leave quickly. Consider improving your homepage message.",
      "Check 'Average Time on Page'. Longer is generally better. It means people are reading.",
      "On social media, look at 'Reach' (how many people saw it) compared to 'Engagement' (how many interacted).",
      "Set a monthly habit: spend 15 minutes reviewing these numbers and note one thing to try next month.",
    ],
    takeaways: [
      "Sessions = visits. Unique visitors = individual people.",
      "A high bounce rate isn't always bad. It depends on the page type.",
      "Trending up over time matters more than any single day's numbers.",
      "Analytics are most useful when compared month-over-month, not day-to-day.",
    ],
    guide: "Analytics Glossary & Reference Card",
    quiz: [
      {
        question: "What does 'bounce rate' measure?",
        options: [
          "How fast your website loads",
          "The percentage of visitors who leave after viewing only one page",
          "How many people click your contact button",
          "How many followers you gain per month",
        ],
        answer: 1,
      },
      {
        question: "What is the difference between 'sessions' and 'unique visitors'?",
        options: [
          "They are the same thing",
          "Sessions count total visits; unique visitors count individual people",
          "Unique visitors counts total visits; sessions count individuals",
          "Sessions only count mobile users",
        ],
        answer: 1,
      },
      {
        question: "How often should a business owner review their analytics?",
        options: [
          "Every hour",
          "Only when something goes wrong",
          "Once a month, consistently",
          "Once a year is enough",
        ],
        answer: 2,
      },
    ],
  },
  {
    number: "05",
    icon: ShieldCheck,
    title: "Digital Security & Maintenance",
    tagline: "Keep your digital presence safe and up to date.",
    description:
      "Learn how to update passwords safely, recognize phishing attempts, keep your website plugins and software updated, and back up your site so your hard work is never at risk.",
    steps: [
      "Change your website and social media passwords to something unique and at least 12 characters long.",
      "Use a free password manager (like Bitwarden or the one built into your phone) to store credentials securely.",
      "Enable two-factor authentication (2FA) on every platform that offers it.",
      "Learn to recognize phishing emails: look for urgency, misspelled domains, and requests for your password.",
      "Log into your website at least once a month to check for and apply any available updates.",
      "Install a backup plugin or use your platform's built-in backup feature. Set it to automatic weekly backups.",
      "Audit who has access to your accounts every six months. Remove anyone who no longer needs it.",
    ],
    takeaways: [
      "A unique password for every account is the single most important security habit.",
      "Two-factor authentication stops most account takeover attempts.",
      "Outdated plugins are the most common way websites get hacked.",
      "A backup is only useful if it's recent. Automate it.",
    ],
    guide: "Security Checklist & Maintenance Calendar",
    quiz: [
      {
        question: "What is two-factor authentication (2FA)?",
        options: [
          "Having two different passwords for the same account",
          "A second verification step beyond your password to confirm your identity",
          "Sharing your login with two people",
          "A type of website backup system",
        ],
        answer: 1,
      },
      {
        question: "What is a common sign of a phishing email?",
        options: [
          "It comes from a familiar company",
          "It has a clear subject line",
          "It creates urgency and asks you to click a link or enter your password",
          "It includes your name in the greeting",
        ],
        answer: 2,
      },
      {
        question: "Why should you keep your website plugins updated?",
        options: [
          "Updates change the design of your website",
          "Outdated plugins are a common security vulnerability",
          "Updates are only necessary for large businesses",
          "Plugins don't affect security",
        ],
        answer: 1,
      },
    ],
  },
];

function QuizSection({ quiz }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const score = submitted
    ? quiz.filter((q, i) => answers[i] === q.answer).length
    : 0;

  return (
    <div className="mt-8 bg-[#FAFAF8] rounded-2xl p-6 border border-gray-100">
      <h4 className="text-base font-bold text-[#2D2D2D] mb-5 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#8FAF88]" aria-hidden="true" />
        Knowledge Check
      </h4>
      <div className="space-y-6">
        {quiz.map((q, qi) => (
          <div key={qi}>
            <p className="text-sm font-semibold text-[#2D2D2D] mb-3">
              {qi + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                const isCorrect = oi === q.answer;
                let style = "border-gray-200 hover:border-[#B2C9AD] bg-white";
                if (submitted) {
                  if (isCorrect) style = "border-[#B2C9AD] bg-[#EDF3EB]";
                  else if (isSelected && !isCorrect) style = "border-red-200 bg-red-50";
                  else style = "border-gray-100 bg-white opacity-60";
                } else if (isSelected) {
                  style = "border-[#B2C9AD] bg-[#EDF3EB]";
                }
                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all duration-200 ${style}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${isSelected ? "border-[#8FAF88] bg-[#8FAF88]" : "border-gray-300"}`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </span>
                      {opt}
                      {submitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-[#8FAF88] ml-auto flex-shrink-0" aria-hidden="true" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          disabled={Object.keys(answers).length < quiz.length}
          className="mt-6 px-6 py-3 bg-[#B2C9AD] hover:bg-[#8FAF88] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl text-sm transition-colors"
        >
          Check My Answers
        </button>
      ) : (
        <div className="mt-6 flex items-center gap-3 px-5 py-4 bg-white rounded-xl border border-[#D4E4D0]">
          <CheckCircle2 className="w-5 h-5 text-[#8FAF88] flex-shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold text-[#2D2D2D]">
            You got {score} out of {quiz.length} correct.{" "}
            {score === quiz.length
              ? "Excellent work!"
              : score >= quiz.length / 2
              ? "Good effort. Review any missed answers above."
              : "Keep reviewing, you'll get it!"}
          </p>
        </div>
      )}
    </div>
  );
}

function LessonCard({ lesson, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
    >
      {/* Header, always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-6 md:p-8 flex items-start gap-5 group hover:bg-[#FAFAF8] transition-colors"
        aria-expanded={open}
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#EDF3EB] flex items-center justify-center group-hover:bg-[#B2C9AD] transition-colors duration-300">
          <lesson.icon className="w-5 h-5 text-[#8FAF88] group-hover:text-white transition-colors duration-300" aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <span className="text-xs font-bold text-[#B2C9AD] tracking-widest uppercase">Lesson {lesson.number}</span>
          </div>
          <h3 className="text-lg font-bold text-[#2D2D2D]">{lesson.title}</h3>
          <p className="text-sm text-[#6B6B6B] mt-1">{lesson.tagline}</p>
        </div>
        <div className="flex-shrink-0 ml-4 mt-1">
          {open ? (
            <ChevronUp className="w-5 h-5 text-[#8FAF88]" aria-hidden="true" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#6B6B6B]" aria-hidden="true" />
          )}
        </div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 md:px-8 pb-8 border-t border-gray-100 pt-6 space-y-8">
              {/* Description */}
              <p className="text-[#4A4A4A] leading-relaxed">{lesson.description}</p>

              {/* Steps */}
              <div>
                <h4 className="text-sm font-bold text-[#2D2D2D] uppercase tracking-wider mb-4">Step-by-Step</h4>
                <ol className="space-y-3">
                  {lesson.steps.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#4A4A4A]">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#EDF3EB] text-[#8FAF88] text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Key Takeaways */}
              <div>
                <h4 className="text-sm font-bold text-[#2D2D2D] uppercase tracking-wider mb-4">Key Takeaways</h4>
                <ul className="space-y-2">
                  {lesson.takeaways.map((t, i) => (
                    <li key={i} className="flex gap-3 text-sm text-[#4A4A4A]">
                      <CheckCircle2 className="w-4 h-4 text-[#B2C9AD] flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Download guide */}
              <div className="flex items-center gap-4 p-4 bg-[#EDF3EB] rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-[#8FAF88]" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#2D2D2D]">{lesson.guide}</p>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">Printable reference guide for this lesson</p>
                </div>
                {lesson.guidePath ? (
                  <a
                    href={lesson.guidePath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-2 rounded-lg bg-white text-[#2D2D2D] text-xs font-semibold border border-[#D4E4D0] hover:bg-[#f5f7f4] transition-colors"
                  >
                    Open Guide
                  </a>
                ) : (
                  <span className="text-xs text-[#6B6B6B] italic">Coming soon</span>
                )}
              </div>

              {/* Quiz */}
              <QuizSection quiz={lesson.quiz} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function DigitalLiteracy() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-24 md:py-32 bg-[#FAFAF8]" aria-labelledby="curriculum-heading">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#B2C9AD]/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/4" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-4">Digital Literacy Curriculum</p>
              <h1 id="curriculum-heading" className="text-4xl md:text-5xl font-extrabold text-[#2D2D2D] leading-[1.1] tracking-tight">
                Learn to own your{" "}
                <span className="text-[#8FAF88]">digital presence</span>
              </h1>
              <p className="mt-5 text-lg text-[#6B6B6B] max-w-xl leading-relaxed">
                These five self-paced lessons are designed specifically for small business owners, and no technical background is required. Work through them at your own pace, in any order.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Lessons */}
      <section className="py-16 md:py-24 bg-white" aria-labelledby="lessons-heading">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <h2 id="lessons-heading" className="sr-only">Curriculum Lessons</h2>
          <div className="space-y-4">
            {lessons.map((lesson, index) => (
              <LessonCard key={lesson.number} lesson={lesson} index={index} />
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Want to Learn More?"
        description="Attend one of our follow-up workshops for hands-on guidance, or reach out with any questions."
        buttonText="View Workshops"
        buttonPage="Workshops"
      />
    </div>
  );
}