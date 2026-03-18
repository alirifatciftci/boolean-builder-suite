import { Node, Edge } from 'reactflow';
import { NodeData } from '@/store/circuitStore';

interface CircuitTemplate {
  name: string;
  description: string;
  category: string;
  nodes: Node<NodeData>[];
  edges: Edge[];
}

export const circuitTemplates: CircuitTemplate[] = [
  {
    name: 'AND Gate Demo',
    description: 'Two inputs connected to an AND gate with LED output.',
    category: 'Basic Gates',
    nodes: [
      { id: 't1', type: 'input', position: { x: 50, y: 80 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 't2', type: 'input', position: { x: 50, y: 200 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 't3', type: 'gate', position: { x: 280, y: 130 }, data: { label: 'AND', logicType: 'AND' } },
      { id: 't4', type: 'output', position: { x: 500, y: 130 }, data: { label: 'OUTPUT', logicType: 'OUTPUT' } },
    ],
    edges: [
      { id: 'te1', source: 't1', target: 't3', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'te2', source: 't2', target: 't3', sourceHandle: 'out', targetHandle: 'b' },
      { id: 'te3', source: 't3', target: 't4', sourceHandle: 'out', targetHandle: 'a' },
    ],
  },
  {
    name: 'XOR Gate (Manual)',
    description: 'XOR built from AND, OR, and NOT gates.',
    category: 'Basic Gates',
    nodes: [
      { id: 'x1', type: 'input', position: { x: 50, y: 80 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 'x2', type: 'input', position: { x: 50, y: 300 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 'x3', type: 'gate', position: { x: 230, y: 40 }, data: { label: 'NOT', logicType: 'NOT' } },
      { id: 'x4', type: 'gate', position: { x: 230, y: 320 }, data: { label: 'NOT', logicType: 'NOT' } },
      { id: 'x5', type: 'gate', position: { x: 420, y: 80 }, data: { label: 'AND', logicType: 'AND' } },
      { id: 'x6', type: 'gate', position: { x: 420, y: 260 }, data: { label: 'AND', logicType: 'AND' } },
      { id: 'x7', type: 'gate', position: { x: 620, y: 170 }, data: { label: 'OR', logicType: 'OR' } },
      { id: 'x8', type: 'output', position: { x: 820, y: 170 }, data: { label: 'OUTPUT', logicType: 'OUTPUT' } },
    ],
    edges: [
      { id: 'xe1', source: 'x1', target: 'x3', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'xe2', source: 'x2', target: 'x4', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'xe3', source: 'x3', target: 'x5', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'xe4', source: 'x2', target: 'x5', sourceHandle: 'out', targetHandle: 'b' },
      { id: 'xe5', source: 'x1', target: 'x6', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'xe6', source: 'x4', target: 'x6', sourceHandle: 'out', targetHandle: 'b' },
      { id: 'xe7', source: 'x5', target: 'x7', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'xe8', source: 'x6', target: 'x7', sourceHandle: 'out', targetHandle: 'b' },
      { id: 'xe9', source: 'x7', target: 'x8', sourceHandle: 'out', targetHandle: 'a' },
    ],
  },
  {
    name: 'Half Adder',
    description: 'A + B with Sum and Carry outputs displayed on LEDs.',
    category: 'Arithmetic',
    nodes: [
      { id: 'ha1', type: 'input', position: { x: 50, y: 100 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 'ha2', type: 'input', position: { x: 50, y: 250 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 'ha3', type: 'halfadder', position: { x: 280, y: 150 }, data: { label: 'HALF_ADDER', logicType: 'HALF_ADDER' } },
      { id: 'ha4', type: 'output', position: { x: 500, y: 100 }, data: { label: 'OUTPUT', logicType: 'OUTPUT' } },
      { id: 'ha5', type: 'output', position: { x: 500, y: 250 }, data: { label: 'OUTPUT', logicType: 'OUTPUT' } },
    ],
    edges: [
      { id: 'hae1', source: 'ha1', target: 'ha3', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'hae2', source: 'ha2', target: 'ha3', sourceHandle: 'out', targetHandle: 'b' },
      { id: 'hae3', source: 'ha3', target: 'ha4', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'hae4', source: 'ha3', target: 'ha5', sourceHandle: 'out2', targetHandle: 'a' },
    ],
  },
  {
    name: 'SR Latch',
    description: 'SR Flip-Flop with clock and two inputs.',
    category: 'Sequential',
    nodes: [
      { id: 'sr1', type: 'input', position: { x: 50, y: 60 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 'sr2', type: 'input', position: { x: 50, y: 200 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 'sr3', type: 'clock', position: { x: 50, y: 340 }, data: { label: 'CLOCK', logicType: 'CLOCK' } },
      { id: 'sr4', type: 'srff', position: { x: 300, y: 160 }, data: { label: 'SR_FF', logicType: 'SR_FF' } },
      { id: 'sr5', type: 'output', position: { x: 520, y: 160 }, data: { label: 'OUTPUT', logicType: 'OUTPUT' } },
    ],
    edges: [
      { id: 'sre1', source: 'sr1', target: 'sr4', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'sre2', source: 'sr2', target: 'sr4', sourceHandle: 'out', targetHandle: 'b' },
      { id: 'sre3', source: 'sr3', target: 'sr4', sourceHandle: 'out', targetHandle: 'c' },
      { id: 'sre4', source: 'sr4', target: 'sr5', sourceHandle: 'out', targetHandle: 'a' },
    ],
  },
  {
    name: 'D Flip-Flop Counter',
    description: 'Clock-driven D Flip-Flop toggling output.',
    category: 'Sequential',
    nodes: [
      { id: 'dc1', type: 'clock', position: { x: 50, y: 180 }, data: { label: 'CLOCK', logicType: 'CLOCK' } },
      { id: 'dc2', type: 'input', position: { x: 50, y: 80 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 'dc3', type: 'dff', position: { x: 280, y: 120 }, data: { label: 'D_FF', logicType: 'D_FF' } },
      { id: 'dc4', type: 'output', position: { x: 500, y: 120 }, data: { label: 'OUTPUT', logicType: 'OUTPUT' } },
    ],
    edges: [
      { id: 'dce1', source: 'dc2', target: 'dc3', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'dce2', source: 'dc1', target: 'dc3', sourceHandle: 'out', targetHandle: 'b' },
      { id: 'dce3', source: 'dc3', target: 'dc4', sourceHandle: 'out', targetHandle: 'a' },
    ],
  },
  {
    name: '2x4 Decoder Demo',
    description: '2-input decoder with 4 output LEDs.',
    category: 'MSI',
    nodes: [
      { id: 'dd1', type: 'input', position: { x: 50, y: 100 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 'dd2', type: 'input', position: { x: 50, y: 250 }, data: { label: 'INPUT', logicType: 'INPUT' } },
      { id: 'dd3', type: 'decoder', position: { x: 280, y: 140 }, data: { label: 'DECODER_2x4', logicType: 'DECODER_2x4' } },
    ],
    edges: [
      { id: 'dde1', source: 'dd1', target: 'dd3', sourceHandle: 'out', targetHandle: 'a' },
      { id: 'dde2', source: 'dd2', target: 'dd3', sourceHandle: 'out', targetHandle: 'b' },
    ],
  },
];
