import { useState, useEffect, useCallback } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

// ============================================================
// LAUNCHBASED CLICKABLE PROTOTYPE
// Full interactive prototype with all major screens
// Dark mode default, blue/purple palette
// ============================================================

// --- THEME ---
const dark = {
  bg: "#0B1120", bgCard: "#111B2E", bgElevated: "#162032", bgHover: "#1E2D47",
  text: "#F0F4FF", textSec: "#94A3C8", textMuted: "#5A6B8A",
  primary: "#3B82F6", primaryHover: "#60A5FA", accent: "#8B5CF6", accentHover: "#A78BFA",
  success: "#22C55E", warning: "#F59E0B", error: "#EF4444",
  border: "#1E2D47", borderActive: "#3B82F6",
};
const light = {
  bg: "#F8FAFF", bgCard: "#FFFFFF", bgElevated: "#EEF2FF", bgHover: "#E2E8F0",
  text: "#0F172A", textSec: "#475569", textMuted: "#94A3B8",
  primary: "#2563EB", primaryHover: "#3B82F6", accent: "#7C3AED", accentHover: "#8B5CF6",
  success: "#16A34A", warning: "#D97706", error: "#DC2626",
  border: "#E2E8F0", borderActive: "#2563EB",
};

// --- ICONS (inline SVG components) ---
const Icons = {
  Sun: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>,
  Moon: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>,
  Home: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Users: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  Check: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  Chat: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
  Settings: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>,
  Briefcase: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
  Globe: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
  Layout: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  File: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  BarChart2: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  Bell: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
  Info: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  ChevronRight: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>,
  Rocket: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 00-2.91-.09z"/><path d="M12 15l-3-3a22 22 0 012-3.95A12.88 12.88 0 0122 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 01-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  Star: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  ArrowLeft: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Upload: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Zap: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Clock: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Send: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  X: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Menu: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
};

// --- AGENT DATA ---
const agents = [
  { name: "Emma", role: "Content Writer", emoji: "✍️", status: "working", task: "Writing blog post about spring trends", progress: 72 },
  { name: "James", role: "Market Researcher", emoji: "🔍", status: "working", task: "Analyzing competitor pricing data", progress: 45 },
  { name: "Olivia", role: "Sales Outreach", emoji: "📧", status: "approval", task: "Follow-up email to 12 leads", progress: 100 },
  { name: "Liam", role: "SEO Specialist", emoji: "📈", status: "idle", task: null, progress: 0 },
  { name: "Sophia", role: "Customer Service", emoji: "💬", status: "working", task: "Responding to 3 customer inquiries", progress: 60 },
  { name: "Noah", role: "Operations Manager", emoji: "📋", status: "idle", task: null, progress: 0 },
  { name: "Ava", role: "Social Media Manager", emoji: "📱", status: "approval", task: "3 Instagram posts ready for review", progress: 100 },
  { name: "Ethan", role: "Data Analyst", emoji: "📊", status: "working", task: "Weekly performance report", progress: 30 },
];

const chartData = [
  { name: "Mon", leads: 4, content: 3, sales: 1 }, { name: "Tue", leads: 7, content: 5, sales: 2 },
  { name: "Wed", leads: 5, content: 8, sales: 3 }, { name: "Thu", leads: 9, content: 6, sales: 4 },
  { name: "Fri", leads: 12, content: 7, sales: 6 }, { name: "Sat", leads: 8, content: 4, sales: 3 },
  { name: "Sun", leads: 6, content: 2, sales: 1 },
];
const pieData = [
  { name: "Content", value: 35, color: "#3B82F6" }, { name: "Outreach", value: 25, color: "#8B5CF6" },
  { name: "Research", value: 20, color: "#22C55E" }, { name: "SEO", value: 12, color: "#F59E0B" },
  { name: "Support", value: 8, color: "#EF4444" },
];

// --- TOOLTIP COMPONENT ---
const TT = ({ text, children, t }) => {
  const [show, setShow] = useState(false);
  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}
      onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)} onClick={() => setShow(!show)}>
      {children || <span style={{ cursor: "pointer", color: t.primary, marginLeft: 6, display: "inline-flex" }}><Icons.Info /></span>}
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
          background: t.bgElevated, color: t.text, border: `1px solid ${t.primary}`,
          borderRadius: 8, padding: "8px 12px", fontSize: 13, lineHeight: 1.4,
          width: 240, zIndex: 999, boxShadow: `0 4px 20px rgba(59,130,246,0.15)`, textAlign: "left",
          pointerEvents: "none", whiteSpace: "normal"
        }}>{text}</span>
      )}
    </span>
  );
};

// --- BUTTON ---
const Btn = ({ children, onClick, variant = "primary", size = "md", style = {}, t, disabled, full }) => {
  const [hov, setHov] = useState(false);
  const base = {
    primary: { bg: t.primary, bgH: t.primaryHover, c: "#FFF", brd: "none" },
    secondary: { bg: "transparent", bgH: t.bgHover, c: t.primary, brd: `1px solid ${t.primary}` },
    accent: { bg: t.accent, bgH: t.accentHover, c: "#FFF", brd: "none" },
    danger: { bg: t.error, bgH: "#F87171", c: "#FFF", brd: "none" },
    ghost: { bg: "transparent", bgH: t.bgHover, c: t.textSec, brd: "none" },
    success: { bg: t.success, bgH: "#34D399", c: "#FFF", brd: "none" },
    warning: { bg: t.warning, bgH: "#FBBF24", c: "#000", brd: "none" },
  }[variant];
  const sz = { sm: { p: "6px 12px", f: 13 }, md: { p: "10px 20px", f: 15 }, lg: { p: "14px 28px", f: 17 } }[size];
  return (
    <button onClick={disabled ? undefined : onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: disabled ? t.bgHover : hov ? base.bgH : base.bg, color: disabled ? t.textMuted : base.c,
        border: base.brd, borderRadius: 8, padding: sz.p, fontSize: sz.f, fontWeight: 600,
        cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s", width: full ? "100%" : undefined,
        display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
        boxShadow: hov && !disabled ? `0 0 20px ${t.primary}33` : "none", ...style,
      }}>{children}</button>
  );
};

// --- INPUT ---
const Input = ({ label, tooltip, placeholder, value, onChange, type = "text", t, required }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{label}</label>
      {required && <span style={{ color: t.error, marginLeft: 4 }}>*</span>}
      {tooltip && <TT text={tooltip} t={t} />}
    </div>
    <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", boxSizing: "border-box", padding: "12px 16px", fontSize: 15, borderRadius: 8,
        border: `1px solid ${t.border}`, background: t.bg, color: t.text, outline: "none",
        transition: "border-color 0.2s",
      }}
      onFocus={e => e.target.style.borderColor = t.borderActive}
      onBlur={e => e.target.style.borderColor = t.border} />
  </div>
);

// --- TEXTAREA ---
const TextArea = ({ label, tooltip, placeholder, value, onChange, t, rows = 3, required }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{label}</label>
      {required && <span style={{ color: t.error, marginLeft: 4 }}>*</span>}
      {tooltip && <TT text={tooltip} t={t} />}
    </div>
    <textarea placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)} rows={rows}
      style={{
        width: "100%", boxSizing: "border-box", padding: "12px 16px", fontSize: 15, borderRadius: 8,
        border: `1px solid ${t.border}`, background: t.bg, color: t.text, outline: "none",
        resize: "vertical", fontFamily: "inherit", transition: "border-color 0.2s",
      }}
      onFocus={e => e.target.style.borderColor = t.borderActive}
      onBlur={e => e.target.style.borderColor = t.border} />
  </div>
);

// --- SELECT ---
const Select = ({ label, tooltip, options, value, onChange, t, required }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
      <label style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{label}</label>
      {required && <span style={{ color: t.error, marginLeft: 4 }}>*</span>}
      {tooltip && <TT text={tooltip} t={t} />}
    </div>
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        width: "100%", padding: "12px 16px", fontSize: 15, borderRadius: 8,
        border: `1px solid ${t.border}`, background: t.bg, color: t.text, outline: "none",
        cursor: "pointer", appearance: "auto",
      }}>
      <option value="">Select...</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

// --- CARD ---
const Card = ({ children, t, style = {}, onClick, hover = true }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: t.bgCard, border: `1px solid ${hov && hover ? t.borderActive : t.border}`,
        borderRadius: 12, padding: 20, transition: "all 0.2s",
        boxShadow: hov && hover ? `0 4px 20px rgba(59,130,246,0.08)` : "none",
        cursor: onClick ? "pointer" : "default", ...style,
      }}>{children}</div>
  );
};

// --- PROGRESS BAR ---
const ProgressBar = ({ value, t, height = 8, color }) => (
  <div style={{ width: "100%", height, borderRadius: height, background: t.bgHover, overflow: "hidden" }}>
    <div style={{ width: `${value}%`, height: "100%", borderRadius: height, background: color || t.primary, transition: "width 0.5s ease" }} />
  </div>
);

// --- BADGE ---
const Badge = ({ text, color, t }) => (
  <span style={{
    display: "inline-block", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600,
    background: `${color}22`, color: color, border: `1px solid ${color}44`,
  }}>{text}</span>
);

// --- CONFETTI (simple CSS animated) ---
const Confetti = ({ show }) => {
  if (!show) return null;
  const colors = ["#3B82F6", "#8B5CF6", "#22C55E", "#F59E0B", "#EF4444", "#EC4899"];
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 9999, overflow: "hidden" }}>
      {Array.from({ length: 60 }).map((_, i) => (
        <div key={i} style={{
          position: "absolute", top: -20, left: `${Math.random() * 100}%`,
          width: 8 + Math.random() * 8, height: 8 + Math.random() * 8,
          background: colors[Math.floor(Math.random() * colors.length)],
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          animation: `confetti-fall ${2 + Math.random() * 3}s ease-in forwards`,
          animationDelay: `${Math.random() * 1}s`, opacity: 0.9,
        }} />
      ))}
      <style>{`@keyframes confetti-fall { 0% { transform: translateY(0) rotate(0deg); opacity:1; } 100% { transform: translateY(100vh) rotate(${360 + Math.random()*720}deg); opacity:0; } }`}</style>
    </div>
  );
};

