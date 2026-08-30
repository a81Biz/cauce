# `PT-195` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Una identidad no declarada **se dice**, y no sólo en un comando que nadie invoca | TS-01 · TS-02 · TS-03 | selftest §EP-026 | evidence/PT-195/manifest.json · salida.txt | no aplica | pendiente |
| AC-02 | El aviso llega **antes** de commitear | TS-04 | selftest §EP-026 | evidence/PT-195/manifest.json · salida.txt | no aplica | pendiente |
| AC-03 | En CI, donde la identidad es la del runner, **no** se bloquea | TS-05 | selftest §EP-026 | evidence/PT-195/manifest.json · salida.txt | no aplica | pendiente |

Los `AC` son **los del intake**, leídos de él y no transcritos (`FDGE-R15a`).

**Sin `AC` huérfano**: los tres tienen escenario y caso ejecutable, y no hay escenario sin `AC`.

## `AC-01` lleva tres escenarios porque son **tres estados**, no uno

`RULE-02` separa lo ausente de lo no legible; aquí la misma forma separa tres hechos distintos:
sin `personas` · no declarada · declarada. Fundirlos daría un mensaje que manda al sitio
equivocado, que es lo que `PT-198` acaba de cerrar en otra herramienta.

## Seis casos, no cinco

Los escenarios son cinco; los casos, **seis**. El de más es la pareja de `TS-05`: que la identidad
ajena **no bloquee** lo cumple un verificador que **no diga nada**. Hace falta el que fija que
**aun así la dice**, como aviso.

Y `TS-05` no se mide por código de salida: el fixture puede fallar por **otras** reglas, y
atribuírselo a ésta sería medir el árbol entero — `CE-001`. Se mide que **esta comprobación** no
emita nunca un error.

## Lo que la tarea NO cambia, y por qué eso importa aquí

El dato **ya existía y ya era correcto**: `tracker personas` lo calcula desde hace lotes. Lo que
esta tarea compra es **quién lo emite** — `CE-007`, existe la herramienta y nada la echa en falta.
Por eso `TS-04` no mide un mensaje sino una **procedencia**: de dónde sale.
