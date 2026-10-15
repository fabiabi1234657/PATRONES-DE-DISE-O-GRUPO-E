// PATRÓN CHAIN OF RESPONSIBILITY (dominio puro, sin dependencias externas)

// Handler abstracto: conoce al siguiente eslabón y delega si no puede resolver.
export class Manejador {
  #siguiente = null;

  setSiguiente(manejador) {
    this.#siguiente = manejador;
    return manejador; // permite encadenar: a.setSiguiente(b).setSiguiente(c)
  }

  manejar(solicitud) {
    const resuelta = this.procesar(solicitud);
    if (resuelta) return solicitud;
    if (this.#siguiente) return this.#siguiente.manejar(solicitud);
    solicitud.rechazar("Cadena", "Ningún manejador pudo resolver la solicitud");
    return solicitud;
  }

  // Devuelve true si la solicitud quedó resuelta en este eslabón.
  procesar() {
    throw new Error("procesar() debe implementarse");
  }
}

export class ValidadorDatos extends Manejador {
  procesar(s) {
    if (!s.solicitante || !s.concepto || !(s.monto > 0)) {
      s.registrar("ValidadorDatos", "Datos inválidos");
      s.rechazar("ValidadorDatos", "Datos incompletos o monto no válido");
      return true;
    }
    s.registrar("ValidadorDatos", "OK, pasa al siguiente");
    return false;
  }
}

export class ControlAntifraude extends Manejador {
  static LIMITE_ABSOLUTO = 100000;
  procesar(s) {
    if (s.monto > ControlAntifraude.LIMITE_ABSOLUTO) {
      s.registrar("ControlAntifraude", "Monto sospechoso");
      s.rechazar("ControlAntifraude", `Supera el límite absoluto de ${ControlAntifraude.LIMITE_ABSOLUTO}`);
      return true;
    }
    s.registrar("ControlAntifraude", "OK, pasa al siguiente");
    return false;
  }
}

// Eslabón genérico por nivel de autorización.
class AprobadorPorLimite extends Manejador {
  constructor(nombre, limite) {
    super();
    this.nombre = nombre;
    this.limite = limite;
  }
  procesar(s) {
    if (s.monto <= this.limite) {
      s.registrar(this.nombre, `Aprueba (límite ${this.limite})`);
      s.aprobar(this.nombre);
      return true;
    }
    s.registrar(this.nombre, `Excede mi límite (${this.limite}), escala`);
    return false;
  }
}

export class Supervisor extends AprobadorPorLimite {
  constructor() { super("Supervisor", 500); }
}
export class Gerente extends AprobadorPorLimite {
  constructor() { super("Gerente", 5000); }
}
export class Director extends AprobadorPorLimite {
  constructor() { super("Director", 50000); }
}
