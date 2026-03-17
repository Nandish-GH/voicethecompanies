import React, { useState } from "react";
import { localClient } from "@/api/localClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Loader2 } from "lucide-react";

const gradeOptions = [
  { value: "high_school_freshman", label: "High School Freshman" },
  { value: "high_school_sophomore", label: "High School Sophomore" },
  { value: "high_school_junior", label: "High School Junior" },
  { value: "high_school_senior", label: "High School Senior" },
  { value: "college_freshman", label: "College Freshman" },
  { value: "college_sophomore", label: "College Sophomore" },
  { value: "college_junior", label: "College Junior" },
  { value: "college_senior", label: "College Senior" },
];

const interestOptions = [
  { value: "project_management", label: "Project Management" },
  { value: "web_design", label: "Web Design" },
  { value: "development", label: "Development" },
  { value: "content_creation", label: "Content Creation" },
  { value: "social_media", label: "Social Media" },
];

const demoFirstNames = ["Jordan", "Taylor", "Avery", "Riley", "Cameron", "Skyler", "Morgan"];
const demoLastNames = ["Lee", "Patel", "Nguyen", "Garcia", "Johnson", "Kim", "Brown"];
const demoSchools = [
  "Riverside High School",
  "Central STEM Academy",
  "Lincoln Preparatory",
  "Eastview College",
  "North Valley University",
];
const demoExperience = [
  "Built small websites for school clubs and helped with social media graphics.",
  "Volunteered at community events and managed event signup forms.",
  "Created short videos and posts for student organizations.",
  "Worked on a coding class project using React and Firebase.",
];
const demoWhyInterested = [
  "I want hands-on experience helping local businesses and learning from mentors.",
  "I am excited to grow my digital skills while making an impact in my community.",
  "I want to practice teamwork on real-world projects before college applications.",
  "I am interested in design and entrepreneurship and want practical project work.",
];
const DEMO_EMAIL = "voicethecompanies@gmail.com";

export default function StudentForm() {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", school: "",
    grade_level: "", interests: "", experience: "", why_interested: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const randomItem = (items) => items[Math.floor(Math.random() * items.length)];
  const randomDigits = (length) =>
    Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");

  const fillDemoData = () => {
    const firstName = randomItem(demoFirstNames);
    const lastName = randomItem(demoLastNames);
    const grade = randomItem(gradeOptions).value;
    const interest = randomItem(interestOptions).value;
    const school = randomItem(demoSchools);

    setForm({
      full_name: `${firstName} ${lastName}`,
      email: DEMO_EMAIL,
      phone: `(555) ${randomDigits(3)}-${randomDigits(4)}`,
      school,
      grade_level: grade,
      interests: interest,
      experience: randomItem(demoExperience),
      why_interested: randomItem(demoWhyInterested),
    });
    setSubmitError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      await localClient.entities.StudentApplication.create(form);
      await localClient.integrations.Core.SendEmail({
        to: "2009nandish@gmail.com",
        subject: `New Student Application: ${form.full_name}`,
        body: `A new student application was submitted.\n\nName: ${form.full_name}\nEmail: ${form.email}\nPhone: ${form.phone}\nSchool: ${form.school}\nGrade: ${form.grade_level}\nInterest: ${form.interests}\n\nExperience:\n${form.experience}\n\nWhy Interested:\n${form.why_interested}`,
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error?.message || "Unable to send email right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-[#EDF3EB] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#8FAF88]" aria-hidden="true" />
        </div>
        <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">Application Submitted!</h3>
        <p className="text-[#6B6B6B]">Thank you for your interest. We'll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="student-name">Full Name *</Label>
          <Input id="student-name" required value={form.full_name} onChange={(e) => handleChange("full_name", e.target.value)} placeholder="Your full name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-email">Email *</Label>
          <Input id="student-email" type="email" required value={form.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@email.com" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="student-phone">Phone</Label>
          <Input id="student-phone" value={form.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="(555) 123-4567" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-school">School *</Label>
          <Input id="student-school" required value={form.school} onChange={(e) => handleChange("school", e.target.value)} placeholder="Your school or university" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="student-grade">Grade Level</Label>
          <Select value={form.grade_level} onValueChange={(v) => handleChange("grade_level", v)}>
            <SelectTrigger id="student-grade"><SelectValue placeholder="Select grade" /></SelectTrigger>
            <SelectContent>
              {gradeOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="student-interest">Area of Interest</Label>
          <Select value={form.interests} onValueChange={(v) => handleChange("interests", v)}>
            <SelectTrigger id="student-interest"><SelectValue placeholder="Select interest" /></SelectTrigger>
            <SelectContent>
              {interestOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="student-experience">Relevant Experience</Label>
        <Textarea id="student-experience" value={form.experience} onChange={(e) => handleChange("experience", e.target.value)} placeholder="Briefly describe any relevant skills or experience" rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="student-why">Why Are You Interested?</Label>
        <Textarea id="student-why" value={form.why_interested} onChange={(e) => handleChange("why_interested", e.target.value)} placeholder="Tell us why you'd like to join" rows={3} />
      </div>
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <Button
        type="button"
        variant="outline"
        onClick={fillDemoData}
        disabled={submitting}
        className="w-full"
      >
        Fill Demo Data
      </Button>
      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold py-3 rounded-xl h-12"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Application"}
      </Button>
    </form>
  );
}