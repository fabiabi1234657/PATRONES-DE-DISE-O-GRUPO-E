# Resumen — Patrón Command (Comando)

**Grupo E · Patrón de comportamiento · Caso: Operaciones bancarias con deshacer/rehacer**

## 1. ¿Qué es?
Patrón de comportamiento (GoF) que **encapsula una petición como un objeto**, con todo lo necesario para ejecutarla (receptor y parámetros). Así las operaciones se pueden almacenar, encolar, registrar y revertir.

**Estructura:** `Comando` (interfaz `ejecutar/deshacer`) → `ComandoConcreto` → `Receptor` (hace el trabajo real) → `Invocador` (ejecuta y guarda historial) → `Cliente` (crea los comandos).

## 2. Propósito
- Desacoplar quien solicita la acción de quien la ejecuta.
- Implementar **deshacer / rehacer**, historial y auditoría.
- Poner en cola, programar o registrar operaciones; componer comandos (macros).
- Agregar nuevas operaciones sin modificar el invocador.

**Desventaja:** aumenta el número de clases (una por operación).

## 3. Ubicación en la arquitectura hexagonal
| Capa | Elemento del proyecto |
|---|---|
| **Dominio (núcleo)** | `Comandos.js` (`Comando`, `DepositarComando`, `RetirarComando`, `TransferirComando`, `Invocador`) y `Cuenta.js` (receptor) |
| **Aplicación** | `OperarCuentasService` (fábrica de comandos + uso del invocador); puertos `OperarCuentasPort` (entrada) y `CuentaRepositoryPort` (salida) |
| **Infraestructura – entrada** | `server.js` (REST) + frontend React |
| **Infraestructura – salida** | `InMemoryCuentaRepository` |

Los comandos son **objetos del dominio/aplicación**: representan casos de uso. Los adaptadores solo convierten HTTP en llamadas al puerto.

```
React ─► [REST] ─► Puerto IN ─► Servicio ─► Invocador ─► Comando ─► Cuenta (receptor)
                                    └─► Puerto OUT ─► [Repositorio]
```

## 4. Caso práctico
Dos cuentas (Ana: 1000, Luis: 500). Se pueden **depositar, retirar y transferir**. Cada operación es un comando guardado en el historial; los botones **Deshacer** y **Rehacer** invierten o reaplican el último. `TransferirComando` es un comando compuesto y atómico (si el retiro falla, no se deposita). Una acción nueva limpia la pila de rehacer.

## 5. Ejecución
```
cd backend  && npm install && npm start      # http://localhost:3002
cd frontend && npm install && npm run dev    # http://localhost:5174
```
API: `GET /api/estado` · `POST /api/comandos/{depositar|retirar|transferir}` · `POST /api/deshacer` · `POST /api/rehacer`

## 6. Conclusión
Command convierte las acciones en objetos de primera clase, lo que habilita historial y reversión con muy poco código y mantiene el núcleo independiente de la tecnología.
