// Boolean expression parser and evaluator
// Supports: AND (. or *), OR (+), NOT (', !, ~), XOR (^), parentheses
// Variables: A-Z (case insensitive)

type Token =
  | { type: 'VAR'; name: string }
  | { type: 'NOT' }
  | { type: 'AND' }
  | { type: 'OR' }
  | { type: 'XOR' }
  | { type: 'LPAREN' }
  | { type: 'RPAREN' };

type ASTNode =
  | { kind: 'var'; name: string }
  | { kind: 'not'; operand: ASTNode }
  | { kind: 'and'; left: ASTNode; right: ASTNode }
  | { kind: 'or'; left: ASTNode; right: ASTNode }
  | { kind: 'xor'; left: ASTNode; right: ASTNode };

function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[A-Za-z]/.test(ch)) {
      tokens.push({ type: 'VAR', name: ch.toUpperCase() });
      i++;
      // Check for post-fix NOT (')
      while (i < expr.length && expr[i] === "'") {
        tokens.push({ type: 'NOT' });
        i++;
      }
      continue;
    }
    if (ch === '(' ) { tokens.push({ type: 'LPAREN' }); i++; continue; }
    if (ch === ')') {
      tokens.push({ type: 'RPAREN' });
      i++;
      // Check for post-fix NOT after paren
      while (i < expr.length && expr[i] === "'") {
        tokens.push({ type: 'NOT' });
        i++;
      }
      continue;
    }
    if (ch === "'" || ch === '!' || ch === '~') { tokens.push({ type: 'NOT' }); i++; continue; }
    if (ch === '+') { tokens.push({ type: 'OR' }); i++; continue; }
    if (ch === '^') { tokens.push({ type: 'XOR' }); i++; continue; }
    if (ch === '.' || ch === '*') { tokens.push({ type: 'AND' }); i++; continue; }
    i++; // skip unknown
  }

  // Insert implicit AND between adjacent operands: VAR VAR, VAR LPAREN, RPAREN VAR, RPAREN LPAREN, NOT VAR
  const result: Token[] = [];
  for (let j = 0; j < tokens.length; j++) {
    result.push(tokens[j]);
    if (j + 1 < tokens.length) {
      const cur = tokens[j];
      const next = tokens[j + 1];
      const curIsOperand = cur.type === 'VAR' || cur.type === 'RPAREN';
      const nextIsOperand = next.type === 'VAR' || next.type === 'LPAREN' || next.type === 'NOT';
      if (curIsOperand && nextIsOperand) {
        result.push({ type: 'AND' });
      }
    }
  }
  return result;
}

// Recursive descent parser
// Precedence: OR (lowest) < XOR < AND < NOT (highest)
class Parser {
  private tokens: Token[];
  private pos: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.pos = 0;
  }

  private peek(): Token | null {
    return this.pos < this.tokens.length ? this.tokens[this.pos] : null;
  }

  private consume(): Token {
    return this.tokens[this.pos++];
  }

  parse(): ASTNode {
    const node = this.parseOr();
    return node;
  }

  private parseOr(): ASTNode {
    let left = this.parseXor();
    while (this.peek()?.type === 'OR') {
      this.consume();
      const right = this.parseXor();
      left = { kind: 'or', left, right };
    }
    return left;
  }

  private parseXor(): ASTNode {
    let left = this.parseAnd();
    while (this.peek()?.type === 'XOR') {
      this.consume();
      const right = this.parseAnd();
      left = { kind: 'xor', left, right };
    }
    return left;
  }

  private parseAnd(): ASTNode {
    let left = this.parseUnary();
    while (this.peek()?.type === 'AND') {
      this.consume();
      const right = this.parseUnary();
      left = { kind: 'and', left, right };
    }
    return left;
  }

  private parseUnary(): ASTNode {
    const tok = this.peek();
    if (tok?.type === 'NOT') {
      this.consume();
      const operand = this.parseUnary();
      return { kind: 'not', operand };
    }
    return this.parsePrimary();
  }

  private parsePrimary(): ASTNode {
    const tok = this.peek();
    if (!tok) throw new Error('Unexpected end of expression');

    if (tok.type === 'VAR') {
      this.consume();
      let node: ASTNode = { kind: 'var', name: tok.name };
      // Handle post-fix NOT already turned into tokens
      while (this.peek()?.type === 'NOT') {
        this.consume();
        node = { kind: 'not', operand: node };
      }
      return node;
    }

    if (tok.type === 'LPAREN') {
      this.consume();
      const node = this.parseOr();
      if (this.peek()?.type === 'RPAREN') {
        this.consume();
      }
      // Handle post-fix NOT after parenthesis
      let result: ASTNode = node;
      while (this.peek()?.type === 'NOT') {
        this.consume();
        result = { kind: 'not', operand: result };
      }
      return result;
    }

    throw new Error(`Unexpected token: ${tok.type}`);
  }
}

function evaluate(node: ASTNode, vars: Record<string, number>): number {
  switch (node.kind) {
    case 'var': return vars[node.name] ?? 0;
    case 'not': return evaluate(node.operand, vars) === 0 ? 1 : 0;
    case 'and': return evaluate(node.left, vars) & evaluate(node.right, vars);
    case 'or': return evaluate(node.left, vars) | evaluate(node.right, vars);
    case 'xor': return evaluate(node.left, vars) ^ evaluate(node.right, vars);
  }
}

export function extractVariables(expr: string): string[] {
  const vars = new Set<string>();
  for (const ch of expr) {
    if (/[A-Za-z]/.test(ch)) vars.add(ch.toUpperCase());
  }
  return [...vars].sort();
}

export function generateTruthTable(expr: string): { variables: string[]; rows: { inputs: number[]; output: number }[] } | null {
  try {
    const variables = extractVariables(expr);
    if (variables.length === 0 || variables.length > 6) return null;

    const tokens = tokenize(expr);
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const totalRows = 1 << variables.length;
    const rows: { inputs: number[]; output: number }[] = [];

    for (let i = 0; i < totalRows; i++) {
      const vars: Record<string, number> = {};
      const inputs: number[] = [];
      for (let j = 0; j < variables.length; j++) {
        const val = (i >> (variables.length - 1 - j)) & 1;
        vars[variables[j]] = val;
        inputs.push(val);
      }
      rows.push({ inputs, output: evaluate(ast, vars) });
    }

    return { variables, rows };
  } catch {
    return null;
  }
}

export function evaluateExpression(expr: string, vars: Record<string, number>): number | null {
  try {
    const tokens = tokenize(expr);
    const parser = new Parser(tokens);
    const ast = parser.parse();
    return evaluate(ast, vars);
  } catch {
    return null;
  }
}
