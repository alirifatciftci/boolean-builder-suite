// Karnaugh Map Solver with proper grouping and SOP simplification

const variables2 = ['A', 'B'];
const variables3 = ['A', 'B', 'C'];
const variables4 = ['A', 'B', 'C', 'D'];

// Gray code orderings for K-Map layout
export const grayCode2 = [0, 1];
export const grayCode4 = [0, 1, 3, 2]; // 00, 01, 11, 10

// Get K-Map cell indices for different variable counts
export const getKMapIndices = (varCount: number): number[][] => {
  if (varCount === 2) {
    return [[0, 1], [2, 3]];
  }
  if (varCount === 3) {
    // 2 rows (A) x 4 cols (BC in gray code)
    // Row 0 (A=0): BC = 00,01,11,10 → minterms 0,1,3,2
    // Row 1 (A=1): BC = 00,01,11,10 → minterms 4,5,7,6
    return [
      [0, 1, 3, 2],
      [4, 5, 7, 6],
    ];
  }
  // 4 variables: AB rows (gray) x CD cols (gray)
  // AB: 00,01,11,10 → 0,1,3,2
  // CD: 00,01,11,10 → 0,1,3,2
  return [
    [0, 1, 3, 2],
    [4, 5, 7, 6],
    [12, 13, 15, 14],
    [8, 9, 11, 10],
  ];
};

export const getRowHeaders = (varCount: number): string[] => {
  if (varCount === 2) return ['0', '1'];
  if (varCount === 3) return ['0', '1'];
  return ['00', '01', '11', '10'];
};

export const getColHeaders = (varCount: number): string[] => {
  if (varCount === 2) return ['0', '1'];
  if (varCount === 3) return ['00', '01', '11', '10'];
  return ['00', '01', '11', '10'];
};

export const getRowLabel = (varCount: number): string => {
  if (varCount === 2) return 'A';
  if (varCount === 3) return 'A';
  return 'AB';
};

export const getColLabel = (varCount: number): string => {
  if (varCount === 2) return 'B';
  if (varCount === 3) return 'BC';
  return 'CD';
};

// Quine-McCluskey style SOP simplification
export const solveKMap = (truthTable: number[], varCount: number): string => {
  const vars = varCount === 2 ? variables2 : varCount === 3 ? variables3 : variables4;
  const totalMinterms = 1 << varCount;

  const minterms = truthTable
    .slice(0, totalMinterms)
    .map((v, i) => (v === 1 ? i : -1))
    .filter(v => v !== -1);

  const dontCares = truthTable
    .slice(0, totalMinterms)
    .map((v, i) => (v === 2 ? i : -1))
    .filter(v => v !== -1);

  if (minterms.length === 0) return '0';
  if (minterms.length + dontCares.length === totalMinterms) return '1';

  const allTerms = [...minterms, ...dontCares];

  // Group by number of 1s
  type Implicant = { bits: string; minterms: Set<number>; used: boolean };

  const toBin = (n: number) => n.toString(2).padStart(varCount, '0');

  let implicants: Implicant[] = allTerms.map(m => ({
    bits: toBin(m),
    minterms: new Set([m]),
    used: false,
  }));

  const primeImplicants: Implicant[] = [];

  // Combine implicants
  let changed = true;
  while (changed) {
    changed = false;
    const next: Implicant[] = [];
    const usedInRound = new Set<number>();

    for (let i = 0; i < implicants.length; i++) {
      for (let j = i + 1; j < implicants.length; j++) {
        const a = implicants[i].bits;
        const b = implicants[j].bits;
        let diffPos = -1;
        let diffs = 0;
        for (let k = 0; k < varCount; k++) {
          if (a[k] !== b[k]) {
            diffs++;
            diffPos = k;
          }
        }
        if (diffs === 1) {
          const newBits = a.substring(0, diffPos) + '-' + a.substring(diffPos + 1);
          const combined = new Set([...implicants[i].minterms, ...implicants[j].minterms]);
          // Check if already exists
          const exists = next.some(n => n.bits === newBits);
          if (!exists) {
            next.push({ bits: newBits, minterms: combined, used: false });
          }
          usedInRound.add(i);
          usedInRound.add(j);
          changed = true;
        }
      }
    }

    // Unused implicants are prime
    implicants.forEach((imp, idx) => {
      if (!usedInRound.has(idx)) {
        primeImplicants.push(imp);
      }
    });

    implicants = next;
  }
  // Add any remaining
  primeImplicants.push(...implicants);

  // Remove duplicates
  const uniquePIs: Implicant[] = [];
  const seen = new Set<string>();
  for (const pi of primeImplicants) {
    if (!seen.has(pi.bits)) {
      seen.add(pi.bits);
      uniquePIs.push(pi);
    }
  }

  // Petrick's method (greedy cover)
  const uncovered = new Set(minterms);
  const selected: Implicant[] = [];

  // Essential prime implicants first
  for (const m of minterms) {
    const covering = uniquePIs.filter(pi => pi.minterms.has(m));
    if (covering.length === 1) {
      if (!selected.includes(covering[0])) {
        selected.push(covering[0]);
        covering[0].minterms.forEach(mt => uncovered.delete(mt));
      }
    }
  }

  // Greedy cover remaining
  while (uncovered.size > 0) {
    let best: Implicant | null = null;
    let bestCount = 0;
    for (const pi of uniquePIs) {
      if (selected.includes(pi)) continue;
      const count = [...pi.minterms].filter(m => uncovered.has(m)).length;
      if (count > bestCount) {
        bestCount = count;
        best = pi;
      }
    }
    if (!best) break;
    selected.push(best);
    best.minterms.forEach(mt => uncovered.delete(mt));
  }

  // Convert to algebraic form
  const terms = selected.map(pi => {
    const literals: string[] = [];
    for (let i = 0; i < varCount; i++) {
      if (pi.bits[i] === '1') literals.push(vars[i]);
      else if (pi.bits[i] === '0') literals.push(vars[i] + "'");
    }
    return literals.length === 0 ? '1' : literals.join('');
  });

  return terms.join(' + ');
};
