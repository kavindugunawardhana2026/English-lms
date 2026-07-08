import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';

/* ─── Animation variants ─────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { duration: 0.6 } },
};

/* ─── Data ───────────────────────────────────── */
const features = [
  {
    icon: '🧩',
    title: 'Interactive Exercises',
    description: 'Engaging MCQs, fill-in-the-blanks, matching pairs, and word-search puzzles crafted for every grade.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Visual dashboards, score histories, and weekly activity charts so students always know where they stand.',
    color: 'from-violet-500 to-purple-600',
    bg: 'bg-violet-50',
  },
  {
    icon: '🎯',
    title: 'Grade-Level Curriculum',
    description: 'Content precisely mapped to Grades 6–11 ensuring learners always study material at the right level.',
    color: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
  },
  {
    icon: '⏱️',
    title: 'Instant Feedback',
    description: 'Every answer gets immediate, detailed feedback so students learn from mistakes right away.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: '🏆',
    title: 'Gamified Learning',
    description: 'Score milestones, streaks, and achievement badges keep motivation high throughout the year.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
  },
  {
    icon: '👩‍🏫',
    title: 'Teacher Dashboard',
    description: 'Teachers can create content, monitor class performance, and manage students from one place.',
    color: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
  },
];

const stats = [
  { value: '6–11', label: 'Grades Covered' },
  { value: '6+',   label: 'Exercise Types' },
  { value: '100%', label: 'Free to Use' },
  { value: '24/7', label: 'Always Available' },
];

const testimonials = [
  {
    text: 'My English score jumped from a C to an A in just two months. The word search exercises are so addictive!',
    name: 'Kavisha R.',
    grade: 'Grade 9 Student',
    initials: 'KR',
    color: 'from-blue-400 to-indigo-500',
  },
  {
    text: 'As a teacher, the dashboard saves me so much time. I can see exactly who needs help and create targeted exercises.',
    name: 'Mr. Perera',
    grade: 'English Teacher',
    initials: 'MP',
    color: 'from-violet-400 to-purple-500',
  },
  {
    text: 'The fill-in-the-blank exercises helped me understand grammar better than any textbook ever did.',
    name: 'Tharindu S.',
    grade: 'Grade 11 Student',
    initials: 'TS',
    color: 'from-emerald-400 to-teal-500',
  },
];

/* ─── Small reusable components ──────────────── */
const AnimatedSection = ({ children, className = '' }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ─── Navbar ─────────────────────────────────── */
const Navbar = () => (
  <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-indigo-950/90 backdrop-blur-lg border-b border-white/10"
  >
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-glow">
        KE
      </div>
      <span className="font-display font-bold text-white text-lg tracking-tight">Kavindu's English</span>
    </div>
    <div className="hidden md:flex items-center gap-1">
      <a href="#features" className="btn-ghost text-white/70 hover:text-white hover:bg-white/10 text-sm">Features</a>
      <a href="#how-it-works" className="btn-ghost text-white/70 hover:text-white hover:bg-white/10 text-sm">How it works</a>
      <a href="#testimonials" className="btn-ghost text-white/70 hover:text-white hover:bg-white/10 text-sm">Testimonials</a>
    </div>
    <div className="flex items-center gap-3">
      <Link to="/login" className="text-sm font-semibold text-white/80 hover:text-white transition-colors px-4 py-2 rounded-xl hover:bg-white/10">
        Sign In
      </Link>
      <Link to="/register" className="btn-primary text-sm px-5 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400">
        Get Started Free
      </Link>
    </div>
  </motion.nav>
);

/* ─── Hero ───────────────────────────────────── */
const Hero = () => (
  <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-gradient">
    {/* Background decorative blobs */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-600/30 blur-[100px]" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-indigo-800/40 blur-[100px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-indigo-700/10 blur-[120px]" />
      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
    </div>

    <div className="relative z-10 container-xl section pt-32">
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="max-w-4xl mx-auto text-center"
      >
        {/* Badge */}
        <motion.div variants={fadeUp} className="flex justify-center mb-8">
          <span className="badge bg-indigo-500/20 text-indigo-200 border border-indigo-400/30 px-4 py-1.5 text-sm">
            🎓 Designed for Sri Lankan Students · Grades 6–11
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.1] mb-6"
        >
          Master English{' '}
          <span className="relative inline-block">
            <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-pink-300 bg-clip-text text-transparent">
              Effortlessly
            </span>
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
              <path d="M2 9.5C50 2 150 2 298 9.5" stroke="url(#u1)" strokeWidth="3" strokeLinecap="round" />
              <defs>
                <linearGradient id="u1" x1="0" y1="0" x2="300" y2="0">
                  <stop stopColor="#a5b4fc" /><stop offset="1" stopColor="#f0abfc" />
                </linearGradient>
              </defs>
            </svg>
          </span>
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={fadeUp}
          className="text-lg sm:text-xl text-indigo-200/80 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Interactive exercises, instant feedback, and progress tracking — all in one beautifully designed platform built just for you.
        </motion.p>

        {/* CTA buttons */}
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4 mb-16">
          <Link to="/register" className="btn-primary px-8 py-4 text-base rounded-2xl shadow-glow-lg group">
            Start Learning Free
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <Link to="/login" className="btn-secondary px-8 py-4 text-base rounded-2xl bg-white/10 border-white/20 text-white hover:bg-white/20">
            Sign in to Dashboard
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <p className="text-3xl font-display font-bold text-white">{s.value}</p>
              <p className="text-xs text-indigo-300 mt-1">{s.label}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>

    {/* Scroll indicator */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5 }}
      className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 text-xs"
    >
      <span>Scroll to explore</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center pt-1.5"
      >
        <div className="w-1 h-2 rounded-full bg-white/40" />
      </motion.div>
    </motion.div>
  </section>
);

