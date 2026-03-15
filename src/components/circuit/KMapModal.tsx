import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import {
  solveKMap,
  getKMapIndices,
  getRowHeaders,
  getColHeaders,
  getRowLabel,
  getColLabel,
} from '@/utils/kmapSolver';

interface KMapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KMapModal = ({ isOpen, onClose }: KMapModalProps) => {
  const [varCount, setVarCount] = useState<2 | 3 | 4>(4);
  const totalMinterms = 1 << varCount;
  const [truthTable, setTruthTable] = useState<number[]>(Array(16).fill(0));

  const toggleCell = (idx: number) => {
    const next = [...truthTable];
    next[idx] = next[idx] === 0 ? 1 : next[idx] === 1 ? 2 : 0; // 0 → 1 → X(2) → 0
    setTruthTable(next);
  };

  const indices = getKMapIndices(varCount);
  const rowHeaders = getRowHeaders(varCount);
  const colHeaders = getColHeaders(varCount);
  const expression = solveKMap(truthTable, varCount);

  const vars = varCount === 2 ? 'AB' : varCount === 3 ? 'ABC' : 'ABCD';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm bg-background/60">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-5xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-border flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-foreground">Karnaugh Map Solver</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Boolean expression simplification — click output cells to cycle 0 → 1 → X
                </p>
              </div>
              <div className="flex items-center gap-3">
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
                <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg text-muted-foreground transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-8">
              {/* Truth Table */}
              <div>
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
                  Truth Table
                </h3>
                <div className="h-[400px] overflow-y-auto custom-scrollbar pr-2">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 bg-card z-10">
                      <tr className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {vars.split('').map(v => (
                          <th key={v} className="pb-2 px-2 text-center">{v}</th>
                        ))}
                        <th className="pb-2 px-2 text-center">F</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm font-mono">
                      {Array.from({ length: totalMinterms }, (_, i) => (
                        <tr key={i} className="border-t border-border/50 hover:bg-secondary/30 transition-colors">
                          {Array.from({ length: varCount }, (_, bit) => (
                            <td key={bit} className="py-1.5 px-2 text-center text-muted-foreground">
                              {(i >> (varCount - 1 - bit)) & 1}
                            </td>
                          ))}
                          <td className="py-1 px-2 text-center">
                            <button
                              onClick={() => toggleCell(i)}
                              className={`w-8 h-8 rounded-md flex items-center justify-center font-bold text-sm transition-all
                                ${truthTable[i] === 1
                                  ? 'bg-primary text-primary-foreground'
                                  : truthTable[i] === 2
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-secondary text-muted-foreground'
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

              {/* K-Map + Result */}
              <div className="flex flex-col">
                <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-3">
                  K-Map — {getRowLabel(varCount)} \ {getColLabel(varCount)}
                </h3>

                <div className="mb-6">
                  {/* Column headers */}
                  <div className="flex ml-12 mb-1">
                    {colHeaders.map((h, i) => (
                      <div key={i} className="flex-1 text-center text-[10px] font-mono text-muted-foreground">{h}</div>
                    ))}
                  </div>

                  {/* Grid */}
                  {indices.map((row, ri) => (
                    <div key={ri} className="flex items-center gap-1 mb-1">
                      <div className="w-10 text-right text-[10px] font-mono text-muted-foreground pr-2">
                        {rowHeaders[ri]}
                      </div>
                      {row.map((cellIdx) => (
                        <motion.button
                          key={cellIdx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleCell(cellIdx)}
                          className={`flex-1 aspect-square rounded-lg flex items-center justify-center font-mono text-base font-bold border-2 transition-all
                            ${truthTable[cellIdx] === 1
                              ? 'bg-primary/20 border-primary text-primary shadow-[0_0_12px_hsl(160_84%_39%/0.2)]'
                              : truthTable[cellIdx] === 2
                                ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                                : 'bg-secondary border-transparent text-muted-foreground'
                            }`}
                        >
                          {truthTable[cellIdx] === 2 ? 'X' : truthTable[cellIdx]}
                        </motion.button>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Result */}
                <div className="mt-auto p-5 rounded-xl bg-background border border-border">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] block mb-2">
                    Simplified Expression (SOP)
                  </span>
                  <div className="text-xl font-mono font-bold text-foreground tracking-tight break-all">
                    F = {expression}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
