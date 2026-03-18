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
      { heading: 'What is AND Gate?', content: 'AND gate is a basic digital logic gate that outputs 1 (HIGH) only when ALL of its inputs are 1. If any input is 0, the output is 0. It implements logical conjunction.' },
      { heading: 'Symbol & Expression', content: 'Boolean expression: F = A · B (or simply AB). The AND operation is also called logical multiplication.' },
      { heading: 'Applications', content: 'AND gates are used in enable circuits, address decoding, and creating more complex logic functions. They are fundamental building blocks of digital systems.' },
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
      { heading: 'What is OR Gate?', content: 'OR gate outputs 1 (HIGH) when at least one of its inputs is 1. It outputs 0 only when ALL inputs are 0. It implements logical disjunction.' },
      { heading: 'Symbol & Expression', content: 'Boolean expression: F = A + B. The OR operation is also called logical addition.' },
      { heading: 'Applications', content: 'OR gates are used in alarm systems (any sensor triggers alarm), interrupt handling, and combining multiple conditions.' },
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
      { heading: 'What is NOT Gate?', content: 'NOT gate (inverter) has a single input and produces the complement (opposite) of that input. If the input is 1, the output is 0, and vice versa.' },
      { heading: 'Symbol & Expression', content: "Boolean expression: F = A' (or F = Ā or F = ¬A). The NOT operation is called complementation or inversion." },
      { heading: 'Applications', content: 'Inverters are used to create complementary signals, build other gates (NAND, NOR), and in feedback circuits like oscillators.' },
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
      { heading: 'What is NAND Gate?', content: 'NAND gate is a universal gate — it can implement ANY Boolean function. It is an AND gate followed by a NOT gate. Output is 0 only when ALL inputs are 1.' },
      { heading: 'Symbol & Expression', content: "Boolean expression: F = (AB)' or F = A↑B. NAND means NOT-AND." },
      { heading: 'Why Universal?', content: 'Using only NAND gates, you can build AND, OR, NOT, and any other gate. This is why NAND gates are the most commonly used gates in integrated circuits.' },
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
      { heading: 'What is XOR Gate?', content: "XOR (Exclusive OR) outputs 1 when the inputs are DIFFERENT. If both inputs are the same (both 0 or both 1), the output is 0." },
      { heading: 'Symbol & Expression', content: "Boolean expression: F = A ⊕ B = A'B + AB'. XOR detects inequality between two bits." },
      { heading: 'Applications', content: "XOR is essential in arithmetic circuits (half adder uses XOR for sum), parity checkers, and comparison circuits." },
    ],
    truthTable: { inputs: ['A', 'B'], output: 'F', rows: [['0','0','0'], ['0','1','1'], ['1','0','1'], ['1','1','0']] },
    expression: "F = A ⊕ B",
  },
  {
    id: 'flipflop',
    title: 'Flip-Flops',
    icon: GitFork,
    color: 'text-cyan-400',
    sections: [
      { heading: 'What are Flip-Flops?', content: 'Flip-flops are sequential logic elements that store one bit of data. Unlike combinational logic, their output depends on both current inputs AND previous state. They are triggered by clock edges.' },
      { heading: 'Types', content: 'D Flip-Flop: Stores data input on clock edge. JK Flip-Flop: J=Set, K=Reset, JK=Toggle. SR Flip-Flop: S=Set, R=Reset. T Flip-Flop: Toggles on every clock edge when T=1.' },
      { heading: 'Applications', content: 'Flip-flops are used in registers, counters, memory circuits, state machines, and synchronization circuits. They are the building blocks of sequential logic.' },
    ],
  },
  {
    id: 'kmap',
    title: 'Karnaugh Maps',
    icon: Grid3X3,
    color: 'text-purple-400',
    sections: [
      { heading: 'What is a K-Map?', content: 'A Karnaugh map is a graphical method for simplifying Boolean expressions. It arranges truth table values in a grid using Gray code ordering so that adjacent cells differ by only one variable.' },
      { heading: 'How to Use', content: 'Group adjacent 1s in powers of 2 (1, 2, 4, 8). Each group eliminates variables that change within the group. Larger groups = simpler expressions.' },
      { heading: 'SOP vs POS', content: "SOP (Sum of Products): Group the 1s to get minterm expressions joined by OR. POS (Product of Sums): Group the 0s to get maxterm expressions joined by AND." },
      { heading: "Don't Care Conditions", content: "Don't care (X) cells can be treated as either 0 or 1 to make larger groups. This allows further simplification when certain input combinations never occur." },
    ],
  },
  {
    id: 'boolean',
    title: 'Boolean Algebra Laws',
    icon: Binary,
    color: 'text-pink-400',
    sections: [
      { heading: 'Identity Laws', content: 'A + 0 = A, A · 1 = A. Adding 0 or multiplying by 1 does not change the value.' },
      { heading: 'Complement Laws', content: "A + A' = 1, A · A' = 0. A variable ORed with its complement is always 1; ANDed is always 0." },
      { heading: "De Morgan's Theorems", content: "(A + B)' = A'B', (AB)' = A' + B'. These theorems are fundamental for converting between SOP and POS forms." },
      { heading: 'Simplification Tips', content: "Use factoring: AB + AC = A(B+C). Use absorption: A + AB = A. Use consensus: AB + A'C + BC = AB + A'C." },
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
            <BookOpen size={14} /> Learn Digital Logic
          </h1>
        </div>

        <Link
          to="/circuit-studio"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
        >
          <CircuitBoard size={12} /> Try in Studio
        </Link>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {!currentLesson ? (
          <>
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-3">
                Learn <span className="text-primary">Digital Logic</span>
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
                <ArrowLeft size={14} /> Back to Lessons
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
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-2">Expression</span>
                      <p className="font-mono text-lg font-bold">{currentLesson.expression}</p>
                    </div>
                  )}

                  {currentLesson.truthTable && (
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-3">Truth Table</span>
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
                    Try in Circuit Studio
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
