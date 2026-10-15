import { useEffect, useState } from "react";

export default function App() {
  const [form, setForm] = useState({ solicitante: "", concepto: "", monto: "" });
  const [lista, setLista] = useState([]);

  const cargar = () => fetch("/api/gastos").then((r) => r.json()).then(setLista);
  useEffect(() => { cargar(); }, []);

  const enviar = async (e) => {
    e.preventDefault();
    await fetch("/api/gastos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ solicitante: "", concepto: "", monto: "" });
    cargar();
  };

  return (
    <main>
      <h1>Chain of Responsibility · Aprobación de gastos</h1>
      <p className="sub">Cadena: Validador → Antifraude → Supervisor (≤500) → Gerente (≤5.000) → Director (≤50.000)</p>

      <form onSubmit={enviar} className="card">
        <input placeholder="Solicitante" value={form.solicitante} onChange={(e) => setForm({ ...form, solicitante: e.target.value })} />
        <input placeholder="Concepto" value={form.concepto} onChange={(e) => setForm({ ...form, concepto: e.target.value })} />
        <input placeholder="Monto" type="number" value={form.monto} onChange={(e) => setForm({ ...form, monto: e.target.value })} />
        <button>Enviar solicitud</button>
      </form>

      {lista.map((s) => (
        <div key={s.id} className="card">
          <b>#{s.id} {s.concepto || "(sin concepto)"}</b> — {s.solicitante || "?"} — ${s.monto}
          <span className={`tag ${s.estado}`}>{s.estado}</span>
          <div className="sub">Resuelta por <b>{s.resueltaPor}</b>: {s.motivo}</div>
          <ol className="traza">
            {s.traza.map((t, i) => <li key={i}><b>{t.manejador}</b>: {t.resultado}</li>)}
          </ol>
        </div>
      ))}
    </main>
  );
}
