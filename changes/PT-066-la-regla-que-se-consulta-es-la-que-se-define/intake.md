# PT-066 — La regla que se consulta es la que se define

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-066
type: BUG
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Que `regla.mjs` diga la verdad. Hoy declara inexistentes 21 reglas que existen y devuelve el texto de OTRA regla en 26 casos, con la cabecera «definida en RULES.md».»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Las 20 reglas de severidad `CHECK` de `RULES.md` se encuentran | `regla.mjs SUITE-R13` y `FDGE-R34` devuelven su propia fila |
| AC-02 | Las 15 `EXEC-R*` de `EXECUTION-MODES.md` se encuentran | `regla.mjs EXEC-R14` devuelve su propio párrafo |
| AC-03 | Las 26 `LEX-R*` de `LEXICON.md` se encuentran | `regla.mjs LEX-R26` devuelve su propia entrada |
| AC-04 | Nunca se devuelve el texto de otra regla | `regla.mjs FDGE-R43` NO devuelve `SUITE-R29`; `FDGE-R19` NO devuelve `SUITE-R42` |
| AC-05 | Una regla que de verdad no existe se sigue declarando inexistente | `regla.mjs SUITE-R99` dice que no existe |
| AC-06 | Un caso por cada uno de los 222 IDs definidos, derivado y no escrito a mano | el arnés recorre los tres documentos propietarios y exige que cada ID se resuelva a su propia definición |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: para los 222 IDs que el marco define, `regla.mjs` devuelve la definición **de ese ID** o dice que no existe, y nunca la de otro.

## 4. Qué NO entra   `[AGENTE]`

- OUT: Cambiar el formato de `RULES.md`, `LEXICON.md` o `EXECUTION-MODES.md` para que sean más fáciles de parsear — se arregla quien lee, no lo que está bien escrito.
- OUT: La salida `--donde` y su cuenta de emisiones: es correcta y `PT-051` ya la protegió.
- OUT: Escribir verificadores para las reglas que no lo tienen — eso es `TD-08` y no esta tarea.

## 5. Firma

```
Firmado por lote: EP-017
```
