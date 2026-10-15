import { SolicitudRepositoryPort } from "../../../application/ports/out/SolicitudRepositoryPort.js";

// Adaptador de salida: persistencia en memoria.
export class InMemorySolicitudRepository extends SolicitudRepositoryPort {
  #datos = [];
  #contador = 0;
  siguienteId() { return ++this.#contador; }
  guardar(s) { this.#datos.unshift(s); return s; }
  listar() { return this.#datos; }
}
