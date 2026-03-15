import { Handle, Position } from 'reactflow';
import { motion } from 'framer-motion';
import { useCircuitStore } from '@/store/circuitStore';

export const GateNode = ({ id, data }: { id: string; data: { label: string; logicType: string } }) => {
  const value = useCircuitStore((s) => s.nodeValues[id] ?? 0);
  const isHigh = value === 1;
  const isNot = data.logicType === 'NOT';

  return (
    <div className={`
      relative px-5 py-3 rounded-xl bg-card border transition-all duration-200 min-w-[110px]
      ${isHigh ? 'border-primary/60 shadow-[0_0_20px_hsl(160_84%_39%/0.15)]' : 'border-node-border'}
    `}>
      {!isNot && (
        <>
          <Handle type="target" position={Position.Left} id="a" style={{ top: '35%' }} />
          <Handle type="target" position={Position.Left} id="b" style={{ top: '65%' }} />
        </>
      )}
      {isNot && <Handle type="target" position={Position.Left} id="a" />}
      
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Gate</span>
        <span className={`text-lg font-mono font-bold transition-colors ${isHigh ? 'text-primary' : 'text-muted-foreground'}`}>
          {data.label}
        </span>
        <motion.div
          animate={{ opacity: isHigh ? 1 : 0.3 }}
          className="w-2 h-2 rounded-full bg-primary"
        />
      </div>
      
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
};

export const InputNode = ({ id }: { id: string }) => {
  const value = useCircuitStore((s) => s.nodeValues[id] ?? 0);
  const updateNodeValue = useCircuitStore((s) => s.updateNodeValue);

  return (
    <div className="px-5 py-3 rounded-xl bg-card border border-node-border min-w-[120px]">
      <div className="flex flex-col items-center gap-2">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Input</span>
        <button
          onClick={() => updateNodeValue(id, value === 1 ? 0 : 1)}
          className={`w-14 h-7 rounded-full transition-colors relative ${value === 1 ? 'bg-primary' : 'bg-secondary'}`}
        >
          <motion.div
            animate={{ x: value === 1 ? 28 : 4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 left-0 w-5 h-5 rounded-full bg-foreground shadow-md"
          />
        </button>
        <span className={`text-xs font-mono font-bold ${value === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
          {value}
        </span>
      </div>
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
};

export const OutputNode = ({ id }: { id: string }) => {
  const value = useCircuitStore((s) => s.nodeValues[id] ?? 0);
  const isHigh = value === 1;

  return (
    <div className="px-5 py-3 rounded-xl bg-card border border-node-border min-w-[100px]">
      <Handle type="target" position={Position.Left} id="a" />
      <div className="flex flex-col items-center gap-2">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Output</span>
        <motion.div
          animate={{
            backgroundColor: isHigh ? 'hsl(160, 84%, 39%)' : 'hsl(215, 20%, 12%)',
            boxShadow: isHigh ? '0 0 24px hsl(160, 84%, 39%, 0.5)' : '0 0 0px transparent',
          }}
          className="w-10 h-10 rounded-full border-2 border-node-border flex items-center justify-center"
        >
          <span className={`text-sm font-mono font-bold ${isHigh ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
            {value}
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export const ClockNode = ({ id }: { id: string }) => {
  const value = useCircuitStore((s) => s.nodeValues[id] ?? 0);
  const isHigh = value === 1;

  return (
    <div className={`
      px-5 py-3 rounded-xl bg-card border transition-all min-w-[110px]
      ${isHigh ? 'border-primary/60' : 'border-node-border'}
    `}>
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Clock</span>
        <div className="flex items-center gap-1">
          {[0, 1, 0, 1, 0].map((v, i) => (
            <motion.div
              key={i}
              animate={{ opacity: (i % 2 === value) ? 1 : 0.3 }}
              className={`w-1.5 ${v === 1 ? 'h-4' : 'h-2'} rounded-full bg-primary`}
            />
          ))}
        </div>
        <span className={`text-xs font-mono font-bold ${isHigh ? 'text-primary' : 'text-muted-foreground'}`}>
          CLK: {value}
        </span>
      </div>
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
};

export const DFlipFlopNode = ({ id }: { id: string }) => {
  const value = useCircuitStore((s) => s.nodeValues[id] ?? 0);
  const isHigh = value === 1;

  return (
    <div className={`
      px-5 py-4 rounded-xl bg-card border transition-all min-w-[120px]
      ${isHigh ? 'border-primary/60 shadow-[0_0_20px_hsl(160_84%_39%/0.1)]' : 'border-node-border'}
    `}>
      <Handle type="target" position={Position.Left} id="a" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="b" style={{ top: '65%' }} />
      
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">D Flip-Flop</span>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
          <span>D →</span>
          <span>CLK →</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground font-mono">Q=</span>
          <span className={`text-lg font-mono font-bold ${isHigh ? 'text-primary' : 'text-muted-foreground'}`}>{value}</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
};

export const JKFlipFlopNode = ({ id }: { id: string }) => {
  const value = useCircuitStore((s) => s.nodeValues[id] ?? 0);
  const isHigh = value === 1;

  return (
    <div className={`
      px-5 py-4 rounded-xl bg-card border transition-all min-w-[120px]
      ${isHigh ? 'border-primary/60 shadow-[0_0_20px_hsl(160_84%_39%/0.1)]' : 'border-node-border'}
    `}>
      <Handle type="target" position={Position.Left} id="a" style={{ top: '25%' }} />
      <Handle type="target" position={Position.Left} id="b" style={{ top: '50%' }} />
      <Handle type="target" position={Position.Left} id="c" style={{ top: '75%' }} />
      
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">JK Flip-Flop</span>
        <div className="flex flex-col items-start gap-0.5 text-[10px] text-muted-foreground font-mono">
          <span>J →</span>
          <span>K →</span>
          <span>CLK →</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground font-mono">Q=</span>
          <span className={`text-lg font-mono font-bold ${isHigh ? 'text-primary' : 'text-muted-foreground'}`}>{value}</span>
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
};

export const DecoderNode = ({ id }: { id: string }) => {
  const value = useCircuitStore((s) => s.nodeValues[id] ?? 0);

  return (
    <div className="px-5 py-4 rounded-xl bg-card border border-node-border min-w-[140px]">
      <Handle type="target" position={Position.Left} id="a" style={{ top: '35%' }} />
      <Handle type="target" position={Position.Left} id="b" style={{ top: '65%' }} />
      
      <div className="flex flex-col items-center gap-2">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">2×4 Decoder</span>
        <div className="grid grid-cols-4 gap-1">
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              animate={{ opacity: value === i ? 1 : 0.2 }}
              className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center
                ${value === i ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}
            >
              {i}
            </motion.div>
          ))}
        </div>
      </div>
      
      <Handle type="source" position={Position.Right} id="out" style={{ top: '20%' }} />
      <Handle type="source" position={Position.Right} id="out1" style={{ top: '40%' }} />
      <Handle type="source" position={Position.Right} id="out2" style={{ top: '60%' }} />
      <Handle type="source" position={Position.Right} id="out3" style={{ top: '80%' }} />
    </div>
  );
};

export const MuxNode = ({ id }: { id: string }) => {
  const value = useCircuitStore((s) => s.nodeValues[id] ?? 0);
  const isHigh = value === 1;

  return (
    <div className={`
      px-5 py-4 rounded-xl bg-card border transition-all min-w-[130px]
      ${isHigh ? 'border-primary/60' : 'border-node-border'}
    `}>
      {/* Data inputs */}
      <Handle type="target" position={Position.Left} id="a" style={{ top: '12%' }} />
      <Handle type="target" position={Position.Left} id="b" style={{ top: '28%' }} />
      <Handle type="target" position={Position.Left} id="c" style={{ top: '44%' }} />
      <Handle type="target" position={Position.Left} id="d" style={{ top: '60%' }} />
      {/* Select inputs */}
      <Handle type="target" position={Position.Left} id="e" style={{ top: '76%' }} />
      <Handle type="target" position={Position.Left} id="f" style={{ top: '92%' }} />
      
      <div className="flex flex-col items-center gap-1">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em]">4×1 MUX</span>
        <div className="text-[10px] text-muted-foreground font-mono space-y-0.5">
          <div>D0-D3 →</div>
          <div>S0,S1 →</div>
        </div>
        <span className={`text-lg font-mono font-bold ${isHigh ? 'text-primary' : 'text-muted-foreground'}`}>
          Y={value}
        </span>
      </div>
      
      <Handle type="source" position={Position.Right} id="out" />
    </div>
  );
};

export const nodeTypes = {
  gate: GateNode,
  input: InputNode,
  output: OutputNode,
  clock: ClockNode,
  dff: DFlipFlopNode,
  jkff: JKFlipFlopNode,
  decoder: DecoderNode,
  mux: MuxNode,
};
