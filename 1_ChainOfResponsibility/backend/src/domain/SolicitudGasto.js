// Entidad de dominio: solicitud de gasto que viaja por la cadena.
export class SolicitudGasto {
  constructor({ id, solicitante, concepto, monto }) {
    this.id = id;
    this.solicitante = solicitante;
    this.concepto = concepto;
    this.monto = Number(monto);
    this.estado = "PENDIENTE"; // PENDIENTE | APROBADA | RECHAZADA
    this.resueltaPor = null;
    this.motivo = null;
    this.traza = []; // recorrido por la cadena
  }

  registrar(manejador, resultado) {
    this.traza.push({ manejador, resultado });
  }

  aprobar(por) {
    this.estado = "APROBADA";
    this.resueltaPor = por;
    this.motivo = "Dentro del límite de autorización";
  }

  rechazar(por, motivo) {
    this.estado = "RECHAZADA";
    this.resueltaPor = por;
    this.motivo = motivo;
  }
}
