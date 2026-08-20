# PT-070 — El alcance del grafo lo calcula la herramienta

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-070
type: BUG
epic: EP-017
track: STANDARD
status: READY
phase: 1
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Que `plan-layout` reconozca `tools/` con `.mjs` bajo `docs/` como código propio. Hoy devuelve `alcance: bin` — 1 archivo — mientras el registro dice `bin, docs/methodology/tools` desde `PT-020`, porque allí se escribió a mano. Cualquier instalación nueva nace con el defecto.»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `plan-layout` sobre este repositorio propone el alcance real | devuelve `bin, docs/methodology/tools`, no `bin` |
| AC-02 | El criterio es general, no un caso especial de cauce | un proyecto sintético con `docs/x/tools/*.mjs` también lo detecta |
| AC-03 | No se traga lo que no es código propio | dependencias, salida de compilación, pruebas y fixtures siguen fuera (`FND-R28`) |
| AC-04 | Un `LAYOUT.md` ya firmado se sigue respetando | la herramienta no lo sobrescribe: eso ya funciona y no puede romperse |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `plan-layout` calcula por sí sola el alcance que hoy sólo existe porque alguien lo escribió a mano en el registro de este repositorio.

## 4. Qué NO entra   `[AGENTE]`

- OUT: Regenerar el grafo de este repositorio: ya está `FRESH` con el alcance correcto.
- OUT: Cambiar `FND-R28` ni `FDGE-R43`.
- OUT: Las 13 comunidades de un solo archivo: eso es una observación de `TD-01`, no un defecto.

## 5. Firma

```
Firmado por lote: EP-017
```
