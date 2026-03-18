import { LogicType } from '@/store/circuitStore';
import { Link } from 'react-router-dom';
import {
  ToggleLeft, Lightbulb, Cpu, Box, GitFork,
  Shuffle, Binary, Plus, Monitor,
} from 'lucide-react';
import { type LucideIcon } from 'lucide-react';

interface ComponentItem {
  type: LogicType;
  label: string;
  icon: LucideIcon;
  nodeType: string;
}

interface ComponentCategory {
  title: string;
  items: ComponentItem[];
}

export const componentLibrary: ComponentCategory[] = [
  {
    title: 'Giriş/Çıkış Bileşenleri',
    items: [
      { type: 'INPUT', label: 'Anahtar (Toggle)', icon: ToggleLeft, nodeType: 'input' },
      { type: 'OUTPUT', label: 'LED Çıkış', icon: Lightbulb, nodeType: 'output' },
      { type: 'CLOCK', label: 'Saat Sinyali', icon: Cpu, nodeType: 'clock' },
    ],
  },
  {
    title: 'Temel Kapılar',
    items: [
      { type: 'AND', label: 'AND Gate', icon: Box, nodeType: 'gate' },
      { type: 'OR', label: 'OR Gate', icon: Box, nodeType: 'gate' },
      { type: 'NOT', label: 'NOT Gate', icon: Box, nodeType: 'gate' },
      { type: 'XOR', label: 'XOR Gate', icon: Box, nodeType: 'gate' },
      { type: 'NAND', label: 'NAND Gate', icon: Box, nodeType: 'gate' },
      { type: 'NOR', label: 'NOR Gate', icon: Box, nodeType: 'gate' },
      { type: 'XNOR', label: 'XNOR Gate', icon: Box, nodeType: 'gate' },
    ],
  },
  {
    title: 'Ardışıl Mantık',
    items: [
      { type: 'D_FF', label: 'D Flip-Flop', icon: GitFork, nodeType: 'dff' },
      { type: 'JK_FF', label: 'JK Flip-Flop', icon: GitFork, nodeType: 'jkff' },
      { type: 'SR_FF', label: 'SR Flip-Flop', icon: GitFork, nodeType: 'srff' },
      { type: 'T_FF', label: 'T Flip-Flop', icon: GitFork, nodeType: 'tff' },
    ],
  },
  {
    title: 'MSI Bileşenler',
    items: [
      { type: 'DECODER_2x4', label: '2×4 Decoder', icon: Binary, nodeType: 'decoder' },
      { type: 'MUX_4x1', label: '4×1 Mux', icon: Shuffle, nodeType: 'mux' },
      { type: 'HALF_ADDER', label: 'Half Adder', icon: Plus, nodeType: 'halfadder' },
      { type: 'FULL_ADDER', label: 'Full Adder', icon: Plus, nodeType: 'fulladder' },
      { type: 'SEVEN_SEG', label: '7-Segment', icon: Monitor, nodeType: 'sevenseg' },
    ],
  },
];

interface SidebarProps {
  className?: string;
}

const SidebarItem = ({ item }: { item: ComponentItem }) => {
  const onDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData('application/logictype', item.type);
    event.dataTransfer.setData('application/nodetype', item.nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const Icon = item.icon;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group flex items-center gap-3 p-2.5 rounded-lg bg-background/50 border border-border/50 hover:border-primary/40 hover:bg-secondary/50 transition-all cursor-grab active:cursor-grabbing"
    >
      <div className="p-1.5 rounded-md bg-secondary group-hover:bg-primary/10 group-hover:text-primary transition-colors">
        <Icon size={16} />
      </div>
      <span className="text-sm font-medium text-secondary-foreground">{item.label}</span>
    </div>
  );
};

export const ComponentSidebar = ({ className }: SidebarProps) => {
  return (
    <aside className={`w-64 border-r border-border bg-card p-5 flex flex-col gap-6 overflow-y-auto custom-scrollbar ${className}`}>
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_hsl(160_84%_39%/0.4)]">
          <Cpu size={16} className="text-primary-foreground" />
        </div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">
          Volt<span className="text-primary">Logic</span>
        </h1>
      </Link>

      {/* Component categories */}
      <div className="space-y-5">
        {componentLibrary.map((cat) => (
          <section key={cat.title}>
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2.5">
              {cat.title}
            </h3>
            <div className="grid gap-1.5">
              {cat.items.map((item) => (
                <SidebarItem key={item.type} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Info card */}
      <div className="mt-auto p-3.5 rounded-xl bg-background/50 border border-border">
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Bileşenleri tuval üzerine sürükleyip bağlantı noktalarını birleştirerek devre kurun. Simülasyon gerçek zamanlı çalışır.
        </p>
      </div>
    </aside>
  );
};
