# PT-121 — El viaje de vuelta tras el merge no lo cubre ninguna fase

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-121
type: BUG
epic: EP-020
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-22
structural: si
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que el estado terminal de un lote llegue a la rama por defecto sin que nadie tenga que inventar cómo.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Existe un comando que escribe la transición `DONE -> INTEGRATED` en el YAML del intake y en el registro, en un solo acto | hoy no existe: `avanzar` se niega —con razón— sobre un estado terminal, y los 17 de EP-019 se sincronizaron a mano |
| AC-02 | `FDGE-R19` declara la forma de rama para cerrar un lote, o declara explícitamente que se usa la de tarea y por qué | verify-fdge deja de avisar sobre una rama de lote |
| AC-03 | `PHASES.md` declara dónde ocurre el viaje de vuelta, con su artefacto y su salida | SUITE-R20: el bloque existe en PHASES y en los prompts de su componente |
| AC-04 | Falta un tag por versión y algo lo echa en falta: `v10.0.0`, `v11.0.0` y `v12.0.0` no existen y dos de esas versiones están en npm | sellar lo reporta contra los tags reales |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: cerrar un lote no exige ningún acto que el marco no nombre.

## 4. Qué NO entra   `[AGENTE]`

- OUT: crear los tags. Es acto humano (SUITE-R06a): aquí se construye lo que los echa en falta
- OUT: automatizar el merge. G4 sigue siendo humana en los tres modos (EXEC-R04)

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Las tres partes son el mismo hueco visto desde tres sitios**: no hay comando, no hay rama y no hay fase. Se agrupan porque partirlas dejaría a cada una sin la evidencia de las otras dos.
- **Medido cerrando `EP-019`**: el estado terminal se quedó en la rama de tarea y `main` declaró el lote `DRAFT` con sus diecisiete tareas en `DONE` durante todo el ciclo de publicación.
