import { CuentaRepositoryPort } from "../../../application/ports/out/CuentaRepositoryPort.js";
import { Cuenta } from "../../../domain/Cuenta.js";

export class InMemoryCuentaRepository extends CuentaRepositoryPort {
  #cuentas = new Map([
    [1, new Cuenta(1, "Ana", 1000)],
    [2, new Cuenta(2, "Luis", 500)],
  ]);
  obtener(id) { return this.#cuentas.get(id); }
  listar() { return [...this.#cuentas.values()]; }
}
