# Resumen — Patrón Interpreter (Intérprete)

**Grupo E · Patrón de comportamiento · Caso: Lenguaje de filtros para buscar productos**

## 1. ¿Qué es?
Patrón de comportamiento (GoF) que, dado un lenguaje, define una **representación de su gramática** mediante clases y un **intérprete** que evalúa sentencias de ese lenguaje. Cada regla de la gramática es una clase; la sentencia se convierte en un **árbol sintáctico abstracto (AST)** que se evalúa recursivamente.

**Estructura:** `Expresion` (abstracta, `interpretar(contexto)`) → `ExpresionTerminal` (`Comparacion`) → `ExpresionNoTerminal` (`And`, `Or`, `Not`) → `Contexto` (el producto evaluado) → `Cliente` (construye el AST con el `Parser`).

## 2. Propósito
- Evaluar lenguajes/reglas sencillas (DSL) sin `if` gigantes ni `eval`.
- Facilitar extender la gramática agregando nuevas clases de expresión.
- Permitir que los usuarios escriban reglas dinámicas (filtros, reglas de negocio, validaciones, consultas).

**Desventaja:** para gramáticas complejas el número de clases crece y el rendimiento baja; ahí conviene un generador de parsers.

## 3. Ubicación en la arquitectura hexagonal
| Capa | Elemento del proyecto |
|---|---|
| **Dominio (núcleo)** | `Interprete.js`: `Expresion`, `Comparacion`, `And`, `Or`, `Not`, tokenizador y `Parser` |
| **Aplicación** | `BuscarProductosService` (parsea la consulta y filtra); puertos `BuscarProductosPort` (entrada) y `ProductoRepositoryPort` (salida) |
| **Infraestructura – entrada** | `server.js` (REST) + frontend React |
| **Infraestructura – salida** | `InMemoryProductoRepository` |

El lenguaje y su evaluación son **lógica de dominio** pura; podrían reutilizarse con una base de datos o una interfaz de consola sin cambios.

```
React ─► [REST] ─► Puerto IN ─► Servicio ─► Parser ─► AST ─► interpretar(producto)
                                    └─► Puerto OUT ─► [Repositorio]
```

## 4. Caso práctico
Gramática:
```
expresion   := termino ( "OR" termino )*
termino     := factor ( "AND" factor )*
factor      := "NOT" factor | "(" expresion ")" | comparacion
comparacion := CAMPO OPERADOR VALOR      (= != > < >= <= CONTAINS)
```
Ejemplos: `precio > 100` · `categoria = "tecnologia" AND stock < 5` · `NOT categoria = "hogar" AND (precio >= 90 AND precio <= 300)`.
El frontend muestra el **AST** generado y la tabla de resultados; los errores de sintaxis se informan con HTTP 400.

## 5. Ejecución
```
cd backend  && npm install && npm start      # http://localhost:3003
cd frontend && npm install && npm run dev    # http://localhost:5175
```
API: `GET /api/productos` · `POST /api/buscar {consulta}`

## 6. Conclusión
Interpreter transforma reglas escritas como texto en objetos evaluables. Aplicado en el dominio de una arquitectura hexagonal, permite filtros dinámicos sin acoplar la lógica a ningún framework.
