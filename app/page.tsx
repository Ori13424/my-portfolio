"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, Variants, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

// --- CUSTOM HOOK: FIXED SEAMLESS AUTO-SCROLL ---
const useNativeSmoothScroll = (ref: React.RefObject<HTMLDivElement | null>, isHovered: boolean, speed: number = 1.0) => {
  useEffect(() => {
    let animationId: number;
    const el = ref.current;
    if (!el) return;

    const scroll = () => {
      if (!isHovered) {
        el.scrollLeft += speed;
        // Seamless loop jump
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };
    
    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered, speed, ref]);
};

// --- DATA LAYER ---
const PORTFOLIO_DATA = {
  experience: [
    {
      role: "Technical Member",
      company: "RUET IoT Club",
      duration: "2025 — Present",
      description: "Active technical member contributing to IoT workshops, hardware demonstrations, and hands-on embedded prototyping sessions. Led LFR competition team and organized PCB design sessions for junior members.",
      tech: ["ESP32", "Arduino", "PCB Design", "IoT Protocols", "FreeRTOS"]
    },
    {
      role: "Member",
      company: "RUET Computing Society (RCS)",
      duration: "2025 — Present",
      description: "Engaged in technical seminars, programming contests, and collaborative software development initiatives. Contributed to open-source projects and organized peer knowledge-sharing on embedded systems and web development.",
      tech: ["Python", "C++", "Web Dev", "Open-Source", "Competitive Programming"]
    }
  ],
  works: [
    {
      id: "bytebot", type: "AI & Automation", status: "FUNDED PROJECT",
      title: "ByteBot: IoT Command Bot", tech: ["Python", "Telegram API", "MQTT", "ESP32"],
      description: "A funded intelligent Telegram bot platform enabling remote command & control of IoT devices. Supports real-time sensor queries, alert routing, and automated hardware responses over MQTT.",
      features: ["Remote IoT Device Command Interface", "Real-time Sensor Data Streaming", "Automated MQTT Alert Routing"],
      image: "/images/bytebot.png",
      liveLink: "#", githubLink: "https://github.com/Ori13424", icon: "smart_toy"
    },
    {
      id: "matri-bandhob", type: "Full-Stack System", status: "HACKATHON FINALIST",
      title: "Matri-Bandhob Health App", tech: ["Next.js", "UI/UX", "Node.js"],
      description: "A comprehensive maternal health application featuring dual doctor/patient dashboards, tailored UI/UX, and an integrated AI chatbot triage system. National hackathon finalist.",
      features: ["Dual User-Role Dashboards", "AI Chatbot Triaging System", "Secure Data Routing & Storage"],
      image: "/images/matri-bandhob.png",
      liveLink: "#", githubLink: "https://github.com/Ori13424", icon: "health_and_safety"
    },
    {
      id: "esp32-flipper", type: "Security Research", status: "PROTOTYPE v1.0",
      title: "ESP32 Flipper Zero Clone", tech: ["ESP32", "C++", "RF Protocols", "OLED"],
      description: "A custom-built security research multitool inspired by Flipper Zero. Runs on ESP32 with OLED display, supporting Sub-GHz scanning, IR emulation, and NFC reader modules.",
      features: ["Sub-GHz RF Signal Scanning & Replay", "IR Remote Emulation & Capture", "NFC/RFID Reader Module Integration"],
      image: "/images/flipper.png",
      liveLink: "#", githubLink: "https://github.com/Ori13424", icon: "security"
    },
    {
      id: "lfr-robotics", type: "Robotics + Custom PCB", status: "PCB DEPLOYED",
      title: "Closed-Loop LFR + Custom PCB", tech: ["PID Logic", "Multiplexed IR", "C++", "EasyEDA"],
      description: "Line Follower Robot engineered with a fully custom-designed PCB fabricated from scratch in EasyEDA. Features an Arduino Nano, multiplexed IR sensor array calibration, and real-time PID motor control via a TB6612FNG driver.",
      features: ["Custom EasyEDA PCB Design & Fabrication", "Real-time PID Tuning Algorithm", "TB6612FNG Motor Driver & Multiplexed IR Integration"],
      image: "/images/lfr.png",
      liveLink: "#", githubLink: "https://github.com/Ori13424", icon: "developer_board"
    },
    {
      id: "power-array", type: "Power Systems", status: "HARDWARE DEPLOYED",
      title: "12V Lithium Power Array", tech: ["Lithium-Ion", "BMS", "Soldering"],
      description: "Hand-built portable power bank utilizing 6 high-capacity lithium cells, integrated with a Battery Management System for sustained hardware testing and field deployments.",
      features: ["Cell Balancing & Safety Protocols", "High-Current Output Routing", "Custom Enclosure Assembly"],
      image: "/images/power-bank.png",
      liveLink: "#", githubLink: "https://github.com/Ori13424", icon: "battery_charging_full"
    }
  ],
  services: [
    { title: "Full-Stack Architecture", icon: "web", desc: "End-to-end development of scalable, high-performance web applications and resilient microservices." },
    { title: "Embedded & IoT Solutions", icon: "memory", desc: "Custom firmware development, sensor integration, and edge computing for ESP32 and microcontrollers." },
    { title: "SCADA & Telemetry Design", icon: "dashboard", desc: "Design and deployment of real-time industrial monitoring dashboards utilizing JointJS and responsive SVGs." },
    { title: "Hardware-Software Synergy", icon: "cable", desc: "Seamlessly bridging the gap between physical analog nodes and digital cloud infrastructures." }
  ],
  skills: {
    software: [
      { name: "React & Next.js", icon: "web", color: "text-primary", border: "hover:border-primary/50", level: 90, sub: "Frontend Architecture & UI/UX", details: "Extensive experience engineering scalable web applications. Proficient in state management, Server-Side Rendering (SSR) for performance optimization, and translating complex Figma designs into responsive, interactive user interfaces using Tailwind CSS." },
      { name: "JointJS & SVG", icon: "draw", color: "text-primary", border: "hover:border-primary/50", level: 85, sub: "Interactive SCADA Dashboards", details: "Specialized in utilizing JointJS and custom scalable vector graphics (SVG) to create complex, drag-and-drop interactive canvases. Deployed these technologies to build web-based SCADA frontend systems mirroring industrial control panels." },
      { name: "Node.js & Backend", icon: "dns", color: "text-primary", border: "hover:border-primary/50", level: 82, sub: "REST APIs & Data Routing", details: "Capable of architecting robust server-side infrastructure using Node.js and Express. Experienced in designing RESTful APIs, handling database integration, and ensuring secure data routing between hardware nodes and user-facing dashboards." },
    ],
    hardware: [
      { name: "ESP32 & Microcontrollers", icon: "memory", color: "text-secondary", border: "hover:border-secondary/50", level: 88, sub: "RTOS, Sensors, Edge Compute", details: "Highly proficient in programming ESP32 and Arduino microcontrollers. Experienced in deploying Real-Time Operating Systems (RTOS), establishing Wi-Fi/Bluetooth telemetry, and interfacing with a wide array of digital and analog sensors at the edge." },
      { name: "Analog Circuitry", icon: "cable", color: "text-secondary", border: "hover:border-secondary/50", level: 82, sub: "Op-Amps, 555 Timers, Logic", details: "Deep foundational knowledge in Electronics and Telecommunication Engineering. Capable of designing custom physical hardware systems from scratch, utilizing core components like operational amplifiers, 555 timers, and discrete logic gates." },
      { name: "Robotics & Control", icon: "smart_toy", color: "text-secondary", border: "hover:border-secondary/50", level: 85, sub: "PID Calibration, Motor Drivers", details: "Hands-on experience in autonomous robotics, specifically closed-loop control systems. Skilled in calculating and calibrating Proportional-Integral-Derivative (PID) algorithms to ensure smooth, responsive motor control based on live sensor arrays." },
    ],
    data: [
      { name: "Python Core", icon: "terminal", color: "text-emerald-400", border: "hover:border-emerald-400/50", level: 92, sub: "Automation, Scripting, CLI", details: "Advanced proficiency in Python for high-level system operations. Utilized for rapid scripting, data manipulation, hardware communication (Serial/UART), and building automated pipelines that bridge embedded systems with broader network infrastructures." },
      { name: "C++ & Systems", icon: "settings_system_daydream", color: "text-emerald-400", border: "hover:border-emerald-400/50", level: 86, sub: "Low-Level Optimization", details: "Strong command of C++ for performance-critical applications. Used extensively in programming microcontrollers, optimizing memory allocation in constrained environments, and writing highly efficient logic for real-time robotic systems." },
      { name: "SQL & Firebase", icon: "database", color: "text-emerald-400", border: "hover:border-emerald-400/50", level: 85, sub: "PostgreSQL, NoSQL", details: "Experienced in designing relational database schemas and implementing NoSQL solutions like Firebase Cloud Firestore. Capable of building robust data routing architectures for full-stack applications and handling secure user data." },
    ],
    ai: [
      { name: "Machine Learning Concepts", icon: "neurology", color: "text-purple-400", border: "hover:border-purple-400/50", level: 60, sub: "Currently Learning", details: "Actively studying foundational ML concepts, including regression, classification, and neural network architectures. Exploring how to train and evaluate predictive models." },
      { name: "AI Tool Integration", icon: "api", color: "text-purple-400", border: "hover:border-purple-400/50", level: 75, sub: "APIs & Workflows", details: "Experienced in integrating existing AI models into full-stack applications. Successfully implemented an AI chatbot triaging system using external APIs for the Matri-Bandhob health application." },
      { name: "Edge AI / TinyML", icon: "speed", color: "text-purple-400", border: "hover:border-purple-400/50", level: 40, sub: "Research & Development", details: "Currently exploring the deployment of lightweight machine learning models onto resource-constrained edge devices, combining my embedded systems knowledge with modern AI capabilities." }
    ]
  },
  certifications: [
    { title: "RUET Innovation Cohort 6", issuer: "RUET Innovation & Entrepreneurship Centre", date: "2025", icon: "emoji_events", link: "https://drive.google.com/file/d/1fcWM1TYX7Df0fbqEnwRf_njtf_J9Kxqm/view?usp=sharing" },
    { title: "AI Build-A-Thon Finalist", issuer: "National AI Competition", date: "2025", icon: "psychology", link: "https://drive.google.com/file/d/1H0_LDh77bPFtJYxI1Nboa8JiiwHbLwG4/view?usp=sharing" },
    { title: "Robolution 2025", issuer: "RUET Robotics Club", date: "2025", icon: "precision_manufacturing", link: "https://drive.google.com/file/d/1T4udVffuHnr00BgQASgIx44bwTjWZN3p/view?usp=sharing" },
    { title: "IEEE RUET IAS SBC Industrial Visit", issuer: "IEEE Industry Applications Society", date: "2024", icon: "factory", link: "https://drive.google.com/file/d/1qyT_gc348EEazQ0mI-ufQ2LIKd_Jqzgf/view?usp=sharing" },
    { title: "SQA & Software Testing Workshop", issuer: "Tech Skills Bangladesh", date: "2024", icon: "verified", link: "https://drive.google.com/file/d/1r57A2i3nXxUmj4gOMW_wUm1JDS8ehA6S/view?usp=sharing" }
  ],
  reviews: [
    { text: "Their ability to bridge the gap between analog electronics and full-stack web architecture is exceptional. The SCADA frontend they contributed to our open-source ecosystem is incredibly robust.", name: "Senior Lead Engineer", role: "Open-Source Collaborator", org: "Global Tech Firm" },
    { text: "During the hackathon, they demonstrated incredible technical versatility. The UI/UX on the Matri-Bandhob application was flawless, and the underlying database architecture was rock solid.", name: "Technical Judge", role: "National Hackathon 2026", org: "Innovation Board" },
    { text: "A standout student in the ETE department. Their hands-on approach to building physical circuits, combined with their active pursuit of machine learning, makes them a prime candidate for advanced graduate research.", name: "Department Professor", role: "University Engineering Dept.", org: "State University" },
    { text: "Delivered a custom IoT telemetry dashboard that perfectly monitored our hardware nodes. Code was impeccably clean and well-documented for future maintainers.", name: "Project Manager", role: "Freelance Client", org: "Hardware Startup" }
  ],
  microSkills: [ "TypeScript", "Tailwind CSS", "Git/GitHub", "Linux", "Arduino IDE", "Soldering", "Figma", "JSON", "C", "Docker Basics", "Telemetry", "Open-Source" ],
  education: [
    { year: "2026 — Future", title: "Master's Degree Pursuit", location: "United States", desc: "Actively seeking scholarship opportunities to deepen expertise in machine learning, AI, and advanced system architecture at a top research university.", icon: "flight_takeoff", color: "text-secondary", bg: "bg-secondary/10" },
    { year: "Oct 2023 — Present", title: "B.Sc. Electronics & Telecommunication Eng.", location: "RUET — Rajshahi University of Engineering and Technology", desc: "Deep focus on analog electronics, signal processing, microcontroller systems, and hardware prototyping within a rigorous ETE curriculum.", icon: "memory", color: "text-primary", bg: "bg-primary/10" },
    { year: "2023", title: "HSC — Science", location: "DRMC — Dhaka Residential Model College", desc: "Higher Secondary Certificate in Science stream. GPA: 5.00 / 5.00", icon: "school", color: "text-emerald-400", bg: "bg-emerald-400/10" },
    { year: "2021", title: "SSC — Science", location: "DRMC — Dhaka Residential Model College", desc: "Secondary School Certificate in Science stream. GPA: 5.00 / 5.00", icon: "menu_book", color: "text-emerald-400", bg: "bg-emerald-400/10" }
  ],
  // PCB Layer Data
  pcbLayers: [
    { id: "all", name: "All Layers", img: "/pcb/all-layers.png", color: "bg-blue-500" },
    { id: "top", name: "Top Layer", img: "/pcb/top-layer.png", color: "bg-emerald-500" },
    { id: "bottom", name: "Bottom Layer", img: "/pcb/bottom-layer.png", color: "bg-red-500" },
    { id: "copperTop", name: "Copper Top", img: "/pcb/copper-top.png", color: "bg-yellow-500" },
    { id: "copperBottom", name: "Copper Bottom", img: "/pcb/copper-bottom.png", color: "bg-orange-500" }
  ]
};

// --- ANIMATION VARIANTS ---
const fadeUp: Variants = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
const staggerContainer: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } } };

