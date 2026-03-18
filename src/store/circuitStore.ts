import { create } from 'zustand';
import {
  Node,
  Edge,
  Connection,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  NodeChange,
  EdgeChange,
} from 'reactflow';

export type LogicType =
  | 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR'
  | 'INPUT' | 'OUTPUT' | 'CLOCK'
  | 'D_FF' | 'JK_FF' | 'SR_FF' | 'T_FF'
  | 'DECODER_2x4' | 'MUX_4x1'
  | 'HALF_ADDER' | 'FULL_ADDER'
  | 'SEVEN_SEG';

export interface NodeData {
  label: string;
  logicType: LogicType;
  inputCount?: number;
}

interface FlipFlopState {
  q: number;
  prevClock: number;
}

interface SignalHistory {
  nodeId: string;
  values: number[];
}

interface CircuitState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  nodeValues: Record<string, number>;
  flipFlopStates: Record<string, FlipFlopState>;
  signalHistory: SignalHistory[];
  isRunning: boolean;
  clockSignal: number;
  tickCount: number;
  setNodes: (changes: NodeChange[]) => void;
  setEdges: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (node: Node<NodeData>) => void;
  toggleRunning: () => void;
  updateNodeValue: (id: string, value: number) => void;
  clearCanvas: () => void;
  tick: () => void;
  deleteSelected: () => void;
  saveCircuit: (name: string) => void;
  loadCircuit: (name: string) => boolean;
  getSavedCircuits: () => string[];
  deleteSavedCircuit: (name: string) => void;
  exportCircuit: () => string;
  importCircuit: (json: string) => boolean;
}

// Evaluate a basic gate given input values
const evaluateGate = (type: LogicType, inputs: number[]): number => {
  switch (type) {
    case 'AND':
      return inputs.length > 0 && inputs.every(v => v === 1) ? 1 : 0;
    case 'OR':
      return inputs.some(v => v === 1) ? 1 : 0;
    case 'NOT':
      return (inputs[0] ?? 0) === 1 ? 0 : 1;
    case 'NAND':
      return inputs.length > 0 && inputs.every(v => v === 1) ? 0 : 1;
    case 'NOR':
      return inputs.some(v => v === 1) ? 0 : 1;
    case 'XOR':
      return inputs.reduce((a, v) => a ^ v, 0);
    case 'XNOR':
      return inputs.length > 0 ? (inputs.reduce((a, v) => a ^ v, 0) === 0 ? 1 : 0) : 1;
    case 'OUTPUT':
      return inputs[0] ?? 0;
    default:
      return 0;
  }
};

// Topological sort for evaluation order
const topoSort = (nodes: Node[], edges: Edge[]): string[] => {
  const adj = new Map<string, string[]>();
  const inDeg = new Map<string, number>();
  nodes.forEach(n => {
    adj.set(n.id, []);
    inDeg.set(n.id, 0);
  });
  edges.forEach(e => {
    adj.get(e.source)?.push(e.target);
    inDeg.set(e.target, (inDeg.get(e.target) || 0) + 1);
  });
  const queue = nodes.filter(n => (inDeg.get(n.id) || 0) === 0).map(n => n.id);
  const sorted: string[] = [];
  while (queue.length > 0) {
    const id = queue.shift()!;
    sorted.push(id);
    for (const neighbor of adj.get(id) || []) {
      const d = (inDeg.get(neighbor) || 1) - 1;
      inDeg.set(neighbor, d);
      if (d === 0) queue.push(neighbor);
    }
  }
  // Add any remaining (cycles) at the end
  nodes.forEach(n => {
    if (!sorted.includes(n.id)) sorted.push(n.id);
  });
  return sorted;
};

