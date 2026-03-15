import { useState } from 'react';
import { Play, Pause, Trash2, Grid3X3 } from 'lucide-react';
import { useCircuitStore } from '@/store/circuitStore';
import { ComponentSidebar } from '@/components/circuit/ComponentSidebar';
import { CircuitCanvas } from '@/components/circuit/CircuitCanvas';
import { KMapModal } from '@/components/circuit/KMapModal';

const Index = () => {
  const { isRunning, toggleRunning, clearCanvas } = useCircuitStore();
  const [isKMapOpen, setIsKMapOpen] = useState(false);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <ComponentSidebar />

      <main className="flex-1 flex flex-col">
        {/* Toolbar */}
        <header className="h-14 border-b border-border bg-card/50 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-3">
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
              className="flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm bg-secondary text-secondary-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>

          <button
            onClick={() => setIsKMapOpen(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full font-semibold text-sm bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-all"
          >
            <Grid3X3 size={14} /> K-Map Solver
          </button>
        </header>

        <CircuitCanvas />
      </main>

      <KMapModal isOpen={isKMapOpen} onClose={() => setIsKMapOpen(false)} />
    </div>
  );
};

export default Index;
