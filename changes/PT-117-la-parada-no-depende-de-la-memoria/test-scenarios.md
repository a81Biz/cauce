# `PT-117` — Escenarios   `PHASE 4`

Todos assertan **comportamiento**. Ninguno busca texto en el fuente: es la clase que `PT-124`
nombró y la que `PT-116` tuvo que rehacer a mitad de tarea.

Cada escenario que afirma «esto falla» lleva su **inversa** — sin ella, el caso pasaría igual si
la comprobación no se ejecutara nunca, que es el motivo contrario al que dice medir.

| TS | Escenario | Espera |
|:---|:---|:---|
| `TS-01` | `asignar` crea una allocation | lleva `suite_version` con la versión vigente |
| `TS-02` | **inversa** de `TS-01`: la versión no se puede leer | **no** se inventa el campo (`RULE-06`: `SIN EVALUAR` antes que un verde falso) |
| `TS-03` | `parada --desenlace abre --abre PT-N` | la allocation `PT-N` queda con `origen_parada.de` apuntando a quien paró |
| `TS-04` | `origen_parada` declara `motivo` de la lista cerrada | el valor es uno de los seis de `LEXICON` §8.5 |
| `TS-05` | Hay plataforma declarada y **no** hay acceso | falla **antes** de escribir: no queda `origen_parada` sobre una parada que nadie publicó |
| `TS-06` | Allocation alcanzada (`suite_version` ≥ 13.0.0) **sin** `origen_parada` | `verify-fdge` da **error** `FDGE-R55` |
| `TS-07` | **inversa** de `TS-06`: allocation con `suite_version` anterior | **silencio**. No se retrofecha (`FDGE-R19`, `FDGE-R52`) |
| `TS-08` | Allocation alcanzada **con** `origen_parada` | silencio |
| `TS-09` | El primer `EP` de un proyecto, sin parada previa posible | **exento**: no hay tarea anterior desde la que parar. Sin esta puerta, instalar cauce empezaría en rojo |
| `TS-10` | `LEXICON` §8.5 declara una clase que `patrones.mjs` no tiene | `verify-suite` **falla** |
| `TS-11` | **inversa** de `TS-10`: las dos listas coinciden | silencio |
| `TS-12` | La cifra del hueco de `SUITE-R26` | **derivada** de las listas, no escrita a mano (`PT-115`) |

## Lo que NO se comprueba, y por qué

- **Que el hook `Stop` funcione.** Vive fuera del paquete. Un caso que lo midiera aquí afirmaría
  algo que no vale en ningún proyecto destino.
- **Que hubo una parada de desenlace `continua` que debió escribirse.** No deja rastro. Ningún
  script puede probar la ausencia de algo que no se escribe, y por eso va como hueco medido y no
  como caso verde.
