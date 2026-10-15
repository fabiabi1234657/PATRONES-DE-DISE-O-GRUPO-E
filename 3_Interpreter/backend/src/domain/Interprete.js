// PATRÓN INTERPRETER (dominio puro)
// Gramática del lenguaje de filtros:
//   expresion   := termino ( "OR" termino )*
//   termino     := factor ( "AND" factor )*
//   factor      := "NOT" factor | "(" expresion ")" | comparacion
//   comparacion := CAMPO OPERADOR VALOR
//   OPERADOR    := = | != | > | < | >= | <= | CONTAINS

// ---- Expresión abstracta ----
export class Expresion {
  interpretar(contexto) { throw new Error("interpretar() no implementado"); }
}

// ---- Expresión terminal ----
export class Comparacion extends Expresion {
  constructor(campo, operador, valor) {
    super();
    this.tipo = "COMPARACION";
    this.campo = campo;
    this.operador = operador;
    this.valor = valor;
  }
  interpretar(producto) {
    const actual = producto[this.campo];
    if (actual === undefined) throw new Error(`Campo desconocido: "${this.campo}"`);
    const a = typeof actual === "string" ? actual.toLowerCase() : actual;
    const v = typeof this.valor === "string" ? this.valor.toLowerCase() : this.valor;
    switch (this.operador) {
      case "=": return a === v;
      case "!=": return a !== v;
      case ">": return a > v;
      case "<": return a < v;
      case ">=": return a >= v;
      case "<=": return a <= v;
      case "CONTAINS": return String(a).includes(String(v));
      default: throw new Error(`Operador no soportado: ${this.operador}`);
    }
  }
}

// ---- Expresiones no terminales ----
export class And extends Expresion {
  constructor(izq, der) { super(); this.tipo = "AND"; this.izq = izq; this.der = der; }
  interpretar(c) { return this.izq.interpretar(c) && this.der.interpretar(c); }
}
export class Or extends Expresion {
  constructor(izq, der) { super(); this.tipo = "OR"; this.izq = izq; this.der = der; }
  interpretar(c) { return this.izq.interpretar(c) || this.der.interpretar(c); }
}
export class Not extends Expresion {
  constructor(expr) { super(); this.tipo = "NOT"; this.expr = expr; }
  interpretar(c) { return !this.expr.interpretar(c); }
}

// ---- Analizador léxico ----
export function tokenizar(texto) {
  const regex = /\s*(>=|<=|!=|=|>|<|\(|\)|"[^"]*"|-?\d+(?:\.\d+)?|[A-Za-zÁÉÍÓÚáéíóúñÑ_]+)/gy;
  const tokens = [];
  let m;
  let fin = 0;
  while ((m = regex.exec(texto)) !== null) {
    tokens.push(m[1]);
    fin = regex.lastIndex;
  }
  if (texto.slice(fin).trim() !== "") {
    throw new Error(`Carácter inesperado cerca de: "${texto.slice(fin).trim().slice(0, 10)}"`);
  }
  return tokens;
}

// ---- Analizador sintáctico (descenso recursivo) → construye el AST ----
const OPERADORES = ["=", "!=", ">", "<", ">=", "<=", "CONTAINS"];

export class Parser {
  #tokens;
  #pos = 0;

  constructor(texto) { this.#tokens = tokenizar(texto); }

  parsear() {
    if (this.#tokens.length === 0) throw new Error("La consulta está vacía");
    const ast = this.#expresion();
    if (this.#pos < this.#tokens.length) throw new Error(`Token inesperado: "${this.#tokens[this.#pos]}"`);
    return ast;
  }

  #mirar() { return this.#tokens[this.#pos]; }
  #es(palabra) { return this.#mirar()?.toUpperCase() === palabra; }
  #tomar() { return this.#tokens[this.#pos++]; }

  #expresion() {
    let nodo = this.#termino();
    while (this.#es("OR")) { this.#tomar(); nodo = new Or(nodo, this.#termino()); }
    return nodo;
  }

  #termino() {
    let nodo = this.#factor();
    while (this.#es("AND")) { this.#tomar(); nodo = new And(nodo, this.#factor()); }
    return nodo;
  }

  #factor() {
    if (this.#es("NOT")) { this.#tomar(); return new Not(this.#factor()); }
    if (this.#mirar() === "(") {
      this.#tomar();
      const nodo = this.#expresion();
      if (this.#tomar() !== ")") throw new Error('Se esperaba ")"');
      return nodo;
    }
    return this.#comparacion();
  }

  #comparacion() {
    const campo = this.#tomar();
    const op = this.#tomar();
    const valorRaw = this.#tomar();
    if (!campo || !op || valorRaw === undefined) throw new Error("Comparación incompleta");
    const operador = op.toUpperCase();
    if (!OPERADORES.includes(operador)) throw new Error(`Operador inválido: "${op}"`);
    const valor = valorRaw.startsWith('"') ? valorRaw.slice(1, -1)
      : isNaN(Number(valorRaw)) ? valorRaw : Number(valorRaw);
    return new Comparacion(campo.toLowerCase(), operador, valor);
  }
}
