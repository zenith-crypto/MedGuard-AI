import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  Shield, Activity, Brain, BookOpen, MapPin, MessageCircle,
  BarChart3, User, Settings, Home, Clock, AlertTriangle,
  CheckCircle, Search, Upload, Mic, Download, ChevronRight,
  ChevronDown, Star, Phone, Heart, Pill, Zap, TrendingUp,
  Bell, Moon, Sun, Plus, ArrowRight, FileText, Share2,
  Save, Eye, Filter, Calendar, Droplets, Sparkles, Bot,
  X, Menu, Hospital, Building2, LogOut, RefreshCw,
  Stethoscope, FlaskConical, Bookmark,
} from "lucide-react"
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"

// ─── Types ────────────────────────────────────────────────────────────────────
type Page =
  | "landing" | "onboarding" | "dashboard" | "checker"
  | "history" | "encyclopedia" | "nearby" | "assistant"
  | "reports" | "profile" | "settings"

// ─── Data ─────────────────────────────────────────────────────────────────────
const adherenceData = [
  { day: "Mon", adherence: 92, risk: 12 },
  { day: "Tue", adherence: 88, risk: 18 },
  { day: "Wed", adherence: 95, risk: 8 },
  { day: "Thu", adherence: 100, risk: 5 },
  { day: "Fri", adherence: 87, risk: 22 },
  { day: "Sat", adherence: 93, risk: 10 },
  { day: "Sun", adherence: 97, risk: 7 },
]

const monthlyData = [
  { month: "Jan", score: 82, interactions: 3 },
  { month: "Feb", score: 78, interactions: 5 },
  { month: "Mar", score: 85, interactions: 2 },
  { month: "Apr", score: 88, interactions: 1 },
  { month: "May", score: 91, interactions: 2 },
  { month: "Jun", score: 87, interactions: 3 },
  { month: "Jul", score: 94, interactions: 1 },
]

const medCategories = [
  { name: "Cardiovascular", value: 35, color: "#3B82F6" },
  { name: "Diabetes", value: 25, color: "#06B6D4" },
  { name: "Pain Relief", value: 20, color: "#22C55E" },
  { name: "Antibiotics", value: 12, color: "#F59E0B" },
  { name: "Other", value: 8, color: "#8B5CF6" },
]

const historyData = [
  {
    id: 1, date: "Jul 12, 2025", doctor: "Dr. Priya Sharma",
    medicines: ["Metformin 500mg", "Lisinopril 10mg", "Aspirin 81mg"],
    score: 92, risk: "Low", riskColor: "green",
  },
  {
    id: 2, date: "Jun 28, 2025", doctor: "Dr. Raj Mehta",
    medicines: ["Atorvastatin 20mg", "Metoprolol 25mg"],
    score: 78, risk: "Medium", riskColor: "amber",
  },
  {
    id: 3, date: "Jun 10, 2025", doctor: "Dr. Priya Sharma",
    medicines: ["Warfarin 5mg", "Aspirin 81mg", "Ibuprofen 400mg"],
    score: 45, risk: "High", riskColor: "red",
  },
  {
    id: 4, date: "May 22, 2025", doctor: "Dr. Anita Roy",
    medicines: ["Amoxicillin 500mg", "Metformin 500mg"],
    score: 88, risk: "Low", riskColor: "green",
  },
  {
    id: 5, date: "May 5, 2025", doctor: "Dr. Raj Mehta",
    medicines: ["Simvastatin 40mg", "Amlodipine 5mg", "Omeprazole 20mg"],
    score: 95, risk: "Low", riskColor: "green",
  },
]

const encyclopediaData = [
  {
    id: 1, name: "Metformin", category: "Antidiabetic", drugClass: "Biguanide",
    purpose: "Controls blood sugar levels in type 2 diabetes",
    mechanism: "Decreases hepatic glucose production and increases insulin sensitivity",
    dosage: "500–2000mg daily", sideEffects: ["Nausea", "Diarrhea", "Stomach pain"],
    pregnancySafe: "Generally safe", kidneySafe: "Caution required", liverSafe: "Safe",
    fact: "Metformin was derived from French lilac (Galega officinalis) used in medieval medicine.",
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=200&fit=crop&auto=format",
  },
  {
    id: 2, name: "Aspirin", category: "Pain Relief", drugClass: "NSAID / Antiplatelet",
    purpose: "Pain relief, fever reduction, and blood clot prevention",
    mechanism: "Inhibits COX-1 and COX-2 enzymes, reducing prostaglandin synthesis",
    dosage: "75–325mg daily", sideEffects: ["GI bleeding", "Stomach ulcers", "Tinnitus"],
    pregnancySafe: "Avoid in 3rd trimester", kidneySafe: "Caution", liverSafe: "Safe",
    fact: "Ancient Egyptians used willow bark containing salicin — aspirin's natural precursor — over 4,000 years ago.",
    img: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400&h=200&fit=crop&auto=format",
  },
  {
    id: 3, name: "Lisinopril", category: "Cardiovascular", drugClass: "ACE Inhibitor",
    purpose: "Treats hypertension, heart failure, and diabetic nephropathy",
    mechanism: "Inhibits angiotensin-converting enzyme, reducing blood vessel constriction",
    dosage: "5–40mg daily", sideEffects: ["Dry cough", "Dizziness", "Hyperkalemia"],
    pregnancySafe: "Contraindicated", kidneySafe: "Monitor closely", liverSafe: "Safe",
    fact: "Lisinopril was developed from the venom of the lancehead pit viper (Bothrops jararaca).",
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=200&fit=crop&auto=format",
  },
  {
    id: 4, name: "Atorvastatin", category: "Cardiovascular", drugClass: "Statin",
    purpose: "Lowers LDL cholesterol and reduces cardiovascular risk",
    mechanism: "Inhibits HMG-CoA reductase, the rate-limiting enzyme in cholesterol synthesis",
    dosage: "10–80mg daily", sideEffects: ["Muscle pain", "Liver enzyme elevation", "Headache"],
    pregnancySafe: "Contraindicated", kidneySafe: "Generally safe", liverSafe: "Monitor",
    fact: "Statins are among the most prescribed drugs globally with over 200 million users worldwide.",
    img: "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=400&h=200&fit=crop&auto=format",
  },
  {
    id: 5, name: "Amoxicillin", category: "Antibiotic", drugClass: "Penicillin",
    purpose: "Treats bacterial infections of ear, throat, lungs, and skin",
    mechanism: "Inhibits bacterial cell wall synthesis by binding to penicillin-binding proteins",
    dosage: "250–500mg three times daily", sideEffects: ["Diarrhea", "Rash", "Nausea"],
    pregnancySafe: "Generally safe", kidneySafe: "Dose adjustment needed", liverSafe: "Safe",
    fact: "Amoxicillin traces its lineage to penicillin, discovered accidentally by Alexander Fleming in 1928.",
    img: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=200&fit=crop&auto=format",
  },
  {
    id: 6, name: "Omeprazole", category: "Gastrology", drugClass: "Proton Pump Inhibitor",
    purpose: "Reduces stomach acid for GERD, peptic ulcers, and H. pylori",
    mechanism: "Irreversibly inhibits the H+/K+ ATPase enzyme in gastric parietal cells",
    dosage: "20–40mg daily", sideEffects: ["Headache", "Nausea", "Vitamin B12 deficiency"],
    pregnancySafe: "Caution", kidneySafe: "Safe", liverSafe: "Reduce dose",
    fact: "Long-term PPI use may increase risk of bone fractures — a counterintuitive side effect of acid suppression.",
    img: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=200&fit=crop&auto=format",
  },
]

