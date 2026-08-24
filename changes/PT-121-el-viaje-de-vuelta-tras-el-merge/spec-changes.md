# `PT-121` — Cambios de especificación   `PHASE 4`

> `SUITE-R06e`: modificar `docs/methodology/` **no se automatiza** — se propone aquí y se resuelve
> en `G2`.

---

## `RULES.md` · `FDGE-R19` — la rama del trabajo de lote

| | |
|:---|:---|
| **Antes** | La regla declara tres niveles de rama y ninguno cubre el trabajo **de lote**: abrir un `EP`, publicar sus paradas, cerrarlo. `verify-fdge` avisaba sobre una rama de lote sin tener con qué compararla |
| **Después** | Declara que ese trabajo usa la **forma de tarea**, con el `type` del propio lote, **y dice por qué**: son actos que ocurren una vez por lote sobre la misma rama efímera, y darles un cuarto nivel añadiría vocabulario que la forma existente ya cubre (`LEX-R23`) |

**Y declara lo que NO se hereda**: la unidad del **commit**. El asunto sigue pidiendo un `PT`, y
si el trabajo de lote debe poder citar el `EP` queda como **pregunta abierta** con su medición
hecha —15 commits, `PT-127`— en vez de resolverse de paso.

## `PHASES.md` · `PHASE 9` — el viaje de vuelta

| | |
|:---|:---|
| **Antes** | *«tras el merge: … PT→INTEGRATED · intake.md CLOSED»*, sin decir **con qué** |
| **Después** | El bloque `EL VIAJE DE VUELTA` nombra los tres comandos, su **orden** —`integrar`, luego `cerrar`, luego `proyectar`— y la **salida** de cada uno. Más el otro extremo: el estado que produce `G1`, también por comando |

El orden no es estético: `cerrar` va **después** porque el estado terminal tiene que estar ya en la
rama por defecto, o la principal queda diciendo «vivo» con el issue cerrado (`SUITE-R46`).

## `FDGE-Prompts.md` · el texto copiable

Lleva los mismos comandos y **cita `SUITE-R27`**, que es lo que `SUITE-R20` exige: una regla que
`PHASES` cita y el prompt no menciona no la vería el humano en modo `MANUAL`.

## Ninguna regla nueva

`SUITE-R27` ya existe y ya dice lo que la firma prueba y lo que no. `SUITE-R46` ya fija el orden.
Lo que faltaba era **el comando** y **el sitio donde se nombra**.

## Autoridad

`LEX-R21` · la obligación vive en `RULES.md`; `PHASES` y los prompts **citan**.
`SUITE-R20` · lo que `PHASES` cita, el prompt lo menciona.