// --- REUSABLE COMPONENTS ---
const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16">
    <span className="font-label text-[12px] font-bold tracking-[0.5em] text-on-surface-muted uppercase flex items-center gap-4">
      <span className="w-8 h-[1px] bg-on-surface-muted"></span> {subtitle}
    </span>
    <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-white mt-4 uppercase">{title}</h2>
  </motion.div>
);

// --- MAIN PAGE COMPONENT ---
export default function Home() {
  const router = useRouter(); 
  const { scrollYProgress } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Modals & Tabs
  const [selectedSkill, setSelectedSkill] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [activeStack, setActiveStack] = useState<"software" | "hardware" | "data" | "ai">("software");
  
  // Forms & Auth
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<"idle" | "sending" | "sent">("idle");
  
  // --- SECRET ADMIN LOGIC ---
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [authError, setAuthError] = useState(false);

  // Auto-Scroll Refs & Hover States
  const systemsRef = useRef<HTMLDivElement | null>(null);
  const certsRef = useRef<HTMLDivElement | null>(null);
  const reviewsRef = useRef<HTMLDivElement | null>(null);
  const [hoveredSection, setHoveredSection] = useState<"systems" | "certs" | "reviews" | null>(null);

  // PCB Viewer State
  const [pcbViewMode, setPcbViewMode] = useState<"layers" | "photo">("layers");
  const [activeLayer, setActiveLayer] = useState<string>("all");

  useNativeSmoothScroll(systemsRef, hoveredSection === "systems", 1);
  useNativeSmoothScroll(certsRef, hoveredSection === "certs", 0.6);
  useNativeSmoothScroll(reviewsRef, hoveredSection === "reviews", 0.8);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'x') {
        e.preventDefault();
        setAuthModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (selectedSkill || selectedProject || reviewModalOpen || authModalOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset' };
  }, [selectedSkill, selectedProject, reviewModalOpen, authModalOpen]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewStatus("sending");
    setTimeout(() => { setReviewStatus("sent"); setTimeout(() => { setReviewStatus("idle"); setReviewModalOpen(false); }, 2000); }, 1500);
  };

  const handleAdminAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPass === "root.override") {
      sessionStorage.setItem("sys_auth", "verified");
      window.location.href = '/sys-admin';
    } else {
      setAuthError(true);
      setTimeout(() => setAuthError(false), 500);
      setAdminPass("");
    }
  };

  const scrollGlide = (direction: "left" | "right") => {
    if (systemsRef.current) {
      setHoveredSection("systems"); 
      const scrollAmount = direction === "left" ? -500 : 500;
      systemsRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(() => setHoveredSection(null), 800); 
    }
  };

  return (
    <div className="bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden relative min-h-screen">
      
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none dot-grid opacity-30"></div>
      <div className="pointer-events-none fixed inset-0 z-30 transition-duration-300" style={{ background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 211, 238, 0.04), transparent 80%)` }} />
      <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-secondary z-[60] origin-left" style={{ scaleX: scrollYProgress }} />

      {/* --- SECRET AUTHENTICATION MODAL --- */}
      <AnimatePresence>
        {authModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0, x: authError ? [-10, 10, -10, 10, 0] : 0 }} 
              transition={{ duration: authError ? 0.4 : 0.3 }}
              className="bg-[#0a0a0a] border border-red-500/30 rounded-xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(239,68,68,0.15)] relative font-mono"
            >
              <button onClick={() => setAuthModalOpen(false)} className="absolute top-4 right-4 text-white/50 hover:text-white"><span className="material-symbols-outlined text-xl">close</span></button>
              
              <div className="flex flex-col items-center justify-center mb-8 text-center">
                 <span className="material-symbols-outlined text-red-500 text-5xl mb-4">gpp_bad</span>
                 <h3 className="text-xl font-bold text-red-500 uppercase tracking-widest mb-1">Restricted Area</h3>
                 <p className="text-xs text-white/50 tracking-widest uppercase">System Override Authentication Required</p>
              </div>
              
              <form onSubmit={handleAdminAuth}>
                <div className="space-y-2 mb-6">
                  <label className="text-[10px] text-red-400 uppercase tracking-widest">Root Password</label>
                  <input 
                    autoFocus type="password" value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
                    placeholder="Enter passphrase..." 
                    className="w-full bg-black border border-red-500/20 text-sm text-red-100 px-4 py-3 rounded focus:outline-none focus:border-red-500 transition-colors placeholder:text-red-900/50 text-center tracking-[0.5em]"
                  />
                </div>
                <button className="w-full py-3 text-xs uppercase tracking-widest rounded font-bold transition-all bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-black">
                  Initialize Override
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- ADD REVIEW MODAL --- */}
      <AnimatePresence>
        {reviewModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto" onClick={() => setReviewModalOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-surface-container-low border border-white/10 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden font-mono my-8">
              <button onClick={() => setReviewModalOpen(false)} className="absolute top-4 right-4 text-on-surface-muted hover:text-white transition-colors"><span className="material-symbols-outlined text-xl">close</span></button>
              
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                 <span className="material-symbols-outlined text-secondary text-3xl">rate_review</span>
                 <h3 className="font-headline text-2xl font-bold text-white uppercase tracking-widest">Submit System Feedback</h3>
              </div>
              
              <form className="space-y-6" onSubmit={handleReviewSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] text-on-surface-muted uppercase tracking-widest block mb-2">Reviewer Identity</label>
                    <input required type="text" placeholder="e.g. Dr. Alan Turing" disabled={reviewStatus !== "idle"} className="w-full bg-surface border border-white/10 text-sm text-white px-4 py-3 rounded focus:outline-none focus:border-secondary transition-colors disabled:opacity-50"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-muted uppercase tracking-widest block mb-2">Professional Role</label>
                    <input required type="text" placeholder="e.g. Lead Engineer / Professor" disabled={reviewStatus !== "idle"} className="w-full bg-surface border border-white/10 text-sm text-white px-4 py-3 rounded focus:outline-none focus:border-secondary transition-colors disabled:opacity-50"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-muted uppercase tracking-widest block mb-2">Industrial Attachment / Org</label>
                    <input required type="text" placeholder="e.g. Tech Innovators Inc." disabled={reviewStatus !== "idle"} className="w-full bg-surface border border-white/10 text-sm text-white px-4 py-3 rounded focus:outline-none focus:border-secondary transition-colors disabled:opacity-50"/>
                  </div>
                  <div>
                    <label className="text-[10px] text-on-surface-muted uppercase tracking-widest block mb-2">Collaboration Context</label>
                    <select disabled={reviewStatus !== "idle"} className="w-full bg-surface border border-white/10 text-sm text-white px-4 py-3 rounded focus:outline-none focus:border-secondary transition-colors disabled:opacity-50 appearance-none">
                      <option>Academic Supervisor</option>
                      <option>Hackathon Judge / Organizer</option>
                      <option>Open-Source Collaborator</option>
                      <option>Freelance Client</option>
                      <option>Colleague / Peer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-on-surface-muted uppercase tracking-widest block mb-2">Evaluation Payload</label>
                  <textarea required placeholder="Detailed assessment of architecture, engineering skills, and system delivery..." rows={4} disabled={reviewStatus !== "idle"} className="w-full bg-surface border border-white/10 text-sm text-white px-4 py-3 rounded focus:outline-none focus:border-secondary transition-colors resize-none disabled:opacity-50"></textarea>
                </div>
                
                <button disabled={reviewStatus !== "idle"} className={`w-full py-4 text-xs uppercase tracking-widest rounded font-bold transition-all flex items-center justify-center gap-2 ${reviewStatus === "idle" ? "bg-secondary text-slate-900 hover:bg-secondary/90 hover:shadow-[0_0_15px_rgba(69,223,164,0.4)]" : ""} ${reviewStatus === "sending" ? "bg-yellow-500 text-slate-900 cursor-wait" : ""} ${reviewStatus === "sent" ? "bg-primary text-slate-900 cursor-default" : ""}`}>
                  {reviewStatus === "idle" && <><span className="material-symbols-outlined text-sm">send</span> Push Evaluation to Server</>}
                  {reviewStatus === "sending" && <><span className="material-symbols-outlined text-sm animate-spin">sync</span> Authenticating & Uploading...</>}
                  {reviewStatus === "sent" && <><span className="material-symbols-outlined text-sm">verified</span> Verified & Pushed Successfully</>}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- SKILL DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedSkill && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md" onClick={() => setSelectedSkill(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()} className="bg-surface-container-low border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
              <div className={`absolute -right-20 -top-20 w-40 h-40 rounded-full blur-[80px] opacity-20 pointer-events-none ${selectedSkill.color.replace('text-', 'bg-')}`}></div>
              <button onClick={() => setSelectedSkill(null)} className="absolute top-4 right-4 text-on-surface-muted hover:text-white transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-surface hover:bg-white/10"><span className="material-symbols-outlined text-sm">close</span></button>
              <div className="flex items-center gap-5 mb-8">
                 <div className="w-16 h-16 rounded-xl bg-surface border border-white/5 flex items-center justify-center shadow-inner">
                   <span className={`material-symbols-outlined text-4xl ${selectedSkill.color}`}>{selectedSkill.icon}</span>
                 </div>
                 <div>
                   <h3 className="font-headline text-2xl font-bold text-white mb-1">{selectedSkill.name}</h3>
                   <p className="font-mono text-[10px] text-on-surface-variant tracking-widest uppercase">{selectedSkill.sub}</p>
                 </div>
              </div>
              <div className="mb-8 p-6 bg-surface rounded-xl border border-white/5">
                 <div className="flex justify-between items-center mb-3">
                   <span className="font-mono text-[10px] text-on-surface-muted uppercase tracking-widest">System Proficiency</span>
                   <span className={`font-mono text-sm font-bold ${selectedSkill.color}`}>{selectedSkill.level}%</span>
                 </div>
                 <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${selectedSkill.level}%` }} transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} className={`h-full rounded-full ${selectedSkill.color.replace('text-', 'bg-')}`} />
                 </div>
              </div>
              <div>
                <span className="font-mono text-[10px] text-primary tracking-widest uppercase mb-3 block">ARCHITECTURE_DETAILS</span>
                <p className="text-sm text-on-surface-variant leading-relaxed font-body">{selectedSkill.details}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- PROJECT DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setSelectedProject(null)}>
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} onClick={(e) => e.stopPropagation()} className="bg-surface-container-low border border-white/10 rounded-2xl max-w-5xl w-full shadow-2xl relative flex flex-col md:flex-row overflow-hidden h-[85vh] md:h-[600px]">
              <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 z-50 text-white hover:text-primary transition-colors w-10 h-10 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-md border border-white/10 hover:bg-black/80"><span className="material-symbols-outlined text-sm">close</span></button>
              
              <div className="w-full md:w-1/2 h-64 md:h-full relative shrink-0">
                <div className="absolute inset-0 bg-surface-container-lowest/20 mix-blend-overlay z-10 pointer-events-none dot-grid"></div>
                <img src={selectedProject.image} alt={selectedProject.title} className="absolute inset-0 w-full h-full object-cover grayscale-[0.3]" />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-surface-container-low to-transparent z-20"></div>
              </div>

              <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col overflow-y-auto hide-scrollbar z-30">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary text-xl">{selectedProject.icon}</span>
                  <span className="font-mono text-[10px] text-primary tracking-widest uppercase border border-primary/20 bg-primary/5 px-3 py-1 rounded">{selectedProject.type}</span>
                </div>
                <h3 className="font-headline text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">{selectedProject.title}</h3>
                <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.tech.map((t: string) => (
                    <span key={t} className="font-mono text-[10px] bg-surface-container-highest px-3 py-1 text-on-surface-variant tracking-wider rounded border border-white/5 uppercase">{t}</span>
                  ))}
                </div>
                <div className="space-y-8 flex-grow">
                  <div>
                    <span className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase mb-3 block">System Overview</span>
                    <p className="text-sm text-on-surface-variant leading-relaxed font-body">{selectedProject.description}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] text-on-surface-muted tracking-widest uppercase mb-3 block">Key Architecture Features</span>
                    <ul className="space-y-3">
                      {selectedProject.features.map((feature: string, idx: number) => (
                         <li key={idx} className="flex items-start gap-3 text-sm text-on-surface-variant font-body">
                           <span className="material-symbols-outlined text-secondary text-base shrink-0 mt-0.5">check_circle</span>{feature}
                         </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-10 pt-6 border-t border-white/5">
                  <a href={selectedProject.liveLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-primary text-slate-900 px-6 py-3 rounded-md font-headline text-xs font-bold uppercase tracking-widest hover:shadow-[0_0_20px_rgba(138,235,255,0.4)] hover:scale-[1.02] transition-all duration-300">
                    <span className="material-symbols-outlined text-sm">rocket_launch</span> Live Demo
                  </a>
                  <a href={selectedProject.githubLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-surface-container-highest border border-white/10 text-white px-6 py-3 rounded-md font-headline text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition-all duration-300">
                    <span className="material-symbols-outlined text-sm">code</span> Source Code
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-surface/80 backdrop-blur-xl border-b border-white/5 py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
        <nav className="flex justify-between items-center max-w-7xl mx-auto px-8">
          <div className="text-xl font-black tracking-tighter text-white flex items-center gap-2 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="material-symbols-outlined text-primary group-hover:rotate-180 transition-transform duration-700">change_history</span>
            FAYEM MUKTADIR RAHMAN<span className="text-primary"></span>
          </div>
          <div className="hidden lg:flex gap-8 items-center font-headline tracking-widest font-bold text-xs uppercase">
            {[['About','about'], ['Systems','systems'], ['PCB','pcb'], ['Stack','stack'], ['Contact','contact']].map(([label, href]) => (
              <a key={href} className="text-on-surface-muted hover:text-primary transition-colors relative group" href={`#${href}`}>
                {label}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-primary transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>
          <a href="/resume.html" target="_blank" rel="noopener noreferrer" className="bg-white/5 border border-white/10 text-white px-6 py-2.5 rounded-md font-headline font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-on-primary hover:border-primary transition-all duration-300 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">open_in_new</span> View CV
          </a>
        </nav>
      </header>

      <main className="relative z-40">
        
        {/* --- HERO (UPDATED WITH FULL COLOR PROFILE IMAGE) --- */}
        <section className="relative min-h-screen flex items-center px-8 md:px-20 overflow-hidden">
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between z-10 pt-20 gap-12">
            
            {/* Text Content */}
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex-1 max-w-2xl">
              <motion.div variants={fadeUp} className="mb-8 flex items-center gap-3 bg-surface-container-low/50 backdrop-blur-sm border border-white/5 w-fit px-4 py-2 rounded-full">
                <span className="inline-block w-2 h-2 bg-secondary rounded-full animate-pulse shadow-[0_0_12px_rgba(69,223,164,0.8)]"></span>
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant">SYSTEMS INITIALIZED</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="font-headline font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-tighter text-white leading-[1.1] mb-8">
                ENGINEERING THE <br className="hidden md:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary drop-shadow-lg">PHYSICAL & DIGITAL</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="font-body text-lg text-on-surface-variant leading-relaxed mb-12 border-l-2 border-primary/30 pl-6">
                Multidisciplinary engineer bridging Electronics & Telecommunication Engineering with high-fidelity full-stack architectures and machine learning systems.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
                <a href="#systems" className="flex items-center gap-2 font-headline font-bold uppercase tracking-widest text-xs bg-primary text-on-primary px-8 py-4 rounded-md hover:shadow-[0_0_25px_rgba(138,235,255,0.4)] hover:-translate-y-1 transition-all duration-300">
                  View Architecture <span className="material-symbols-outlined text-sm">arrow_downward</span>
                </a>
                <a href="/resume.html" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-headline font-bold uppercase tracking-widest text-xs bg-surface-container-high border border-white/10 text-white px-8 py-4 rounded-md hover:bg-white/10 hover:-translate-y-1 transition-all duration-300">
                  <span className="material-symbols-outlined text-sm">open_in_new</span> View CV
                </a>
              </motion.div>
            </motion.div>

            {/* Profile Image Node */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }} className="hidden lg:block w-[400px] h-[400px] xl:w-[500px] xl:h-[500px] shrink-0 rounded-full border border-white/10 overflow-hidden relative shadow-[0_0_50px_rgba(34,211,238,0.05)] group">
               <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-500"></div>
               {/* Full color image, slight scale on hover */}
               <img src="/images/profile.png" alt="Fayem Muktadir Rahman" className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
            </motion.div>

          </div>
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 100, repeat: Infinity, ease: "linear" }} className="absolute -right-[20%] top-[10%] w-[800px] h-[800px] border-[1px] border-primary/10 rounded-full border-dashed -z-10" />
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-20"></div>
        </section>

        {/* --- STATS --- */}
        <section className="py-12 bg-surface-container-low border-y border-white/5 relative z-20">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
            {[ 
              { label: "Hardware Builds", value: "05+" }, 
              { label: "Software Systems", value: "05+" }, 
              { label: "System Uptime", value: "99.9%" }, 
              { label: "ETE Undergrad", value: "RUET" } 
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col items-center justify-center ${i === 0 ? 'pl-0' : ''}`}>
                <span className="font-headline text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</span>
                <span className="font-mono text-[10px] text-primary tracking-widest uppercase">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>


        {/* --- ABOUT --- */}
        <section className="py-32 px-8 md:px-20 bg-surface relative" id="about">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-8">
              <SectionHeader subtitle="System Logs" title="The Architect" />
              
              <div className="bg-surface-container-low border border-white/5 rounded-2xl overflow-hidden shadow-2xl flex-grow">
                <div className="bg-surface-container-high px-4 py-3 flex gap-2 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                </div>
                <div className="p-8 space-y-6 font-mono text-sm text-on-surface-variant leading-relaxed">
                  <p><span className="text-primary">{">"}</span> Initialize bio_sequence...</p>
                  <p>I am a multidisciplinary builder who thrives at the intersection where physical hardware meets digital logic. My journey began in the physical realm, prototyping analog circuits and programming microcontrollers.</p>
                  <p>Today, I leverage that low-level embedded knowledge to architect complex software systems, ensuring high performance from the silicon edge all the way to the cloud dashboard.</p>
                  <p><span className="text-secondary animate-pulse">_</span></p>
                </div>
              </div>
            </motion.div>

            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="lg:pt-24 relative" id="education">
               <div className="absolute left-[27px] top-[120px] bottom-10 w-[2px] bg-gradient-to-b from-secondary via-primary/50 to-transparent"></div>
               <div className="space-y-12">
                 {PORTFOLIO_DATA.education.map((item, i) => (
                   <motion.div key={i} variants={fadeUp} className="relative pl-20 group">
                      <div className={`absolute left-0 top-0 w-14 h-14 rounded-full ${item.bg} border border-white/10 flex items-center justify-center z-10 group-hover:scale-110 transition-transform duration-300`}>
                        <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                      </div>
                      <div className="bg-surface-container-high/50 hover:bg-surface-container-high transition-colors border border-white/5 rounded-xl p-6">
                        <span className="font-mono text-[10px] text-on-surface-muted uppercase tracking-widest">{item.year}</span>
                        <h3 className="font-headline text-xl font-bold text-white mt-1 mb-2">{item.title}</h3>
                        <h4 className={`font-mono text-xs uppercase tracking-widest mb-4 ${item.color}`}>{item.location}</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
                      </div>
                   </motion.div>
                 ))}
               </div>
            </motion.div>
          </div>
        </section>

        {/* --- ACTIVITIES & CLUBS --- */}
        <section className="py-32 px-8 md:px-20 bg-surface-container-lowest border-y border-white/5 relative" id="experience">
          <div className="max-w-7xl mx-auto">
            <SectionHeader subtitle="Campus & Community" title="Activities & Clubs" />
            <div className="relative mt-12">
              <div className="absolute left-[23px] top-8 bottom-8 w-[2px] bg-gradient-to-b from-primary via-secondary to-transparent hidden md:block"></div>
              <div className="space-y-12">
                {PORTFOLIO_DATA.experience.map((job, index) => (
                  <motion.div key={index} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="relative md:pl-24 group">
                    <div className="absolute left-[13px] top-8 w-[22px] h-[22px] rounded-full bg-surface border-[4px] border-primary hidden md:block group-hover:scale-125 group-hover:border-secondary transition-all duration-300 z-10"></div>
                    <div className="bg-surface-container-low border border-white/5 rounded-2xl p-8 md:p-10 hover:border-primary/30 hover:bg-surface-container transition-all duration-300 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                        <span className="material-symbols-outlined text-9xl text-primary">groups</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                        <div>
                          <h3 className="font-headline text-2xl md:text-3xl font-bold text-white">{job.role}</h3>
                          <h4 className="font-mono text-sm text-primary tracking-widest uppercase mt-1">{job.company}</h4>
                        </div>
                        <div className="bg-surface-container-highest px-4 py-2 rounded-full border border-white/10 w-fit">
                          <span className="font-mono text-[10px] text-white uppercase tracking-widest">{job.duration}</span>
                        </div>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed mb-8 relative z-10 max-w-3xl">{job.description}</p>
                      <div className="flex flex-wrap gap-2 relative z-10">
                        {job.tech.map((t, i) => (
                          <span key={i} className="font-mono text-[10px] border border-white/10 bg-surface px-3 py-1.5 rounded uppercase tracking-widest text-on-surface-muted">{t}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- UNIFIED SYSTEMS PORTFOLIO --- */}
        <section className="py-32 bg-surface-container-lowest border-y border-white/5 relative overflow-hidden" id="systems">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none -z-10"></div>
          
          <div className="max-w-[1400px] mx-auto relative">
            <div className="px-8 md:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
               <SectionHeader subtitle="Unified Architecture" title="Systems Portfolio" />
               
               <div className="flex gap-4 pb-4 z-20">
                 <button onClick={() => scrollGlide("left")} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white/10 hover:border-white/50 transition-all cursor-pointer active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                 </button>
                 <button onClick={() => scrollGlide("right")} className="w-12 h-12 rounded-full border border-primary/50 bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-slate-900 transition-all cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 pointer-events-none"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                 </button>
               </div>
            </div>

            <div 
              ref={systemsRef} 
              onMouseEnter={() => setHoveredSection("systems")} 
              onMouseLeave={() => setHoveredSection(null)}
              className="flex gap-8 overflow-x-auto hide-scrollbar pb-12 px-8 md:px-12 cursor-grab active:cursor-grabbing"
            >
              {[...PORTFOLIO_DATA.works, ...PORTFOLIO_DATA.works].map((work, index) => (
                <div 
                  key={work.id + index} 
                  onClick={() => setSelectedProject(work)}
                  className="min-w-[340px] md:min-w-[440px] shrink-0 bg-surface border border-white/10 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-primary/40 transition-all duration-500 group flex flex-col relative"
                >
                  <div className="absolute top-4 left-4 z-30 bg-black/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-2">
                     <span className={`w-2 h-2 rounded-full animate-pulse ${work.status.includes('HARDWARE') || work.status.includes('PROTOTYPE') ? 'bg-secondary' : 'bg-primary'}`}></span>
                     <span className="font-mono text-[9px] text-white uppercase tracking-widest">{work.status}</span>
                  </div>
                  <div className="h-[240px] relative overflow-hidden border-b border-white/10 flex items-center justify-center bg-black/20">
                     <img src={work.image} alt={work.title} className="absolute inset-0 w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 pointer-events-none" />
                     <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent z-20"></div>
                  </div>
                  <div className="p-8 flex flex-col flex-grow bg-surface relative z-20">
                     <div className="flex items-center gap-3 mb-4">
                       <span className="material-symbols-outlined text-primary">{work.icon}</span>
                       <span className="font-mono text-[10px] text-primary tracking-widest uppercase border border-primary/20 bg-primary/5 px-2 py-0.5 rounded">{work.type}</span>
                     </div>
                     <h3 className="font-headline text-3xl font-bold text-white mb-3 group-hover:text-primary transition-colors tracking-tight">{work.title}</h3>
                     <p className="text-sm text-on-surface-variant font-body line-clamp-3 mb-8 leading-relaxed pointer-events-none">{work.description}</p>
                     
                     <div className="mt-auto flex flex-wrap gap-2 pointer-events-none">
                        {work.tech.slice(0, 3).map(t => (
                          <span key={t} className="font-mono text-[10px] bg-surface-container-highest px-3 py-1.5 text-on-surface-variant tracking-wider rounded border border-white/5 uppercase">{t}</span>
                        ))}
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- INTERACTIVE PCB DESIGN STUDIO --- */}
        <section className="py-32 px-8 md:px-20 bg-surface border-y border-white/5 relative overflow-hidden" id="pcb">
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[180px] pointer-events-none -z-10"></div>
          <div className="max-w-7xl mx-auto">
            <SectionHeader subtitle="Hardware Design" title="PCB Design Studio" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="space-y-8">
                <motion.div variants={fadeUp}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-[10px] text-secondary tracking-widest uppercase border border-secondary/20 bg-secondary/5 px-3 py-1 rounded">LFR v2.0 — EasyEDA</span>
                    <span className="font-mono text-[10px] text-on-surface-muted uppercase tracking-widest">Custom Fabricated</span>
                  </div>
                  <h3 className="font-headline text-3xl font-bold text-white mb-4">Line Follower Robot PCB</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">Fully custom PCB designed in EasyEDA from schematic to Gerber export and physical fabrication. Features an Arduino Nano, TB6612FNG motor driver, multiplexed IR sensor array headers, and onboard voltage regulation — all on a 2-layer board.</p>
                </motion.div>

                {/* Bug Fix: Instead of unmounting the controls when switching to "photo", we keep them in the DOM but hide them via CSS so Framer Motion doesn't lose track of them. */}
                <motion.div variants={fadeUp} className={`space-y-3 ${pcbViewMode === 'layers' ? 'block' : 'hidden'}`}>
                  <span className="font-mono text-[10px] text-on-surface-muted uppercase tracking-widest block mb-4">Layer Visibility Controls</span>
                  
                  {PORTFOLIO_DATA.pcbLayers.map((layer) => (
                    <button
                      key={layer.id}
                      onClick={() => setActiveLayer(layer.id)}
                      className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg border transition-all duration-200 text-left ${activeLayer === layer.id ? 'border-white/20 bg-white/5 text-white' : 'border-white/5 bg-transparent text-on-surface-muted hover:bg-white/5'}`}
                    >
                      <span className={`w-3 h-3 rounded-full shrink-0 transition-opacity ${layer.color} ${activeLayer === layer.id ? 'opacity-100 shadow-[0_0_10px_currentColor]' : 'opacity-20'}`}></span>
                      <span className="font-mono text-[11px] uppercase tracking-widest">{layer.name}</span>
                      <span className="ml-auto material-symbols-outlined text-sm">{activeLayer === layer.id ? 'visibility' : 'visibility_off'}</span>
                    </button>
                  ))}
                </motion.div>

                <motion.div variants={fadeUp} className="flex gap-2 bg-surface-container-lowest border border-white/5 rounded-lg p-1 w-fit">
                  <button onClick={() => setPcbViewMode("layers")} className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-[10px] uppercase tracking-widest transition-all ${pcbViewMode === "layers" ? "bg-white/10 text-white" : "text-on-surface-muted hover:text-white"}`}>
                    <span className="material-symbols-outlined text-sm">layers</span> Layer View
                  </button>
                  <button onClick={() => setPcbViewMode("photo")} className={`flex items-center gap-2 px-4 py-2 rounded-md font-mono text-[10px] uppercase tracking-widest transition-all ${pcbViewMode === "photo" ? "bg-white/10 text-white" : "text-on-surface-muted hover:text-white"}`}>
                    <span className="material-symbols-outlined text-sm">photo_camera</span> Board Photo
                  </button>
                </motion.div>

                <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
                  <a href="/pcb/lfr-gerbers.zip" download className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary/30 bg-primary/10 text-primary hover:bg-primary hover:text-slate-900 transition-all font-mono text-[10px] uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">download</span> Download Gerbers
                  </a>
                  <a href="/pcb/lfr-schematic.png" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-on-surface-variant hover:text-white hover:border-white/30 transition-all font-mono text-[10px] uppercase tracking-widest">
                    <span className="material-symbols-outlined text-sm">schema</span> Schematic PNG
                  </a>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="flex items-center justify-center py-12"
              >
                {pcbViewMode === "layers" ? (
                  <div className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl bg-[#0a0a0a] border border-white/10 aspect-[4/3] flex items-center justify-center p-4">
                     <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none"></div>
                     <AnimatePresence mode="wait">
                       <motion.img 
                          key={activeLayer}
                          initial={{ opacity: 0, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, filter: 'blur(0px)' }}
                          exit={{ opacity: 0, filter: 'blur(10px)', position: 'absolute' }}
                          transition={{ duration: 0.4 }}
                          src={PORTFOLIO_DATA.pcbLayers.find(l => l.id === activeLayer)?.img} 
                          alt={`${activeLayer} PCB view`} 
                          className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                       />
                     </AnimatePresence>
                     <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/10 z-20">
                       <span className="font-mono text-[9px] uppercase tracking-widest text-primary">Live Renderer</span>
                     </div>
                  </div>
                ) : (
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-white/10 shadow-2xl group flex items-center justify-center bg-surface-container-high aspect-video"
                  >
                     <img src="/pcb/board-photo.png" alt="LFR PCB Physical Build" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700" />
                     <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 pointer-events-none z-10">
                       <p className="font-mono text-[10px] text-primary tracking-widest uppercase">Hardware Deployed</p>
                     </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- TECH STACK --- */}
        <section className="py-32 px-8 md:px-20 bg-surface border-y border-white/5 relative" id="stack">
          <div className="max-w-7xl mx-auto">
            <SectionHeader subtitle="System Capabilities" title="The Engineering Stack" />
            
            <div className="flex flex-wrap gap-4 mb-12">
              {[ { id: "software", label: "Software Architecture" }, { id: "hardware", label: "Hardware & Embedded" }, { id: "data", label: "Data Architecture" }, { id: "ai", label: "AI & ML (Learning)" } ].map((tab) => (
                <button key={tab.id} onClick={() => setActiveStack(tab.id as any)} className={`px-6 py-3 font-mono text-xs uppercase tracking-widest rounded-md transition-all duration-300 border ${activeStack === tab.id ? 'bg-white/10 border-white/30 text-white shadow-inner' : 'bg-transparent border-white/5 text-on-surface-muted hover:text-white hover:border-white/10'}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeStack} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {PORTFOLIO_DATA.skills[activeStack].map((skill, index) => (
                  <div key={index} onClick={() => setSelectedSkill(skill)} className={`flex flex-col p-8 bg-surface-container-low border border-white/5 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${skill.border} group overflow-hidden relative cursor-pointer`}>
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                       <span className="material-symbols-outlined text-sm text-on-surface-muted">open_in_new</span>
                    </div>
                    <div className="flex items-center gap-4 mb-4 relative z-10">
                      <span className={`material-symbols-outlined text-4xl transition-transform duration-300 group-hover:scale-110 ${skill.color}`}>{skill.icon}</span>
                      <div>
                        <h4 className="font-mono text-sm text-white tracking-widest uppercase mb-1">{skill.name}</h4>
                        <p className="font-mono text-[10px] text-on-surface-muted uppercase">{skill.sub}</p>
                      </div>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full mt-4 overflow-hidden relative z-10">
                      <div className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out w-0 group-hover:w-full ${skill.color.replace('text-', 'bg-')}`} style={{ maxWidth: `${skill.level}%` }} />
                    </div>
                    <div className="flex justify-between items-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 z-10">
                      <span className="font-mono text-[9px] text-on-surface-muted uppercase">Proficiency</span>
                      <span className={`font-mono text-[10px] font-bold ${skill.color}`}>{skill.level}%</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
            
            <div className="mt-20 w-full overflow-hidden border-y border-white/5 py-4 bg-surface-container-lowest flex relative">
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surface to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface to-transparent z-10"></div>
              <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 25, ease: "linear", repeat: Infinity }} className="flex whitespace-nowrap gap-8 font-mono text-[10px] uppercase tracking-widest text-on-surface-variant opacity-70">
                {[...PORTFOLIO_DATA.microSkills, ...PORTFOLIO_DATA.microSkills].map((ms, i) => (
                  <span key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/30"></span>{ms}</span>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- CERTIFICATIONS --- */}
        <section className="py-32 bg-surface-container-lowest border-b border-white/5 relative" id="credentials">
          <div className="max-w-[1400px] mx-auto relative">
            <div className="px-8 md:px-12 mb-12">
               <SectionHeader subtitle="Verified Qualifications" title="Certifications" />
            </div>

            <div 
              ref={certsRef} 
              onMouseEnter={() => setHoveredSection("certs")} 
              onMouseLeave={() => setHoveredSection(null)}
              className="flex gap-6 overflow-x-auto hide-scrollbar pb-12 px-8 md:px-12 cursor-grab active:cursor-grabbing"
            >
              {[...PORTFOLIO_DATA.certifications, ...PORTFOLIO_DATA.certifications].map((cert, index) => (
                <a 
                  href={cert.link} target="_blank" rel="noopener noreferrer" key={index} 
                  className="min-w-[300px] shrink-0 bg-surface border border-white/5 rounded-2xl p-6 flex flex-col justify-between hover:border-primary/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6 pointer-events-none">
                      <div className="w-14 h-14 bg-surface-container-highest rounded-xl flex items-center justify-center border border-white/10 group-hover:bg-primary/10 transition-colors">
                        <span className="material-symbols-outlined text-primary text-2xl">{cert.icon}</span>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-muted text-sm opacity-0 group-hover:opacity-100 transition-opacity">open_in_new</span>
                    </div>
                    <h4 className="font-headline text-xl font-bold text-white mb-2 leading-snug pointer-events-none">{cert.title}</h4>
                    <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest pointer-events-none">{cert.issuer}</p>
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/5 pointer-events-none">
                    <span className="font-mono text-[10px] text-on-surface-muted uppercase tracking-widest">Issued: {cert.date}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* --- REVIEWS / TESTIMONIALS --- */}
        <section className="py-32 bg-surface border-b border-white/5 relative overflow-hidden">
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[150px] pointer-events-none -z-10 -translate-y-1/2"></div>
          
          <div className="max-w-[1400px] mx-auto relative">
             <div className="px-8 md:px-12 flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
               <SectionHeader subtitle="Peer & Mentor Feedback" title="Professional Reviews" />
               <button onClick={() => setReviewModalOpen(true)} className="mb-4 md:mb-16 flex items-center gap-2 bg-surface-container-highest border border-white/10 text-white px-6 py-3 rounded-md font-headline text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-slate-900 transition-all duration-300">
                  <span className="material-symbols-outlined text-sm">rate_review</span> Add Feedback
               </button>
             </div>
             
             <div 
              ref={reviewsRef} 
              onMouseEnter={() => setHoveredSection("reviews")} 
              onMouseLeave={() => setHoveredSection(null)}
              className="flex gap-8 overflow-x-auto hide-scrollbar pb-12 px-8 md:px-12 cursor-grab active:cursor-grabbing"
            >
                {[...PORTFOLIO_DATA.reviews, ...PORTFOLIO_DATA.reviews].map((review, i) => (
                   <div key={i} className="min-w-[350px] md:min-w-[450px] shrink-0 bg-surface-container-low border border-white/5 p-8 rounded-2xl relative hover:border-white/10 transition-colors">
                      <span className="material-symbols-outlined text-6xl text-white/5 absolute top-6 left-6 pointer-events-none">format_quote</span>
                      <p className="text-on-surface-variant font-body leading-relaxed mb-8 relative z-10 text-sm pointer-events-none">"{review.text}"</p>
                      
                      <div className="flex items-center gap-4 pt-6 border-t border-white/5 pointer-events-none">
                         <div className="w-12 h-12 rounded-full bg-gradient-to-br from-surface-container-highest to-surface border border-white/10 flex items-center justify-center shrink-0">
                           <span className="material-symbols-outlined text-sm text-primary">person</span>
                         </div>
                         <div>
                            <h5 className="font-headline text-sm font-bold text-white mb-0.5">{review.name}</h5>
                            <p className="font-mono text-[9px] text-on-surface-muted uppercase tracking-widest">{review.role} • {review.org}</p>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-surface relative z-40 pt-24 pb-12" id="contact">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-16 md:gap-8 mb-20 border-b border-white/10 pb-20">
            
            <div className="md:col-span-2 flex flex-col items-start">
              <div className="text-3xl font-black tracking-tighter text-white flex items-center gap-3 mb-6 cursor-pointer hover:text-primary transition-colors" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <span className="material-symbols-outlined text-primary text-3xl">change_history</span>
                FAYEM MUKTADIR RAHMAN<span className="text-primary"></span>
              </div>
              <p className="text-base text-on-surface-variant font-body leading-relaxed max-w-md mb-10">
                Architecting high-fidelity digital and physical systems. Bridging the gap between low-level hardware constraints and modern web architectures. Actively seeking graduate research opportunities.
              </p>
              <div className="flex items-center gap-3 bg-surface-container-low border border-white/5 px-5 py-2.5 rounded-full w-fit shadow-inner">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">System Status: All Nodes Online</span>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-mono text-[11px] text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-primary"></span> Sitemap
              </h4>
              <div className="flex flex-col gap-4">
                {['About', 'Systems', 'Stack', 'Credentials'].map(link => (
                  <a key={link} href={`#${link.toLowerCase()}`} className="font-headline text-sm font-bold text-on-surface-variant hover:text-primary transition-colors w-fit">{link}</a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="font-mono text-[11px] text-white uppercase tracking-widest mb-2 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-primary"></span> Network
              </h4>
              <div className="flex flex-col gap-4">
                <a href="https://github.com/Ori13424" target="_blank" rel="noreferrer" className="font-headline text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-3 w-fit group">
                  <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">code</span> GitHub
                </a>
                <a href="mailto:orittro@example.com" className="font-headline text-sm font-bold text-on-surface-variant hover:text-primary transition-colors flex items-center gap-3 w-fit group">
                  <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">mail</span> Contact Me
                </a>
                <a href="/resume.html" target="_blank" rel="noopener noreferrer" className="font-headline text-sm font-bold text-primary hover:text-white transition-colors flex items-center gap-3 w-fit mt-2 bg-primary/10 px-4 py-2 rounded-lg border border-primary/20 group">
                  <span className="material-symbols-outlined text-lg group-hover:translate-y-1 transition-transform">open_in_new</span> View CV
                </a>
              </div>
            </div>

          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-on-surface-muted font-mono text-[10px] uppercase tracking-widest flex items-center gap-2">
              © 2026 ARCHITECT.LOG // VERSION 2.2.0
            </div>
            
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-12 h-12 rounded-full bg-surface-container-low border border-white/5 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-all group hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <span className="material-symbols-outlined text-base group-hover:-translate-y-1 transition-transform">arrow_upward</span>
            </button>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0');
        .material-symbols-outlined { font-family: 'Material Symbols Outlined' !important; font-weight: normal; font-style: normal; font-size: 24px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; -webkit-font-feature-settings: 'liga'; -webkit-font-smoothing: antialiased; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}