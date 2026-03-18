import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Cpu, ChevronRight, BookOpen, CircuitBoard, Grid3X3,
  Binary, Zap, GitFork,
} from 'lucide-react';

interface Lesson {
  id: string;
  title: string;
  icon: typeof Zap;
  color: string;
  sections: { heading: string; content: string }[];
  truthTable?: { inputs: string[]; output: string; rows: string[][] };
  expression?: string;
}

const lessons: Lesson[] = [
  {
    id: 'and',
    title: 'AND Gate',
    icon: Zap,
    color: 'text-emerald-400',
    sections: [
      { heading: 'AND Gate Nedir?', content: 'AND kapısı, tüm girişleri 1 (HIGH) olduğunda çıkışı 1 veren temel bir dijital mantık kapısıdır. Herhangi bir giriş 0 ise çıkış 0 olur. Mantıksal çarpma (conjunction) işlemini gerçekleştirir.' },
      { heading: 'Sembol ve İfade', content: 'Boolean ifadesi: F = A · B (veya kısaca AB). AND işlemi mantıksal çarpma olarak da adlandırılır.' },
      { heading: 'Uygulama Alanları', content: 'AND kapıları, etkinleştirme devreleri, adres çözümleme ve daha karmaşık mantık fonksiyonları oluşturmada kullanılır. Dijital sistemlerin temel yapı taşlarıdır.' },
    ],
    truthTable: { inputs: ['A', 'B'], output: 'F', rows: [['0','0','0'], ['0','1','0'], ['1','0','0'], ['1','1','1']] },
    expression: 'F = AB',
  },
  {
    id: 'or',
    title: 'OR Gate',
    icon: Zap,
    color: 'text-blue-400',
    sections: [
      { heading: 'OR Gate Nedir?', content: 'OR kapısı, girişlerinden en az biri 1 (HIGH) olduğunda çıkışı 1 verir. Tüm girişler 0 olduğunda çıkış 0 olur. Mantıksal toplama (disjunction) işlemini gerçekleştirir.' },
      { heading: 'Sembol ve İfade', content: 'Boolean ifadesi: F = A + B. OR işlemi mantıksal toplama olarak da adlandırılır.' },
      { heading: 'Uygulama Alanları', content: 'OR kapıları alarm sistemlerinde (herhangi bir sensör alarmı tetikler), kesme işleme ve birden fazla koşulun birleştirilmesinde kullanılır.' },
    ],
    truthTable: { inputs: ['A', 'B'], output: 'F', rows: [['0','0','0'], ['0','1','1'], ['1','0','1'], ['1','1','1']] },
    expression: 'F = A + B',
  },
  {
    id: 'not',
    title: 'NOT Gate (Inverter)',
    icon: Zap,
    color: 'text-rose-400',
    sections: [
      { heading: 'NOT Gate Nedir?', content: 'NOT kapısı (inverter) tek bir girişe sahiptir ve o girişin tersini (tümleyenini) üretir. Giriş 1 ise çıkış 0, giriş 0 ise çıkış 1 olur.' },
      { heading: 'Sembol ve İfade', content: "Boolean ifadesi: F = A' (veya F = Ā veya F = ¬A). NOT işlemi tümleyen alma veya tersini alma olarak adlandırılır." },
      { heading: 'Uygulama Alanları', content: 'Inverter\'lar tümleyen sinyaller oluşturmak, diğer kapıları (NAND, NOR) inşa etmek ve osilatör gibi geri beslemeli devrelerde kullanılır.' },
    ],
    truthTable: { inputs: ['A'], output: 'F', rows: [['0','1'], ['1','0']] },
    expression: "F = A'",
  },
  {
    id: 'nand',
    title: 'NAND Gate',
    icon: Zap,
    color: 'text-amber-400',
    sections: [
      { heading: 'NAND Gate Nedir?', content: 'NAND kapısı evrensel bir kapıdır — herhangi bir Boolean fonksiyonunu gerçekleştirebilir. AND kapısının ardından NOT kapısı gelir. Çıkış yalnızca tüm girişler 1 olduğunda 0 olur.' },
      { heading: 'Sembol ve İfade', content: "Boolean ifadesi: F = (AB)' veya F = A↑B. NAND, NOT-AND anlamına gelir." },
      { heading: 'Neden Evrensel?', content: 'Sadece NAND kapıları kullanarak AND, OR, NOT ve diğer tüm kapıları oluşturabilirsiniz. Bu nedenle NAND kapıları entegre devrelerde en yaygın kullanılan kapılardır.' },
    ],
    truthTable: { inputs: ['A', 'B'], output: 'F', rows: [['0','0','1'], ['0','1','1'], ['1','0','1'], ['1','1','0']] },
    expression: "F = (AB)'",
  },
  {
    id: 'xor',
    title: 'XOR Gate',
    icon: Zap,
    color: 'text-violet-400',
    sections: [
      { heading: 'XOR Gate Nedir?', content: "XOR (Dışlayan VEYA) kapısı, girişler FARKLI olduğunda çıkışı 1 verir. Her iki giriş aynı ise (ikisi de 0 veya ikisi de 1) çıkış 0 olur." },
      { heading: 'Sembol ve İfade', content: "Boolean ifadesi: F = A ⊕ B = A'B + AB'. XOR iki bit arasındaki eşitsizliği algılar." },
      { heading: 'Uygulama Alanları', content: "XOR, aritmetik devrelerde (half adder toplam için XOR kullanır), eşlik denetleyicilerde ve karşılaştırma devrelerinde vazgeçilmezdir." },
    ],
    truthTable: { inputs: ['A', 'B'], output: 'F', rows: [['0','0','0'], ['0','1','1'], ['1','0','1'], ['1','1','0']] },
    expression: "F = A ⊕ B",
  },
  {
    id: 'flipflop',
    title: 'Flip-Flop\'lar',
    icon: GitFork,
    color: 'text-cyan-400',
    sections: [
      { heading: 'Flip-Flop Nedir?', content: 'Flip-flop\'lar bir bit veri saklayan ardışıl mantık elemanlarıdır. Kombinasyonel mantığın aksine, çıkışları hem mevcut girişlere HEM DE önceki duruma bağlıdır. Saat kenarları ile tetiklenirler.' },
      { heading: 'Türleri', content: 'D Flip-Flop: Saat kenarında veri girişini saklar. JK Flip-Flop: J=Set, K=Reset, JK=Toggle. SR Flip-Flop: S=Set, R=Reset. T Flip-Flop: T=1 olduğunda her saat kenarında durumu değiştirir.' },
      { heading: 'Uygulama Alanları', content: 'Flip-flop\'lar yazmaçlarda, sayıcılarda, bellek devrelerinde, durum makinelerinde ve senkronizasyon devrelerinde kullanılır. Ardışıl mantığın temel yapı taşlarıdır.' },
    ],
  },
  {
    id: 'kmap',
    title: 'Karnaugh Haritası',
    icon: Grid3X3,
    color: 'text-purple-400',
    sections: [
      { heading: 'K-Map Nedir?', content: 'Karnaugh haritası, Boolean ifadelerini sadeleştirmek için kullanılan grafiksel bir yöntemdir. Doğruluk tablosu değerlerini Gray kodu sıralamasıyla bir ızgarada düzenler, böylece komşu hücreler yalnızca bir değişken ile farklılık gösterir.' },
      { heading: 'Nasıl Kullanılır?', content: 'Komşu 1\'leri 2\'nin kuvvetleri (1, 2, 4, 8) şeklinde gruplandırın. Her grup, grup içinde değişen değişkenleri ortadan kaldırır. Daha büyük gruplar = daha basit ifadeler.' },
      { heading: 'SOP ve POS', content: "SOP (Çarpımların Toplamı): 1'leri gruplayarak OR ile birleştirilmiş minterm ifadeleri elde edin. POS (Toplamların Çarpımı): 0'ları gruplayarak AND ile birleştirilmiş maxterm ifadeleri elde edin." },
      { heading: "Don't Care Koşulları", content: "Don't care (X) hücreleri, daha büyük gruplar oluşturmak için 0 veya 1 olarak ele alınabilir. Belirli giriş kombinasyonlarının asla oluşmadığı durumlarda daha fazla sadeleştirme sağlar." },
    ],
  },
  {
    id: 'boolean',
    title: 'Boolean Cebri Kuralları',
    icon: Binary,
    color: 'text-pink-400',
    sections: [
      { heading: 'Özdeşlik Kuralları', content: 'A + 0 = A, A · 1 = A. 0 eklemek veya 1 ile çarpmak değeri değiştirmez.' },
      { heading: 'Tümleyen Kuralları', content: "A + A' = 1, A · A' = 0. Bir değişken tümleyeni ile OR'lanırsa daima 1, AND'lenirse daima 0 olur." },
      { heading: "De Morgan Teoremleri", content: "(A + B)' = A'B', (AB)' = A' + B'. Bu teoremler SOP ve POS formları arasında dönüşüm için temeldir." },
      { heading: 'Sadeleştirme İpuçları', content: "Çarpanlara ayırma: AB + AC = A(B+C). Absorpsiyon: A + AB = A. Konsensüs: AB + A'C + BC = AB + A'C." },
    ],
  },
];

