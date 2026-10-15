import { EvaluarGastoPort } from "./ports/in/EvaluarGastoPort.js";
import { SolicitudGasto } from "../domain/SolicitudGasto.js";
import { ValidadorDatos, ControlAntifraude, Supervisor, Gerente, Director } from "../domain/Manejadores.js";

// Caso de uso: arma la cadena y orquesta el flujo.
export class EvaluarGastoService extends EvaluarGastoPort {
  constructor(repositorio) {
    super();
    this.repositorio = repositorio;
    this.cadena = new ValidadorDatos();
    this.cadena
      .setSiguiente(new ControlAntifraude())
      .setSiguiente(new Supervisor())
      .setSiguiente(new Gerente())
      .setSiguiente(new Director());
  }

  evaluar(datos) {
    const solicitud = new SolicitudGasto({ id: this.repositorio.siguienteId(), ...datos });
    this.cadena.manejar(solicitud);
    this.repositorio.guardar(solicitud);
    return solicitud;
  }

  listar() {
    return this.repositorio.listar();
  }
}
