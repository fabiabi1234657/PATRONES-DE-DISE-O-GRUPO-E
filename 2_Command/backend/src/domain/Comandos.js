// PATRÓN COMMAND (dominio puro)

// Interfaz Command: encapsula una petición como objeto con ejecutar/deshacer.
export class Comando {
  ejecutar() { throw new Error("ejecutar() no implementado"); }
  deshacer() { throw new Error("deshacer() no implementado"); }
  describir() { throw new Error("describir() no implementado"); }
}

export class DepositarComando extends Comando {
  constructor(cuenta, monto) {
    super();
    this.cuenta = cuenta;
    this.monto = monto;
  }
  ejecutar() { this.cuenta.depositar(this.monto); }
  deshacer() { this.cuenta.retirar(this.monto); }
  describir() { return `Depósito de ${this.monto} en cuenta ${this.cuenta.id}`; }
}

export class RetirarComando extends Comando {
  constructor(cuenta, monto) {
    super();
    this.cuenta = cuenta;
    this.monto = monto;
  }
  ejecutar() { this.cuenta.retirar(this.monto); }
  deshacer() { this.cuenta.depositar(this.monto); }
  describir() { return `Retiro de ${this.monto} de cuenta ${this.cuenta.id}`; }
}

// Comando compuesto: transferir = retirar + depositar (atómico).
export class TransferirComando extends Comando {
  constructor(origen, destino, monto) {
    super();
    this.origen = origen;
    this.destino = destino;
    this.monto = monto;
  }
  ejecutar() {
    this.origen.retirar(this.monto); // si falla, no se deposita
    this.destino.depositar(this.monto);
  }
  deshacer() {
    this.destino.retirar(this.monto);
    this.origen.depositar(this.monto);
  }
  describir() { return `Transferencia de ${this.monto}: cuenta ${this.origen.id} → cuenta ${this.destino.id}`; }
}

// Invoker: ejecuta comandos y mantiene historial para deshacer/rehacer.
export class Invocador {
  #hechos = [];
  #deshechos = [];

  ejecutar(comando) {
    comando.ejecutar();
    this.#hechos.push(comando);
    this.#deshechos = []; // una acción nueva invalida el "rehacer"
  }

  deshacer() {
    const c = this.#hechos.pop();
    if (!c) throw new Error("No hay acciones para deshacer");
    c.deshacer();
    this.#deshechos.push(c);
    return c;
  }

  rehacer() {
    const c = this.#deshechos.pop();
    if (!c) throw new Error("No hay acciones para rehacer");
    c.ejecutar();
    this.#hechos.push(c);
    return c;
  }

  historial() { return this.#hechos.map((c) => c.describir()); }
  puedeDeshacer() { return this.#hechos.length > 0; }
  puedeRehacer() { return this.#deshechos.length > 0; }
}
