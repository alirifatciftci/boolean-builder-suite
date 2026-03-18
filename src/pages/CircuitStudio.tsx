import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, Trash2, Grid3X3, Cpu, ArrowLeft, Save, FolderOpen, Download, Upload, X, Activity, BarChart3 } from 'lucide-react';
import { useCircuitStore } from '@/store/circuitStore';
import { ComponentSidebar } from '@/components/circuit/ComponentSidebar';
import { CircuitCanvas } from '@/components/circuit/CircuitCanvas';
import { KMapModal } from '@/components/circuit/KMapModal';
import { TimingDiagram } from '@/components/circuit/TimingDiagram';
import { circuitTemplates } from '@/utils/circuitTemplates';

const CircuitStudio = () => {
  const { isRunning, toggleRunning, clearCanvas, saveCircuit, loadCircuit, getSavedCircuits, deleteSavedCircuit, exportCircuit, importCircuit, nodes, edges } = useCircuitStore();
  const [isKMapOpen, setIsKMapOpen] = useState(false);
  const [isTimingOpen, setIsTimingOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSaveOpen, setIsSaveOpen] = useState(false);
  const [isLoadOpen, setIsLoadOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    if (saveName.trim()) {
      saveCircuit(saveName.trim());
      setSaveName('');
      setIsSaveOpen(false);
    }
  };

  const handleLoad = (name: string) => {
    loadCircuit(name);
    setIsLoadOpen(false);
  };

  const handleLoadTemplate = (template: typeof circuitTemplates[0]) => {
    importCircuit(JSON.stringify({ nodes: template.nodes, edges: template.edges }));
    setIsLoadOpen(false);
  };

  const handleExport = () => {
    const json = exportCircuit();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'circuit.voltlogic.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      importCircuit(text);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const savedList = getSavedCircuits();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ComponentSidebar />

      <main className="flex-1 flex flex-col">
        {/* Toolbar */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all mr-1"
            >
              <ArrowLeft size={14} />
              <Cpu size={14} className="text-primary" />
            </Link>
            <button
              onClick={toggleRunning}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm transition-all
                ${isRunning
                  ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
            >
              {isRunning ? <><Pause size={14} /> Pause</> : <><Play size={14} /> Run</>}
            </button>
            <button
              onClick={clearCanvas}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-sm bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <Trash2 size={14} /> Clear
            </button>

            <div className="w-px h-6 bg-border mx-1" />

            {/* Save/Load */}
            <div className="relative">
              <button
                onClick={() => { setIsSaveOpen(!isSaveOpen); setIsLoadOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <Save size={14} /> Save
              </button>
              {isSaveOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl p-3 z-50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={saveName}
                      onChange={(e) => setSaveName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                      placeholder="Circuit name..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                      autoFocus
                    />
                    <button onClick={handleSave} className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => { setIsLoadOpen(!isLoadOpen); setIsSaveOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              >
                <FolderOpen size={14} /> Load
              </button>
              {isLoadOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-card border border-border rounded-xl shadow-2xl p-3 z-50 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {/* Saved circuits */}
                  {savedList.length > 0 && (
                    <>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] px-2 mb-1">Saved Circuits</p>
                      {savedList.map(name => (
                        <div key={name} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors group">
                          <button onClick={() => handleLoad(name)} className="text-sm text-foreground font-medium flex-1 text-left">
                            {name}
                          </button>
                          <button
                            onClick={() => deleteSavedCircuit(name)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded text-muted-foreground hover:text-destructive transition-all"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                      <div className="border-t border-border my-2" />
                    </>
                  )}
                  {/* Templates */}
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] px-2 mb-1">Templates</p>
                  {circuitTemplates.map(t => (
                    <button
                      key={t.name}
                      onClick={() => handleLoadTemplate(t)}
                      className="w-full text-left p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <span className="text-sm text-foreground font-medium block">{t.name}</span>
                      <span className="text-[10px] text-muted-foreground">{t.description}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-px h-6 bg-border mx-1" />

            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              title="Export JSON"
            >
              <Download size={14} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
              title="Import JSON"
            >
              <Upload size={14} />
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setIsStatsOpen(!isStatsOpen)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm transition-all border ${
                  isStatsOpen
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80'
                }`}
              >
                <BarChart3 size={14} /> Stats
              </button>
              {isStatsOpen && (() => {
                const gateTypes = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR', 'XNOR'];
                const ffTypes = ['D_FF', 'JK_FF', 'SR_FF', 'T_FF'];
                const msiTypes = ['DECODER_2x4', 'MUX_4x1', 'HALF_ADDER', 'FULL_ADDER', 'SEVEN_SEG'];
                const gateCount = nodes.filter(n => gateTypes.includes(n.data.logicType)).length;
                const ffCount = nodes.filter(n => ffTypes.includes(n.data.logicType)).length;
                const msiCount = nodes.filter(n => msiTypes.includes(n.data.logicType)).length;
                const inputCount = nodes.filter(n => n.data.logicType === 'INPUT').length;
                const outputCount = nodes.filter(n => n.data.logicType === 'OUTPUT').length;
                const clockCount = nodes.filter(n => n.data.logicType === 'CLOCK').length;
                const wireCount = edges.length;

                return (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-2xl p-4 z-50">
                    <p className="text-[10px] font-black text-amber-400 uppercase tracking-[0.2em] mb-3">Circuit Statistics</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Gates</span><span className="font-mono font-bold">{gateCount}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Flip-Flops</span><span className="font-mono font-bold">{ffCount}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">MSI Components</span><span className="font-mono font-bold">{msiCount}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Inputs</span><span className="font-mono font-bold">{inputCount}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Outputs</span><span className="font-mono font-bold">{outputCount}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Clocks</span><span className="font-mono font-bold">{clockCount}</span></div>
                      <div className="border-t border-border pt-2 flex justify-between"><span className="text-muted-foreground">Wires</span><span className="font-mono font-bold">{wireCount}</span></div>
                      <div className="flex justify-between font-bold"><span className="text-foreground">Total Components</span><span className="font-mono text-primary">{nodes.length}</span></div>
                    </div>
                  </div>
                );
              })()}
            </div>
            <button
              onClick={() => setIsTimingOpen(!isTimingOpen)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm transition-all border ${
                isTimingOpen
                  ? 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                  : 'bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80'
              }`}
            >
              <Activity size={14} /> Timing
            </button>
            <button
              onClick={() => setIsKMapOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
            >
              <Grid3X3 size={14} /> K-Map
            </button>
          </div>
        </header>

        <div className="flex-1 relative">
          <CircuitCanvas />
          <TimingDiagram isOpen={isTimingOpen} onClose={() => setIsTimingOpen(false)} />
        </div>
      </main>

      <KMapModal isOpen={isKMapOpen} onClose={() => setIsKMapOpen(false)} />
    </div>
  );
};

export default CircuitStudio;
