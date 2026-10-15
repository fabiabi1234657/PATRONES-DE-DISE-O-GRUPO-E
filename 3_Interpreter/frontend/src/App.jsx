import { useState } from "react";

const EJEMPLOS = [
  'precio > 100',
  'categoria = "tecnologia" AND stock < 5',
  'precio < 100 OR categoria = "ropa"',
  'NOT categoria = "hogar" AND (precio >= 90 AND precio <= 300)',
  'nombre CONTAINS "pro" AND stock > 0',
];

// Renderiza el AST (árbol de expresiones) de forma recursiva.
function Nodo({ n }) {
  if (n.tipo === "COMPARACION") return <li>Comparación: <code>{n.campo} {n.operador} {JSON.stringify(n.valor)}</code></li>;
  const hijos = n.tipo === "NOT" ? [n.expr] : [n.izq, n.der];
  return (
    <li><b>{n.tipo}</b>
      <ul>{hijos.map((h, i) => <Nodo key={i} n={h} />)}</ul>
    </li>
  );
}
export default function App() {
  const [q, setQ] = useState(EJEMPLOS[1]);
  const [res, setRes] = useState(null);
  const [error, setError] = useState("");

  const buscar = async () => {
    const r = await fetch("/api/buscar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ consulta: q }) });
    const d = await r.json();
    if (!r.ok) { setError(d.error); setRes(null); } else { setError(""); setRes(d); }
  };

  return (
    <main>
      <h1>Interpreter · Lenguaje de filtros de productos</h1>
      <p className="sub">Campos: nombre, categoria, precio, stock · Operadores: = != &gt; &lt; &gt;= &lt;= CONTAINS · Lógicos: AND OR NOT ( )</p>

      <div className="card">
        <input className="wide" value={q} onChange={(e) => setQ(e.target.value)} />
        <button onClick={buscar}>Interpretar y buscar</button>
        <div>{EJEMPLOS.map((e) => <button key={e} className="chip" onClick={() => setQ(e)}>{e}</button>)}</div>
        {error && <p className="err">⚠ {error}</p>}
      </div>

      {res && (
        <>
          <div className="card">
            <h3>Árbol sintáctico (AST)</h3>
            <ul className="ast"><Nodo n={res.ast} /></ul>
          </div>
          <div className="card">
            <h3>Resultados ({res.resultados.length})</h3>
            <table>
              <thead><tr><th>ID</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th></tr></thead>
              <tbody>{res.resultados.map((p) => (
                <tr key={p.id}><td>{p.id}</td><td>{p.nombre}</td><td>{p.categoria}</td><td>${p.precio}</td><td>{p.stock}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </>
      )}
    </main>
  );
}
