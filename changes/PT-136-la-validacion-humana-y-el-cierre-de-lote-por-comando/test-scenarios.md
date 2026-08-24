# Escenarios de test — `PT-136`

> `FDGE-R17`: rojo primero, y **válido**.

| TS | Escenario | Esperado |
|:---|:---|:---|
| `TS-01` | `validar` lleva un `BUG` de `VALIDATION_PENDING` a `DONE` | la transición |
| `TS-02` | …y deja **quién y cuándo** en el registro | `DONE Alberto Martínez 2020-03-04` |
| `TS-03` | Un **no-`BUG`** no pasa por esta validación | `FDGE-R26` |
| `TS-04` | …ni un `BUG` que ya está en `DONE` | `LEX-R08` |
| `TS-05` | Un firmante que no está en la lista **falla** | `SUITE-R27` |
| `TS-06` | Si una del lote falla, **ninguna** se escribe | `VALIDATION_PENDING` |
| `TS-07` | La fecha de la validación se puede **decir** | `2020-03-04` |
| `TS-08` | Un lote con tareas vivas **no** se cierra | `no estan terminales` |
| `TS-09` | …y las **nombra**, no sólo las cuenta | `PT-001` |
| `TS-10` | …y con todas terminales, `READY` → `CLOSED` | la transición |

---

## Los que existen porque algo falló

**`TS-06`** — el que sostiene «todas o ninguna». Sin él, una implementación que escribiera las que
pasan y abandonara al primer fallo también pasaría, y dejaría el registro en un estado que nadie
decidió. Se prueba con un lote mixto: un `BUG` válido y un `FEATURE` que debe rechazarse.

**`TS-09`** — nombrar y no contar. Cuando `integrar EP-020` me rechazó el cierre, lo útil no fue el
número **22**: fue leer `PT-113 (DONE)` y entender que `DONE` no es terminal. Un recuento correcto
convive con cualquier hueco porque no dice cuál.

**`TS-07`** — la lección de `PT-121`, encontrada usando `firmar` sobre una `G1` de dos días antes.
Aquí se aplicó **antes** de tropezar.

**`TS-03` y `TS-04`** — los dos negativos que impiden que el comando **decida**: rechaza lo que no
es un `BUG`, y rechaza uno ya validado. Sin ellos sería una forma de escribir `DONE` sobre
cualquier cosa.

---

## Prueba inversa

| Se quita | Qué se pierde |
|:---|:---|
| La guarda de `type == BUG` | `TS-03` — un `FEATURE` pasaría por validación humana de `BUG` |
| La guarda de `status` | `TS-04` — se reescribiría un `DONE` ya firmado |
| El contraste de la firma | `TS-05` — «Quien Sea» validaría |
| La acumulación previa a escribir | `TS-06` — se escribirían las que pasan |
| La derivación de tareas vivas | `TS-08` — un lote con trabajo dentro cerraría |

Las cinco están medidas en los casos: cada una tiene su negativo, y el fixture lleva a propósito un
`BUG` válido, un no-`BUG` y un `BUG` ya cerrado.
