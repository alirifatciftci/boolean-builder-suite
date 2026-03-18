import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, Trash2, ArrowRight, ArrowRightLeft } from 'lucide-react';
import { generateTruthTable, extractVariables } from '@/utils/booleanParser';
import { solveKMap, solveKMapPOS } from '@/utils/kmapSolver';

const EXAMPLES = [
  { label: "XOR", expr: "A'B + AB'" },
  { label: "XNOR", expr: "AB + A'B'" },
  { label: "3-var", expr: "A'BC + AB'C + ABC" },
  { label: "4-var", expr: "A'B'CD + ABCD + A'BCD" },
  { label: "Complex", expr: "(A + B)(A' + C)" },
];

const BooleanAlgebraPage = () => {
  const [expression, setExpression] = useState("A'B + AB'");

  const result = useMemo(() => generateTruthTable(expression), [expression]);
  const variables = useMemo(() => extractVariables(expression), [expression]);

  // Generate simplified SOP and POS using K-Map solver
  const simplified = useMemo(() => {
    if (!result || variables.length < 2 || variables.length > 4) return null;
    const truthValues = Array(16).fill(0);
    result.rows.forEach((row, i) => {
      truthValues[i] = row.output;
    });
    return {
      sop: solveKMap(truthValues, variables.length),
      pos: solveKMapPOS(truthValues, variables.length),
    };
  }, [result, variables]);

  // Generate canonical forms
  const canonical = useMemo(() => {
    if (!result) return null;

    const minterms = result.rows
      .map((r, i) => (r.output === 1 ? i : -1))
      .filter(v => v !== -1);
    const maxterms = result.rows
      .map((r, i) => (r.output === 0 ? i : -1))
      .filter(v => v !== -1);

    // Canonical SOP (all minterms expanded)
    const canonSOP = minterms.map(m => {
      return variables.map((v, j) => {
        const bit = (m >> (variables.length - 1 - j)) & 1;
        return bit === 1 ? v : v + "'";
      }).join('');
    }).join(' + ');

    // Canonical POS (all maxterms expanded)
    const canonPOS = maxterms.map(m => {
      return '(' + variables.map((v, j) => {
        const bit = (m >> (variables.length - 1 - j)) & 1;
        return bit === 0 ? v : v + "'";
      }).join(' + ') + ')';
    }).join('');

    return {
      canonSOP: canonSOP || '1',
      canonPOS: canonPOS || '1',
      minterms,
      maxterms,
    };
  }, [result, variables]);

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
          <h1 className="text-sm font-bold">Boolean Cebri</h1>
        </div>

        <div className="flex items-center gap-2">
          {result && variables.length >= 2 && variables.length <= 4 && (
            <Link
              to="/kmap"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-all"
            >
              K-Map'te Aç <ArrowRight size={12} />
            </Link>
          )}
          {result && (
            <Link
              to="/truth-table"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
            >
              Doğruluk Tablosu <ArrowRight size={12} />
            </Link>
          )}
        </div>
      </header>

      <div className="max-w-5xl mx-auto p-6">
        {/* Input */}
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

          <div className="flex flex-wrap gap-2 mt-3">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.expr}
                onClick={() => setExpression(ex.expr)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all border ${
                  expression === ex.expr
                    ? 'bg-primary/10 border-primary/30 text-primary'
                    : 'bg-card border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="text-muted-foreground mr-1">{ex.label}:</span> {ex.expr}
              </button>
            ))}
          </div>
        </div>

        {result && canonical ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Input expression */}
            <div className="p-5 rounded-xl bg-card border border-border">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] block mb-2">
                Girilen İfade
              </span>
              <div className="text-xl font-mono font-bold text-foreground break-all">
                F({variables.join(', ')}) = {expression}
              </div>
            </div>

            {/* Simplified forms */}
            {simplified && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRightLeft size={14} className="text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                      Sadeleştirilmiş SOP
                    </span>
                  </div>
                  <div className="text-lg font-mono font-bold text-foreground break-all">
                    F = {simplified.sop}
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRightLeft size={14} className="text-violet-400" />
                    <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em]">
                      Sadeleştirilmiş POS
                    </span>
                  </div>
                  <div className="text-lg font-mono font-bold text-foreground break-all">
                    F = {simplified.pos}
                  </div>
                </div>
              </div>
            )}

            {/* Canonical forms */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Kanonik Formlar
              </h3>

              <div className="p-5 rounded-xl bg-card border border-border">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] block mb-2">
                  Kanonik SOP (Minterm'ler)
                </span>
                <p className="text-xs font-mono text-muted-foreground mb-2">
                  &Sigma;m({canonical.minterms.join(', ')})
                </p>
                <div className="text-sm font-mono text-foreground break-all leading-relaxed">
                  F = {canonical.canonSOP}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-card border border-border">
                <span className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] block mb-2">
                  Kanonik POS (Maxterm'ler)
                </span>
                <p className="text-xs font-mono text-muted-foreground mb-2">
                  &Pi;M({canonical.maxterms.join(', ')})
                </p>
                <div className="text-sm font-mono text-foreground break-all leading-relaxed">
                  F = {canonical.canonPOS}
                </div>
              </div>
            </div>

            {/* Quick truth table */}
            <div>
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
                Doğruluk Tablosu Önizleme
              </h3>
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-card z-10">
                      <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border">
                        {variables.map(v => (
                          <th key={v} className="py-3 px-4 text-center font-black">{v}</th>
                        ))}
                        <th className="py-3 px-4 text-center font-black text-primary">F</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-mono">
                      {result.rows.map((row, i) => (
                        <tr key={i} className="border-t border-border/30 hover:bg-secondary/30 transition-colors">
                          {row.inputs.map((val, j) => (
                            <td key={j} className="py-1.5 px-4 text-center text-muted-foreground">{val}</td>
                          ))}
                          <td className="py-1.5 px-4 text-center">
                            <span className={row.output === 1 ? 'text-primary font-bold' : 'text-muted-foreground'}>
                              {row.output}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {variables.length > 4 && (
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <p className="text-sm text-amber-400">
                  K-Map sadeleştirme 2-4 değişken için kullanılabilir. İfadeniz {variables.length} değişkene sahip.
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
              <Cpu size={28} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              {expression.length === 0
                ? 'Analiz etmek için bir Boolean ifadesi girin.'
                : 'Geçersiz ifade. Sözdizimini kontrol edip tekrar deneyin.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BooleanAlgebraPage;
