import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Cpu, Zap, Grid3X3, Table2, Binary, BookOpen,
  ArrowRight, CircuitBoard, GraduationCap,
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

const features = [
  { label: '7+ Mantık Kapısı', icon: Zap },
  { label: 'Flip-Flop\'lar', icon: Cpu },
  { label: 'K-Map Çözücü', icon: Grid3X3 },
  { label: 'Gerçek Zamanlı Simülasyon', icon: CircuitBoard },
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
              className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-500/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8">
              <GraduationCap size={14} />
              Dijital Mantık Tasarım Aracı
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6"
          >
            Tasarla, Simüle Et &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">
              Sadeleştir
            </span>
            <br />
            Dijital Devreler
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Dijital mantık devrelerini interaktif olarak tasarla, gerçek zamanlı simüle et
            ve Karnaugh haritası ile Boolean ifadeleri sadeleştir.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/circuit-studio"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all hover:shadow-[0_0_30px_hsl(160_84%_39%/0.3)]"
            >
              Devre Stüdyosu
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/kmap"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-secondary text-secondary-foreground font-bold text-base hover:bg-secondary/80 transition-colors border border-border"
            >
              K-Map Solver
              <Grid3X3 size={18} />
            </Link>
          </motion.div>

          {/* Feature badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mt-12"
          >
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-muted-foreground"
              >
                <f.icon size={12} className="text-primary" />
                {f.label}
              </div>
            ))}
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
