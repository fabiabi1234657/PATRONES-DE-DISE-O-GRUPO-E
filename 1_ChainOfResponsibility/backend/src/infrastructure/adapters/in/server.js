import express from "express";
import cors from "cors";
import { EvaluarGastoService } from "../../../application/EvaluarGastoService.js";
import { InMemorySolicitudRepository } from "../out/InMemorySolicitudRepository.js";

// Adaptador de entrada REST + composición de dependencias.
const servicio = new EvaluarGastoService(new InMemorySolicitudRepository());

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/gastos", (req, res) => res.status(201).json(servicio.evaluar(req.body)));
app.get("/api/gastos", (_req, res) => res.json(servicio.listar()));

app.listen(3001, () => console.log("Chain backend en http://localhost:3001"));
