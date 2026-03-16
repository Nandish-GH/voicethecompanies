import React, { useEffect, useState } from "react";
import { localClient } from "@/api/localClient";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Globe, Users, TrendingUp, Star, MapPin, BarChart2,
  LogIn, Lock, ChevronRight
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line
} from "recharts";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-lg text-sm">
        <p className="font-semibold text-[#2D2D2D] mb-1">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }} className="text-xs">{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

function StatCard({ icon: Icon, label, value, sub, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-[#EDF3EB] flex items-center justify-center">
          <Icon className="w-4 h-4 text-[#8FAF88]" aria-hidden="true" />
        </div>
      </div>
      <p className="text-2xl font-extrabold text-[#2D2D2D] tracking-tight">{value ?? "N/A"}</p>
      <p className="text-sm font-semibold text-[#8FAF88] mt-1">{label}</p>
      {sub && <p className="text-xs text-[#6B6B6B] mt-0.5">{sub}</p>}
    </motion.div>
  );
}

function ConfidenceBar({ label, score }) {
  return (
    <div>
      <div className="flex justify-between text-xs text-[#4A4A4A] mb-1">
        <span>{label}</span>
        <span className="font-semibold">{score ? `${score} / 5` : "Not yet rated"}</span>
      </div>
      <div className="h-2 bg-[#EDF3EB] rounded-full overflow-hidden">
        <div
          className="h-2 bg-[#B2C9AD] rounded-full transition-all duration-700"
          style={{ width: score ? `${(score / 5) * 100}%` : "0%" }}
          role="progressbar"
          aria-valuenow={score || 0}
          aria-valuemin={0}
          aria-valuemax={5}
          aria-label={`${label}: ${score || 0} out of 5`}
        />
      </div>
    </div>
  );
}

export default function BusinessDashboard() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    localClient.auth.me().then((u) => {
      setUser(u);
      setAuthChecked(true);
    }).catch(() => {
      setAuthChecked(true);
    });
  }, []);

  const { data: allStats = [] } = useQuery({
    queryKey: ["business-stats", user?.email],
    queryFn: () => localClient.entities.BusinessStats.filter({ owner_email: user.email }),
    enabled: !!user,
  });

  // Sort by created_date so charts show chronological progression
  const stats = [...allStats].sort((a, b) => new Date(a.created_date) - new Date(b.created_date));

  const latest = stats[stats.length - 1];

  const trafficData = stats.map((s) => ({
    period: s.period_label,
    Sessions: s.website_sessions,
    Visitors: s.unique_visitors,
  }));

  const socialData = stats.map((s) => ({
    period: s.period_label,
    Followers: s.social_followers,
    Reach: s.social_reach,
  }));

  if (!authChecked) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#B2C9AD] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAF8] px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EDF3EB] flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-[#8FAF88]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-3">Business Dashboard</h1>
          <p className="text-[#6B6B6B] mb-8 leading-relaxed">
            This dashboard is for participating business owners. Please log in with the email address associated with your program account to view your statistics.
          </p>
          <button
            onClick={() => localClient.auth.redirectToLogin(createPageUrl("BusinessDashboard"))}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#B2C9AD] hover:bg-[#8FAF88] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-[#B2C9AD]/25"
          >
            <LogIn className="w-4 h-4" aria-hidden="true" />
            Log In to View Your Dashboard
          </button>
          <p className="mt-6 text-xs text-[#6B6B6B]">
            Don't have an account yet?{" "}
            <Link to={createPageUrl("GetInvolved")} className="text-[#8FAF88] hover:underline font-medium">
              Request services first
            </Link>
            . Your login will be created once your project begins.
          </p>
        </div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="min-h-[80vh] bg-[#FAFAF8]">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#EDF3EB] flex items-center justify-center mx-auto mb-6">
            <BarChart2 className="w-7 h-7 text-[#8FAF88]" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-3">Your Dashboard</h1>
          <p className="text-[#6B6B6B] mb-4 leading-relaxed max-w-md mx-auto">
            Welcome, {user.full_name || user.email}. Your statistics will appear here once your student team has completed the first reporting period.
          </p>
          <p className="text-sm text-[#6B6B6B]">
            In the meantime, check out the{" "}
            <Link to={createPageUrl("DigitalLiteracy")} className="text-[#8FAF88] hover:underline font-medium">
              Digital Literacy Curriculum
            </Link>{" "}
            to prepare.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAF8] min-h-screen">
      {/* Header */}
      <section className="py-16 md:py-20 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#8FAF88] mb-2">Business Dashboard</p>
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#2D2D2D] tracking-tight">
              {latest?.business_name || "Your Business"}
            </h1>
            <p className="text-[#6B6B6B] mt-2">
              Welcome back, {user.full_name || user.email}. Here is your latest performance snapshot.
            </p>
            {latest && (
              <p className="text-xs text-[#6B6B6B] mt-1">
                Latest period: <span className="font-semibold text-[#2D2D2D]">{latest.period_label}</span>
              </p>
            )}
          </motion.div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12 space-y-10">

        {/* Quick stats */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#6B6B6B] mb-4">Latest Snapshot</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <StatCard icon={Globe} label="Sessions" value={latest?.website_sessions} sub="This period" index={0} />
            <StatCard icon={Users} label="Unique Visitors" value={latest?.unique_visitors} sub="This period" index={1} />
            <StatCard icon={TrendingUp} label="Social Followers" value={latest?.social_followers} sub="Total" index={2} />
            <StatCard icon={Star} label="Post Reach" value={latest?.social_reach} sub="This period" index={3} />
            <StatCard icon={MapPin} label="Profile Views" value={latest?.google_profile_views} sub="Google Business" index={4} />
            <StatCard icon={BarChart2} label="Direction Requests" value={latest?.google_direction_requests} sub="Google Business" index={5} />
          </div>
        </div>

        {/* Charts */}
        {stats.length > 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <p className="text-sm font-bold text-[#2D2D2D] mb-1">Website Traffic Over Time</p>
              <p className="text-xs text-[#6B6B6B] mb-5">Sessions and unique visitors by period</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={trafficData} barSize={18}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="period" tick={{ fontSize: 10, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="Sessions" fill="#B2C9AD" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Visitors" fill="#D4E4D0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="bg-white rounded-2xl border border-gray-100 p-6"
            >
              <p className="text-sm font-bold text-[#2D2D2D] mb-1">Social Media Growth</p>
              <p className="text-xs text-[#6B6B6B] mb-5">Followers and reach over time</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={socialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
                  <XAxis dataKey="period" tick={{ fontSize: 10, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#6B6B6B" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="Followers" stroke="#8FAF88" strokeWidth={2} dot={{ fill: "#8FAF88", r: 4 }} />
                  <Line type="monotone" dataKey="Reach" stroke="#B2C9AD" strokeWidth={2} dot={{ fill: "#B2C9AD", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        )}

        {/* Confidence ratings */}
        {latest && (latest.confidence_website || latest.confidence_social || latest.confidence_analytics) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8"
          >
            <h2 className="text-sm font-bold text-[#2D2D2D] uppercase tracking-wider mb-5">Your Digital Confidence Ratings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ConfidenceBar label="Managing your website" score={latest.confidence_website} />
              <ConfidenceBar label="Posting on social media" score={latest.confidence_social} />
              <ConfidenceBar label="Reading your analytics" score={latest.confidence_analytics} />
            </div>
          </motion.div>
        )}

        {/* All periods table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-sm font-bold text-[#2D2D2D] uppercase tracking-wider">All Reporting Periods</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-[#FAFAF8]">
                  <th className="text-left px-6 py-3 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Period</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Sessions</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Visitors</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Followers</th>
                  <th className="text-right px-4 py-3 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Reach</th>
                  <th className="text-right px-6 py-3 text-xs font-bold text-[#6B6B6B] uppercase tracking-wider">Profile Views</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((s, i) => (
                  <tr key={s.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-[#FAFAF8]/50"}`}>
                    <td className="px-6 py-4 font-semibold text-[#2D2D2D]">{s.period_label}</td>
                    <td className="px-4 py-4 text-right text-[#4A4A4A]">{s.website_sessions ?? "-"}</td>
                    <td className="px-4 py-4 text-right text-[#4A4A4A]">{s.unique_visitors ?? "-"}</td>
                    <td className="px-4 py-4 text-right text-[#4A4A4A]">{s.social_followers ?? "-"}</td>
                    <td className="px-4 py-4 text-right text-[#4A4A4A]">{s.social_reach ?? "-"}</td>
                    <td className="px-6 py-4 text-right text-[#4A4A4A]">{s.google_profile_views ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Notes */}
        {latest?.notes && (
          <div className="bg-[#EDF3EB] rounded-2xl p-6 border border-[#D4E4D0]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#8FAF88] mb-2">Notes from Your Team</p>
            <p className="text-sm text-[#4A4A4A] leading-relaxed">{latest.notes}</p>
          </div>
        )}

        {/* Footer links */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
          <Link to={createPageUrl("DigitalLiteracy")} className="text-sm text-[#8FAF88] hover:text-[#2D2D2D] font-medium flex items-center gap-1 transition-colors">
            Digital Literacy Curriculum <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
          <Link to={createPageUrl("Workshops")} className="text-sm text-[#8FAF88] hover:text-[#2D2D2D] font-medium flex items-center gap-1 transition-colors">
            View Upcoming Workshops <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}