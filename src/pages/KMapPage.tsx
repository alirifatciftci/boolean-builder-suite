import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Cpu, ChevronDown, RotateCcw } from 'lucide-react';
import {
  solveKMap,
  solveKMapPOS,
  getKMapIndices,
  getRowHeaders,
  getColHeaders,
  getRowLabel,
  getColLabel,
} from '@/utils/kmapSolver';

type OutputMode = 'SOP' | 'POS';

const KMapPage = () => {
  const [varCount, setVarCount] = useState<2 | 3 | 4>(4);
  const totalMinterms = 1 << varCount;
  const [truthTable, setTruthTable] = useState<number[]>(Array(16).fill(0));
  const [outputMode, setOutputMode] = useState<OutputMode>('SOP');

  const toggleCell = (idx: number) => {
    const next = [...truthTable];
    next[idx] = next[idx] === 0 ? 1 : next[idx] === 1 ? 2 : 0;
    setTruthTable(next);
  };

  const resetTable = () => {
    setTruthTable(Array(16).fill(0));
  };

  const setAll = (val: number) => {
    const next = Array(16).fill(0);
    for (let i = 0; i < totalMinterms; i++) next[i] = val;
    setTruthTable(next);
  };

  const indices = getKMapIndices(varCount);
  const rowHeaders = getRowHeaders(varCount);
  const colHeaders = getColHeaders(varCount);
  const expressionSOP = solveKMap(truthTable, varCount);
  const expressionPOS = solveKMapPOS(truthTable, varCount);
  const expression = outputMode === 'SOP' ? expressionSOP : expressionPOS;

  const vars = varCount === 2 ? 'AB' : varCount === 3 ? 'ABC' : 'ABCD';

  // Collect minterms and maxterms for display
  const minterms = truthTable.slice(0, totalMinterms)
    .map((v, i) => (v === 1 ? i : -1)).filter(v => v !== -1);
  const maxterms = truthTable.slice(0, totalMinterms)
    .map((v, i) => (v === 0 ? i : -1)).filter(v => v !== -1);
  const dontCares = truthTable.slice(0, totalMinterms)
    .map((v, i) => (v === 2 ? i : -1)).filter(v => v !== -1);

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
          <h1 className="text-sm font-bold">Karnaugh Map Solver</h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick actions */}
          <button
            onClick={resetTable}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
          >
            <RotateCcw size={12} /> Reset
          </button>

          {/* Variable selector */}
          <div className="relative">
            <select
              value={varCount}
              onChange={(e) => {
                setVarCount(Number(e.target.value) as 2 | 3 | 4);
                setTruthTable(Array(16).fill(0));
              }}
              className="appearance-none bg-secondary text-secondary-foreground text-sm font-medium px-4 py-2 pr-8 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={2}>2 Variables</option>
              <option value={3}>3 Variables</option>
              <option value={4}>4 Variables</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Left: Truth Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">
                Truth Table
              </h3>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setAll(0)}
                  className="px-2.5 py-1 rounded text-[10px] font-bold bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  All 0
                </button>
                <button
                  onClick={() => setAll(1)}
                  className="px-2.5 py-1 rounded text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  All 1
                </button>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-card z-10">
                    <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border">
                      <th className="py-3 px-3 text-center text-muted-foreground/60">#</th>
                      {vars.split('').map(v => (
                        <th key={v} className="py-3 px-2 text-center">{v}</th>
                      ))}
                      <th className="py-3 px-2 text-center">F</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm font-mono">
                    {Array.from({ length: totalMinterms }, (_, i) => (
                      <tr key={i} className="border-t border-border/30 hover:bg-secondary/30 transition-colors">
                        <td className="py-1.5 px-3 text-center text-[10px] text-muted-foreground/50">
                          m{i}
                        </td>
                        {Array.from({ length: varCount }, (_, bit) => (
                          <td key={bit} className="py-1.5 px-2 text-center text-muted-foreground">
                            {(i >> (varCount - 1 - bit)) & 1}
                          </td>
                        ))}
                        <td className="py-1 px-2 text-center">
                          <button
                            onClick={() => toggleCell(i)}
                            className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm transition-all mx-auto
                              ${truthTable[i] === 1
                                ? 'bg-primary text-primary-foreground'
                                : truthTable[i] === 2
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
                              }`}
                          >
                            {truthTable[i] === 2 ? 'X' : truthTable[i]}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Minterm / Maxterm info */}
            <div className="mt-4 space-y-2">
              {minterms.length > 0 && (
                <div className="p-3 rounded-lg bg-card border border-border">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Minterms</span>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    &Sigma;m({minterms.join(', ')})
                    {dontCares.length > 0 && <> + d({dontCares.join(', ')})</>}
                  </p>
                </div>
              )}
              {maxterms.length > 0 && (
                <div className="p-3 rounded-lg bg-card border border-border">
                  <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em]">Maxterms</span>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    &Pi;M({maxterms.join(', ')})
                    {dontCares.length > 0 && <> + d({dontCares.join(', ')})</>}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: K-Map + Result */}
          <div className="flex flex-col">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
              K-Map — {getRowLabel(varCount)} \ {getColLabel(varCount)}
            </h3>

            <div className="bg-card rounded-xl border border-border p-6 mb-6">
              {/* Column headers */}
              <div className="flex ml-14 mb-2">
                {colHeaders.map((h, i) => (
                  <div key={i} className="flex-1 text-center text-xs font-mono text-muted-foreground font-bold">{h}</div>
                ))}
              </div>

              {/* Grid */}
              <div className="space-y-2">
                {indices.map((row, ri) => (
                  <div key={ri} className="flex items-center gap-2">
                    <div className="w-12 text-right text-xs font-mono text-muted-foreground font-bold pr-2">
                      {rowHeaders[ri]}
                    </div>
                    {row.map((cellIdx) => (
                      <motion.button
                        key={cellIdx}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggleCell(cellIdx)}
                        className={`flex-1 aspect-square rounded-xl flex items-center justify-center font-mono text-lg font-bold border-2 transition-all min-h-[56px]
                          ${truthTable[cellIdx] === 1
                            ? 'bg-primary/20 border-primary text-primary shadow-[0_0_12px_hsl(160_84%_39%/0.2)]'
                            : truthTable[cellIdx] === 2
                              ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                              : 'bg-secondary border-transparent text-muted-foreground hover:border-border'
                          }`}
                      >
                        {truthTable[cellIdx] === 2 ? 'X' : truthTable[cellIdx]}
                      </motion.button>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Output mode toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setOutputMode('SOP')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  outputMode === 'SOP'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                SOP (Sum of Products)
              </button>
              <button
                onClick={() => setOutputMode('POS')}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  outputMode === 'POS'
                    ? 'bg-violet-500 text-white'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                POS (Product of Sums)
              </button>
            </div>

            {/* Results */}
            <div className="space-y-3">
              <motion.div
                key={outputMode + expression}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-5 rounded-xl border ${
                  outputMode === 'SOP'
                    ? 'bg-primary/5 border-primary/20'
                    : 'bg-violet-500/5 border-violet-500/20'
                }`}
              >
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] block mb-2 ${
                  outputMode === 'SOP' ? 'text-primary' : 'text-violet-400'
                }`}>
                  Simplified Expression ({outputMode})
                </span>
                <div className="text-xl font-mono font-bold text-foreground tracking-tight break-all">
                  F = {expression}
                </div>
              </motion.div>

              {/* Show both if non-trivial */}
              {expressionSOP !== '0' && expressionSOP !== '1' && (
                <div className="p-4 rounded-xl bg-card border border-border">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-1">SOP</span>
                      <p className="font-mono text-muted-foreground break-all">F = {expressionSOP}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-violet-400 uppercase tracking-[0.2em] block mb-1">POS</span>
                      <p className="font-mono text-muted-foreground break-all">F = {expressionPOS}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Usage tip */}
            <div className="mt-auto pt-6">
              <div className="p-4 rounded-xl bg-background border border-border">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Click cells to cycle: <span className="text-foreground font-semibold">0</span> →{' '}
                  <span className="text-primary font-semibold">1</span> →{' '}
                  <span className="text-amber-400 font-semibold">X</span> (don't care) → 0.
                  The expression updates in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KMapPage;
