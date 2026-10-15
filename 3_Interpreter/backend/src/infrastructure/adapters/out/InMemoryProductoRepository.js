import { ProductoRepositoryPort } from "../../../application/ports/out/ProductoRepositoryPort.js";

const CATALOGO = [
  { id: 1, nombre: "Laptop Pro", categoria: "tecnologia", precio: 1500, stock: 4 },
  { id: 2, nombre: "Mouse inalámbrico", categoria: "tecnologia", precio: 25, stock: 120 },
  { id: 3, nombre: "Teclado mecánico", categoria: "tecnologia", precio: 90, stock: 3 },
  { id: 4, nombre: "Silla ergonómica", categoria: "hogar", precio: 220, stock: 15 },
  { id: 5, nombre: "Lámpara LED", categoria: "hogar", precio: 35, stock: 2 },
  { id: 6, nombre: "Camiseta deportiva", categoria: "ropa", precio: 20, stock: 60 },
  { id: 7, nombre: "Chaqueta Pro", categoria: "ropa", precio: 130, stock: 8 },
  { id: 8, nombre: "Monitor 27", categoria: "tecnologia", precio: 300, stock: 0 },
];

export class InMemoryProductoRepository extends ProductoRepositoryPort {
  listar() { return CATALOGO; }
}
