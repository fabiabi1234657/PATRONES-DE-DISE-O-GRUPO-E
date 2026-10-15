import express from "express";
import cors from "cors";
import { OperarCuentasService } from "../../../application/OperarCuentasService.js";
import { InMemoryCuentaRepository } from "../out/InMemoryCuentaRepository.js";

const servicio = new OperarCuentasService(new InMemoryCuentaRepository());

const app = express();
app.use(cors());
app.use(express.json());

// Envuelve el caso de uso y traduce errores de dominio a HTTP 400.
const manejar = (fn) => (req, res) => {
  try { res.json(fn(req)); } catch (e) { res.status(400).json({ error: e.message }); }
};

app.get("/api/estado", manejar(() => servicio.estado()));
app.post("/api/comandos/:tipo", manejar((req) => servicio.ejecutar(req.params.tipo, req.body)));
app.post("/api/deshacer", manejar(() => servicio.deshacer()));
app.post("/api/rehacer", manejar(() => servicio.rehacer()));

app.listen(3002, () => console.log("Command backend en http://localhost:3002"));
