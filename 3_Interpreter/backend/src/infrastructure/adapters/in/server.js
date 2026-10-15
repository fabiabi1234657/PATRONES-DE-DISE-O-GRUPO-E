import express from "express";
import cors from "cors";
import { BuscarProductosService } from "../../../application/BuscarProductosService.js";
import { InMemoryProductoRepository } from "../out/InMemoryProductoRepository.js";

const repo = new InMemoryProductoRepository();
const servicio = new BuscarProductosService(repo);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/productos", (_req, res) => res.json(repo.listar()));
app.post("/api/buscar", (req, res) => {
  try {
    res.json(servicio.buscar(String(req.body.consulta ?? "")));
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.listen(3003, () => console.log("Interpreter backend en http://localhost:3003"));