export const useCircuitStore = create<CircuitState>((set, get) => ({
  nodes: [],
  edges: [],
  nodeValues: {},
  flipFlopStates: {},
  signalHistory: [],
  isRunning: true,
  clockSignal: 0,
  tickCount: 0,

  setNodes: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as Node<NodeData>[] })),

  setEdges: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) })),

  onConnect: (connection) =>
    set((s) => ({
      edges: addEdge(
        { ...connection, animated: false, style: { strokeWidth: 2.5 } },
        s.edges
      ),
    })),

  addNode: (node) => set((s) => ({ nodes: [...s.nodes, node] })),

  toggleRunning: () => set((s) => ({ isRunning: !s.isRunning })),

  updateNodeValue: (id, value) =>
    set((s) => ({ nodeValues: { ...s.nodeValues, [id]: value } })),

  clearCanvas: () => set({ nodes: [], edges: [], nodeValues: {}, flipFlopStates: {}, signalHistory: [] }),

  deleteSelected: () =>
    set((s) => {
      const selectedNodeIds = new Set(s.nodes.filter(n => n.selected).map(n => n.id));
      const selectedEdgeIds = new Set(s.edges.filter(e => e.selected).map(e => e.id));
      return {
        nodes: s.nodes.filter(n => !n.selected),
        edges: s.edges.filter(e => !e.selected && !selectedNodeIds.has(e.source) && !selectedNodeIds.has(e.target)),
      };
    }),

  tick: () => {
    const state = get();
    const newClock = state.clockSignal === 0 ? 1 : 0;
    const vals = { ...state.nodeValues };
    const ffStates = { ...state.flipFlopStates };
    const nodeMap = new Map(state.nodes.map(n => [n.id, n]));

    // Get inputs for a node by looking at handle target IDs
    const getInputsForNode = (nodeId: string): number[] => {
      const incoming = state.edges.filter(e => e.target === nodeId);
      // Sort by targetHandle to maintain input order
      incoming.sort((a, b) => (a.targetHandle || '').localeCompare(b.targetHandle || ''));
      return incoming.map(e => vals[e.source] ?? 0);
    };

    const order = topoSort(state.nodes, state.edges);

    for (const nodeId of order) {
      const node = nodeMap.get(nodeId);
      if (!node) continue;
      const lt = node.data.logicType;

      if (lt === 'INPUT') {
        // Maintained by user toggle, keep current value
        if (vals[nodeId] === undefined) vals[nodeId] = 0;
      } else if (lt === 'CLOCK') {
        vals[nodeId] = newClock;
      } else if (lt === 'D_FF') {
        const inputs = getInputsForNode(nodeId);
        // inputs[0] = D, inputs[1] = CLK (or use global clock)
        const d = inputs[0] ?? 0;
        const clk = inputs[1] ?? newClock;
        const prev = ffStates[nodeId] || { q: 0, prevClock: 0 };
        // Rising edge detection
        if (clk === 1 && prev.prevClock === 0) {
          ffStates[nodeId] = { q: d, prevClock: clk };
        } else {
          ffStates[nodeId] = { ...prev, prevClock: clk };
        }
        vals[nodeId] = ffStates[nodeId].q;
      } else if (lt === 'JK_FF') {
        const inputs = getInputsForNode(nodeId);
        // inputs[0]=J, inputs[1]=K, inputs[2]=CLK
        const j = inputs[0] ?? 0;
        const k = inputs[1] ?? 0;
        const clk = inputs[2] ?? newClock;
        const prev = ffStates[nodeId] || { q: 0, prevClock: 0 };
        if (clk === 1 && prev.prevClock === 0) {
          let newQ = prev.q;
          if (j === 0 && k === 0) newQ = prev.q;
          else if (j === 0 && k === 1) newQ = 0;
          else if (j === 1 && k === 0) newQ = 1;
          else newQ = prev.q === 0 ? 1 : 0; // Toggle
          ffStates[nodeId] = { q: newQ, prevClock: clk };
        } else {
          ffStates[nodeId] = { ...prev, prevClock: clk };
        }
        vals[nodeId] = ffStates[nodeId].q;
      } else if (lt === 'DECODER_2x4') {
        const inputs = getInputsForNode(nodeId);
        const a = inputs[0] ?? 0;
        const b = inputs[1] ?? 0;
        const idx = (a << 1) | b;
        // Store the active output line index
        vals[nodeId] = idx;
      } else if (lt === 'SR_FF') {
        const inputs = getInputsForNode(nodeId);
        // inputs[0]=S, inputs[1]=R, inputs[2]=CLK
        const s = inputs[0] ?? 0;
        const r = inputs[1] ?? 0;
        const clk = inputs[2] ?? newClock;
        const prev = ffStates[nodeId] || { q: 0, prevClock: 0 };
        if (clk === 1 && prev.prevClock === 0) {
          let newQ = prev.q;
          if (s === 0 && r === 0) newQ = prev.q;        // Hold
          else if (s === 0 && r === 1) newQ = 0;         // Reset
          else if (s === 1 && r === 0) newQ = 1;         // Set
          else newQ = prev.q;                             // Invalid (hold)
          ffStates[nodeId] = { q: newQ, prevClock: clk };
        } else {
          ffStates[nodeId] = { ...prev, prevClock: clk };
        }
        vals[nodeId] = ffStates[nodeId].q;
      } else if (lt === 'T_FF') {
        const inputs = getInputsForNode(nodeId);
        // inputs[0]=T, inputs[1]=CLK
        const t = inputs[0] ?? 0;
        const clk = inputs[1] ?? newClock;
        const prev = ffStates[nodeId] || { q: 0, prevClock: 0 };
        if (clk === 1 && prev.prevClock === 0) {
          const newQ = t === 1 ? (prev.q === 0 ? 1 : 0) : prev.q;
          ffStates[nodeId] = { q: newQ, prevClock: clk };
        } else {
          ffStates[nodeId] = { ...prev, prevClock: clk };
        }
        vals[nodeId] = ffStates[nodeId].q;
      } else if (lt === 'MUX_4x1') {
        const inputs = getInputsForNode(nodeId);
        const d0 = inputs[0] ?? 0;
        const d1 = inputs[1] ?? 0;
        const d2 = inputs[2] ?? 0;
        const d3 = inputs[3] ?? 0;
        const s0 = inputs[4] ?? 0;
        const s1 = inputs[5] ?? 0;
        const sel = (s1 << 1) | s0;
        vals[nodeId] = [d0, d1, d2, d3][sel];
      } else if (lt === 'HALF_ADDER') {
        const inputs = getInputsForNode(nodeId);
        const a = inputs[0] ?? 0;
        const b = inputs[1] ?? 0;
        // Store sum in lower bit, carry in upper bit: val = carry * 2 + sum
        vals[nodeId] = ((a & b) << 1) | (a ^ b);
      } else if (lt === 'FULL_ADDER') {
        const inputs = getInputsForNode(nodeId);
        const a = inputs[0] ?? 0;
        const b = inputs[1] ?? 0;
        const cin = inputs[2] ?? 0;
        const sum = a ^ b ^ cin;
        const cout = (a & b) | (b & cin) | (a & cin);
        vals[nodeId] = (cout << 1) | sum;
      } else if (lt === 'SEVEN_SEG') {
        const inputs = getInputsForNode(nodeId);
        // 4-bit BCD input
        const val = ((inputs[0] ?? 0) << 3) | ((inputs[1] ?? 0) << 2) | ((inputs[2] ?? 0) << 1) | (inputs[3] ?? 0);
        vals[nodeId] = val & 0xF;
      } else {
        const inputs = getInputsForNode(nodeId);
        vals[nodeId] = evaluateGate(lt, inputs);
      }
    }

    // Update signal history (keep last 64 ticks)
    const MAX_HISTORY = 64;
    const history = [...state.signalHistory];
    const trackedNodes = state.nodes.filter(n =>
      ['INPUT', 'OUTPUT', 'CLOCK', 'D_FF', 'JK_FF', 'SR_FF', 'T_FF'].includes(n.data.logicType)
    );

    for (const node of trackedNodes) {
      let entry = history.find(h => h.nodeId === node.id);
      if (!entry) {
        entry = { nodeId: node.id, values: [] };
        history.push(entry);
      }
      entry.values.push(vals[node.id] ?? 0);
      if (entry.values.length > MAX_HISTORY) {
        entry.values = entry.values.slice(-MAX_HISTORY);
      }
    }
    // Remove entries for deleted nodes
    const nodeIds = new Set(state.nodes.map(n => n.id));
    const filteredHistory = history.filter(h => nodeIds.has(h.nodeId));

    set({ clockSignal: newClock, nodeValues: vals, flipFlopStates: ffStates, signalHistory: filteredHistory, tickCount: state.tickCount + 1 });
  },

  saveCircuit: (name: string) => {
    const state = get();
    const data = { nodes: state.nodes, edges: state.edges, nodeValues: state.nodeValues };
    const saved = JSON.parse(localStorage.getItem('voltlogic_circuits') || '{}');
    saved[name] = data;
    localStorage.setItem('voltlogic_circuits', JSON.stringify(saved));
  },

  loadCircuit: (name: string) => {
    const saved = JSON.parse(localStorage.getItem('voltlogic_circuits') || '{}');
    const data = saved[name];
    if (!data) return false;
    set({ nodes: data.nodes || [], edges: data.edges || [], nodeValues: data.nodeValues || {}, flipFlopStates: {} });
    return true;
  },

  getSavedCircuits: () => {
    const saved = JSON.parse(localStorage.getItem('voltlogic_circuits') || '{}');
    return Object.keys(saved);
  },

  deleteSavedCircuit: (name: string) => {
    const saved = JSON.parse(localStorage.getItem('voltlogic_circuits') || '{}');
    delete saved[name];
    localStorage.setItem('voltlogic_circuits', JSON.stringify(saved));
  },

  exportCircuit: () => {
    const state = get();
    return JSON.stringify({ nodes: state.nodes, edges: state.edges, nodeValues: state.nodeValues }, null, 2);
  },

  importCircuit: (json: string) => {
    try {
      const data = JSON.parse(json);
      if (!data.nodes || !data.edges) return false;
      set({ nodes: data.nodes, edges: data.edges, nodeValues: data.nodeValues || {}, flipFlopStates: {} });
      return true;
    } catch {
      return false;
    }
  },
}));
