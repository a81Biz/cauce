# Fuera de alcance — `PT-117`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| **Exigir la parada de desenlace `continua`** | No deja rastro. Ningún script puede probar la ausencia de algo que no se escribe. Se declara como **hueco medido** (`SUITE-R26`) en `evidence/PT-117/salidas/hueco.txt`, con su cifra derivada. **No aplaza**: no hay trabajo futuro que lo cubra, y por eso el destino es `—` y no un identificador | — |
| Medir la eficacia del hook `Stop` | Vive en `.claude/settings.json`, **fuera del paquete**: un proyecto destino que instale cauce no lo recibe. Un caso que lo midiera afirmaría algo que no vale fuera de esta máquina | — |
| Leer los comentarios del issue para verificar | Exigiría red y plataforma. Rompería el proyecto sin tablero, que `SUITE-R22` declara soportado | — |
| Retrofechar las 20 allocations de `EP-020` | Declaran `suite_version: 12.0.0`. `RIGE_DESDE` las deja fuera, con el criterio de `FDGE-R19` y `FDGE-R52`: obligar a rehacer trabajo válido es la forma más rápida de que se abandone el marco | — |
| Contar cuántas paradas hubo por clase | Es lo que dirá si las seis clases son las correctas | `PT-119` |
| Que la parada abra la allocation por sí sola | El registro asigna (`SUITE-R08`). `parada` **cita** una allocation que ya existe; crearla sería una segunda fuente de identificadores, la avería que la v4 nació para eliminar | — |
| Bloquear la conversación hasta que se escriba la parada | La parada deja rastro; no pide permiso. Bloquear convertiría un registro en un peaje, y el defecto original no es que se pida permiso: es que no queda constancia | — |

## Lo que este documento **no** hace

No declara aquí nada que un `AC` debiera cubrir. `FDGE-R15` rechaza el criterio huérfano, y en
`PT-115` ya se intentó usar un `AC` para declarar algo **no hecho** — que es exactamente el uso
que esta tabla existe para absorber.