const LearnPage = () => {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const currentLesson = lessons.find(l => l.id === selectedLesson);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="h-14 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            <ArrowLeft size={14} />
            <Cpu size={14} className="text-primary" />
            <span className="font-semibold hidden sm:inline">VoltLogic</span>
          </Link>
          <div className="w-px h-6 bg-border" />
          <h1 className="text-sm font-bold flex items-center gap-1.5">
            <BookOpen size={14} /> Dijital Mantık Öğren
          </h1>
        </div>

        <Link
          to="/circuit-studio"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
        >
          <CircuitBoard size={12} /> Stüdyoda Dene
        </Link>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {!currentLesson ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-3">
                <span className="text-primary">Dijital Mantık</span> Öğren
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Temel kapılardan Karnaugh haritasına, dijital mantık devrelerinin temelleri.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {lessons.map((lesson, i) => (
                <motion.button
                  key={lesson.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  onClick={() => setSelectedLesson(lesson.id)}
                  className="group text-left p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg bg-background border border-border ${lesson.color}`}>
                      <lesson.icon size={18} />
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="text-base font-bold mb-1">{lesson.title}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{lesson.sections[0].content}</p>
                </motion.button>
              ))}
            </div>
          </>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentLesson.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button
                onClick={() => setSelectedLesson(null)}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft size={14} /> Derslere Dön
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2.5 rounded-xl bg-card border border-border ${currentLesson.color}`}>
                  <currentLesson.icon size={24} />
                </div>
                <h2 className="text-2xl font-black">{currentLesson.title}</h2>
              </div>

              <div className="grid lg:grid-cols-[1fr_auto] gap-8">
                {/* Content */}
                <div className="space-y-6">
                  {currentLesson.sections.map((section, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 rounded-xl bg-card border border-border"
                    >
                      <h3 className="text-sm font-bold mb-2">{section.heading}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Sidebar: Truth table + expression */}
                <div className="lg:w-64 space-y-4">
                  {currentLesson.expression && (
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-2">İfade</span>
                      <p className="font-mono text-lg font-bold">{currentLesson.expression}</p>
                    </div>
                  )}

                  {currentLesson.truthTable && (
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-3">Doğruluk Tablosu</span>
                      <table className="w-full text-center text-sm font-mono">
                        <thead>
                          <tr className="text-[10px] text-muted-foreground uppercase">
                            {currentLesson.truthTable.inputs.map(h => (
                              <th key={h} className="pb-2 px-2">{h}</th>
                            ))}
                            <th className="pb-2 px-2 text-primary">{currentLesson.truthTable.output}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentLesson.truthTable.rows.map((row, i) => (
                            <tr key={i} className="border-t border-border/30">
                              {row.map((cell, j) => (
                                <td key={j} className={`py-1.5 px-2 ${j === row.length - 1 && cell === '1' ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <Link
                    to="/circuit-studio"
                    className="block w-full text-center py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-colors"
                  >
                    Devre Stüdyosunda Dene
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default LearnPage;
