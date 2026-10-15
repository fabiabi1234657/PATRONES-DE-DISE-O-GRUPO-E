import { BuscarProductosPort } from "./ports/in/BuscarProductosPort.js";
import { Parser } from "../domain/Interprete.js";

// Caso de uso: interpreta la consulta y filtra el catálogo.
export class BuscarProductosService extends BuscarProductosPort {
  constructor(repositorio) {
    super();
    this.repositorio = repositorio;
  }

  buscar(consulta) {
    const ast = new Parser(consulta).parsear();
    const resultados = this.repositorio.listar().filter((p) => ast.interpretar(p));
    return { ast, resultados };
  }
}
