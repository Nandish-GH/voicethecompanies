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

export default function StudentForm() {
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", school: "",
    grade_level: "", interests: "", experience: "", why_interested: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitWarning, setSubmitWarning] = useState("");

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    setSubmitWarning("");
    try {
      await localClient.entities.StudentApplication.create(form);
      const emailResult = await localClient.integrations.Core.SendEmail({
        to: "voicethecompanies@gmail.com",
        subject: `New Student Application: ${form.full_name}`,
        body: `A new student application was submitted.\n\nName: ${form.full_name}\nEmail: ${form.email}\nPhone: ${form.phone}\nSchool: ${form.school}\nGrade: ${form.grade_level}\nInterest: ${form.interests}\n\nExperience:\n${form.experience}\n\nWhy Interested:\n${form.why_interested}`,
      });
      if (!emailResult?.success) {
        setSubmitWarning("Your application was received, but email notifications are temporarily unavailable. Please also email voicethecompanies@gmail.com.");
      }
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
        {submitWarning && <p className="text-sm text-amber-700 mt-3">{submitWarning}</p>}
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
        type="submit"
        disabled={submitting}
        className="w-full bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold py-3 rounded-xl h-12"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit Application"}
      </Button>
    </form>
  );
}