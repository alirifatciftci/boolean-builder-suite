import { useCircuitStore } from '@/store/circuitStore';
import { X, Activity } from 'lucide-react';

interface TimingDiagramProps {
  isOpen: boolean;
  onClose: () => void;
}

const SIGNAL_COLORS: Record<string, string> = {
  INPUT: '#22c55e',
  OUTPUT: '#f59e0b',
  CLOCK: '#8b5cf6',
  D_FF: '#06b6d4',
  JK_FF: '#ec4899',
  SR_FF: '#f97316',
  T_FF: '#14b8a6',
};

export const TimingDiagram = ({ isOpen, onClose }: TimingDiagramProps) => {
  const nodes = useCircuitStore(s => s.nodes);
  const signalHistory = useCircuitStore(s => s.signalHistory);
  const tickCount = useCircuitStore(s => s.tickCount);

  if (!isOpen) return null;

  const trackedNodes = nodes.filter(n =>
    ['INPUT', 'OUTPUT', 'CLOCK', 'D_FF', 'JK_FF', 'SR_FF', 'T_FF'].includes(n.data.logicType)
  );

  const drawWaveform = (values: number[], color: string) => {
    if (values.length === 0) return null;

    const width = 400;
    const height = 32;
    const stepW = width / Math.max(values.length - 1, 1);
    const highY = 4;
    const lowY = height - 4;

    let path = `M 0 ${values[0] === 1 ? highY : lowY}`;
    for (let i = 1; i < values.length; i++) {
      const x = i * stepW;
      const prevY = values[i - 1] === 1 ? highY : lowY;
      const curY = values[i] === 1 ? highY : lowY;
      if (prevY !== curY) {
        path += ` L ${x} ${prevY} L ${x} ${curY}`;
      } else {
        path += ` L ${x} ${curY}`;
      }
    }

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-8">
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-card border-t border-border z-40 max-h-[45%] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-2">
          <Activity size={14} className="text-primary" />
          <span className="text-xs font-bold">Zamanlama Diyagramı</span>
          <span className="text-[10px] text-muted-foreground font-mono">Tick: {tickCount}</span>
        </div>
        <button onClick={onClose} className="p-1 rounded hover:bg-secondary text-muted-foreground transition-colors">
          <X size={16} />
        </button>
      </div>

      {/* Waveforms */}
      <div className="overflow-y-auto custom-scrollbar flex-1 p-3">
        {trackedNodes.length === 0 ? (
          <p className="text-xs text-muted-foreground p-4 text-center">
            Zamanlama diyagramını görmek için INPUT, OUTPUT, CLOCK veya Flip-Flop bileşenleri ekleyin.
          </p>
        ) : (
          <div className="space-y-1">
            {trackedNodes.map(node => {
              const history = signalHistory.find(h => h.nodeId === node.id);
              const values = history?.values || [];
              const color = SIGNAL_COLORS[node.data.logicType] || '#64748b';
              const label = node.data.logicType === 'INPUT' ? `IN` :
                            node.data.logicType === 'OUTPUT' ? `OUT` :
                            node.data.label || node.data.logicType;

              return (
                <div key={node.id} className="flex items-center gap-3">
                  <div className="w-20 shrink-0 text-right">
                    <span className="text-[10px] font-mono font-bold" style={{ color }}>
                      {label}
                    </span>
                    <span className="text-[9px] text-muted-foreground block truncate">
                      {node.id.slice(0, 6)}
                    </span>
                  </div>
                  <div className="flex-1 bg-background rounded-lg p-1 border border-border/50">
                    {values.length > 1 ? (
                      drawWaveform(values, color)
                    ) : (
                      <div className="h-8 flex items-center justify-center text-[10px] text-muted-foreground">
                        Veri bekleniyor...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