/* ─── Features section ───────────────────────── */
const Features = () => (
  <section id="features" className="section bg-gray-50">
    <div className="container-xl">
      <AnimatedSection>
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="badge bg-indigo-100 text-indigo-600 mb-4">Everything you need</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Built for real learning
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Every feature has been crafted with students and teachers in mind.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.01 }}
              className="card group cursor-default"
            >
              <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl ${f.bg} text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                {f.icon}
              </div>
              <h3 className="font-display font-bold text-gray-900 text-lg mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

/* ─── How it works ───────────────────────────── */
const steps = [
  { num: '01', icon: '✍️', title: 'Sign Up Free', desc: 'Create your student account in seconds. No credit card, no fuss — just your name and email.' },
  { num: '02', icon: '📚', title: 'Choose Your Grade', desc: 'Pick your grade level and the system automatically curates the right exercises for you.' },
  { num: '03', icon: '🎮', title: 'Practice & Learn', desc: 'Work through interactive exercises at your own pace with instant feedback on every answer.' },
  { num: '04', icon: '📈', title: 'Track Progress', desc: 'Watch your scores improve on the dashboard with weekly charts and performance stats.' },
];

const HowItWorks = () => (
  <section id="how-it-works" className="section bg-white">
    <div className="container-xl">
      <AnimatedSection>
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="badge bg-violet-100 text-violet-600 mb-4">Simple process</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Up and running in minutes
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            No complicated setup. Just register and start improving your English right away.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-indigo-200 via-violet-300 to-indigo-200" />

          {steps.map((step, i) => (
            <motion.div key={step.num} variants={fadeUp} className="relative text-center">
              <div className="relative inline-flex items-center justify-center h-24 w-24 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100" />
                <div className="relative z-10">
                  <span className="text-3xl">{step.icon}</span>
                </div>
                <span className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

/* ─── Testimonials ───────────────────────────── */
const Testimonials = () => (
  <section id="testimonials" className="section bg-indigo-950 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-indigo-800/40 blur-[80px]" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-violet-800/30 blur-[80px]" />
    </div>
    <div className="container-xl relative z-10">
      <AnimatedSection>
        <motion.div variants={fadeUp} className="text-center mb-16">
          <span className="badge bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-4">Student stories</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
            Students love it
          </h2>
          <p className="text-indigo-300/80 text-lg max-w-xl mx-auto">
            Don't take our word for it — hear from real students and teachers.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="card-glass p-8 rounded-2xl"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-indigo-400 text-xs">{t.grade}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatedSection>
    </div>
  </section>
);

/* ─── CTA Banner ─────────────────────────────── */
const CTABanner = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <section className="section bg-gradient-to-br from-indigo-600 to-violet-600 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>
      <motion.div
        ref={ref}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
        variants={stagger}
        className="container-xl relative z-10 text-center"
      >
        <motion.h2 variants={fadeUp} className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
          Ready to ace your English?
        </motion.h2>
        <motion.p variants={fadeUp} className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
          Join hundreds of students already improving their English scores with our interactive platform.
        </motion.p>
        <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-4">
          <Link to="/register" className="btn-primary bg-white text-indigo-700 hover:bg-indigo-50 px-8 py-4 text-base rounded-2xl shadow-glow-lg font-bold">
            Create Free Account
          </Link>
          <Link to="/login" className="btn-secondary bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-4 text-base rounded-2xl">
            Sign In
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

/* ─── Footer ─────────────────────────────────── */
const Footer = () => (
  <footer className="bg-gray-950 text-gray-400 py-12 px-6">
    <div className="container-xl">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
            KE
          </div>
          <span className="font-display font-bold text-white text-lg">Kavindu's English</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">How it Works</a>
          <a href="#testimonials" className="hover:text-indigo-400 transition-colors">Testimonials</a>
          <Link to="/login" className="hover:text-indigo-400 transition-colors">Sign In</Link>
          <Link to="/register" className="hover:text-indigo-400 transition-colors">Register</Link>
        </nav>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <p>© {new Date().getFullYear()} Kavindu's English LMS. All rights reserved.</p>
        <div className="flex gap-2">
          {['📝 MCQ', '✏️ Fill Blank', '🔗 Matching', '🔍 Word Search'].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-gray-800 text-gray-500 text-xs">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

/* ─── Main export ────────────────────────────── */
const Home = () => (
  <div className="min-h-screen font-sans">
    <Hero />
    <Features />
    <HowItWorks />
    <Testimonials />
    <CTABanner />
    <Footer />
  </div>
);

export default Home;