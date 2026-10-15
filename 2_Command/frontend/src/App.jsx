import { useEffect, useState } from "react";

const api = async (url, method = "GET", body) => {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body && JSON.stringify(body) });
  const data = await r.json();
  if (!r.ok) throw new Error(data.error);
  return data;
};

export default function App() {
  const [est, setEst] = useState({ cuentas: [], historial: [], puedeDeshacer: false, puedeRehacer: false });
  const [error, setError] = useState("");
  const [f, setF] = useState({ tipo: "depositar", cuenta: 1, origen: 1, destino: 2, monto: "" });

  const run = async (fn) => {
    try { setEst(await fn()); setError(""); } catch (e) { setError(e.message); }
  };
  useEffect(() => { run(() => api("/api/estado")); }, []);

  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const sel = (k) => (
    <select value={f[k]} onChange={set(k)}>
      {est.cuentas.map((c) => <option key={c.id} value={c.id}>{c.id} · {c.titular}</option>)}
    </select>
  );

  return (
    <main>
      <h1>Command · Operaciones bancarias con deshacer/rehacer</h1>

      <div className="row">
        {est.cuentas.map((c) => (
          <div key={c.id} className="card"><b>{c.titular}</b> (cuenta {c.id})<h2>${c.saldo}</h2></div>
        ))}
      </div>

      <div className="card">
        <select value={f.tipo} onChange={set("tipo")}>
          <option value="depositar">Depositar</option>
          <option value="retirar">Retirar</option>
          <option value="transferir">Transferir</option>
        </select>
        {f.tipo === "transferir" ? <>{sel("origen")} → {sel("destino")}</> : sel("cuenta")}
        <input type="number" placeholder="Monto" value={f.monto} onChange={set("monto")} />
        <button onClick={() => run(() => api(`/api/comandos/${f.tipo}`, "POST", f))}>Ejecutar comando</button>
        <button disabled={!est.puedeDeshacer} onClick={() => run(() => api("/api/deshacer", "POST"))}>↶ Deshacer</button>
        <button disabled={!est.puedeRehacer} onClick={() => run(() => api("/api/rehacer", "POST"))}>↷ Rehacer</button>
        {error && <p className="err">{error}</p>}
      </div>

      <div className="card">
        <h3>Historial de comandos</h3>
        <ol>{est.historial.map((h, i) => <li key={i}>{h}</li>)}</ol>
        {!est.historial.length && <p className="sub">Sin comandos ejecutados</p>}
      </div>
    </main>
  );
}
