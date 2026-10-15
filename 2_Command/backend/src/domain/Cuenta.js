// Receptor (Receiver) del patrón Command: la entidad que realiza el trabajo real.
export class Cuenta {
  constructor(id, titular, saldo = 0) {
    this.id = id;
    this.titular = titular;
    this.saldo = saldo;
  }

  depositar(monto) {
    this.saldo += monto;
  }

  retirar(monto) {
    if (monto > this.saldo) throw new Error(`Saldo insuficiente en cuenta ${this.id}`);
    this.saldo -= monto;
  }
}
