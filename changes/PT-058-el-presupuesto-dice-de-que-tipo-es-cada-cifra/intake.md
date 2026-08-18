# PT-058 — El presupuesto dice de qué tipo es cada cifra

> Tarea de la implementación abierta `EP-015` (`FDGE-R51`).

```yaml
---
id: PT-058
type: CHORE
epic: EP-015
track: STANDARD
status: READY
created: 2026-08-18
structural: no
suite_version: 8.1.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> **Decisión 4 del firmante, segunda mitad:** «el sistema debe distinguir `MEDIDO`, `ESTIMADO`,
> `SIN EVALUAR`, y **nunca presentar una estimación como una medición**.»

Que cada cifra del presupuesto lleve **de qué naturaleza es**, y que esa naturaleza sea un dato
comprobable y no una convención de redacción.

Sin eso, el presupuesto sería exactamente el `estimated_used: 67` que `LEX-R26` dejó fuera de
`CHECKPOINT.json` **por criterio**: un número que parece una medida porque está en un campo
numérico.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Toda cifra del presupuesto declara `MEDIDO`, `ESTIMADO` o `SIN EVALUAR` | selftest |
| AC-02 | Las tres son **vocabulario cerrado**: no hay una cuarta ni prosa | `verify-suite` |
| AC-03 | `SIN EVALUAR` **no vale cero**: no saber y no haber son cosas distintas | selftest |
| AC-04 | Una cifra sin naturaleza declarada **falla**; no se asume la más favorable | selftest |
| AC-05 | El vocabulario está en `LEXICON` antes que en el código (`LEX-R21`) | `verify-suite` |

`AC-03` es el que evita el defecto silencioso: si `SIN EVALUAR` se tratara como `0`, un presupuesto
sin datos parecería holgado — y el marco arrancaría tareas justo cuando menos sabe.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: el presupuesto no puede expresar una cifra sin decir qué es, `SIN EVALUAR` no se
> confunde con cero en ninguna operación, y las tres naturalezas están en `LEXICON`.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| De dónde sale la cifra estimada | PT-057 |
| Decidir con ella | PT-059 |
| Un cuarto valor para «medido pero poco fiable» | — |

**La tercera lleva `—` a propósito.** Ampliar el vocabulario es perseguir el idioma —lo que
`SUITE-R44` ya decidió no hacer— y una cifra poco fiable **es** una estimación: eso ya tiene nombre.

## 5. Firma

```
Firmado por lote: EP-015
```