const nearbyPlaces = [
  { id: 1, name: "City General Hospital", type: "Hospital", distance: "0.8 km", rating: 4.7, isOpen: true, phone: "+91 98765 43210", address: "12 Medical Lane, Mumbai" },
  { id: 2, name: "HealthFirst Clinic", type: "Clinic", distance: "1.2 km", rating: 4.5, isOpen: true, phone: "+91 98765 43211", address: "45 Health Street, Mumbai" },
  { id: 3, name: "MediCare Pharmacy", type: "Pharmacy", distance: "0.3 km", rating: 4.8, isOpen: true, phone: "+91 98765 43212", address: "8 Drug Square, Mumbai" },
  { id: 4, name: "Apollo Hospital", type: "Hospital", distance: "2.1 km", rating: 4.9, isOpen: false, phone: "+91 98765 43213", address: "100 Apollo Road, Mumbai" },
  { id: 5, name: "Sunrise Pharmacy", type: "Pharmacy", distance: "0.6 km", rating: 4.3, isOpen: true, phone: "+91 98765 43214", address: "22 Sunrise Ave, Mumbai" },
  { id: 6, name: "MedPlus Clinic", type: "Clinic", distance: "1.8 km", rating: 4.4, isOpen: false, phone: "+91 98765 43215", address: "67 Plus Road, Mumbai" },
]

const faqs = [
  { q: "How accurate is the AI drug interaction checker?", a: "MedGuard AI uses a comprehensive database of over 50,000 drug interactions combined with machine learning models trained on clinical trial data. Our system achieves 97.3% accuracy, validated against published pharmacological literature." },
  { q: "Is my medical data secure and private?", a: "All data is encrypted using AES-256 at rest and TLS 1.3 in transit. We are HIPAA compliant, never sell data to third parties, and give you full control to export or delete your data at any time." },
  { q: "Can MedGuard AI replace my doctor?", a: "No. MedGuard AI is a decision-support tool designed to assist you and your healthcare provider — not replace professional medical advice. Always consult a qualified physician before making medication changes." },
  { q: "What types of interactions does it detect?", a: "We detect drug-drug interactions, drug-food interactions, drug-condition contraindications (e.g., kidney disease, pregnancy), dosage risks based on age and weight, and cumulative toxicity across multiple medications." },
  { q: "How do I upload a prescription?", a: "Use the OCR Prescription Upload feature in the Drug Interaction Checker. Take a photo or upload a PDF — our AI automatically extracts medication names, dosages, and frequencies with high accuracy." },
]

const features = [
  { icon: Brain, title: "AI Risk Prediction", desc: "ML models predict interaction severity with clinical-grade accuracy", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: Activity, title: "Compatibility Score", desc: "Real-time 0–100 safety score for your complete medication stack", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: BookOpen, title: "Medicine Encyclopedia", desc: "Detailed pharmacology for 10,000+ drugs with fun facts", color: "text-violet-400", bg: "bg-violet-500/10" },
  { icon: Bot, title: "AI Health Assistant", desc: "Conversational AI trained on medical literature and guidelines", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: MapPin, title: "Nearby Care", desc: "Find hospitals, clinics, and pharmacies open right now", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Clock, title: "Medication History", desc: "Full audit trail of every interaction check and prescription", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: Upload, title: "OCR Prescription", desc: "Scan any prescription — AI extracts medicines instantly", color: "text-indigo-400", bg: "bg-indigo-500/10" },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Visualize adherence, risk trends, and health outcomes over time", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: AlertTriangle, title: "Interaction Alerts", desc: "Real-time push notifications for dangerous combinations", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Sparkles, title: "Personalized Guidance", desc: "Tailored to your age, weight, and existing medical conditions", color: "text-teal-400", bg: "bg-teal-500/10" },
]

const testimonials = [
  {
    name: "Dr. Priya Sharma", role: "Cardiologist, AIIMS Delhi", avatar: "PS",
    text: "MedGuard AI has transformed how I review polypharmacy cases. The interaction detection is remarkably accurate, and my elderly patients love the plain-language explanations. I recommend it to every physician in my network.",
    rating: 5, color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Rahul Mehta", role: "Patient, Type 2 Diabetic", avatar: "RM",
    text: "I take 6 medications daily. Before MedGuard, I had a dangerous interaction I had no idea about. This app potentially saved my life. The AI explains everything clearly — no medical degree needed.",
    rating: 5, color: "from-green-500 to-teal-500",
  },
  {
    name: "Aisha Nair", role: "PharmD Student, KMC Manipal", avatar: "AN",
    text: "The Medicine Encyclopedia is an incredible learning resource. The mechanism explanations are clinically accurate, and the fun facts make studying pharmacology actually enjoyable. It's my go-to reference.",
    rating: 5, color: "from-violet-500 to-pink-500",
  },
]

const onboardingSteps = [
  { field: "name", question: "What's your name?", type: "text", placeholder: "Sarah Johnson", options: [] },
  { field: "age", question: "How old are you?", type: "number", placeholder: "34", options: [] },
  { field: "gender", question: "What's your gender?", type: "select", placeholder: "", options: ["Female", "Male", "Non-binary", "Prefer not to say"] },
  { field: "height", question: "What's your height? (cm)", type: "number", placeholder: "165", options: [] },
  { field: "weight", question: "What's your weight? (kg)", type: "number", placeholder: "62", options: [] },
  { field: "bloodGroup", question: "What's your blood group?", type: "select", placeholder: "", options: ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"] },
  { field: "allergies", question: "Any drug allergies?", type: "text", placeholder: "Penicillin, Sulfa drugs (or None)", options: [] },
  { field: "pregnant", question: "Are you pregnant or planning to be?", type: "select", placeholder: "", options: ["No", "Yes, currently pregnant", "Planning to be", "Not applicable"] },
  { field: "smoking", question: "Do you smoke?", type: "select", placeholder: "", options: ["No", "Yes, regularly", "Occasionally", "Former smoker"] },
  { field: "alcohol", question: "Do you drink alcohol?", type: "select", placeholder: "", options: ["Never", "Rarely", "Socially", "Regularly"] },
  { field: "kidney", question: "Any kidney disease?", type: "select", placeholder: "", options: ["No", "Mild CKD", "Moderate CKD", "Severe CKD", "On dialysis"] },
  { field: "liver", question: "Any liver disease?", type: "select", placeholder: "", options: ["No", "Mild hepatitis", "Cirrhosis", "Fatty liver"] },
  { field: "diabetes", question: "Do you have diabetes?", type: "select", placeholder: "", options: ["No", "Type 1", "Type 2", "Pre-diabetes", "Gestational"] },
  { field: "heart", question: "Any heart condition?", type: "select", placeholder: "", options: ["None", "Hypertension", "Coronary artery disease", "Heart failure", "Arrhythmia"] },
  { field: "emergency", question: "Emergency contact number?", type: "text", placeholder: "+91 98765 43210", options: [] },
  { field: "medications", question: "List your current medications", type: "text", placeholder: "Metformin 500mg, Aspirin 81mg...", options: [] },
  { field: "conditions", question: "Any other medical conditions?", type: "text", placeholder: "Hypothyroidism, PCOS (or None)", options: [] },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl ${className}`}>
      {children}
    </div>
  )
}

type BadgeColor = "blue" | "green" | "red" | "amber" | "cyan" | "violet"
function Badge({ children, color = "blue" }: { children: React.ReactNode; color?: BadgeColor }) {
  const map: Record<BadgeColor, string> = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    red: "bg-red-500/20 text-red-400 border-red-500/30",
    amber: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    cyan: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    violet: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${map[color]}`}>
      {children}
    </span>
  )
}

function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference
  const color = score >= 80 ? "#22C55E" : score >= 60 ? "#F59E0B" : "#EF4444"
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={6}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
      />
    </svg>
  )
}

