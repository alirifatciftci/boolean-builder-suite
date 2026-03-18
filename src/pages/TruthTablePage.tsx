import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, ArrowRight, Trash2, Copy, Check } from 'lucide-react';
import { generateTruthTable, extractVariables } from '@/utils/booleanParser';

const EXAMPLES = [
  "A'B + AB'",
  "AB + A'B'",
  "(A + B)(A' + C)",
  "A'B'C + ABC",
  "AB + BC + AC",
  "A ^ B",
];

const TruthTablePage = () => {
  const [expression, setExpression] = useState("A'B + AB'");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => generateTruthTable(expression), [expression]);
  const variables = useMemo(() => extractVariables(expression), [expression]);

  const handleCopy = () => {
    if (!result) return;
    const header = [...result.variables, 'F'].join('\t');
    const rows = result.rows.map(r => [...r.inputs, r.output].join('\t'));
    navigator.clipboard.writeText([header, ...rows].join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Collect minterms and maxterms
  const minterms = result?.rows
    .map((r, i) => (r.output === 1 ? i : -1))
    .filter(v => v !== -1) ?? [];
  const maxterms = result?.rows
    .map((r, i) => (r.output === 0 ? i : -1))
    .filter(v => v !== -1) ?? [];

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
          <h1 className="text-sm font-bold">Doğruluk Tablosu Oluşturucu</h1>
        </div>

        <div className="flex items-center gap-2">
          {result && (
            <Link
              to="/kmap"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
            >
              K-Map'te Aç <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Expression input */}
        <div className="mb-8">
          <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-3">
            Boolean İfadesi
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="İfade girin: AB + A'B', (A+B)C', A^B ..."
              className="flex-1 px-5 py-3 rounded-xl bg-card border border-border text-foreground font-mono text-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground/50"
            />
            <button
              onClick={() => setExpression('')}
              className="px-4 py-3 rounded-xl bg-secondary text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>

          {/* Examples */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider self-center mr-1">Örnekler:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setExpression(ex)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                  expression === ex
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {ex}
              </button>
            ))}
          </div>

          {/* Syntax help */}
          <div className="mt-3 p-3 rounded-lg bg-card border border-border">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-bold text-foreground">Sözdizimi:</span>{' '}
              NOT = <code className="text-primary">A'</code> veya <code className="text-primary">!A</code>,{' '}
              AND = <code className="text-primary">AB</code> veya <code className="text-primary">A.B</code>,{' '}
              OR = <code className="text-primary">A+B</code>,{' '}
              XOR = <code className="text-primary">A^B</code>,{' '}
              Parantez = <code className="text-primary">(A+B)'</code>
            </p>
          </div>
        </div>

        {result ? (
          <div className="grid lg:grid-cols-[1fr_auto] gap-8">
            {/* Truth Table */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                  Doğruluk Tablosu — {result.rows.length} satır
                </h3>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  {copied ? <><Check size={12} className="text-primary" /> Kopyalandı!</> : <><Copy size={12} /> Kopyala</>}
                </button>
              </div>

              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-card z-10">
                      <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border">
                        <th className="py-3 px-3 text-center text-muted-foreground/60">#</th>
                        {result.variables.map(v => (
                          <th key={v} className="py-3 px-4 text-center font-black">{v}</th>
                        ))}
                        <th className="py-3 px-4 text-center font-black text-primary">F</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-mono">
                      {result.rows.map((row, i) => (
                        <motion.tr
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.02, duration: 0.2 }}
                          className="border-t border-border/30 hover:bg-secondary/30 transition-colors"
                        >
                          <td className="py-2 px-3 text-center text-[10px] text-muted-foreground/50">
                            {i}
                          </td>
                          {row.inputs.map((val, j) => (
                            <td key={j} className="py-2 px-4 text-center text-muted-foreground">
                              {val}
                            </td>
                          ))}
                          <td className="py-2 px-4 text-center">
                            <span className={`inline-flex w-8 h-8 rounded-md items-center justify-center font-bold text-sm ${
                              row.output === 1
                                ? 'bg-primary/20 text-primary'
                                : 'text-muted-foreground'
                            }`}>
                              {row.output}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Summary sidebar */}
            <div className="lg:w-72 space-y-4">
              <div className="p-4 rounded-xl bg-card border border-border">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-2">İfade</span>
                <p className="font-mono text-lg font-bold text-foreground break-all">
                  F = {expression}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-card border border-border">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-2">Değişkenler</span>
                <div className="flex gap-2">
                  {variables.map(v => (
                    <span key={v} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-mono font-bold text-sm">
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {minterms.length > 0 && (
                <div className="p-4 rounded-xl bg-card border border-border">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-1">Minterms</span>
                  <p className="text-xs font-mono text-muted-foreground">
                    &Sigma;m({minterms.join(', ')})
                  </p>
                </div>
              )}

              {maxterms.length > 0 && (
                <div className="p-4 rounded-xl bg-card border border-border">
                  <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] block mb-1">Maxterms</span>
                  <p className="text-xs font-mono text-muted-foreground">
                    &Pi;M({maxterms.join(', ')})
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-card border border-border">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-2">İstatistikler</span>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Değişkenler</span>
                    <span className="font-mono font-bold">{variables.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toplam satır</span>
                    <span className="font-mono font-bold">{result.rows.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Birler (1)</span>
                    <span className="font-mono font-bold text-primary">{minterms.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sıfırlar (0)</span>
                    <span className="font-mono font-bold">{maxterms.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
              <Cpu size={28} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {expression.length === 0
                ? 'Enter a Boolean expression above to generate its truth table.'
                : 'Invalid expression. Check your syntax and try again.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TruthTablePage;
