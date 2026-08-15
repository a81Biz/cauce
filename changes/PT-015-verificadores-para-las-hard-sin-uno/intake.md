# PT-015 — Verificador para las HARD que deciden algo

> Tarea de la implementación abierta `EP-013` (`FDGE-R51`).

```yaml
---
id: PT-015
type: CHORE
epic: EP-013
track: STANDARD
status: DONE
created: 2026-08-14
structural: no
suite_version: 7.7.0
phase: 8
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Acotar a las HARD que deciden algo — decisión del firmante, 2026-08-14»

Que las reglas HARD que **bloquean una compuerta** citen su ID cuando fallan. Medido hoy: 106 de 161 reglas no las emite ningún verificador con su nombre. El alcance se **reduce por escrito** a las que deciden algo; el resto queda como deuda medida.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Está **enumerado** cuáles de las HARD sin verificador bloquean hoy una compuerta | ejecución |
| AC-02 | Cada una de esas emite su ID al fallar | selftest |
| AC-03 | El alcance reducido está **escrito**: qué queda fuera y por qué | selftest |
| AC-04 | `regla --sin-comprobar` sigue declarando el resto con su número | ejecución |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: toda regla HARD que hoy bloquea una compuerta emite su ID al fallar, y `regla --sin-comprobar` declara el resto con su número — que es deuda medida, no promesa.

## 4. Qué NO entra   `[AGENTE]`

- OUT: lo que resuelven las otras siete tareas de `EP-013`
- OUT: publicar. Decisión humana explícita, sostenida en tres lotes

## 5. Firma

```
Firmado por lote: EP-013
```
