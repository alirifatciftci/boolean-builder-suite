import { useCallback, useEffect, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ConnectionMode,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useCircuitStore, LogicType } from '@/store/circuitStore';
import { nodeTypes } from '@/components/circuit/CircuitNodes';

interface CanvasProps {
  className?: string;
}

export const CircuitCanvas = ({ className }: CanvasProps) => {
  const {
    nodes, edges, isRunning,
    setNodes, setEdges, onConnect, tick,
  } = useCircuitStore();

  const addNode = useCircuitStore((s) => s.addNode);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(tick, 120);
    return () => clearInterval(interval);
  }, [isRunning, tick]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const logicType = event.dataTransfer.getData('application/logictype') as LogicType;
      const nodeType = event.dataTransfer.getData('application/nodetype');
      if (!logicType || !nodeType) return;

      const bounds = reactFlowWrapper.current?.getBoundingClientRect();
      const x = event.clientX - (bounds?.left ?? 0);
      const y = event.clientY - (bounds?.top ?? 0);

      addNode({
        id: `${logicType}-${Date.now()}`,
        type: nodeType,
        position: { x, y },
        data: { label: logicType, logicType },
      });
    },
    [addNode]
  );

  // Dynamic edge styling based on signal value
  const nodeValues = useCircuitStore((s) => s.nodeValues);
  const styledEdges = edges.map(e => ({
    ...e,
    animated: (nodeValues[e.source] ?? 0) === 1,
    style: {
      strokeWidth: 2.5,
      stroke: (nodeValues[e.source] ?? 0) === 1
        ? 'hsl(160, 84%, 39%)'
        : 'hsl(215, 20%, 30%)',
    },
  }));

  return (
    <div
      ref={reactFlowWrapper}
      className={`flex-1 ${className}`}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        onNodesChange={setNodes}
        onEdgesChange={setEdges}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
        style={{ background: 'hsl(222, 59%, 2.5%)' }}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background color="hsl(215, 20%, 10%)" gap={20} size={1} />
        <Controls />
        <MiniMap
          nodeColor={() => 'hsl(160, 84%, 39%)'}
          maskColor="rgba(2, 6, 23, 0.7)"
        />
      </ReactFlow>
    </div>
  );
};
