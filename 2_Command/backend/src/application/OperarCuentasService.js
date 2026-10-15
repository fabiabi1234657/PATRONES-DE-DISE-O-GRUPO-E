import { OperarCuentasPort } from "./ports/in/OperarCuentasPort.js";
import { Invocador, DepositarComando, RetirarComando, TransferirComando } from "../domain/Comandos.js";

// Caso de uso: fábrica de comandos + invocador.
export class OperarCuentasService extends OperarCuentasPort {
  constructor(repositorio) {
    super();
    this.repositorio = repositorio;
    this.invocador = new Invocador();
  }

  #cuenta(id) {
    const c = this.repositorio.obtener(Number(id));
    if (!c) throw new Error(`Cuenta ${id} no existe`);
    return c;
  }

  #crear(tipo, { cuenta, origen, destino, monto }) {
    const m = Number(monto);
    if (!(m > 0)) throw new Error("El monto debe ser mayor a 0");
    switch (tipo) {
      case "depositar": return new DepositarComando(this.#cuenta(cuenta), m);
      case "retirar": return new RetirarComando(this.#cuenta(cuenta), m);
      case "transferir":
        if (Number(origen) === Number(destino)) throw new Error("Origen y destino iguales");
        return new TransferirComando(this.#cuenta(origen), this.#cuenta(destino), m);
      default: throw new Error(`Comando desconocido: ${tipo}`);
    }
  }

  ejecutar(tipo, params) {
    this.invocador.ejecutar(this.#crear(tipo, params));
    return this.estado();
  }

  deshacer() { this.invocador.deshacer(); return this.estado(); }
  rehacer() { this.invocador.rehacer(); return this.estado(); }

  estado() {
    return {
      cuentas: this.repositorio.listar(),
      historial: this.invocador.historial(),
      puedeDeshacer: this.invocador.puedeDeshacer(),
      puedeRehacer: this.invocador.puedeRehacer(),
    };
  }
}
