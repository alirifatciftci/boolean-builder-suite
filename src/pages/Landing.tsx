import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu, Grid3X3, Table2, Binary, BookOpen,
  ArrowRight, CircuitBoard,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

const tools = [
  {
    title: 'Devre Stüdyosu',
    description: 'Sürükle-bırak ile dijital devre tasarla ve gerçek zamanlı simüle et. AND, OR, NOT, Flip-Flop, Decoder ve daha fazlası.',
    icon: CircuitBoard,
    to: '/circuit-studio',
    color: 'from-emerald-500/20 to-cyan-500/20',
    border: 'hover:border-emerald-500/50',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'K-Map Çözücü',
    description: 'Karnaugh haritası ile Boolean ifadeleri sadeleştir. 2-4 değişken, SOP ve POS desteği.',
    icon: Grid3X3,
    to: '/kmap',
    color: 'from-violet-500/20 to-purple-500/20',
    border: 'hover:border-violet-500/50',
    iconColor: 'text-violet-400',
  },
  {
    title: 'Doğruluk Tablosu',
    description: 'Doğruluk tablosu oluştur, Boolean ifadelerini analiz et ve K-Map\'e aktar.',
    icon: Table2,
    to: '/truth-table',
    color: 'from-amber-500/20 to-orange-500/20',
    border: 'hover:border-amber-500/50',
    iconColor: 'text-amber-400',
  },
  {
    title: 'Boolean Cebri',
    description: 'Boolean ifadelerini ayrıştır, sadeleştir ve devreye dönüştür. SOP ↔ POS dönüşümü.',
    icon: Binary,
    to: '/boolean-algebra',
    color: 'from-rose-500/20 to-pink-500/20',
    border: 'hover:border-rose-500/50',
    iconColor: 'text-rose-400',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' as const },
  }),
};

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_hsl(160_84%_39%/0.4)]">
              <Cpu size={16} className="text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">
              Volt<span className="text-primary">Logic</span>
            </span>
          </Link>

          <div className="flex items-center gap-6">
            <Link
              to="/circuit-studio"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              Devre Stüdyosu
            </Link>
            <Link
              to="/kmap"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
            >
              K-Map
            </Link>
            <Link
              to="/truth-table"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block"
            >
              Doğruluk Tablosu
            </Link>
            <Link
              to="/boolean-algebra"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden md:block"
            >
              Boolean Cebri
            </Link>
            <Link
              to="/learn"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden lg:block"
            >
              Öğren
            </Link>
            <ThemeToggle />
            <Link
              to="/circuit-studio"
              className="px-4 py-2 rounded-md border border-border bg-card/40 text-foreground text-sm font-semibold hover:border-primary/40 hover:bg-card transition-colors"
            >
              Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background — schematic circuit pattern */}
        <div className="absolute inset-0 pointer-events-none">
          {/* PCB dot grid */}
          <div
            className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]"
            style={{
              backgroundImage:
                'radial-gradient(circle, hsl(160 84% 39%) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
              maskImage:
                'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 80%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 80% 60% at 50% 40%, black 40%, transparent 80%)',
            }}
          />

          {/* Schematic gates + wires */}
          <svg
            className="absolute inset-0 w-full h-full text-primary/[0.18] dark:text-primary/[0.13]"
            viewBox="0 0 1440 820"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Top-left: AND gate */}
            <g transform="translate(90, 120)">
              <path d="M0,0 L28,0 A30,30 0 0,1 28,60 L0,60 Z" />
              <line x1="-30" y1="15" x2="0" y2="15" />
              <line x1="-30" y1="45" x2="0" y2="45" />
              <line x1="58" y1="30" x2="120" y2="30" />
              <text x="-2" y="-8" fontSize="10" fill="currentColor" stroke="none">AND</text>
            </g>

            {/* Top-right: OR gate */}
            <g transform="translate(1210, 150)">
              <path d="M0,0 Q14,30 0,60 Q30,30 60,30 Q30,30 0,0 Z" />
              <line x1="-30" y1="15" x2="6" y2="15" />
              <line x1="-30" y1="45" x2="6" y2="45" />
              <line x1="60" y1="30" x2="120" y2="30" />
              <text x="-2" y="-8" fontSize="10" fill="currentColor" stroke="none">OR</text>
            </g>

            {/* Mid-left: XOR gate */}
            <g transform="translate(60, 430)">
              <path d="M-5,0 Q9,30 -5,60" />
              <path d="M5,0 Q19,30 5,60 Q35,30 65,30 Q35,30 5,0 Z" />
              <line x1="-30" y1="15" x2="-2" y2="15" />
              <line x1="-30" y1="45" x2="-2" y2="45" />
              <line x1="65" y1="30" x2="130" y2="30" />
              <text x="-5" y="-8" fontSize="10" fill="currentColor" stroke="none">XOR</text>
            </g>

            {/* Mid-right: NOT gate (inverter) */}
            <g transform="translate(1260, 440)">
              <path d="M0,0 L50,25 L0,50 Z" />
              <circle cx="55" cy="25" r="4" />
              <line x1="-30" y1="25" x2="0" y2="25" />
              <line x1="59" y1="25" x2="110" y2="25" />
              <text x="-2" y="-8" fontSize="10" fill="currentColor" stroke="none">NOT</text>
            </g>

            {/* Bottom-left: NAND gate */}
            <g transform="translate(150, 700)">
              <path d="M0,0 L28,0 A30,30 0 0,1 28,60 L0,60 Z" />
              <circle cx="63" cy="30" r="4" />
              <line x1="-30" y1="15" x2="0" y2="15" />
              <line x1="-30" y1="45" x2="0" y2="45" />
              <line x1="67" y1="30" x2="130" y2="30" />
              <text x="-2" y="-8" fontSize="10" fill="currentColor" stroke="none">NAND</text>
            </g>

            {/* Bottom-right: NOR gate */}
            <g transform="translate(1170, 690)">
              <path d="M0,0 Q14,30 0,60 Q30,30 60,30 Q30,30 0,0 Z" />
              <circle cx="64" cy="30" r="4" />
              <line x1="-30" y1="15" x2="6" y2="15" />
              <line x1="-30" y1="45" x2="6" y2="45" />
              <line x1="68" y1="30" x2="130" y2="30" />
              <text x="-2" y="-8" fontSize="10" fill="currentColor" stroke="none">NOR</text>
            </g>

            {/* Connecting traces between gates */}
            <path d="M210,150 L380,150 L380,460 L60,460" opacity="0.5" />
            <path d="M1330,180 L1430,180" opacity="0.5" />
            <path d="M1370,465 L1430,465" opacity="0.5" />
            <path d="M280,730 L420,730 L420,820" opacity="0.5" />
            <path d="M1300,720 L1430,720" opacity="0.5" />

            {/* Small K-Map grid hint (top-mid-left) */}
            <g transform="translate(310, 280)" opacity="0.6">
              <rect x="0" y="0" width="20" height="20" />
              <rect x="20" y="0" width="20" height="20" />
              <rect x="40" y="0" width="20" height="20" />
              <rect x="60" y="0" width="20" height="20" />
              <rect x="0" y="20" width="20" height="20" />
              <rect x="20" y="20" width="20" height="20" />
              <rect x="40" y="20" width="20" height="20" />
              <rect x="60" y="20" width="20" height="20" />
              <text x="22" y="14" fontSize="9" fill="currentColor" stroke="none">1</text>
              <text x="42" y="14" fontSize="9" fill="currentColor" stroke="none">1</text>
              <text x="42" y="34" fontSize="9" fill="currentColor" stroke="none">1</text>
            </g>

            {/* Truth table hint (top-mid-right) */}
            <g transform="translate(1040, 310)" opacity="0.6" fontSize="9" fill="currentColor" stroke="none">
              <text x="0" y="0" stroke="currentColor" strokeWidth="0.5">A B | F</text>
              <text x="0" y="14">0 0 | 0</text>
              <text x="0" y="28">0 1 | 1</text>
              <text x="0" y="42">1 0 | 1</text>
              <text x="0" y="56">1 1 | 0</text>
            </g>
          </svg>

          {/* Soft center glow to focus on text */}
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[700px] h-[420px] bg-primary/[0.05] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[5rem] font-black tracking-tight leading-[1.05] mb-6"
          >
            Dijital mantık devreleri,
            <br />
            tarayıcıda.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed"
          >
            Sürükle-bırak ile devre kur, K-Map ile sadeleştir,
            doğruluk tablosunu anında gör.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/circuit-studio"
              className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-lg border border-border bg-card/40 text-foreground font-semibold text-[15px] hover:border-primary/40 hover:bg-card transition-all hover:translate-y-[-1px]"
            >
              <CircuitBoard size={17} className="text-primary" />
              Devre Stüdyosunu Aç
            </Link>
            <Link
              to="/kmap"
              className="group inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              K-Map çözücüye git
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </motion.div>

          {/* Stats — monospace status line */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 mt-16 text-[11px] font-mono uppercase tracking-[0.15em] text-muted-foreground/70"
          >
            <span><span className="text-foreground font-bold">7</span> kapı</span>
            <span className="opacity-30">/</span>
            <span><span className="text-foreground font-bold">4</span> flip-flop</span>
            <span className="opacity-30">/</span>
            <span><span className="text-foreground font-bold">5</span> msi bileşen</span>
            <span className="opacity-30">/</span>
            <span><span className="text-foreground font-bold">2–4</span> değişken k-map</span>
          </motion.div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-black mb-4">
              Hepsi Bir Arada{' '}
              <span className="text-primary">Mantık Tasarım</span> Paketi
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Devre tasarımından Boolean sadeleştirmeye, ihtiyacın olan tüm araçlar tek bir yerde.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5">
            {tools.map((tool, i) => (
              <motion.div
                key={tool.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                  <Link
                  to={tool.to}
                  className={`group relative block p-6 rounded-2xl bg-card border border-border ${tool.border} transition-all duration-300 hover:shadow-lg h-full`}
                >
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2.5 rounded-xl bg-background border border-border ${tool.iconColor}`}>
                        <tool.icon size={22} />
                      </div>
                      <ArrowRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About / Team Section */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6">
              <BookOpen size={14} />
              Bitirme Projesi
            </div>
            <h2 className="text-3xl font-black mb-4">Proje Hakkında</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              VoltLogic, dijital mantık devreleri dersine yardımcı olmak amacıyla geliştirilen
              interaktif bir web uygulamasıdır. Devre tasarımı, simülasyon ve Boolean cebri
              araçlarını tek bir platformda sunar.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-5 justify-center"
          >
            <div className="flex-1 max-w-xs mx-auto p-6 rounded-2xl bg-card border border-border">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center text-2xl font-black text-blue-400">
                A
              </div>
              <h3 className="font-bold text-lg">Ali Rifat</h3>
              <p className="text-sm text-muted-foreground mt-1">Geliştirici</p>
            </div>
            <div className="flex-1 max-w-xs mx-auto p-6 rounded-2xl bg-card border border-border">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl font-black text-emerald-400">
                E
              </div>
              <h3 className="font-bold text-lg">Eslem</h3>
              <p className="text-sm text-muted-foreground mt-1">Geliştirici</p>
            </div>
            <div className="flex-1 max-w-xs mx-auto p-6 rounded-2xl bg-card border border-border">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center text-2xl font-black text-violet-400">
                S
              </div>
              <h3 className="font-bold text-lg">Seyda</h3>
              <p className="text-sm text-muted-foreground mt-1">Geliştirici</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-primary" />
            <span className="font-semibold text-foreground">
              Volt<span className="text-primary">Logic</span>
            </span>
          </div>
          <p>2025 - Bitirme Projesi</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