// ============================================================
// MAIN APP
// ============================================================
export default function LaunchBasedApp() {
  const [isDark, setIsDark] = useState(true);
  const t = isDark ? dark : light;
  const [page, setPage] = useState("landing"); // landing, orderForm, preview, onboarding, dashboard, agents, approvals, settings, website, docs, analytics, daily
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [confetti, setConfetti] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Order form state
  const [formStep, setFormStep] = useState(0);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    bizName: "", bizDesc: "", idealCustomer: "", bizType: "", industry: "",
    goals: [], hasWebsite: false, currentUrl: "", revenueGoal: "",
    theme: "", inspireUrls: ["", "", ""], logo: null, colors: "",
  });

  // Onboarding state
  const [onboardSteps, setOnboardSteps] = useState([
    { id: 1, label: "Magic link sent! Check your email", done: true },
    { id: 2, label: "Building your website...", done: true },
    { id: 3, label: "Import your AI profile", done: false, skippable: true },
    { id: 4, label: "Meet your AI team", done: false, skippable: true },
    { id: 5, label: "Connect your chat app", done: false },
    { id: 6, label: "Connect business tools", done: false, skippable: true },
    { id: 7, label: "Join the LaunchBased community", done: false },
    { id: 8, label: "Your first win!", done: false },
  ]);

  const triggerConfetti = () => { setConfetti(true); setTimeout(() => setConfetti(false), 4000); };

  const completeOnboardStep = (id) => {
    setOnboardSteps(prev => prev.map(s => s.id === id ? { ...s, done: true } : s));
    if (id === 8) triggerConfetti();
  };

  const completedSteps = onboardSteps.filter(s => s.done).length;
  const totalSteps = onboardSteps.length;
  const onboardProgress = Math.round((completedSteps / totalSteps) * 100);

  // ---- NAVIGATION ----
  // Integrations state
  const [intCategory, setIntCategory] = useState("all");
  const [intSearch, setIntSearch] = useState("");
  const [connectedTools, setConnectedTools] = useState(["discord", "gmail"]);
  const [showIntModal, setShowIntModal] = useState(null);

  const allIntegrations = [
    // Chat Apps
    { id: "discord", name: "Discord", cat: "chat", icon: "💬", desc: "Chat with your AI team and get notifications in Discord channels.", popular: true },
    { id: "slack", name: "Slack", cat: "chat", icon: "📨", desc: "Send and receive messages through Slack workspaces and channels.", popular: true },
    { id: "telegram", name: "Telegram", cat: "chat", icon: "✈️", desc: "Message your AI team from Telegram on your phone.", popular: true },
    { id: "whatsapp", name: "WhatsApp", cat: "chat", icon: "📞", desc: "Talk to your AI agents through WhatsApp messages." },
    { id: "teams", name: "Microsoft Teams", cat: "chat", icon: "🟦", desc: "Connect to your Teams workspace for business communication." },
    // CRMs
    { id: "hubspot", name: "HubSpot CRM", cat: "crm", icon: "🟠", desc: "Manage contacts, deals, and sales pipeline. Auto-sync leads from outreach.", popular: true },
    { id: "salesforce", name: "Salesforce", cat: "crm", icon: "☁️", desc: "Full CRM integration for enterprise-level contact and deal management.", popular: true },
    { id: "pipedrive", name: "Pipedrive", cat: "crm", icon: "🟢", desc: "Visual sales pipeline management. Great for small teams." },
    { id: "zoho", name: "Zoho CRM", cat: "crm", icon: "🔴", desc: "Affordable CRM with marketing automation and analytics." },
    { id: "freshsales", name: "Freshsales", cat: "crm", icon: "🍊", desc: "AI-powered CRM with built-in phone, email, and chat." },
    { id: "gohighlevel", name: "GoHighLevel", cat: "crm", icon: "⚡", desc: "All-in-one CRM, funnels, and marketing automation platform.", popular: true },
    // Ad Platforms
    { id: "meta-ads", name: "Meta Ads (Facebook/Instagram)", cat: "ads", icon: "📘", desc: "Create, manage, and optimize your Facebook and Instagram ad campaigns.", popular: true },
    { id: "google-ads", name: "Google Ads", cat: "ads", icon: "🔍", desc: "Run search, display, and YouTube ads. AI optimizes your campaigns.", popular: true },
    { id: "tiktok-ads", name: "TikTok Ads", cat: "ads", icon: "🎵", desc: "Create and manage TikTok ad campaigns for younger audiences." },
    { id: "linkedin-ads", name: "LinkedIn Ads", cat: "ads", icon: "💼", desc: "B2B advertising on LinkedIn for professional audiences." },
    { id: "pinterest-ads", name: "Pinterest Ads", cat: "ads", icon: "📌", desc: "Visual ad campaigns perfect for product-based businesses." },
    // eCommerce
    { id: "shopify", name: "Shopify", cat: "ecommerce", icon: "🛍️", desc: "Manage products, orders, inventory, and customers in your Shopify store.", popular: true },
    { id: "etsy", name: "Etsy", cat: "ecommerce", icon: "🧶", desc: "List products, manage orders, and optimize listings on Etsy." },
    { id: "woocommerce", name: "WooCommerce", cat: "ecommerce", icon: "🟣", desc: "Full WordPress eCommerce store management." },
    { id: "amazon", name: "Amazon Seller", cat: "ecommerce", icon: "📦", desc: "Product listings, order tracking, and review monitoring on Amazon." },
    { id: "stripe", name: "Stripe", cat: "ecommerce", icon: "💳", desc: "Payment processing, invoicing, and subscription management.", popular: true },
    { id: "square", name: "Square", cat: "ecommerce", icon: "⬛", desc: "Point-of-sale and online payments for retail and service businesses." },
    // LLMs / AI
    { id: "openai", name: "OpenAI (GPT)", cat: "ai", icon: "🤖", desc: "Connect your OpenAI API key to use GPT models for specific agent tasks." },
    { id: "anthropic", name: "Anthropic (Claude)", cat: "ai", icon: "🧠", desc: "Claude is the default AI brain for your agents. Already connected!", popular: true },
    { id: "gemini", name: "Google Gemini", cat: "ai", icon: "💎", desc: "Add Google Gemini as an alternative AI model for certain tasks." },
    { id: "perplexity", name: "Perplexity", cat: "ai", icon: "🔮", desc: "Use Perplexity for real-time web research and fact-checking." },
    { id: "mistral", name: "Mistral", cat: "ai", icon: "🌬️", desc: "Cost-effective open-source AI for high-volume, simpler tasks." },
    // Document / Storage
    { id: "gdrive", name: "Google Drive", cat: "docs", icon: "📁", desc: "Store, share, and collaborate on documents, sheets, and slides.", popular: true },
    { id: "onedrive", name: "OneDrive", cat: "docs", icon: "☁️", desc: "Microsoft cloud storage for documents and file sharing." },
    { id: "dropbox", name: "Dropbox", cat: "docs", icon: "📦", desc: "Cloud file storage and sharing with team collaboration." },
    { id: "notion", name: "Notion", cat: "docs", icon: "📝", desc: "All-in-one workspace for notes, docs, wikis, and project management.", popular: true },
    { id: "google-docs", name: "Google Docs", cat: "docs", icon: "📄", desc: "Create and edit documents collaboratively in real time." },
    { id: "google-sheets", name: "Google Sheets", cat: "docs", icon: "📊", desc: "Spreadsheets for tracking data, budgets, and analytics." },
    // Email / Marketing
    { id: "gmail", name: "Gmail", cat: "email", icon: "📧", desc: "Read, send, and manage emails from your Gmail account.", popular: true },
    { id: "outlook", name: "Outlook", cat: "email", icon: "📬", desc: "Microsoft email integration for business communication." },
    { id: "mailchimp", name: "Mailchimp", cat: "email", icon: "🐵", desc: "Email marketing campaigns, automations, and audience management.", popular: true },
    { id: "convertkit", name: "ConvertKit", cat: "email", icon: "✉️", desc: "Email marketing built for creators and small businesses." },
    { id: "sendgrid", name: "SendGrid", cat: "email", icon: "📮", desc: "Transactional and marketing email delivery at scale." },
    { id: "instantly", name: "Instantly", cat: "email", icon: "⚡", desc: "Cold email outreach at scale with smart sending and warmup." },
    // Social Media
    { id: "instagram", name: "Instagram", cat: "social", icon: "📸", desc: "Post photos, reels, and stories. Track engagement and followers.", popular: true },
    { id: "facebook", name: "Facebook Pages", cat: "social", icon: "👤", desc: "Manage your Facebook business page, posts, and audience." },
    { id: "twitter", name: "X (Twitter)", cat: "social", icon: "🐦", desc: "Post tweets, monitor mentions, and engage with your audience." },
    { id: "linkedin", name: "LinkedIn", cat: "social", icon: "💼", desc: "Publish content and grow your professional network.", popular: true },
    { id: "youtube", name: "YouTube", cat: "social", icon: "🎬", desc: "Upload videos, manage your channel, and track analytics." },
    { id: "tiktok", name: "TikTok", cat: "social", icon: "🎵", desc: "Post short videos and track engagement on TikTok." },
    { id: "pinterest", name: "Pinterest", cat: "social", icon: "📌", desc: "Pin images and drive traffic from Pinterest to your website." },
    // Scheduling / Productivity
    { id: "gcal", name: "Google Calendar", cat: "productivity", icon: "📅", desc: "Schedule meetings, appointments, and sync with your AI team.", popular: true },
    { id: "calendly", name: "Calendly", cat: "productivity", icon: "🗓️", desc: "Let customers book calls and appointments automatically." },
    { id: "trello", name: "Trello", cat: "productivity", icon: "📋", desc: "Visual project boards for organizing tasks and workflows." },
    { id: "asana", name: "Asana", cat: "productivity", icon: "🎯", desc: "Project management and task tracking for your business." },
    { id: "zapier", name: "Zapier", cat: "productivity", icon: "⚡", desc: "Connect 5,000+ apps together with automated workflows.", popular: true },
    { id: "make", name: "Make (Integromat)", cat: "productivity", icon: "🔧", desc: "Visual automation builder for complex multi-step workflows." },
    // Analytics
    { id: "ga4", name: "Google Analytics", cat: "analytics", icon: "📈", desc: "Track website visitors, page views, conversions, and more.", popular: true },
    { id: "hotjar", name: "Hotjar", cat: "analytics", icon: "🔥", desc: "Heatmaps, session recordings, and user feedback for your website." },
    { id: "posthog", name: "PostHog", cat: "analytics", icon: "🦔", desc: "Product analytics, feature flags, and session replay." },
    // Suppliers / Dropship
    { id: "printful", name: "Printful", cat: "suppliers", icon: "👕", desc: "Print-on-demand for custom t-shirts, mugs, and more." },
    { id: "spocket", name: "Spocket", cat: "suppliers", icon: "📦", desc: "Dropshipping marketplace with US and EU suppliers." },
    { id: "cj-drop", name: "CJ Dropshipping", cat: "suppliers", icon: "🚢", desc: "Global dropshipping platform with sourcing and fulfillment." },
  ];

  const intCategories = [
    { id: "all", label: "All Tools", icon: "🔧" },
    { id: "chat", label: "Chat Apps", icon: "💬" },
    { id: "crm", label: "CRMs", icon: "👥" },
    { id: "ads", label: "Ad Platforms", icon: "📢" },
    { id: "ecommerce", label: "eCommerce", icon: "🛒" },
    { id: "ai", label: "AI Models", icon: "🤖" },
    { id: "docs", label: "Documents & Storage", icon: "📁" },
    { id: "email", label: "Email & Marketing", icon: "📧" },
    { id: "social", label: "Social Media", icon: "📱" },
    { id: "productivity", label: "Productivity", icon: "⚡" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "suppliers", label: "Suppliers", icon: "📦" },
  ];

  const toggleConnect = (id) => {
    setConnectedTools(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    setShowIntModal(null);
  };

  const filteredIntegrations = allIntegrations.filter(i => {
    const matchCat = intCategory === "all" || i.cat === intCategory;
    const matchSearch = !intSearch || i.name.toLowerCase().includes(intSearch.toLowerCase()) || i.desc.toLowerCase().includes(intSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const sidebarItems = [
    { id: "dashboard", label: "Command Center", icon: <Icons.Home /> },
    { id: "agents", label: "Agent Office", icon: <Icons.Users /> },
    { id: "approvals", label: "Approvals", icon: <Icons.Check />, badge: 2 },
    { id: "integrations", label: "Integrations", icon: <Icons.Layout /> },
    { id: "website", label: "My Website", icon: <Icons.Globe /> },
    { id: "docs", label: "Documents", icon: <Icons.File /> },
    { id: "analytics", label: "Analytics", icon: <Icons.BarChart2 /> },
    { id: "daily", label: "Daily Brief", icon: <Icons.Briefcase /> },
    { id: "onboarding", label: "Setup Guide", icon: <Icons.Rocket /> },
    { id: "settings", label: "Settings", icon: <Icons.Settings /> },
  ];

  // Responsive check
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check(); window.addEventListener("resize", check); return () => window.removeEventListener("resize", check);
  }, []);

  // ============================================================
  // LANDING PAGE
  // ============================================================
  const LandingPage = () => (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${t.bg} 0%, #0D1B3E 50%, #1A0B2E 100%)`, color: t.text }}>
      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "16px 16px" : "20px 40px", maxWidth: 1200, margin: "0 auto", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 800, color: t.primary }}>
          <span style={{ color: t.accent }}>Launch</span>Based
        </div>
        <div style={{ display: "flex", gap: isMobile ? 6 : 12, alignItems: "center" }}>
          {!isMobile && <Btn variant="ghost" size="sm" t={t} onClick={() => setPage("orderForm")}>Pricing</Btn>}
          {!isMobile && <Btn variant="ghost" size="sm" t={t}>Book a Demo</Btn>}
          <Btn size="sm" t={t} onClick={() => setPage("orderForm")}>Get Started</Btn>
          <div onClick={() => setIsDark(!isDark)} style={{ cursor: "pointer", color: t.textSec, display: "flex", padding: 8 }}>
            {isDark ? <Icons.Sun /> : <Icons.Moon />}
          </div>
        </div>
      </div>

      {/* Hero */}
      <div style={{ textAlign: "center", padding: isMobile ? "40px 16px 24px" : "80px 20px 40px", maxWidth: 800, margin: "0 auto" }}>
        <div style={{ display: "inline-block", padding: "6px 16px", borderRadius: 20, background: `${t.accent}22`, color: t.accent, fontSize: isMobile ? 12 : 14, fontWeight: 600, marginBottom: isMobile ? 16 : 24 }}>
          Your AI Team Is Ready To Work
        </div>
        <h1 style={{ fontSize: isMobile ? 28 : 56, fontWeight: 800, lineHeight: 1.1, margin: "0 0 20px", background: `linear-gradient(135deg, ${t.text} 0%, ${t.primary} 50%, ${t.accent} 100%)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          Build Your Business With AI Agents That Work 24/7
        </h1>
        <p style={{ fontSize: isMobile ? 16 : 20, color: t.textSec, lineHeight: 1.6, margin: "0 0 32px" }}>
          No coding. No tech skills. Just tell us about your business, and we set up a team of AI agents that builds your website, creates content, finds customers, and grows your business while you sleep.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Btn size={isMobile ? "md" : "lg"} t={t} onClick={() => setPage("orderForm")}><Icons.Rocket /> Start Building My Business</Btn>
          <Btn variant="secondary" size={isMobile ? "md" : "lg"} t={t}>Book a Free Demo Call</Btn>
        </div>
      </div>

      {/* Feature cards */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 16, padding: isMobile ? "32px 16px" : "60px 40px", maxWidth: 1100, margin: "0 auto" }}>
        {[
          { icon: "🌐", title: "Website Built For You", desc: "We build your professional website automatically. See a live preview before you sign up." },
          { icon: "🤖", title: "8 AI Agents On Your Team", desc: "A content writer, researcher, sales rep, SEO expert, and more — all working for your business." },
          { icon: "📱", title: "Manage From Your Phone", desc: "Talk to your AI team from Discord, Slack, or text. Approve their work with one tap." },
        ].map((f, i) => (
          <Card key={i} t={t} style={{ textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{f.icon}</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: t.text, margin: "0 0 12px" }}>{f.title}</h3>
            <p style={{ fontSize: 15, color: t.textSec, lineHeight: 1.5, margin: 0 }}>{f.desc}</p>
          </Card>
        ))}
      </div>

      {/* Social proof */}
      <div style={{ textAlign: "center", padding: "40px 20px 80px" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginBottom: 12 }}>
          {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#F59E0B" }}><Icons.Star /></span>)}
        </div>
        <p style={{ color: t.textSec, fontSize: 16 }}>Join 2,000+ solopreneurs already building with LaunchBased</p>
      </div>
    </div>
  );

  // ============================================================
  // ORDER FORM
  // ============================================================
  const OrderFormPage = () => {
    const steps = ["About You", "Your Business", "Your Goals", "Design", "Preview"];
    const goalOptions = ["Get more customers", "Build a website", "Start selling online", "Save time", "Create content", "Grow on social media"];
    const themes = [
      { id: "modern", name: "Modern Clean", colors: ["#3B82F6", "#1E293B", "#F8FAFC"] },
      { id: "bold", name: "Bold & Colorful", colors: ["#EC4899", "#8B5CF6", "#FDE68A"] },
      { id: "pro", name: "Professional", colors: ["#1E40AF", "#374151", "#F3F4F6"] },
      { id: "minimal", name: "Minimal", colors: ["#000000", "#6B7280", "#FFFFFF"] },
      { id: "warm", name: "Warm & Friendly", colors: ["#EA580C", "#92400E", "#FFF7ED"] },
      { id: "tech", name: "Tech / Futuristic", colors: ["#06B6D4", "#0F172A", "#22D3EE"] },
    ];

    return (
      <div style={{ minHeight: "100vh", background: t.bg, color: t.text }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "12px 16px" : "16px 32px", borderBottom: `1px solid ${t.border}` }}>
          <div onClick={() => setPage("landing")} style={{ cursor: "pointer", fontSize: isMobile ? 18 : 22, fontWeight: 800, color: t.primary }}>
            <span style={{ color: t.accent }}>Launch</span>Based
          </div>
          <div onClick={() => setIsDark(!isDark)} style={{ cursor: "pointer", color: t.textSec, display: "flex", padding: 8 }}>
            {isDark ? <Icons.Sun /> : <Icons.Moon />}
          </div>
        </div>

        <div style={{ maxWidth: 640, margin: "0 auto", padding: isMobile ? "20px 16px" : "32px 20px" }}>
          {/* Progress */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, gap: 4 }}>
              {steps.map((s, i) => (
                <div key={i} style={{ fontSize: isMobile ? 10 : 12, fontWeight: formStep === i ? 700 : 400, color: formStep === i ? t.primary : i < formStep ? t.success : t.textMuted, textAlign: "center", flex: 1 }}>
                  {i < formStep ? "✓ " : ""}{isMobile ? s.split(" ")[0] : s}
                </div>
              ))}
            </div>
            <ProgressBar value={((formStep) / (steps.length - 1)) * 100} t={t} height={6} />
          </div>

          {/* Step content */}
          <Card t={t} hover={false} style={{ padding: 32 }}>
            {formStep === 0 && (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: t.text }}>Let's get to know you!</h2>
                <p style={{ color: t.textSec, margin: "0 0 24px", fontSize: 15 }}>This takes about 5 minutes. Your info is safe with us.</p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 0 : 16 }}>
                  <Input label="First Name" tooltip="What should we call you?" placeholder="Sara" value={form.firstName} onChange={v => setForm({ ...form, firstName: v })} t={t} required />
                  <Input label="Last Name" placeholder="Johnson" value={form.lastName} onChange={v => setForm({ ...form, lastName: v })} t={t} required />
                </div>
                <Input label="Email Address" tooltip="We will send your login link here." placeholder="sara@example.com" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} t={t} required />
                <Input label="Phone Number" tooltip="Optional. We can text you updates if you want." placeholder="(555) 123-4567" type="tel" value={form.phone} onChange={v => setForm({ ...form, phone: v })} t={t} />
              </>
            )}
            {formStep === 1 && (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: t.text }}>Tell us about your business</h2>
                <p style={{ color: t.textSec, margin: "0 0 24px", fontSize: 15 }}>Even if you're just getting started, that's totally fine!</p>
                <Input label="Business Name" tooltip="What is your business called? You can change this later." placeholder="Sara's Bakery" value={form.bizName} onChange={v => setForm({ ...form, bizName: v })} t={t} required />
                <TextArea label="What does your business do?" tooltip="In a few sentences, tell us what you sell or what service you offer. Write it like you're telling a friend." placeholder="I make custom cakes and pastries for special events..." value={form.bizDesc} onChange={v => setForm({ ...form, bizDesc: v })} t={t} required />
                <TextArea label="Who is your ideal customer?" tooltip="Who buys from you? Example: Busy moms who want healthy meal prep delivered." placeholder="Couples planning weddings, parents planning birthdays..." value={form.idealCustomer} onChange={v => setForm({ ...form, idealCustomer: v })} t={t} rows={2} />
                <Select label="Business Type" tooltip="Pick the one that fits best. This helps us set up the right tools for you." options={["Online Store", "Service Business", "Content / Creator", "Consulting / Coaching", "Other"]} value={form.bizType} onChange={v => setForm({ ...form, bizType: v })} t={t} required />
              </>
            )}
            {formStep === 2 && (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: t.text }}>What are your goals?</h2>
                <p style={{ color: t.textSec, margin: "0 0 24px", fontSize: 15 }}>Pick the things that matter most right now. Your AI team will focus on these first.</p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 10, marginBottom: 20 }}>
                  {goalOptions.map(g => (
                    <div key={g} onClick={() => {
                      const goals = form.goals.includes(g) ? form.goals.filter(x => x !== g) : [...form.goals, g];
                      setForm({ ...form, goals });
                    }} style={{
                      padding: "12px 16px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 500,
                      border: `2px solid ${form.goals.includes(g) ? t.primary : t.border}`,
                      background: form.goals.includes(g) ? `${t.primary}15` : t.bg,
                      color: form.goals.includes(g) ? t.primary : t.text, transition: "all 0.2s",
                    }}>
                      {form.goals.includes(g) ? "✓ " : ""}{g}
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: t.bg, border: `1px solid ${t.border}` }}>
                  <span style={{ fontSize: 14, color: t.text, fontWeight: 600 }}>Do you already have a website?</span>
                  <div onClick={() => setForm({ ...form, hasWebsite: !form.hasWebsite })} style={{
                    width: 48, height: 26, borderRadius: 13, cursor: "pointer", transition: "all 0.2s",
                    background: form.hasWebsite ? t.primary : t.bgHover, padding: 2, display: "flex", alignItems: "center",
                  }}>
                    <div style={{ width: 22, height: 22, borderRadius: 11, background: "#FFF", transition: "all 0.2s", transform: form.hasWebsite ? "translateX(22px)" : "translateX(0)" }} />
                  </div>
                </div>
                {form.hasWebsite && <Input label="Current Website URL" placeholder="https://www.mybusiness.com" value={form.currentUrl} onChange={v => setForm({ ...form, currentUrl: v })} t={t} />}
                <Select label="Monthly Revenue Goal" tooltip="This helps your AI team set the right strategies for your stage." options={["Just starting out", "Under $1,000/month", "$1K - $5K/month", "$5K - $25K/month", "$25K - $100K/month", "$100K+/month"]} value={form.revenueGoal} onChange={v => setForm({ ...form, revenueGoal: v })} t={t} />
              </>
            )}
            {formStep === 3 && (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: t.text }}>Pick your website style</h2>
                <p style={{ color: t.textSec, margin: "0 0 24px", fontSize: 15 }}>Choose a look that feels like your brand. You can always change it later!</p>
                <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
                  {themes.map(th => (
                    <div key={th.id} onClick={() => setForm({ ...form, theme: th.id })} style={{
                      borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "all 0.2s",
                      border: `3px solid ${form.theme === th.id ? t.primary : t.border}`,
                      boxShadow: form.theme === th.id ? `0 0 20px ${t.primary}33` : "none",
                    }}>
                      <div style={{ display: "flex", height: 60 }}>
                        {th.colors.map((c, i) => <div key={i} style={{ flex: 1, background: c }} />)}
                      </div>
                      <div style={{ padding: "10px 12px", background: t.bgCard, textAlign: "center" }}>
                        <span style={{ fontSize: 13, fontWeight: form.theme === th.id ? 700 : 500, color: form.theme === th.id ? t.primary : t.text }}>{form.theme === th.id ? "✓ " : ""}{th.name}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 8 }}>Websites you like (optional) <TT text="Paste links to 1-3 websites whose design you like. We'll use them to find colors and styles that match your taste." t={t} /></p>
                {[0, 1, 2].map(i => (
                  <Input key={i} label="" placeholder={`https://website-i-like-${i + 1}.com`} value={form.inspireUrls[i]}
                    onChange={v => { const u = [...form.inspireUrls]; u[i] = v; setForm({ ...form, inspireUrls: u }); }} t={t} />
                ))}
                <div style={{ padding: 16, borderRadius: 12, background: `${t.warning}11`, border: `1px solid ${t.warning}33`, marginTop: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <span style={{ color: t.warning }}>💡</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: t.warning }}>Quick Name Check (Optional)</span>
                  </div>
                  <p style={{ fontSize: 13, color: t.textSec, margin: "0 0 12px", lineHeight: 1.5 }}>Want us to quickly check if "{form.bizName || "your business name"}" might conflict with an existing trademark? This is not legal advice — just a quick scan.</p>
                  <Btn variant="warning" size="sm" t={t}>Check My Business Name</Btn>
                </div>
              </>
            )}
            {formStep === 4 && (
              <>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: "0 0 8px", color: t.text }}>Here's your website preview!</h2>
                <p style={{ color: t.textSec, margin: "0 0 24px", fontSize: 15 }}>This is what your website will look like. Pretty cool, right?</p>

                {/* Mock website preview */}
                <div style={{ borderRadius: 12, overflow: "hidden", border: `2px solid ${t.border}`, marginBottom: 24 }}>
                  {/* Browser chrome */}
                  <div style={{ background: t.bgElevated, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${t.border}` }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#EF4444" }} />
                      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#F59E0B" }} />
                      <div style={{ width: 12, height: 12, borderRadius: 6, background: "#22C55E" }} />
                    </div>
                    <div style={{ flex: 1, background: t.bg, borderRadius: 6, padding: "4px 12px", fontSize: 12, color: t.textMuted }}>
                      lb-{(form.bizName || "your-business").toLowerCase().replace(/\s+/g, "-")}.ondigitalocean.app
                    </div>
                  </div>
                  {/* Mock site */}
                  <div style={{ background: themes.find(th => th.id === form.theme)?.colors[2] || "#F8FAFC" }}>
                    {/* Hero */}
                    <div style={{
                      background: `linear-gradient(135deg, ${themes.find(th => th.id === form.theme)?.colors[0] || "#3B82F6"}, ${themes.find(th => th.id === form.theme)?.colors[1] || "#1E293B"})`,
                      padding: "48px 24px", textAlign: "center", color: "#FFF",
                    }}>
                      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, opacity: 0.8, marginBottom: 8 }}>Welcome to</div>
                      <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 12px" }}>{form.bizName || "Your Business Name"}</h2>
                      <p style={{ fontSize: 16, opacity: 0.9, margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto" }}>
                        {form.bizDesc ? form.bizDesc.substring(0, 80) + "..." : "Your business description will appear here"}
                      </p>
                      <div style={{ display: "inline-block", background: "#FFF", color: themes.find(th => th.id === form.theme)?.colors[0] || "#3B82F6", padding: "10px 24px", borderRadius: 8, fontWeight: 700, fontSize: 14 }}>
                        Get Started Today
                      </div>
                    </div>
                    {/* Features */}
                    <div style={{ padding: isMobile ? "16px 12px" : "32px 24px", display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
                      {["Quality Products", "Fast Delivery", "24/7 Support"].map((f, i) => (
                        <div key={i} style={{ textAlign: "center", padding: 16 }}>
                          <div style={{ fontSize: 28, marginBottom: 8 }}>{["⭐", "🚀", "💬"][i]}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: "#1E293B" }}>{f}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <Btn size="lg" t={t} full onClick={() => { triggerConfetti(); setTimeout(() => setPage("onboarding"), 1500); }}>
                    <Icons.Rocket /> Let's Go! Start Building My Business
                  </Btn>
                </div>
                <Btn variant="secondary" size="md" t={t} full>I Have Questions — Book a Free Call</Btn>
                <p style={{ fontSize: 12, color: t.textMuted, textAlign: "center", marginTop: 12 }}>No demo required. You can sign up right now and start in minutes.</p>
              </>
            )}

            {/* Navigation buttons */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: `1px solid ${t.border}` }}>
              {formStep > 0 ? (
                <Btn variant="ghost" t={t} onClick={() => setFormStep(formStep - 1)}>
                  <Icons.ArrowLeft /> Back
                </Btn>
              ) : (
                <Btn variant="ghost" t={t} onClick={() => setPage("landing")}>
                  <Icons.ArrowLeft /> Home
                </Btn>
              )}
              {formStep < 4 && (
                <Btn t={t} onClick={() => setFormStep(formStep + 1)}>
                  {formStep === 3 ? "See My Website Preview" : "Next"} <Icons.ChevronRight />
                </Btn>
              )}
            </div>
          </Card>

          {formStep < 4 && (
            <p style={{ textAlign: "center", color: t.textMuted, fontSize: 13, marginTop: 16 }}>
              Your progress is saved automatically. You can come back anytime.
            </p>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // ONBOARDING DASHBOARD
  // ============================================================
  const OnboardingPage = () => (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 8px" }}>Welcome aboard, {form.firstName || "there"}! 🎉</h1>
        <p style={{ color: t.textSec, fontSize: 16, margin: 0 }}>Let's get your business set up. Follow these steps and you'll be ready to go in minutes.</p>
      </div>

      {/* Progress card */}
      <Card t={t} hover={false} style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: t.text }}>Setup Progress</span>
          <span style={{ fontSize: 24, fontWeight: 800, color: onboardProgress === 100 ? t.success : t.primary }}>{onboardProgress}%</span>
        </div>
        <ProgressBar value={onboardProgress} t={t} height={12} color={onboardProgress === 100 ? t.success : undefined} />
        <p style={{ fontSize: 13, color: t.textSec, marginTop: 8, marginBottom: 0 }}>{completedSteps} of {totalSteps} steps complete</p>
      </Card>

      {/* Steps */}
      {onboardSteps.map((step, i) => (
        <Card key={step.id} t={t} hover={!step.done} style={{ marginBottom: 12, padding: "16px 20px", opacity: step.done ? 0.7 : 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
              background: step.done ? t.success : i === onboardSteps.findIndex(s => !s.done) ? t.primary : t.bgHover,
              color: "#FFF", fontSize: 16, fontWeight: 700, flexShrink: 0,
            }}>
              {step.done ? "✓" : step.id}
            </div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: step.done ? t.textSec : t.text, textDecoration: step.done ? "line-through" : "none" }}>
                {step.label}
              </span>
            </div>
            {!step.done && (
              <div style={{ display: "flex", gap: 8 }}>
                {step.skippable && <Btn variant="ghost" size="sm" t={t} onClick={() => completeOnboardStep(step.id)}>Skip</Btn>}
                <Btn size="sm" t={t} onClick={() => completeOnboardStep(step.id)}>
                  {i === onboardSteps.findIndex(s => !s.done) ? "Do This Now" : "Complete"}
                </Btn>
              </div>
            )}
          </div>
        </Card>
      ))}

      {onboardProgress === 100 && (
        <Card t={t} hover={false} style={{ marginTop: 24, padding: 32, textAlign: "center", border: `2px solid ${t.success}` }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: t.success, margin: "0 0 8px" }}>You're All Set!</h2>
          <p style={{ color: t.textSec, margin: "0 0 20px" }}>Your AI team is ready to work. Head to the Command Center to see what they're doing!</p>
          <Btn size="lg" t={t} onClick={() => setPage("dashboard")}>Go to Command Center <Icons.ChevronRight /></Btn>
        </Card>
      )}
    </div>
  );

  // ============================================================
  // DASHBOARD (Command Center)
  // ============================================================
  const DashboardPage = () => {
    const workingAgents = agents.filter(a => a.status === "working");
    const pendingApprovals = agents.filter(a => a.status === "approval");

    // --- LIVE ACTIVITY FEED with streaming simulation ---
    const activityFeedData = [
      { agent: "Emma", emoji: "✍️", action: "writing", color: "#8B5CF6", streamText: "Spring is the perfect time to refresh your business strategy. Here are 10 proven ways to attract new customers this season:\n\n1. **Launch a seasonal promotion** — Create a limited-time offer tied to spring themes. Think fresh starts, spring cleaning sales, or \"new beginnings\" bundles.\n\n2. **Refresh your social media** — Update your cover photos, profile pictures, and bio to reflect the season. Post bright, energizing content.\n\n3. **Partner with local businesses** — Cross-promote with complementary businesses in your area. A bakery + florist collab for Mother's Day = magic.\n\n4. **Start a referral program** — Your happiest customers are your best marketers. Give them a reason to spread the word.", label: "Writing blog post: \"10 Ways to Grow Your Business This Spring\"" },
      { agent: "James", emoji: "🔍", action: "researching", color: "#3B82F6", streamText: "COMPETITOR ANALYSIS — March 14, 2026\n\n▸ Scanning competitor websites... 4 found\n▸ Analyzing pricing pages...\n  → CompetitorA: $49/mo starter, $99/mo pro, $249/mo business\n  → CompetitorB: $29/mo flat rate, no tiers\n  → CompetitorC: $79/mo + $0.02/action usage fee\n  → CompetitorD: Free tier available, $39/mo premium\n▸ Checking social media engagement...\n  → CompetitorA: 2.3K followers, 4.2% engagement rate\n  → CompetitorB: 890 followers, 1.8% engagement rate\n▸ Monitoring review sites...\n  → CompetitorA: 4.2★ on G2 (127 reviews)\n  → CompetitorC: 3.8★ on Capterra (43 reviews)\n▸ Key insight: CompetitorA launched a 20% spring discount 2 days ago\n▸ Recommendation: Consider matching or differentiating with a value-add bundle", label: "Analyzing competitor pricing and market positioning" },
      { agent: "Olivia", emoji: "📧", action: "outreach", color: "#22C55E", streamText: "OUTREACH CAMPAIGN — Warm Lead Follow-ups\n\n▸ Loading lead list... 12 warm leads found\n▸ Personalizing email #1 of 12...\n  To: sarah.chen@freshfoods.co\n  Subject: Quick follow-up on your demo request\n  Body: Hi Sarah, I noticed you checked out our meal prep automation tools last week. I'd love to show you how other food businesses are saving 15 hours/week...\n▸ Personalizing email #2 of 12...\n  To: mike.torres@urbanfit.com\n  Subject: The fitness studio growth hack you asked about\n  Body: Hey Mike, Great chatting at the conference last week. You mentioned wanting to automate your class scheduling...\n▸ Checking send limits... 47/100 daily limit remaining ✓\n▸ Running spam score check... Score: 2.1 (excellent)\n▸ Scheduling sends for optimal delivery times...\n  → 3 emails queued for 9:15 AM EST\n  → 4 emails queued for 1:30 PM EST\n  → 5 emails queued for 4:00 PM EST", label: "Personalizing follow-up emails for 12 warm leads" },
      { agent: "Sophia", emoji: "💬", action: "responding", color: "#F59E0B", streamText: "CUSTOMER SUPPORT — Active Tickets\n\n▸ Ticket #1847 — Priority: Medium\n  From: jenny.williams@email.com\n  Question: \"How do I change my subscription plan?\"\n  → Drafting response...\n  \"Hi Jenny! Great question. Here's how to change your plan:\n   1. Go to Settings (gear icon, top right)\n   2. Click 'Subscription'\n   3. Choose your new plan\n   4. Click 'Update'\n   Your new plan starts immediately and we'll prorate the difference. Let me know if you need any help!\"\n  → Response sent ✓ (avg response time: 47 seconds)\n\n▸ Ticket #1848 — Priority: High\n  From: robert.kim@techstart.io\n  Question: \"My checkout page isn't loading for customers\"\n  → Escalating to technical review...\n  → Checking Shopify API status... all systems operational\n  → Checking SSL certificate... valid through 2027-01-15\n  → Running page speed test... loading in 2.3s (acceptable)", label: "Responding to 3 customer support tickets" },
      { agent: "Ethan", emoji: "📊", action: "analyzing", color: "#EC4899", streamText: "WEEKLY PERFORMANCE REPORT — Generating...\n\n▸ Pulling revenue data...\n  This week:  $3,821 (+12.4% vs last week)\n  Last week:  $3,399\n  Monthly:    $14,207 (73% of $19,500 goal)\n\n▸ Pulling traffic data...\n  Website visits: 1,847 (+23% vs last week)\n  Unique visitors: 1,204\n  Bounce rate: 34% (improved from 41%)\n  Top pages: /products (34%), /about (21%), /blog (18%)\n\n▸ Pulling conversion data...\n  Email signups: 47 new subscribers\n  Contact form: 12 submissions\n  Purchases: 31 orders (1.67% conversion rate)\n\n▸ Pulling social media data...\n  Instagram: +89 followers, 4.7% engagement\n  Facebook: +34 followers, 2.1% engagement\n  Best post: Spring sale carousel (2,341 impressions)\n\n▸ AI Insights:\n  → Traffic spike correlates with Tuesday blog post\n  → Email open rate improved after subject line A/B test\n  → Recommend increasing ad spend on Instagram (best ROI)", label: "Generating weekly performance analytics report" },
      { agent: "Liam", emoji: "📈", action: "optimizing", color: "#06B6D4", streamText: "SEO OPTIMIZATION — Site Audit Running...\n\n▸ Crawling 47 pages...\n  → 42 pages indexed ✓\n  → 5 pages missing meta descriptions ⚠️\n  → 0 broken links ✓\n\n▸ Keyword rankings update:\n  → \"custom cakes near me\" — Position #4 (↑2)\n  → \"wedding cake delivery\" — Position #7 (↑5)\n  → \"birthday cake order online\" — Position #12 (→)\n  → \"bakery catering services\" — Position #18 (↑3)\n\n▸ Content gap analysis:\n  → Competitors ranking for \"gluten free cake\" — you have no content\n  → Competitors ranking for \"cake decorating ideas\" — you have 1 thin page\n  → Recommendation: Create 2 new blog posts targeting these keywords\n\n▸ Technical SEO:\n  → Page speed: 2.1s mobile, 1.3s desktop ✓\n  → Core Web Vitals: All passing ✓\n  → Schema markup: Added to 3 product pages\n  → Sitemap: Updated and submitted to Google", label: "Running full SEO audit and keyword tracking" },
      { agent: "Ava", emoji: "📱", action: "creating", color: "#F97316", streamText: "SOCIAL MEDIA — Creating this week's content...\n\n▸ Analyzing top-performing posts from last 30 days...\n  → Carousels: avg 342 impressions, 4.8% engagement\n  → Reels: avg 1,247 impressions, 6.2% engagement\n  → Single images: avg 198 impressions, 2.1% engagement\n  → Strategy: Prioritize reels and carousels this week\n\n▸ Creating Post #1 (Instagram Carousel):\n  → Topic: \"5 Things Every New Business Owner Needs to Know\"\n  → Slide 1: Bold hook text on brand-colored background\n  → Slide 2: Tip #1 — Start with one product, not ten\n  → Slide 3: Tip #2 — Your first 100 customers matter most\n  → Slide 4: Tip #3 — Consistency beats perfection\n  → Slide 5: CTA — \"Save this for later! Follow for more tips\"\n  → Hashtags: #smallbusiness #entrepreneur #biztips #startup2026\n  → Scheduled: Tuesday 11:30 AM EST (peak engagement time)\n\n▸ Creating Post #2 (Instagram Reel):\n  → Concept: Behind-the-scenes of a customer order being prepared\n  → Duration: 15 seconds\n  → Audio: Trending sound #spring2026\n  → Scheduled: Thursday 6:00 PM EST", label: "Planning and creating social media content for the week" },
    ];

    const [feedItems, setFeedItems] = useState([]);
    const [streamingIdx, setStreamingIdx] = useState(0);
    const [streamedChars, setStreamedChars] = useState(0);
    const [feedPaused, setFeedPaused] = useState(false);
    const feedRef = useCallback(node => {
      if (node) node.scrollTop = node.scrollHeight;
    }, [feedItems, streamedChars]);

    // Simulate streaming character by character
    useEffect(() => {
      if (feedPaused) return;
      const currentItem = activityFeedData[streamingIdx % activityFeedData.length];
      const fullText = currentItem.streamText;

      if (streamedChars < fullText.length) {
        // Stream characters — variable speed for realism
        const ch = fullText[streamedChars];
        const isNewline = ch === '\n';
        const isPunctuation = '.!?:'.includes(ch);
        const delay = isNewline ? 120 : isPunctuation ? 80 : (15 + Math.random() * 25);

        const timer = setTimeout(() => {
          setStreamedChars(prev => prev + 1);
        }, delay);
        return () => clearTimeout(timer);
      } else {
        // Current item done streaming — pause, then start next
        const timer = setTimeout(() => {
          setFeedItems(prev => {
            const newItems = [...prev, {
              ...currentItem,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
              id: Date.now(),
            }];
            return newItems.slice(-20); // Keep last 20 completed items
          });
          setStreamingIdx(prev => prev + 1);
          setStreamedChars(0);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }, [streamedChars, streamingIdx, feedPaused]);

    const currentStreamItem = activityFeedData[streamingIdx % activityFeedData.length];
    const currentStreamText = currentStreamItem.streamText.substring(0, streamedChars);

    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 4px" }}>
            Command Center
          </h1>
          <p style={{ color: t.textSec, fontSize: 15, margin: 0 }}>Here's what your AI team is up to right now.</p>
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: isMobile ? 8 : 16, marginBottom: 24 }}>
          {[
            { label: "Active Agents", value: "4", icon: "🤖", color: t.primary },
            { label: "Pending Approvals", value: "2", icon: "⏳", color: t.warning },
            { label: "Tasks Done Today", value: "12", icon: "✅", color: t.success },
            { label: "Leads This Week", value: "31", icon: "📈", color: t.accent },
          ].map((s, i) => (
            <Card key={i} t={t} style={{ padding: isMobile ? 12 : 20 }} onClick={s.label === "Pending Approvals" ? () => setPage("approvals") : undefined}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: isMobile ? 11 : 13, color: t.textSec, marginBottom: 4 }}>{s.label}</div>
                  <div style={{ fontSize: isMobile ? 24 : 32, fontWeight: 800, color: s.color }}>{s.value}</div>
                </div>
                <div style={{ fontSize: isMobile ? 20 : 28 }}>{s.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* ========== LIVE ACTIVITY FEED ========== */}
        <Card t={t} hover={false} style={{ padding: 0, marginBottom: 24, overflow: "hidden", border: `1px solid ${t.primary}33` }}>
          {/* Feed header */}
          <div style={{
            padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
            background: `linear-gradient(135deg, ${t.primary}15, ${t.accent}10)`,
            borderBottom: `1px solid ${t.border}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 10, height: 10, borderRadius: 5, background: feedPaused ? t.warning : "#22C55E",
                boxShadow: feedPaused ? "none" : "0 0 8px #22C55E88, 0 0 16px #22C55E44",
                animation: feedPaused ? "none" : "pulse-glow 2s ease-in-out infinite",
              }} />
              <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: 0 }}>Live Agent Activity</h3>
              <span style={{ fontSize: 12, color: t.textMuted, fontFamily: "monospace" }}>
                {feedPaused ? "PAUSED" : "STREAMING"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant={feedPaused ? "primary" : "ghost"} size="sm" t={t} onClick={() => setFeedPaused(!feedPaused)}>
                {feedPaused ? "▶ Resume" : "⏸ Pause"}
              </Btn>
            </div>
          </div>

          {/* Streaming content area */}
          <div ref={feedRef} style={{
            height: isMobile ? 320 : 380, overflowY: "auto", padding: "0 4px",
            background: `linear-gradient(180deg, ${t.bg} 0%, ${t.bgCard} 100%)`,
          }}>
            {/* Completed feed items (collapsed) */}
            {feedItems.map((item) => (
              <div key={item.id} style={{
                padding: "10px 16px", borderBottom: `1px solid ${t.border}`,
                opacity: 0.6, transition: "opacity 0.3s",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{item.emoji}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.agent}</span>
                  <span style={{ fontSize: 12, color: t.textMuted }}>completed</span>
                  <span style={{ fontSize: 12, color: t.textSec, flex: 1 }}>{item.label}</span>
                  <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "monospace" }}>{item.timestamp}</span>
                  <span style={{ color: t.success, fontSize: 12 }}>✓</span>
                </div>
              </div>
            ))}

            {/* Currently streaming item */}
            <div style={{
              padding: "16px 16px 20px", background: `${currentStreamItem.color}08`,
              borderLeft: `3px solid ${currentStreamItem.color}`,
              minHeight: 200,
            }}>
              {/* Agent header */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, background: `${currentStreamItem.color}20`, border: `1px solid ${currentStreamItem.color}44`,
                }}>{currentStreamItem.emoji}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: currentStreamItem.color }}>{currentStreamItem.agent}</span>
                    <div style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                      background: `${currentStreamItem.color}20`, color: currentStreamItem.color,
                    }}>
                      <span style={{
                        width: 6, height: 6, borderRadius: 3, background: currentStreamItem.color,
                        animation: "pulse-glow 1s ease-in-out infinite",
                      }} />
                      {currentStreamItem.action}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: t.textSec }}>{currentStreamItem.label}</div>
                </div>
              </div>

              {/* Streaming text output */}
              <div style={{
                fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontSize: 12, lineHeight: 1.7, color: t.text,
                padding: "12px 16px", borderRadius: 8,
                background: t.bg, border: `1px solid ${t.border}`,
                whiteSpace: "pre-wrap", wordBreak: "break-word",
                minHeight: 120, position: "relative",
              }}>
                {currentStreamText}
                {/* Blinking cursor */}
                {!feedPaused && streamedChars < currentStreamItem.streamText.length && (
                  <span style={{
                    display: "inline-block", width: 7, height: 16,
                    background: currentStreamItem.color, marginLeft: 1,
                    animation: "blink-cursor 0.8s step-end infinite",
                    verticalAlign: "text-bottom",
                  }} />
                )}
              </div>

              {/* Progress for current stream */}
              <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 10 }}>
                <ProgressBar value={(streamedChars / currentStreamItem.streamText.length) * 100} t={t} height={3} color={currentStreamItem.color} />
                <span style={{ fontSize: 11, color: t.textMuted, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                  {Math.round((streamedChars / currentStreamItem.streamText.length) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Feed footer */}
          <div style={{
            padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center",
            borderTop: `1px solid ${t.border}`, background: t.bgCard,
          }}>
            <span style={{ fontSize: 11, color: t.textMuted }}>
              {feedItems.length} actions completed this session
            </span>
            <div style={{ display: "flex", gap: 12 }}>
              {agents.filter(a => a.status === "working").map(a => (
                <span key={a.name} title={`${a.name} — ${a.role}`} style={{
                  fontSize: 16, opacity: currentStreamItem.agent === a.name ? 1 : 0.4,
                  transition: "opacity 0.3s",
                }}>{a.emoji}</span>
              ))}
            </div>
          </div>
        </Card>

        {/* Animations */}
        <style>{`
          @keyframes pulse-glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          @keyframes blink-cursor {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>

        {/* Active work */}
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <Card t={t} hover={false} style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: t.primary }}>⚡</span> Working Now
            </h3>
            {workingAgents.map(a => (
              <div key={a.name} style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: t.bg, border: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, color: t.text }}>{a.emoji} {a.name} <span style={{ fontWeight: 400, color: t.textSec, fontSize: 13 }}>({a.role})</span></span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>{a.progress}%</span>
                </div>
                <div style={{ fontSize: 13, color: t.textSec, marginBottom: 8 }}>{a.task}</div>
                <ProgressBar value={a.progress} t={t} height={6} />
              </div>
            ))}
          </Card>

          <Card t={t} hover={false} style={{ padding: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: t.warning }}>⏳</span> Needs Your Approval
            </h3>
            {pendingApprovals.map(a => (
              <div key={a.name} style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 10, background: t.bg, border: `1px solid ${t.warning}44` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ fontWeight: 600, color: t.text }}>{a.emoji} {a.name}</span>
                  <Badge text="Ready for Review" color={t.warning} t={t} />
                </div>
                <div style={{ fontSize: 13, color: t.textSec, marginBottom: 12 }}>{a.task}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="success" size="sm" t={t}>✓ Approve</Btn>
                  <Btn variant="warning" size="sm" t={t}>✏️ Revise</Btn>
                  <Btn variant="danger" size="sm" t={t}>✕ Block</Btn>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Chart */}
        <Card t={t} hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: "0 0 20px" }}>This Week's Activity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: t.textSec, fontSize: 12 }} axisLine={{ stroke: t.border }} tickLine={false} />
              <YAxis tick={{ fill: t.textSec, fontSize: 12 }} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
              <Bar dataKey="leads" fill={t.primary} radius={[4, 4, 0, 0]} />
              <Bar dataKey="content" fill={t.accent} radius={[4, 4, 0, 0]} />
              <Bar dataKey="sales" fill={t.success} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 20, justifyContent: "center", marginTop: 12 }}>
            {[{ label: "Leads", color: t.primary }, { label: "Content", color: t.accent }, { label: "Sales", color: t.success }].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
                <span style={{ fontSize: 12, color: t.textSec }}>{l.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  // ============================================================
  // AGENT OFFICE
  // ============================================================
  const AgentOfficePage = () => {
    const tables = [
      { label: "Working", emoji: "⚡", color: t.primary, agents: agents.filter(a => a.status === "working") },
      { label: "Needs Approval", emoji: "⏳", color: t.warning, agents: agents.filter(a => a.status === "approval") },
      { label: "Idle (Available)", emoji: "💤", color: t.textMuted, agents: agents.filter(a => a.status === "idle") },
    ];
    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 4px" }}>Agent Office</h1>
          <p style={{ color: t.textSec, fontSize: 15, margin: 0 }}>Your AI team's workspace. See who's working, who needs your review, and who's available.</p>
        </div>

        {tables.map(table => (
          <div key={table.label} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <span style={{ fontSize: 22 }}>{table.emoji}</span>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: table.color, margin: 0 }}>{table.label}</h2>
              <div style={{ background: `${table.color}22`, color: table.color, padding: "2px 10px", borderRadius: 12, fontSize: 13, fontWeight: 700 }}>{table.agents.length}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 14 }}>
              {table.agents.map(a => (
                <Card key={a.name} t={t} style={{ padding: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: 26, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 26, background: `${table.color}15`, border: `2px solid ${table.color}44`,
                    }}>{a.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 16, color: t.text }}>{a.name}</div>
                      <div style={{ fontSize: 13, color: t.textSec }}>{a.role}</div>
                    </div>
                    <Badge text={a.status === "working" ? "Working" : a.status === "approval" ? "Review" : "Available"} color={table.color} t={t} />
                  </div>
                  {a.task && (
                    <div style={{ marginTop: 12, padding: "10px 14px", borderRadius: 8, background: t.bg, border: `1px solid ${t.border}` }}>
                      <div style={{ fontSize: 13, color: t.textSec, marginBottom: 6 }}>{a.task}</div>
                      {a.progress > 0 && a.progress < 100 && <ProgressBar value={a.progress} t={t} height={4} color={table.color} />}
                    </div>
                  )}
                  {a.status === "idle" && (
                    <div style={{ marginTop: 12 }}>
                      <Btn size="sm" t={t} full>Assign a Task</Btn>
                    </div>
                  )}
                  {a.status === "approval" && (
                    <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                      <Btn variant="success" size="sm" t={t} style={{ flex: 1 }}>✓ Approve</Btn>
                      <Btn variant="warning" size="sm" t={t} style={{ flex: 1 }}>✏️ Revise</Btn>
                      <Btn variant="danger" size="sm" t={t} style={{ flex: 1 }}>✕ Block</Btn>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ============================================================
  // APPROVALS PAGE
  // ============================================================
  const ApprovalsPage = () => {
    const items = [
      { agent: "Olivia", emoji: "📧", type: "Email Campaign", title: "Follow-up email to 12 warm leads", preview: "Hi [Name],\n\nI wanted to follow up on our conversation about [product]. I know you mentioned you were interested in...", status: "pending" },
      { agent: "Ava", emoji: "📱", type: "Social Media", title: "3 Instagram posts for this week", preview: "Post 1: Behind-the-scenes of our new product launch\nPost 2: Customer testimonial spotlight\nPost 3: Tips & tricks carousel", status: "pending" },
      { agent: "Emma", emoji: "✍️", type: "Blog Post", title: "\"10 Ways to Grow Your Small Business in 2026\"", preview: "Starting a business is exciting, but growing it can feel overwhelming. Here are 10 proven ways to take your small business to the next level this year...", status: "approved" },
    ];

    return (
      <div>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 4px" }}>Approvals</h1>
          <p style={{ color: t.textSec, fontSize: 15, margin: 0 }}>Review what your AI team has done before it goes live. You're always in control.</p>
        </div>

        {items.map((item, i) => (
          <Card key={i} t={t} hover={false} style={{ marginBottom: 16, padding: 24, border: item.status === "pending" ? `1px solid ${t.warning}44` : `1px solid ${t.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{item.emoji}</span>
                <div>
                  <div style={{ fontWeight: 700, color: t.text }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: t.textSec }}>By {item.agent} • {item.type}</div>
                </div>
              </div>
              <Badge text={item.status === "pending" ? "Needs Review" : "Approved ✓"} color={item.status === "pending" ? t.warning : t.success} t={t} />
            </div>
            <div style={{
              padding: 16, borderRadius: 8, background: t.bg, border: `1px solid ${t.border}`,
              fontSize: 14, color: t.textSec, lineHeight: 1.6, whiteSpace: "pre-line", marginBottom: 16, maxHeight: 120, overflow: "hidden",
            }}>{item.preview}</div>
            {item.status === "pending" && (
              <div style={{ display: "flex", gap: 10 }}>
                <Btn variant="success" size="sm" t={t} onClick={triggerConfetti}>✓ Approve</Btn>
                <Btn variant="warning" size="sm" t={t}>✏️ Revise</Btn>
                <Btn variant="danger" size="sm" t={t}>✕ Block</Btn>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  // ============================================================
  // WEBSITE PAGE
  // ============================================================
  const WebsitePage = () => (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 4px" }}>My Website</h1>
        <p style={{ color: t.textSec, fontSize: 15, margin: 0 }}>Your website is live! Here's where you can manage it.</p>
      </div>

      <Card t={t} hover={false} style={{ marginBottom: 20, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, color: t.textSec, marginBottom: 4 }}>Your website URL</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: t.primary }}>lb-{(form.bizName || "your-business").toLowerCase().replace(/\s+/g, "-")}.ondigitalocean.app</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn size="sm" t={t}><Icons.Globe /> Visit Website</Btn>
            <Btn variant="secondary" size="sm" t={t}><Icons.Send /> Share Link</Btn>
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <Card t={t} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 12px" }}>📝 Edit Website Content</h3>
          <p style={{ fontSize: 14, color: t.textSec, margin: "0 0 16px", lineHeight: 1.5 }}>Change text, swap images, or add new sections. Or just ask Emma (your content writer) to update it for you!</p>
          <Btn size="sm" t={t} full>Open Editor</Btn>
        </Card>
        <Card t={t} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 12px" }}>🌐 Connect Custom Domain</h3>
          <p style={{ fontSize: 14, color: t.textSec, margin: "0 0 16px", lineHeight: 1.5 }}>Use your own domain name like www.yourbusiness.com instead of the default URL.</p>
          <Btn variant="accent" size="sm" t={t} full>Set Up My Domain</Btn>
        </Card>
      </div>

      {/* Domain setup card */}
      <Card t={t} hover={false} style={{ padding: 24, border: `1px solid ${t.accent}44` }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: "0 0 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <Icons.Globe /> Connect Your Domain
          <TT text="Type the domain name you bought from GoDaddy, Namecheap, or any other provider. Don't include https:// or www." t={t} />
        </h3>
        <Input label="Your Domain Name" placeholder="yourbusiness.com" value="" onChange={() => {}} t={t} tooltip="Just type the domain name. Example: sarasbakery.com" />
        <Btn t={t}>Check Domain</Btn>

        <div style={{ marginTop: 20, padding: 16, borderRadius: 10, background: t.bg, border: `1px solid ${t.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 12 }}>After you enter your domain, we'll show you one simple step:</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)", gap: 12 }}>
            {[
              { label: "Type", value: "CNAME" },
              { label: "Name / Host", value: "www" },
              { label: "Points To", value: `lb-${(form.bizName || "business").toLowerCase().replace(/\s+/g, "-")}.ondigitalocean.app` },
              { label: "TTL", value: "Auto" },
            ].map((r, i) => (
              <div key={i} style={{ padding: 10, borderRadius: 8, background: t.bgElevated, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{r.label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.primary, wordBreak: "break-all" }}>{r.value}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: t.textMuted, marginTop: 12, marginBottom: 0 }}>
            We have video guides for GoDaddy, Namecheap, Cloudflare, and more. Just 60 seconds each!
          </p>
        </div>
      </Card>
    </div>
  );

  // ============================================================
  // ANALYTICS PAGE
  // ============================================================
  const AnalyticsPage = () => (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 4px" }}>Analytics</h1>
        <p style={{ color: t.textSec, fontSize: 15, margin: 0 }}>Simple charts showing how your business and AI team are doing.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        <Card t={t} hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 16px" }}>Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <XAxis dataKey="name" tick={{ fill: t.textSec, fontSize: 12 }} axisLine={{ stroke: t.border }} tickLine={false} />
              <YAxis tick={{ fill: t.textSec, fontSize: 12 }} axisLine={false} tickLine={false} />
              <ReTooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
              <Line type="monotone" dataKey="leads" stroke={t.primary} strokeWidth={2} dot={{ fill: t.primary, r: 4 }} />
              <Line type="monotone" dataKey="content" stroke={t.accent} strokeWidth={2} dot={{ fill: t.accent, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card t={t} hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 16px" }}>Agent Workload</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <ReTooltip contentStyle={{ background: t.bgElevated, border: `1px solid ${t.border}`, borderRadius: 8, color: t.text }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {pieData.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: p.color }} />
                <span style={{ fontSize: 12, color: t.textSec }}>{p.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  // ============================================================
  // DAILY BRIEF
  // ============================================================
  const DailyBriefPage = () => (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 4px" }}>Daily Brief ☀️</h1>
        <p style={{ color: t.textSec, fontSize: 15, margin: 0 }}>Your morning summary — everything you need to know to start your day.</p>
      </div>
      <Card t={t} hover={false} style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: t.textMuted, marginBottom: 16 }}>
          <Icons.Clock /> March 14, 2026 • Generated at 7:00 AM
        </div>
        {[
          { emoji: "📈", title: "Leads Update", text: "James found 7 new leads yesterday from LinkedIn outreach. 3 opened Olivia's follow-up emails. 1 booked a call!" },
          { emoji: "✍️", title: "Content Published", text: "Emma published 2 blog posts and 4 social media posts yesterday. The Instagram carousel about spring tips got 142 likes." },
          { emoji: "🔍", title: "Competitor Alert", text: "James noticed your main competitor launched a 20% off sale. Want Olivia to create a matching promotion?" },
          { emoji: "⚠️", title: "Needs Your Attention", text: "2 items in your approval queue: Olivia's email campaign (12 leads) and Ava's Instagram posts for next week." },
          { emoji: "💰", title: "Revenue", text: "3 new orders came in overnight totaling $247. Your monthly total is now $3,821." },
        ].map((item, i) => (
          <div key={i} style={{ padding: 16, borderRadius: 10, background: t.bg, border: `1px solid ${t.border}`, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{item.emoji}</span>
              <span style={{ fontWeight: 700, color: t.text, fontSize: 15 }}>{item.title}</span>
            </div>
            <p style={{ color: t.textSec, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{item.text}</p>
          </div>
        ))}
      </Card>
    </div>
  );

  // ============================================================
  // DOCUMENTS PAGE
  // ============================================================
  const DocsPage = () => (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 4px" }}>Documents</h1>
        <p style={{ color: t.textSec, fontSize: 15, margin: 0 }}>Everything your AI team has created — blog posts, emails, reports, and more.</p>
      </div>
      {[
        { title: "10 Ways to Grow Your Small Business in 2026", agent: "Emma", type: "Blog Post", date: "Today", icon: "📝" },
        { title: "Weekly Performance Report", agent: "Ethan", type: "Report", date: "Today", icon: "📊" },
        { title: "Instagram Content Calendar - March", agent: "Ava", type: "Social Media Plan", date: "Yesterday", icon: "📅" },
        { title: "Competitor Pricing Analysis", agent: "James", type: "Research", date: "Yesterday", icon: "🔍" },
        { title: "Welcome Email Sequence (3 emails)", agent: "Olivia", type: "Email Campaign", date: "2 days ago", icon: "📧" },
        { title: "SEO Keyword Report", agent: "Liam", type: "SEO Report", date: "3 days ago", icon: "📈" },
      ].map((doc, i) => (
        <Card key={i} t={t} style={{ marginBottom: 10, padding: "14px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ fontSize: 24 }}>{doc.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: t.text, fontSize: 15 }}>{doc.title}</div>
              <div style={{ fontSize: 13, color: t.textSec }}>By {doc.agent} • {doc.type} • {doc.date}</div>
            </div>
            <Btn variant="ghost" size="sm" t={t}>View</Btn>
          </div>
        </Card>
      ))}
    </div>
  );

  // ============================================================
  // SETTINGS PAGE
  // ============================================================
  // ============================================================
  // INTEGRATIONS PAGE (Full Marketplace)
  // ============================================================
  const IntegrationsPage = () => (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 4px" }}>Integrations</h1>
        <p style={{ color: t.textSec, fontSize: 15, margin: 0 }}>Connect your favorite tools so your AI team can work with them. One click to connect — no tech skills needed.</p>
      </div>

      {/* Search + connected count */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <input placeholder="Search tools... (e.g. Shopify, Gmail, HubSpot)" value={intSearch} onChange={e => setIntSearch(e.target.value)}
            style={{
              width: "100%", boxSizing: "border-box", padding: "12px 16px 12px 40px", fontSize: 15, borderRadius: 10,
              border: `1px solid ${t.border}`, background: t.bgCard, color: t.text, outline: "none",
            }}
            onFocus={e => e.target.style.borderColor = t.borderActive}
            onBlur={e => e.target.style.borderColor = t.border} />
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: t.textMuted, fontSize: 16 }}>🔍</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: `${t.success}15`, border: `1px solid ${t.success}33` }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: t.success }}>{connectedTools.length}</span>
          <span style={{ fontSize: 13, color: t.textSec }}>Connected</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 10, background: `${t.primary}15`, border: `1px solid ${t.primary}33` }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: t.primary }}>{allIntegrations.length}</span>
          <span style={{ fontSize: 13, color: t.textSec }}>Available</span>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
        {intCategories.map(cat => (
          <div key={cat.id} onClick={() => setIntCategory(cat.id)}
            style={{
              padding: "8px 14px", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap",
              fontSize: 13, fontWeight: intCategory === cat.id ? 700 : 500, transition: "all 0.15s",
              background: intCategory === cat.id ? `${t.primary}20` : t.bgCard,
              color: intCategory === cat.id ? t.primary : t.textSec,
              border: `1px solid ${intCategory === cat.id ? t.primary + "44" : t.border}`,
            }}>
            {cat.icon} {cat.label}
          </div>
        ))}
      </div>

      {/* Popular / Recommended row (only show on "all") */}
      {intCategory === "all" && !intSearch && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 14px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: t.warning }}>⭐</span> Popular & Recommended
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12 }}>
            {allIntegrations.filter(i => i.popular).slice(0, 9).map(integ => {
              const isConn = connectedTools.includes(integ.id);
              return (
                <Card key={integ.id} t={t} style={{ padding: 16 }} onClick={() => !isConn && setShowIntModal(integ.id)}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 22, background: `${t.primary}10`, border: `1px solid ${t.border}`,
                    }}>{integ.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{integ.name}</div>
                      <div style={{ fontSize: 11, color: t.textMuted, textTransform: "capitalize" }}>{integ.cat}</div>
                    </div>
                    {isConn ? (
                      <Badge text="Connected" color={t.success} t={t} />
                    ) : (
                      <Btn size="sm" t={t} onClick={(e) => { e.stopPropagation(); setShowIntModal(integ.id); }}>+ Add</Btn>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.4 }}>{integ.desc}</div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* All integrations in category */}
      <div>
        {intCategory !== "all" || intSearch ? (
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 14px" }}>
            {intSearch ? `Search results for "${intSearch}"` : intCategories.find(c => c.id === intCategory)?.label} ({filteredIntegrations.length})
          </h3>
        ) : (
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 14px" }}>All Integrations</h3>
        )}

        {filteredIntegrations.length === 0 && (
          <Card t={t} hover={false} style={{ padding: 32, textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: t.text, marginBottom: 4 }}>No tools found</div>
            <div style={{ fontSize: 14, color: t.textSec }}>Try a different search or category. Need a tool we don't have? Let us know!</div>
          </Card>
        )}

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 12 }}>
          {filteredIntegrations.map(integ => {
            const isConn = connectedTools.includes(integ.id);
            return (
              <Card key={integ.id} t={t} style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, background: isConn ? `${t.success}10` : `${t.primary}10`,
                    border: `1px solid ${isConn ? t.success + "33" : t.border}`, flexShrink: 0,
                  }}>{integ.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <span style={{ fontWeight: 700, fontSize: 14, color: t.text }}>{integ.name}</span>
                      {integ.popular && <span style={{ fontSize: 10, padding: "1px 6px", borderRadius: 4, background: `${t.warning}20`, color: t.warning, fontWeight: 600 }}>POPULAR</span>}
                    </div>
                    <div style={{ fontSize: 12, color: t.textSec, lineHeight: 1.4 }}>{integ.desc}</div>
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: 8 }}>
                    {isConn ? (
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                        <Badge text="Connected" color={t.success} t={t} />
                        <span onClick={() => toggleConnect(integ.id)} style={{ fontSize: 11, color: t.error, cursor: "pointer" }}>Disconnect</span>
                      </div>
                    ) : (
                      <Btn size="sm" t={t} onClick={() => setShowIntModal(integ.id)}>+ Add</Btn>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Connection modal */}
      {showIntModal && (() => {
        const integ = allIntegrations.find(i => i.id === showIntModal);
        if (!integ) return null;
        return (
          <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999, padding: 20 }}>
            <div onClick={() => setShowIntModal(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)" }} />
            <div style={{
              position: "relative", background: t.bgCard, borderRadius: 16, padding: 32, maxWidth: 480, width: "100%",
              border: `1px solid ${t.border}`, boxShadow: `0 20px 60px rgba(0,0,0,0.4)`,
            }}>
              <div onClick={() => setShowIntModal(null)} style={{ position: "absolute", top: 16, right: 16, cursor: "pointer", color: t.textMuted }}><Icons.X /></div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 30, background: `${t.primary}10`, border: `1px solid ${t.border}`,
                }}>{integ.icon}</div>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: t.text, margin: 0 }}>Connect {integ.name}</h2>
                  <div style={{ fontSize: 13, color: t.textMuted, textTransform: "capitalize" }}>{intCategories.find(c => c.id === integ.cat)?.label}</div>
                </div>
              </div>
              <p style={{ fontSize: 15, color: t.textSec, lineHeight: 1.6, margin: "0 0 20px" }}>{integ.desc}</p>
              <div style={{ padding: 16, borderRadius: 10, background: t.bg, border: `1px solid ${t.border}`, marginBottom: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 8 }}>What your AI team can do with {integ.name}:</div>
                <div style={{ fontSize: 13, color: t.textSec, lineHeight: 1.6 }}>
                  {integ.cat === "crm" && "View and update contacts, track deals, log activities, sync lead data from outreach campaigns, and generate pipeline reports."}
                  {integ.cat === "ads" && "Create ad campaigns, monitor performance metrics, adjust budgets, A/B test creatives, and generate ROI reports."}
                  {integ.cat === "chat" && "Send and receive messages, get notifications for approvals, chat with your AI team on the go, and share files."}
                  {integ.cat === "ecommerce" && "Manage products and inventory, process orders, track shipping, generate sales reports, and optimize listings."}
                  {integ.cat === "ai" && "Use this AI model for specific agent tasks, route complex queries, and balance cost vs. quality for different workloads."}
                  {integ.cat === "docs" && "Store generated documents, collaborate on files, sync folders, and organize your business knowledge base."}
                  {integ.cat === "email" && "Send emails, manage campaigns, track opens and clicks, segment audiences, and automate follow-up sequences."}
                  {integ.cat === "social" && "Schedule and publish posts, track engagement metrics, respond to comments, and analyze what content performs best."}
                  {integ.cat === "productivity" && "Manage calendars, schedule meetings, track tasks and projects, and automate repetitive workflows."}
                  {integ.cat === "analytics" && "Track website traffic, user behavior, conversions, and generate easy-to-read performance dashboards."}
                  {integ.cat === "suppliers" && "Browse supplier catalogs, import products to your store, track orders, and sync inventory levels."}
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <Btn size="lg" t={t} full onClick={() => toggleConnect(integ.id)}>
                  <Icons.Zap /> Connect {integ.name}
                </Btn>
              </div>
              <p style={{ fontSize: 12, color: t.textMuted, textAlign: "center", marginTop: 12, marginBottom: 0 }}>
                You can disconnect anytime from Settings. Your data stays safe.
                <TT text="When you connect a tool, your AI team gets permission to work with it on your behalf. You control what they can do in the approval settings." t={t} />
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );

  // ============================================================
  // SETTINGS PAGE
  // ============================================================
  const SettingsPage = () => (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: t.text, margin: "0 0 4px" }}>Settings</h1>
        <p style={{ color: t.textSec, fontSize: 15, margin: 0 }}>Manage your business profile, brand, notifications, and connected tools.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        <Card t={t} hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 16px" }}>🎨 Brand Settings</h3>
          <Input label="Business Name" value={form.bizName || ""} onChange={v => setForm({ ...form, bizName: v })} t={t} tooltip="This shows in your Command Center header and on your website." />
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 14, fontWeight: 600, color: t.text, display: "flex", alignItems: "center", gap: 4, marginBottom: 8 }}>
              Logo <TT text="Upload your logo. It will appear in the top-left corner of your Command Center." t={t} />
            </label>
            <div style={{
              border: `2px dashed ${t.border}`, borderRadius: 12, padding: 32, textAlign: "center",
              cursor: "pointer", transition: "all 0.2s",
            }}>
              <div style={{ color: t.textSec }}><Icons.Upload /></div>
              <div style={{ fontSize: 14, color: t.textSec, marginTop: 8 }}>Drag & drop your logo here, or click to browse</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>PNG, JPG, SVG, or WebP</div>
            </div>
          </div>
        </Card>

        <Card t={t} hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 16px" }}>🔔 Notifications</h3>
          {["Email me when an agent needs approval", "Daily brief every morning at 7 AM", "Weekly performance summary", "Community auto-posts on my behalf"].map((n, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 3 ? `1px solid ${t.border}` : "none" }}>
              <span style={{ fontSize: 14, color: t.text }}>{n}</span>
              <div style={{
                width: 44, height: 24, borderRadius: 12, background: i < 3 ? t.primary : t.bgHover,
                padding: 2, display: "flex", alignItems: "center", cursor: "pointer",
              }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: "#FFF", transform: i < 3 ? "translateX(20px)" : "translateX(0)", transition: "0.2s" }} />
              </div>
            </div>
          ))}
        </Card>

        {/* Connected Tools Summary — links to full Integrations page */}
        <Card t={t} hover={false} style={{ padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: 0 }}>🔌 Connected Tools</h3>
            <Btn size="sm" t={t} onClick={() => setPage("integrations")}>+ Add New Tool</Btn>
          </div>
          {connectedTools.length === 0 && (
            <div style={{ textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🔌</div>
              <div style={{ fontSize: 14, color: t.textSec, marginBottom: 12 }}>No tools connected yet.</div>
              <Btn size="sm" t={t} onClick={() => setPage("integrations")}>Browse Integrations</Btn>
            </div>
          )}
          {connectedTools.map((toolId, i) => {
            const integ = allIntegrations.find(x => x.id === toolId);
            if (!integ) return null;
            return (
              <div key={toolId} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < connectedTools.length - 1 ? `1px solid ${t.border}` : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{integ.icon}</span>
                  <div>
                    <span style={{ fontSize: 14, color: t.text, fontWeight: 500 }}>{integ.name}</span>
                    <div style={{ fontSize: 11, color: t.textMuted, textTransform: "capitalize" }}>{intCategories.find(c => c.id === integ.cat)?.label}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Badge text="Connected" color={t.success} t={t} />
                  <span onClick={() => toggleConnect(toolId)} style={{ fontSize: 11, color: t.error, cursor: "pointer" }}>Remove</span>
                </div>
              </div>
            );
          })}
          {connectedTools.length > 0 && (
            <div style={{ marginTop: 12, textAlign: "center" }}>
              <Btn variant="secondary" size="sm" t={t} onClick={() => setPage("integrations")}>Browse All {allIntegrations.length} Integrations</Btn>
            </div>
          )}
        </Card>

        <Card t={t} hover={false} style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: t.text, margin: "0 0 16px" }}>🌗 Appearance</h3>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>Dark Mode</div>
              <div style={{ fontSize: 12, color: t.textSec }}>Currently: {isDark ? "Dark" : "Light"}</div>
            </div>
            <div onClick={() => setIsDark(!isDark)} style={{
              width: 56, height: 30, borderRadius: 15, background: isDark ? t.primary : t.bgHover,
              padding: 3, display: "flex", alignItems: "center", cursor: "pointer",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: 12, background: "#FFF",
                transform: isDark ? "translateX(26px)" : "translateX(0)", transition: "0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              }}>{isDark ? "🌙" : "☀️"}</div>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: t.text, marginBottom: 12 }}>Usage This Month</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: t.textSec }}>AI Actions Used</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>1,847 / 5,000</span>
            </div>
            <ProgressBar value={37} t={t} height={8} />
          </div>
        </Card>
      </div>
    </div>
  );

  // ============================================================
  // SIDEBAR + LAYOUT
  // ============================================================
  const isAppPage = !["landing", "orderForm", "preview"].includes(page);

  if (!isAppPage) {
    return (
      <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif", minHeight: "100vh", overflowY: "auto", overflowX: "hidden", WebkitOverflowScrolling: "touch" }}>
        <Confetti show={confetti} />
        {page === "landing" && <LandingPage />}
        {page === "orderForm" && <OrderFormPage />}
      </div>
    );
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <DashboardPage />;
      case "agents": return <AgentOfficePage />;
      case "approvals": return <ApprovalsPage />;
      case "integrations": return <IntegrationsPage />;
      case "onboarding": return <OnboardingPage />;
      case "website": return <WebsitePage />;
      case "analytics": return <AnalyticsPage />;
      case "daily": return <DailyBriefPage />;
      case "docs": return <DocsPage />;
      case "settings": return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif", display: "flex", height: "100vh", background: t.bg, color: t.text, overflow: "hidden", WebkitOverflowScrolling: "touch" }}>
      <Confetti show={confetti} />

      {/* Mobile overlay */}
      {mobileSidebar && isMobile && (
        <div onClick={() => setMobileSidebar(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 998 }} />
      )}

      {/* Sidebar */}
      {(!isMobile || mobileSidebar) && (
        <div style={{
          width: 240, background: t.bg, borderRight: `1px solid ${t.border}`,
          display: "flex", flexDirection: "column", flexShrink: 0, height: "100vh",
          ...(isMobile ? { position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 999 } : {}),
        }}>
          {/* Logo */}
          <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${t.border}` }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              <span style={{ color: t.accent }}>Launch</span><span style={{ color: t.primary }}>Based</span>
            </div>
            {form.bizName && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>{form.bizName}</div>}
          </div>

          {/* Nav items */}
          <div style={{ flex: 1, padding: "12px 8px", overflowY: "auto" }}>
            {sidebarItems.map(item => (
              <div key={item.id} onClick={() => { setPage(item.id); setMobileSidebar(false); }}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10,
                  cursor: "pointer", transition: "all 0.15s", marginBottom: 2,
                  background: page === item.id ? `${t.primary}20` : "transparent",
                  color: page === item.id ? t.primary : t.textSec,
                }}>
                {item.icon}
                <span style={{ fontSize: 14, fontWeight: page === item.id ? 700 : 500 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    marginLeft: "auto", background: t.error, color: "#FFF",
                    borderRadius: 10, padding: "1px 8px", fontSize: 12, fontWeight: 700,
                  }}>{item.badge}</span>
                )}
              </div>
            ))}
          </div>

          {/* Profile */}
          <div style={{ padding: "12px 16px", borderTop: `1px solid ${t.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 18, background: `linear-gradient(135deg, ${t.primary}, ${t.accent})`,
                display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF", fontWeight: 700, fontSize: 14,
              }}>{(form.firstName?.[0] || "U").toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{form.firstName || "User"} {form.lastName?.[0] ? form.lastName[0] + "." : ""}</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>{form.email || "user@email.com"}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 24px", borderBottom: `1px solid ${t.border}`, background: t.bg, flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {isMobile && (
              <div onClick={() => setMobileSidebar(true)} style={{ cursor: "pointer", color: t.textSec, display: "flex" }}><Icons.Menu /></div>
            )}
            <h2 style={{ fontSize: 18, fontWeight: 700, color: t.text, margin: 0 }}>
              {sidebarItems.find(i => i.id === page)?.label || "Dashboard"}
            </h2>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ position: "relative", cursor: "pointer", color: t.textSec, display: "flex", padding: 6 }}>
              <Icons.Bell />
              <div style={{ position: "absolute", top: 2, right: 2, width: 8, height: 8, borderRadius: 4, background: t.error }} />
            </div>
            <div onClick={() => setIsDark(!isDark)}
              style={{ cursor: "pointer", color: t.textSec, display: "flex", padding: 6, borderRadius: 8, background: t.bgHover }}>
              {isDark ? <Icons.Sun /> : <Icons.Moon />}
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: isMobile ? 16 : 28, WebkitOverflowScrolling: "touch" }}>
          {renderPage()}
        </div>

        {/* Mobile bottom nav */}
        {isMobile && (
          <div style={{
            display: "flex", borderTop: `1px solid ${t.border}`, background: t.bg, flexShrink: 0,
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
          }}>
            {[
              { id: "dashboard", icon: <Icons.Home />, label: "Home" },
              { id: "agents", icon: <Icons.Users />, label: "Team" },
              { id: "approvals", icon: <Icons.Check />, label: "Approvals" },
              { id: "settings", icon: <Icons.Settings />, label: "Settings" },
            ].map(tab => (
              <div key={tab.id} onClick={() => setPage(tab.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                  padding: "10px 0", cursor: "pointer",
                  color: page === tab.id ? t.primary : t.textMuted,
                }}>
                {tab.icon}
                <span style={{ fontSize: 11, fontWeight: page === tab.id ? 700 : 400 }}>{tab.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
