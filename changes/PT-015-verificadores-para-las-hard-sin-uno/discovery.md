# PT-015 — Descubrimiento   `PHASE 2` · `2-R`

## El universo, enumerado desde fuentes mecánicas

```
reglas declaradas                    161
sin verificador que las emita        105
   de esas, CHECK                      0     ← ninguna
   de esas, HARD                      93
   de esas, SOFT                      12
```

**Que las `CHECK` sean cero no es casualidad: es que la clasificación ya funciona.** `CHECK`
significa «lo verifica un script y bloquea la integración», y las 24 lo hacen. El hueco está
entero en `HARD`, que `SUITE-R26` declara que solo **aspira** a comprobación mecánica.

## El hallazgo que acota la tarea

Tres herramientas existen **por una regla concreta**, ejecutan su contrato, y **no la nombran**:

| Herramienta | Emite hoy | La regla que ejecuta |
|:---|:---|:---|
| `verify-patrones.mjs` | **nada** | `SUITE-R38` — «un patrón crítico vive en un solo sitio y viaja con su contrato» |
| `revisar-secretos.mjs` | **nada** | `FND-R29` — «nada se publica sin revisar secretos, y la revisión bloquea» |
| `tracker.mjs` | 5 IDs, ninguno es `SUITE-R47` | `SUITE-R47` — dónde bloquea el espejo y dónde solo informa |

No es que la comprobación falte: **es que el fallo no lleva a la regla**. Es literalmente el
defecto que `SUITE-R53` corrigió para el resto —*«todo mensaje de fallo cita su regla, y
deducirla no puede ser el camino»*— sin corregirlo en las tres herramientas cuya única razón de
ser es una.

Arreglarlo cuesta una línea por herramienta y convierte tres reglas de «si falla no lo dirá con
su nombre» a «lo dice».

## Lo que sí falta comprobar, y decide algo

De las 93 `HARD`, las que un **gate** consulta y hoy nadie comprueba:

| Regla | Qué decide | Comprobable |
|:---|:---|:---|
| `FDGE-R39` | Todo archivo de un PT vive bajo `changes/PT-XXX-slug/`. Sin ella, dos PTs en vuelo se destruyen | **Sí**, y es barato |
| `FDGE-R13` | `G2`: cero líneas de código y cero ramas antes de la compuerta | Sí, pero exige comparar `git` contra la fase |
| `FDGE-R20` | Scope lock: no tocar archivos fuera de `tasks.md` | Sí, pero exige parsear el campo `Archivos` de cada `tasks.md` |

## Y las que **no** son mecanizables, dicho en vez de callado

La mayor parte de las 93 no describe una propiedad de un artefacto, sino del **razonamiento**:

```
SUITE-R01  «toda decision se apoya en evidencia … nunca en intuicion»
SUITE-R04  «una decision importante que solo existe en el chat no existe»
FDGE-R06   «la senal inicial nunca es la especificacion»
INTAKE-R01 «el comportamiento esperado de un bug lo declara el humano»
```

Ninguna se puede comprobar sin leer la intención de quien escribió. `SUITE-R26` dice «aspira»
justamente por esto, y `RULE-06` prefiere declararlo a fingir que se comprueba.

## Lo que este descubrimiento NO puede afirmar

Cuántas de las 93 son mecanizables **en total**. Enumerarlas una por una es un trabajo de días y
no cabe aquí. Lo que sí se puede es lo que el firmante acotó: **cubrir las que deciden algo**, y
dejar el resto **medido** —`regla --sin-comprobar` lo dice con su número— en vez de prometido.
