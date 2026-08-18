# PT-051 — Dónde vive la comprobación de una regla

> Tarea de la implementación abierta `EP-014` (`FDGE-R51`).

```yaml
---
id: PT-051
type: CHORE
epic: EP-014
track: STANDARD
status: READY
created: 2026-08-15
structural: no
suite_version: 8.0.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «cómo reducir el coste de tokens sin perder el contexto»

Que `regla <ID>` diga **dónde** está la comprobación, con archivo y línea, en vez de obligar a
abrir 1 490 líneas de `verify-fdge.mjs` buscándola.

No es una capacidad nueva: `regla --fallos` ya **deriva** los `fail('ID', …)` del código, así que
la herramienta ya sabe dónde están. Lo que falta es decirlo.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `regla <ID> --donde` da archivo y línea de **cada** `fail()` que emite ese ID | selftest |
| AC-02 | Sale de leer el código, no de una tabla escrita a mano (`RULE-01`) | selftest |
| AC-03 | Una regla sin verificador lo **dice**, y no devuelve una lista vacía que parezca «ninguno» | selftest |
| AC-04 | Una regla con verificador en **varias** herramientas las enumera todas | selftest |

`AC-03` distingue «no tiene verificador» de «no encontré nada»: son dos respuestas y hoy se
verían igual. Es `RULE-06` en su forma más corta.

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `regla SUITE-R34 --donde` responde `verify-fdge.mjs:460`, y `regla SUITE-R22
> --donde` —una de las 62 de `TD-08`— responde que **no tiene verificador**, con esas palabras.

## 4. Qué NO entra   `[AGENTE]`

| Qué | Dónde va |
|:---|:---|
| Escribir verificadores para las 62 reglas que no tienen | — |
| Partir `verify-fdge.mjs` (`TD-02`) | — |

Las dos llevan `—`: la primera es deuda **medida** en `TD-08` y el firmante ya decidió acotarla;
la segunda es una deuda declarada que esta tarea no toca ni empeora.

## 5. Firma

```
Firmado por lote: EP-014
```