const navItems = [
  { id: "dashboard", icon: Home, label: "Dashboard" },
  { id: "checker", icon: Shield, label: "Checker" },
  { id: "history", icon: Clock, label: "History" },
  { id: "encyclopedia", icon: BookOpen, label: "Encyclopedia" },
  { id: "nearby", icon: MapPin, label: "Nearby" },
  { id: "assistant", icon: Bot, label: "AI Chat" },
  { id: "reports", icon: BarChart3, label: "Reports" },
  { id: "profile", icon: User, label: "Profile" },
  { id: "settings", icon: Settings, label: "Settings" },
]

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#0A0E1B] text-slate-100 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 backdrop-blur-xl bg-[#0A0E1B]/80 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white text-lg">MedGuard AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
          {["About", "Features", "How It Works", "FAQ"].map(l => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          onClick={onGetStarted}
          className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
        >
          Get Started
        </motion.button>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-violet-600/10 rounded-full blur-3xl" />
        </div>

        {/* Floating pills */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute hidden md:block pointer-events-none"
            style={{ left: `${8 + (i * 12) % 82}%`, top: `${18 + (i * 11) % 62}%` }}
            animate={{ y: [0, -14, 0], rotate: [0, 6, -6, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 3 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          >
            <div className={`w-9 h-4 rounded-full border ${
              i % 4 === 0 ? "border-blue-500/40 bg-blue-500/10" :
              i % 4 === 1 ? "border-cyan-500/40 bg-cyan-500/10" :
              i % 4 === 2 ? "border-violet-500/40 bg-violet-500/10" :
              "border-green-500/40 bg-green-500/10"
            }`} />
          </motion.div>
        ))}

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Medication Safety · Trusted by 50,000+ users
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
              Your AI{" "}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Medication Safety
              </span>
              <br />Companion
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Analyze medicines, detect harmful interactions, understand risks, and receive AI-powered guidance — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={onGetStarted}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold text-lg flex items-center gap-2 justify-center shadow-2xl shadow-blue-500/30"
              >
                Get Started Free <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Preview card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="mt-16"
          >
            <GlassCard className="p-6 mx-auto max-w-xl">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-sm text-slate-400">AI analyzing your medications…</span>
                </div>
                <span className="text-green-400 text-sm font-semibold">92 / 100</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                  initial={{ width: 0 }} animate={{ width: "92%" }}
                  transition={{ duration: 1.6, delay: 0.8 }}
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["Metformin 500mg", "Lisinopril 10mg", "Aspirin 81mg"].map(m => (
                  <span key={m} className="text-xs px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">{m}</span>
                ))}
                <span className="text-xs px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">Low Risk ✓</span>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { value: "2.5M+", label: "Drug interactions occur yearly in India", icon: AlertTriangle, color: "text-red-400" },
            { value: "60%", label: "Of elderly patients take 5+ medications", icon: Heart, color: "text-blue-400" },
            { value: "67%", label: "Reduction in medication errors with AI assistance", icon: TrendingUp, color: "text-green-400" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
              <GlassCard className="p-6 text-center">
                <s.icon className={`w-8 h-8 ${s.color} mx-auto mb-4`} />
                <div className="text-4xl font-bold text-white mb-2">{s.value}</div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Mission + Vision */}
      <section className="py-8 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {[
            { icon: Heart, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", title: "Our Mission", text: '"Our mission is to make medication safer and easier to understand for everyone — from patients managing chronic conditions to physicians overseeing complex polypharmacy."' },
            { icon: Eye, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", title: "Our Vision", text: '"Healthcare where AI assists every patient in making safer medication decisions — democratizing pharmaceutical knowledge once exclusive to specialists."' },
          ].map((item, i) => (
            <GlassCard key={i} className="p-8">
              <div className={`w-12 h-12 rounded-2xl ${item.bg} border ${item.border} flex items-center justify-center mb-4`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
              <p className="text-slate-400 leading-relaxed">{item.text}</p>
            </GlassCard>
          ))}
        </div>

        {/* Core Values */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">Core Values</h2>
          <p className="text-slate-400">The principles that guide every product decision we make</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { icon: Shield, label: "Trust", color: "text-blue-400", bg: "bg-blue-500/10" },
            { icon: CheckCircle, label: "Accuracy", color: "text-green-400", bg: "bg-green-500/10" },
            { icon: Sparkles, label: "Simplicity", color: "text-violet-400", bg: "bg-violet-500/10" },
            { icon: Eye, label: "Accessibility", color: "text-cyan-400", bg: "bg-cyan-500/10" },
            { icon: Activity, label: "Privacy", color: "text-pink-400", bg: "bg-pink-500/10" },
          ].map((v, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05 }}>
              <GlassCard className="p-4 text-center cursor-default">
                <div className={`w-10 h-10 rounded-xl ${v.bg} flex items-center justify-center mx-auto mb-3`}>
                  <v.icon className={`w-5 h-5 ${v.color}`} />
                </div>
                <div className="text-sm font-semibold text-white">{v.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Everything you need</h2>
          <p className="text-slate-400 max-w-xl mx-auto">A complete medication safety platform built for patients, caregivers, and healthcare professionals</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }} transition={{ delay: i * 0.04 }} viewport={{ once: true }}
            >
              <GlassCard className="p-5 h-full hover:border-white/20 transition-all cursor-default">
                <div className={`w-10 h-10 rounded-xl ${f.bg} flex items-center justify-center mb-3`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{f.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">How it works</h2>
          <p className="text-slate-400">From prescription to safety report in under 60 seconds</p>
        </div>
        <div>
          {[
            { step: 1, title: "Upload Prescription", desc: "Photograph or upload your prescription — our OCR instantly extracts all medications", icon: Upload, color: "bg-blue-500" },
            { step: 2, title: "Enter Health Profile", desc: "Share your age, weight, conditions, and allergies for personalized analysis", icon: User, color: "bg-cyan-500" },
            { step: 3, title: "AI Analyzes Medicines", desc: "Our models check 50,000+ interactions against your specific health profile", icon: Brain, color: "bg-violet-500" },
            { step: 4, title: "Receive Safety Report", desc: "Get a compatibility score, risk levels, plain-language explanations, and safer alternatives", icon: FileText, color: "bg-green-500" },
            { step: 5, title: "Download & Share", desc: "Export a professional PDF report to share with your doctor or pharmacist", icon: Download, color: "bg-amber-500" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="flex items-start gap-5 mb-6"
            >
              <div className="flex flex-col items-center">
                <div className={`w-11 h-11 rounded-2xl ${s.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                  <s.icon className="w-5 h-5 text-white" />
                </div>
                {i < 4 && <div className="w-0.5 h-7 bg-white/8 mt-2" />}
              </div>
              <GlassCard className="flex-1 p-4 -mt-0.5">
                <span className="text-xs text-slate-600 font-mono">Step {s.step}</span>
                <h3 className="font-semibold text-white mt-0.5 mb-1">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Trusted by thousands</h2>
          <p className="text-slate-400">Doctors, patients, and students rely on MedGuard AI daily</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -4 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
            >
              <GlassCard className="p-6 h-full flex flex-col hover:border-white/20 transition-all">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed flex-1 mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-slate-500 text-xs">{t.role}</div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Frequently asked questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <GlassCard key={i} className="overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-white font-medium pr-4 text-sm">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-4 text-slate-400 text-sm leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <GlassCard className="max-w-xl mx-auto p-12">
          <h2 className="text-2xl font-bold text-white mb-3">Start protecting your health today</h2>
          <p className="text-slate-400 mb-8 text-sm">Join 50,000+ users who trust MedGuard AI with their medication safety</p>
          <motion.button
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={onGetStarted}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold"
          >
            Get Started Free — No Credit Card
          </motion.button>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white">MedGuard AI</span>
            </div>
            <p className="text-slate-600 text-sm">AI-powered medication safety for everyone.</p>
          </div>
          {[
            { title: "Product", links: ["Features", "Dashboard", "Drug Checker", "Encyclopedia"] },
            { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            { title: "Legal", links: ["Privacy Policy", "Terms of Service", "HIPAA", "Cookies"] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-semibold text-sm mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(l => (
                  <li key={l}><a href="#" className="text-slate-600 text-sm hover:text-slate-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto border-t border-white/5 pt-6 flex items-center justify-between">
          <p className="text-slate-700 text-xs">© 2025 MedGuard AI. Not a substitute for professional medical advice.</p>
          <div className="flex gap-4">
            {["GitHub", "Twitter", "LinkedIn"].map(s => (
              <a key={s} href="#" className="text-slate-600 hover:text-slate-300 text-xs transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

// ─── Onboarding Page ──────────────────────────────────────────────────────────

function OnboardingPage({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [value, setValue] = useState("")

  const current = onboardingSteps[step]
  const progress = (step / onboardingSteps.length) * 100

  const handleNext = () => {
    if (!value && current.type !== "select") return
    setAnswers(prev => ({ ...prev, [current.field]: value }))
    if (step < onboardingSteps.length - 1) {
      setStep(s => s + 1)
      setValue("")
    } else {
      onFinish()
    }
  }

  const handleBack = () => {
    if (step > 0) {
      setStep(s => s - 1)
      setValue(answers[onboardingSteps[step - 1].field] || "")
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0E1B] flex items-center justify-center px-4">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-xl">MedGuard AI</span>
        </div>

        <div className="mb-8">
          <div className="flex justify-between mb-2 text-xs">
            <span className="text-slate-600">{step + 1} of {onboardingSteps.length}</span>
            <span className="text-blue-400">{Math.round(progress)}% complete</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.25 }}
          >
            <GlassCard className="p-8">
              {step === 0 && (
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">👋</div>
                  <h2 className="text-2xl font-bold text-white mb-1">Hello!</h2>
                  <p className="text-slate-400 text-sm">Welcome to MedGuard AI. Let's personalize your healthcare experience.</p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <span className="text-xs text-slate-500 font-medium">MedGuard AI</span>
              </div>

              <h2 className="text-lg font-semibold text-white mb-5">{current.question}</h2>

              {current.type === "select" ? (
                <div className="grid grid-cols-2 gap-2">
                  {current.options.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setValue(opt)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                        value === opt
                          ? "bg-blue-500/20 border-blue-500/40 text-blue-300"
                          : "bg-white/[0.03] border-white/10 text-slate-300 hover:border-white/20"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type={current.type}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleNext()}
                  placeholder={current.placeholder}
                  autoFocus
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 text-sm"
                />
              )}

              <button
                onClick={handleNext}
                disabled={!value && current.type !== "select"}
                className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {step === onboardingSteps.length - 1 ? "Complete Setup" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>

              {step > 0 && (
                <button onClick={handleBack} className="w-full mt-2 py-2 text-slate-600 text-sm hover:text-slate-400 transition-colors">
                  ← Back
                </button>
              )}
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen bg-[#0A0E1B] text-slate-100 overflow-hidden">
      <aside className={`flex-shrink-0 transition-all duration-300 ${collapsed ? "w-14" : "w-52"} bg-[#0D1117] border-r border-white/[0.05] flex flex-col`}>
        <div className="h-13 px-3 py-3.5 flex items-center gap-3 border-b border-white/[0.05]">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          {!collapsed && <span className="font-bold text-white text-sm truncate">MedGuard AI</span>}
        </div>

        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setPage(item.id as Page)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl transition-all text-sm ${
                page === item.id
                  ? "bg-blue-500/15 text-blue-400 border border-blue-500/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]"
              }`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-2 border-t border-white/[0.05] space-y-0.5">
          <button
            onClick={() => setCollapsed(v => !v)}
            className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-400 hover:bg-white/[0.03] transition-all text-sm"
            title={collapsed ? "Expand" : undefined}
          >
            <Menu className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={() => setPage("landing")}
            className="w-full flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-slate-600 hover:text-slate-400 hover:bg-white/[0.03] transition-all text-sm"
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto min-w-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
            className="min-h-full"
          >
            {page === "dashboard" && <DashboardPage />}
            {page === "checker" && <CheckerPage />}
            {page === "history" && <HistoryPage />}
            {page === "encyclopedia" && <EncyclopediaPage />}
            {page === "nearby" && <NearbyPage />}
            {page === "assistant" && <AssistantPage />}
            {page === "reports" && <ReportsPage />}
            {page === "profile" && <ProfilePage />}
            {page === "settings" && <SettingsPage />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardPage() {
  const topCards = [
    { label: "Today's Medicines", value: "4", sub: "2 taken · 2 remaining", icon: Pill, color: "text-blue-400", bg: "bg-blue-500/10" },
    { label: "Compatibility Score", value: "92", unit: "/100", sub: "Excellent — Low risk", icon: Activity, color: "text-green-400", bg: "bg-green-500/10" },
    { label: "Adherence Rate", value: "94%", sub: "↑5% vs last week", icon: TrendingUp, color: "text-cyan-400", bg: "bg-cyan-500/10" },
    { label: "Next Appointment", value: "Jul 18", sub: "Dr. Priya Sharma · 10AM", icon: Calendar, color: "text-violet-400", bg: "bg-violet-500/10" },
    { label: "Interaction Alerts", value: "1", sub: "Aspirin + Warfarin", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Upcoming Refill", value: "3 days", sub: "Metformin 500mg low", icon: RefreshCw, color: "text-pink-400", bg: "bg-pink-500/10" },
  ]

  const timeline = [
    { time: "Morning", clock: "8:00 AM", meds: ["Metformin 500mg", "Aspirin 81mg"], done: true },
    { time: "Afternoon", clock: "1:00 PM", meds: ["Lisinopril 10mg"], done: true },
    { time: "Evening", clock: "7:00 PM", meds: ["Metformin 500mg", "Atorvastatin 20mg"], done: false },
    { time: "Night", clock: "10:00 PM", meds: ["Omeprazole 20mg"], done: false },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Good afternoon, Sarah 👋</h1>
          <p className="text-slate-500 text-sm">Tuesday, July 15, 2025 — Your health is looking great today</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl bg-white/5 border border-white/[0.08] text-slate-500 hover:text-white hover:border-white/20 transition-all">
            <Bell className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">SJ</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-6">
        {topCards.map((card, i) => (
          <motion.div key={i} whileHover={{ y: -2 }}>
            <GlassCard className="p-4">
              <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
              <div className="text-xl font-bold text-white mb-0.5">
                {card.value}{card.unit && <span className="text-xs text-slate-600">{card.unit}</span>}
              </div>
              <div className="text-xs text-slate-500 leading-tight">{card.label}</div>
              <div className="text-xs text-slate-600 mt-1 leading-tight">{card.sub}</div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <GlassCard className="p-5">
            <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Medication Timeline — Today
            </h2>
            <div className="space-y-2">
              {timeline.map((slot, i) => (
                <div key={i} className={`flex items-start gap-4 p-3 rounded-xl ${slot.done ? "opacity-55" : "bg-white/[0.02] border border-white/[0.04]"}`}>
                  <div className="w-14 flex-shrink-0">
                    <div className="text-xs text-slate-500">{slot.time}</div>
                    <div className="text-xs text-slate-600">{slot.clock}</div>
                  </div>
                  <div className={`w-0.5 self-stretch rounded-full flex-shrink-0 ${slot.done ? "bg-green-500/40" : "bg-blue-500/40"}`} />
                  <div className="flex-1 flex flex-wrap gap-1.5">
                    {slot.meds.map(m => (
                      <span key={m} className={`text-xs px-2.5 py-1 rounded-full ${slot.done ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"}`}>{m}</span>
                    ))}
                  </div>
                  {slot.done
                    ? <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                    : <div className="w-4 h-4 rounded-full border-2 border-slate-700 flex-shrink-0 mt-0.5" />
                  }
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              Weekly Adherence & Risk Trend
            </h2>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={adherenceData}>
                <defs>
                  <linearGradient id="gAdh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, color: "#E2E8F7", fontSize: 12 }} />
                <Area type="monotone" dataKey="adherence" stroke="#3B82F6" strokeWidth={2} fill="url(#gAdh)" name="Adherence %" />
                <Area type="monotone" dataKey="risk" stroke="#EF4444" strokeWidth={2} fill="url(#gRisk)" name="Risk Score" />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
              <Pill className="w-4 h-4 text-violet-400" />
              Medicine Categories
            </h2>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="45%" height={150}>
                <PieChart>
                  <Pie data={medCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                    {medCategories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {medCategories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                      <span className="text-xs text-slate-400">{cat.name}</span>
                    </div>
                    <span className="text-xs text-slate-600">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <GlassCard className="p-5">
            <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-pink-400" /> Health Score
            </h2>
            <div className="flex items-center gap-4 justify-center">
              <div className="relative">
                <ScoreRing score={92} size={96} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">92</div>
                    <div className="text-xs text-slate-600">/100</div>
                  </div>
                </div>
              </div>
              <div>
                <Badge color="green">Excellent</Badge>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed max-w-[110px]">Well-optimized regime. One minor interaction flagged.</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-amber-500/20 bg-amber-500/[0.03]">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-semibold text-amber-400">Interaction Alert</span>
            </div>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">Aspirin 81mg + Warfarin may increase bleeding risk. Monitor INR closely.</p>
            <button className="text-xs text-amber-400 border border-amber-500/20 px-3 py-1.5 rounded-lg hover:bg-amber-500/10 transition-colors">
              View Full Report
            </button>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-white text-sm">AI Daily Advice</span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <Droplets className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Drink 8+ glasses of water. Metformin and Lisinopril both require good hydration.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Take Atorvastatin at night for better absorption.</span>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                <span>Avoid grapefruit — it inhibits Atorvastatin metabolism significantly.</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-white">Water Intake</span>
              </div>
              <span className="text-xs text-cyan-400">5 / 8 glasses</span>
            </div>
            <div className="flex gap-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`flex-1 h-5 rounded ${i < 5 ? "bg-cyan-500" : "bg-white/8"}`} />
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <h2 className="font-semibold text-white text-sm mb-3">Recent Reports</h2>
            <div className="space-y-2">
              {historyData.slice(0, 3).map(h => (
                <div key={h.id} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                  <div>
                    <div className="text-xs text-slate-300">{h.date}</div>
                    <div className="text-xs text-slate-600">{h.medicines.length} medicines</div>
                  </div>
                  <Badge color={h.riskColor as BadgeColor}>{h.risk}</Badge>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

// ─── Drug Interaction Checker ─────────────────────────────────────────────────

function CheckerPage() {
  const [medicines, setMedicines] = useState([
    { name: "Metformin", dose: "500mg", freq: "Twice daily" },
    { name: "Aspirin", dose: "81mg", freq: "Once daily" },
    { name: "Warfarin", dose: "5mg", freq: "Once daily" },
  ])
  const [newMed, setNewMed] = useState({ name: "", dose: "", freq: "" })
  const [analyzed, setAnalyzed] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)

  const handleAnalyze = () => {
    setAnalyzing(true)
    setTimeout(() => { setAnalyzing(false); setAnalyzed(true) }, 2000)
  }

  const interactions = [
    {
      medA: "Aspirin 81mg", medB: "Warfarin 5mg", risk: "High" as const, riskColor: "red" as BadgeColor,
      explanation: "Both drugs inhibit coagulation through different mechanisms, creating additive bleeding risk. Aspirin inhibits platelet aggregation via COX-1, while Warfarin inhibits clotting factors II, VII, IX, and X.",
      action: "Monitor INR closely every 2 weeks. Consider reducing Aspirin dose or switching to an alternative antiplatelet agent.",
    },
    {
      medA: "Metformin 500mg", medB: "Aspirin 81mg", risk: "Low" as const, riskColor: "green" as BadgeColor,
      explanation: "Minor pharmacokinetic interaction. Aspirin may slightly enhance the glucose-lowering effect of Metformin in some patients.",
      action: "No dose adjustment needed. Monitor blood glucose levels during concurrent therapy.",
    },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Drug Interaction Checker</h1>
          <p className="text-slate-500 text-sm">AI-powered compatibility analysis for your medications</p>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="space-y-4">
          <GlassCard className="p-5">
            <h2 className="font-semibold text-white mb-4 text-sm">Patient Profile</h2>
            <div className="grid grid-cols-2 gap-2.5">
              {[["Age", "34 years"], ["Weight", "62 kg"], ["Height", "165 cm"], ["Blood Pressure", "118/76"], ["Heart Rate", "72 bpm"], ["Medical Condition", "Type 2 Diabetes"]].map(([label, val]) => (
                <div key={label}>
                  <label className="text-xs text-slate-600 mb-1 block">{label}</label>
                  <input defaultValue={val} className="w-full text-xs bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2 text-slate-300 focus:outline-none focus:border-blue-500/40" />
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-3">
              {[["Kidney Disease", false], ["Liver Disease", false], ["Pregnant", false]].map(([label, checked]) => (
                <label key={String(label)} className="flex items-center gap-1.5 text-xs text-slate-500 cursor-pointer">
                  <div className={`w-4 h-4 rounded border ${checked ? "bg-blue-500 border-blue-500" : "border-white/20"} flex-shrink-0`} />
                  {label}
                </label>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white text-sm">Medicines ({medicines.length})</h2>
              <div className="flex gap-2">
                <button className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white flex items-center gap-1">
                  <Upload className="w-3 h-3" /> OCR
                </button>
                <button className="text-xs px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white flex items-center gap-1">
                  <Mic className="w-3 h-3" /> Voice
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {medicines.map((med, i) => (
                <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                  <Pill className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-white flex-1">{med.name}</span>
                  <span className="text-xs text-slate-500">{med.dose}</span>
                  <span className="text-xs text-slate-600">·</span>
                  <span className="text-xs text-slate-500">{med.freq}</span>
                  <button onClick={() => setMedicines(m => m.filter((_, j) => j !== i))} className="text-slate-600 hover:text-red-400 transition-colors ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2 mb-2">
              <input value={newMed.name} onChange={e => setNewMed(p => ({ ...p, name: e.target.value }))} placeholder="Medicine" className="text-xs bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40" />
              <input value={newMed.dose} onChange={e => setNewMed(p => ({ ...p, dose: e.target.value }))} placeholder="Dose" className="text-xs bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40" />
              <input value={newMed.freq} onChange={e => setNewMed(p => ({ ...p, freq: e.target.value }))} placeholder="Frequency" className="text-xs bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40" />
            </div>
            <button
              onClick={() => { if (newMed.name) { setMedicines(m => [...m, newMed]); setNewMed({ name: "", dose: "", freq: "" }) } }}
              className="w-full py-2 rounded-xl border border-dashed border-white/10 text-slate-600 text-xs hover:border-blue-500/30 hover:text-blue-400 transition-all flex items-center justify-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Add Medicine
            </button>
          </GlassCard>

          <motion.button
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:opacity-90 transition-opacity"
          >
            {analyzing ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing with AI…</>
            ) : (
              <><Brain className="w-5 h-5" /> Analyze Interactions</>
            )}
          </motion.button>
        </div>

        <div className="space-y-4">
          {analyzed ? (
            <>
              <GlassCard className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-white mb-1">Compatibility Score</h2>
                    <p className="text-slate-500 text-xs">{medicines.length} medicines analyzed</p>
                  </div>
                  <div className="relative">
                    <ScoreRing score={62} size={88} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-xl font-bold text-white">62</div>
                        <div className="text-xs text-slate-600">/100</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 flex-wrap">
                  <Badge color="green">2 Safe Pairs</Badge>
                  <Badge color="amber">0 Moderate</Badge>
                  <Badge color="red">1 High Risk</Badge>
                </div>
              </GlassCard>

              {interactions.map((inter, i) => (
                <GlassCard key={i} className={`p-5 ${inter.riskColor === "red" ? "border-red-500/15 bg-red-500/[0.02]" : "border-green-500/15"}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge color={inter.riskColor}>{inter.risk} Risk</Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-white bg-white/[0.06] px-3 py-1 rounded-lg">{inter.medA}</span>
                    <span className="text-slate-600 text-sm">+</span>
                    <span className="text-sm font-medium text-white bg-white/[0.06] px-3 py-1 rounded-lg">{inter.medB}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">{inter.explanation}</p>
                  <div className={`text-xs p-3 rounded-xl leading-relaxed ${inter.riskColor === "red" ? "bg-red-500/[0.06] border border-red-500/15 text-red-300" : "bg-green-500/[0.06] border border-green-500/15 text-green-300"}`}>
                    <strong>Recommended:</strong> {inter.action}
                  </div>
                </GlassCard>
              ))}

              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-4 h-4 text-blue-400" />
                  <h2 className="font-semibold text-white text-sm">AI Summary</h2>
                  <Badge color="blue">Patient-Friendly</Badge>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  Your current medication combination is moderately safe, but there is one significant concern. <strong className="text-white">Aspirin and Warfarin together significantly increase your risk of bleeding</strong> — both thin your blood through different pathways. Metformin is well-tolerated with your other medications and is essential for your diabetes management.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed pb-4 border-b border-white/[0.04]">
                  <strong className="text-slate-500">For your physician:</strong> Concurrent aspirin and warfarin therapy increases major bleeding risk (OR 3.2, 95% CI 1.8–5.6). Recommend INR monitoring at 2-week intervals.
                </p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {[["Download PDF", Download], ["Share Report", Share2], ["Save", Save]].map(([label, Icon]) => (
                    <button key={String(label)} className="text-xs px-3 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/[0.08] flex items-center gap-1.5 hover:bg-white/10 transition-colors">
                      <Icon className="w-3 h-3" /> {label}
                    </button>
                  ))}
                </div>
              </GlassCard>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-slate-500 text-sm">Add your medications and click "Analyze Interactions"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── History Page ─────────────────────────────────────────────────────────────

function HistoryPage() {
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState<number | null>(null)

  const filtered = historyData.filter(h =>
    h.doctor.toLowerCase().includes(search.toLowerCase()) ||
    h.medicines.some(m => m.toLowerCase().includes(search.toLowerCase())) ||
    h.date.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Medication History</h1>
          <p className="text-slate-500 text-sm">All your past interaction checks and reports</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search reports…"
              className="pl-9 pr-4 py-2 text-sm bg-white/5 border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40 w-48"
            />
          </div>
          <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-slate-500 hover:text-white text-sm flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
        </div>
      </div>

      <div className="relative pl-12">
        <div className="absolute left-4 top-0 bottom-0 w-px bg-white/[0.05]" />
        <div className="space-y-4">
          {filtered.map(report => {
            const dotColor = report.riskColor === "green" ? "#22C55E" : report.riskColor === "amber" ? "#F59E0B" : "#EF4444"
            return (
              <motion.div key={report.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="relative">
                <div className="absolute -left-8 top-5 w-3 h-3 rounded-full bg-[#0A0E1B] border-2" style={{ borderColor: dotColor }} />
                <GlassCard className="overflow-hidden">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <span className="text-sm font-semibold text-white">{report.date}</span>
                          <Badge color={report.riskColor as BadgeColor}>{report.risk} Risk</Badge>
                          <span className="text-xs text-slate-600 bg-white/[0.04] px-2 py-0.5 rounded-lg font-mono">{report.score}/100</span>
                        </div>
                        <div className="text-xs text-slate-600 mb-3 flex items-center gap-1.5">
                          <Stethoscope className="w-3 h-3" /> {report.doctor}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {report.medicines.map(m => (
                            <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-white/[0.04] text-slate-400 border border-white/[0.05]">{m}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setExpanded(expanded === report.id ? null : report.id)}
                          className="p-2 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-all"
                        >
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded === report.id ? "rotate-180" : ""}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {expanded === report.id && (
                      <motion.div
                        initial={{ height: 0 }} animate={{ height: "auto" }}
                        exit={{ height: 0 }} className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-4 border-t border-white/[0.04]">
                          <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                            AI analysis identified {report.risk === "High" ? "critical" : report.risk === "Medium" ? "moderate" : "no significant"} drug interactions. Compatibility score {report.score}/100 — {report.score >= 80 ? "safe regimen" : report.score >= 60 ? "caution advised" : "significant risk — consult physician"}.
                          </p>
                          <button className="text-xs text-blue-400 flex items-center gap-1 hover:underline">
                            View Full Report <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassCard>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Encyclopedia Page ────────────────────────────────────────────────────────

function EncyclopediaPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [selected, setSelected] = useState<typeof encyclopediaData[0] | null>(null)
  const [bookmarks, setBookmarks] = useState<number[]>([1, 3])

  const categories = ["All", "Antidiabetic", "Cardiovascular", "Pain Relief", "Antibiotic", "Gastrology"]
  const filtered = encyclopediaData.filter(m =>
    (category === "All" || m.category === category) &&
    m.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Medicine Encyclopedia</h1>
        <p className="text-slate-500 text-sm">Explore 10,000+ medications with AI-curated pharmacological insights</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search medicines…"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/5 border border-white/[0.08] rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/40"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${category === cat ? "bg-blue-500 text-white" : "bg-white/5 border border-white/[0.08] text-slate-400 hover:border-white/20"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(med => (
          <motion.div key={med.id} whileHover={{ y: -4 }} className="cursor-pointer" onClick={() => setSelected(med)}>
            <GlassCard className="overflow-hidden hover:border-white/20 transition-all h-full">
              <div className="h-36 bg-slate-900 relative overflow-hidden">
                <img src={med.img} alt={med.name} className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                <div className="absolute top-3 left-3">
                  <Badge color="blue">{med.category}</Badge>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); setBookmarks(b => b.includes(med.id) ? b.filter(x => x !== med.id) : [...b, med.id]) }}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(med.id) ? "fill-amber-400 text-amber-400" : "text-white"}`} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-white mb-0.5">{med.name}</h3>
                <p className="text-xs text-slate-600 mb-2">{med.drugClass}</p>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">{med.purpose}</p>
                <div className="flex items-center gap-2 text-xs mb-3">
                  <span className="text-slate-600">Dose:</span>
                  <span className="text-slate-400">{med.dosage}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/15">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-amber-300/70 leading-relaxed">{med.fact}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
              className="bg-[#111827] border border-white/[0.08] rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-44 bg-slate-900 relative rounded-t-3xl overflow-hidden">
                <img src={selected.img} alt={selected.name} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/30 to-transparent" />
                <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 rounded-xl bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors">
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <h2 className="text-2xl font-bold text-white">{selected.name}</h2>
                  <p className="text-slate-400 text-sm">{selected.drugClass}</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                {[["Purpose", selected.purpose], ["Mechanism of Action", selected.mechanism], ["Standard Dosage", selected.dosage]].map(([label, val]) => (
                  <div key={label}>
                    <div className="text-xs text-slate-600 mb-1">{label}</div>
                    <div className="text-sm text-slate-300">{val}</div>
                  </div>
                ))}
                <div>
                  <div className="text-xs text-slate-600 mb-2">Common Side Effects</div>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.sideEffects.map(s => <Badge key={s} color="amber">{s}</Badge>)}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[["Pregnancy", selected.pregnancySafe], ["Kidney", selected.kidneySafe], ["Liver", selected.liverSafe]].map(([label, val]) => (
                    <div key={label} className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-3 text-center">
                      <div className="text-xs text-slate-600 mb-1">{label}</div>
                      <div className="text-xs text-slate-300 leading-tight">{val}</div>
                    </div>
                  ))}
                </div>
                <div className="p-3 rounded-xl bg-amber-500/[0.07] border border-amber-500/20 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-semibold text-amber-400 mb-1">Did you know?</div>
                    <p className="text-xs text-amber-300/70 leading-relaxed">{selected.fact}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Nearby Care ──────────────────────────────────────────────────────────────

function NearbyPage() {
  const [filter, setFilter] = useState("All")

  const types = ["All", "Hospital", "Clinic", "Pharmacy"]
  const filtered = nearbyPlaces.filter(p => filter === "All" || p.type === filter)

  function getIcon(type: string) {
    if (type === "Hospital") return Hospital
    if (type === "Clinic") return Stethoscope
    return FlaskConical
  }

  function getColors(type: string) {
    if (type === "Hospital") return { text: "text-red-400", bg: "bg-red-500/10" }
    if (type === "Clinic") return { text: "text-blue-400", bg: "bg-blue-500/10" }
    return { text: "text-green-400", bg: "bg-green-500/10" }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-white">Nearby Care</h1>
        <p className="text-slate-500 text-sm">Hospitals, clinics, and pharmacies near you in Mumbai</p>
      </div>

      {/* Map placeholder */}
      <GlassCard className="h-48 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/60" />
        <div className="absolute inset-0 opacity-10">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="absolute border-slate-500" style={{ left: `${i * 15}%`, top: 0, bottom: 0, borderLeftWidth: 1 }} />
          ))}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="absolute border-slate-500" style={{ top: `${i * 33}%`, left: 0, right: 0, borderTopWidth: 1 }} />
          ))}
        </div>
        {nearbyPlaces.slice(0, 5).map((place, i) => {
          const colors = getColors(place.type)
          return (
            <motion.div
              key={place.id} whileHover={{ scale: 1.2 }}
              className="absolute cursor-pointer"
              style={{ left: `${15 + i * 16}%`, top: `${20 + (i % 2) * 40}%` }}
            >
              <div className={`w-7 h-7 rounded-full ${colors.bg} border border-white/20 flex items-center justify-center shadow-lg`}>
                <MapPin className={`w-3.5 h-3.5 ${colors.text}`} />
              </div>
            </motion.div>
          )
        })}
        <div className="absolute bottom-4 left-4 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 bg-[#0A0E1B]/70 backdrop-blur-sm px-3 py-1.5 rounded-xl">
            <MapPin className="w-3 h-3" /> Mumbai, Maharashtra · 6 results nearby
          </div>
        </div>
      </GlassCard>

      <div className="flex items-center gap-2 mb-5 flex-wrap">
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${filter === t ? "bg-blue-500 text-white" : "bg-white/5 border border-white/[0.08] text-slate-400 hover:border-white/20"}`}>
            {t}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          {["24 Hours", "Top Rated"].map(f => (
            <button key={f} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/[0.08] text-slate-500 hover:text-white text-xs transition-all">{f}</button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(place => {
          const Icon = getIcon(place.type)
          const colors = getColors(place.type)
          return (
            <motion.div key={place.id} whileHover={{ y: -2 }}>
              <GlassCard className="p-4 hover:border-white/20 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm truncate">{place.name}</h3>
                    <p className="text-xs text-slate-600 truncate">{place.address}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${place.isOpen ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                    {place.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {place.distance}</span>
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400" /> {place.rating}</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs hover:bg-blue-500/20 transition-colors flex items-center justify-center gap-1">
                    <Phone className="w-3 h-3" /> Call
                  </button>
                  <button className="flex-1 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/[0.08] text-xs hover:bg-white/10 transition-colors flex items-center justify-center gap-1">
                    <MapPin className="w-3 h-3" /> Navigate
                  </button>
                  {place.type !== "Pharmacy" && (
                    <button className="flex-1 py-2 rounded-xl bg-white/5 text-slate-400 border border-white/[0.08] text-xs hover:bg-white/10 transition-colors">
                      Book
                    </button>
                  )}
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// ─── AI Assistant ─────────────────────────────────────────────────────────────

function AssistantPage() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm MedGuard AI. I can help you understand drug interactions, explain your medications, suggest safer alternatives, and answer any healthcare questions. What would you like to know?" },
    { role: "user", text: "Can I take Aspirin and Warfarin together?" },
    { role: "ai", text: "Caution: High-Risk Combination\n\nTaking Aspirin and Warfarin together significantly increases your risk of bleeding. Here's why:\n\n• Aspirin inhibits platelet aggregation via COX-1\n• Warfarin inhibits clotting factors II, VII, IX, and X\n\nTogether they attack coagulation from two directions — additive anticoagulant effect.\n\nRecommendation: Do not combine without physician supervision. If both are prescribed, your doctor will monitor INR closely and may adjust your Warfarin dose. In some cases, low-dose Aspirin (75mg) can be used with careful INR monitoring." },
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    "What does Metformin do?",
    "Explain my prescription",
    "What if I miss my dose?",
    "Safe pain relief for diabetics?",
  ]

  const sendMessage = (text: string = input) => {
    if (!text.trim()) return
    setMessages(m => [...m, { role: "user", text }])
    setInput("")
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(m => [...m, {
        role: "ai",
        text: "That's a great question. Based on your health profile and current medications, I recommend consulting your primary physician for a personalized answer. In general, it's important to consider your kidney function, liver health, and any concurrent medications before making changes. Would you like me to explain the pharmacological mechanism in more detail?",
      }])
    }, 1600)
  }

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, typing])

  return (
    <div className="flex flex-col p-6 gap-4" style={{ height: "100vh" }}>
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white">MedGuard AI Assistant</h1>
          <div className="flex items-center gap-1.5 text-xs text-green-400">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Online · Trained on 50,000+ clinical papers
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 min-h-0 pr-1">
        {messages.map((msg, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "ai" && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-2.5 flex-shrink-0 mt-1">
                <Bot className="w-3.5 h-3.5 text-white" />
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-blue-500 text-white rounded-tr-sm"
                : "bg-white/[0.05] border border-white/[0.08] text-slate-300 rounded-tl-sm"
            }`}>
              {msg.text.split("\n").map((line, j) => (
                <p key={j} className={line === "" ? "h-2" : ""}>{line}</p>
              ))}
            </div>
          </motion.div>
        ))}
        {typing && (
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="bg-white/[0.05] border border-white/[0.08] rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 flex-shrink-0">
        {suggestions.map(s => (
          <button key={s} onClick={() => sendMessage(s)} className="text-xs px-3 py-1.5 rounded-xl bg-white/5 border border-white/[0.08] text-slate-500 hover:border-blue-500/30 hover:text-blue-400 transition-all whitespace-nowrap flex-shrink-0">
            {s}
          </button>
        ))}
      </div>

      <div className="flex gap-3 flex-shrink-0">
        <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/[0.08] rounded-2xl px-4 focus-within:border-blue-500/40 transition-colors">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask about medications, interactions, or your health…"
            className="flex-1 bg-transparent text-white placeholder-slate-600 text-sm py-3.5 focus:outline-none"
          />
          <button className="text-slate-600 hover:text-slate-400 transition-colors">
            <Mic className="w-4 h-4" />
          </button>
        </div>
        <button onClick={() => sendMessage()} className="p-3.5 rounded-2xl bg-blue-500 hover:bg-blue-600 text-white transition-colors">
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

// ─── Reports Page ─────────────────────────────────────────────────────────────

function ReportsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-white">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm">Your medication trends and health insights</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white text-sm flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> PDF
          </button>
          <button className="px-3 py-2 rounded-xl bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white text-sm flex items-center gap-1.5">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Avg. Compatibility", value: "86/100", color: "text-green-400", trend: "+4% this month" },
          { label: "Total Checks", value: "23", color: "text-blue-400", trend: "+8 this month" },
          { label: "Interactions Found", value: "7", color: "text-amber-400", trend: "−2 this month" },
          { label: "Adherence Rate", value: "91%", color: "text-cyan-400", trend: "+3% this month" },
        ].map((item, i) => (
          <GlassCard key={i} className="p-4">
            <div className={`text-2xl font-bold ${item.color} mb-1`}>{item.value}</div>
            <div className="text-xs text-slate-600 mb-1">{item.label}</div>
            <div className="text-xs text-green-400">{item.trend}</div>
          </GlassCard>
        ))}
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" /> Monthly Compatibility Score
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="gScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
              <Area type="monotone" dataKey="score" stroke="#22C55E" strokeWidth={2} fill="url(#gScore)" name="Score" />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" /> Monthly Interactions Detected
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="interactions" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Interactions" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" /> Weekly Adherence
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={adherenceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
              <Bar dataKey="adherence" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Adherence %" />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
            <Pill className="w-4 h-4 text-violet-400" /> Medicine Category Distribution
          </h2>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie data={medCategories} cx="50%" cy="50%" outerRadius={75} dataKey="value" paddingAngle={2}>
                  {medCategories.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#111827", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
              {medCategories.map((cat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
                    <span className="text-xs text-slate-400">{cat.name}</span>
                  </div>
                  <span className="text-xs text-slate-600">{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  )
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

function ProfilePage() {
  const [editing, setEditing] = useState(false)

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-white">Profile</h1>
        <button
          onClick={() => setEditing(v => !v)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${editing ? "bg-green-500 text-white" : "bg-white/5 border border-white/[0.08] text-slate-400 hover:text-white"}`}
        >
          {editing ? "✓ Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <GlassCard className="p-6 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            SJ
          </div>
          <h2 className="text-lg font-bold text-white mb-0.5">Sarah Johnson</h2>
          <p className="text-slate-500 text-sm mb-5">34 years · Female · Mumbai</p>
          <div className="flex justify-center">
            <div className="relative">
              <ScoreRing score={92} size={90} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div>
                  <div className="text-xl font-bold text-white">92</div>
                  <div className="text-xs text-slate-600 text-center">Health</div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Badge color="green">Excellent Health</Badge>
          </div>
        </GlassCard>

        <div className="md:col-span-2 space-y-4">
          <GlassCard className="p-5">
            <h3 className="font-semibold text-white mb-4 text-sm">Physical Stats</h3>
            <div className="grid grid-cols-4 gap-3">
              {[["62 kg", "Weight"], ["165 cm", "Height"], ["22.8", "BMI"], ["O+", "Blood Group"]].map(([val, label]) => (
                <div key={label} className="text-center p-3 bg-white/[0.03] rounded-xl">
                  <div className="text-lg font-bold text-white">{val}</div>
                  <div className="text-xs text-slate-600">{label}</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid grid-cols-2 gap-4">
            <GlassCard className="p-5">
              <h3 className="font-semibold text-white mb-3 text-sm">Medical Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {["Type 2 Diabetes", "Hypertension"].map(c => <Badge key={c} color="blue">{c}</Badge>)}
              </div>
            </GlassCard>
            <GlassCard className="p-5">
              <h3 className="font-semibold text-white mb-3 text-sm">Drug Allergies</h3>
              <div className="flex flex-wrap gap-2">
                {["Penicillin", "Sulfa drugs"].map(a => <Badge key={a} color="red">{a}</Badge>)}
              </div>
            </GlassCard>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: "Primary Doctor", value: "Dr. Priya Sharma", icon: Stethoscope },
              { label: "Hospital", value: "City General Hospital", icon: Hospital },
              { label: "Insurance", value: "Star Health #SH2024567", icon: Shield },
            ].map(item => (
              <GlassCard key={item.label} className="p-4">
                <item.icon className="w-4 h-4 text-slate-600 mb-2" />
                <div className="text-xs text-slate-600 mb-1">{item.label}</div>
                <div className="text-xs text-slate-300 leading-tight">{item.value}</div>
              </GlassCard>
            ))}
          </div>

          <GlassCard className="p-4 border-red-500/15 bg-red-500/[0.02]">
            <div className="flex items-center gap-2 mb-1.5">
              <Phone className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">Emergency Contact</span>
            </div>
            <div className="text-sm text-slate-300">+91 98765 43210 · Raj Johnson (Husband)</div>
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(true)
  const [notifs, setNotifs] = useState({ medication: true, interactions: true, refills: true, weekly: false })
  const [language, setLanguage] = useState("English")

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">Settings</h1>

      <div className="space-y-4">
        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">Appearance</h2>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
              <div>
                <div className="text-sm text-white">Dark Mode</div>
                <div className="text-xs text-slate-600">Currently {darkMode ? "dark" : "light"} theme</div>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(v => !v)}
              className={`w-11 h-6 rounded-full transition-colors flex-shrink-0 relative ${darkMode ? "bg-blue-500" : "bg-white/20"}`}
            >
              <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${darkMode ? "translate-x-5.5" : "translate-x-0.5"}`} style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4 text-sm flex items-center gap-2">
            <Bell className="w-4 h-4 text-blue-400" /> Notifications
          </h2>
          <div className="space-y-3">
            {[
              { key: "medication", label: "Medication Reminders", desc: "Alerts for scheduled doses" },
              { key: "interactions", label: "Interaction Alerts", desc: "Critical drug interaction warnings" },
              { key: "refills", label: "Refill Reminders", desc: "When medicines run low" },
              { key: "weekly", label: "Weekly Health Summary", desc: "Your weekly analytics report" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0">
                <div>
                  <div className="text-sm text-white">{item.label}</div>
                  <div className="text-xs text-slate-600">{item.desc}</div>
                </div>
                <button
                  onClick={() => setNotifs(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ml-4 ${notifs[item.key as keyof typeof notifs] ? "bg-blue-500" : "bg-white/10"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform shadow-sm ${notifs[item.key as keyof typeof notifs] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">Language & Region</h2>
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="w-full bg-white/5 border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/40"
          >
            {["English", "Hindi", "Tamil", "Marathi", "Telugu", "Bengali"].map(l => (
              <option key={l} value={l} style={{ background: "#111827" }}>{l}</option>
            ))}
          </select>
        </GlassCard>

        <GlassCard className="p-5">
          <h2 className="font-semibold text-white mb-4 text-sm">Privacy & Data Export</h2>
          <div className="space-y-2">
            {["Export My Data (PDF)", "Export My Data (CSV)", "Download Health Report"].map(action => (
              <button key={action} className="w-full text-left px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05] text-sm text-slate-300 hover:border-white/20 hover:text-white transition-all flex items-center justify-between">
                {action}
                <Download className="w-3.5 h-3.5 text-slate-600" />
              </button>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-5 border-red-500/10">
          <h2 className="font-semibold text-red-400 mb-4 text-sm">Danger Zone</h2>
          <button className="w-full py-3 rounded-xl border border-red-500/20 text-red-400 text-sm hover:bg-red-500/10 transition-colors">
            Delete Account & All Data
          </button>
        </GlassCard>
      </div>
    </div>
  )
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing")

  return (
    <div className="font-['Inter',_sans-serif]">
      {page === "landing" && <LandingPage onGetStarted={() => setPage("onboarding")} />}
      {page === "onboarding" && <OnboardingPage onFinish={() => setPage("dashboard")} />}
      {page !== "landing" && page !== "onboarding" && (
        <AppShell page={page} setPage={setPage} />
      )}
    </div>
  )
}
