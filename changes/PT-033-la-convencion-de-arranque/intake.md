# PT-033 — La convención de arranque

> Tarea de la implementación abierta `EP-008` (`FDGE-R51`).

```yaml
---
id: PT-033
type: FEATURE
epic: EP-008
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 7.2.0
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Deberíamos incluir alguna convención para que no se te olvide»

## 2. Qué hay que definir   `[AGENTE]`

Qué significa exactamente **«haber consultado el tablero»**, y dónde se escribe para que sea lo
primero que el agente carga. Esa definición la usará también `PT-034`: tiene que existir una vez
y en un solo sitio (`SUITE-R38`).

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `CORE.md` abre con el estado del tablero, antes que cualquier regla | selftest |
| AC-02 | «Consultado» está **definido**, no sugerido: qué comando, qué salida, qué caduca | selftest |
| AC-03 | Si el tablero no se puede consultar, se declara `SIN EVALUAR` y no se asume | selftest |
| AC-04 | La definición vive en un solo sitio y `PT-034` la cita, no la copia | selftest |

## 4. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: existe una definición comprobable de «haber consultado el tablero» y avanzar
> de fase sin ella falla.

## 5. Qué NO entra   `[AGENTE]`

- OUT: el agente propio. Es `PT-034`
- OUT: cargar el tablero entero en el contexto. `SUITE-R15` — se carga lo mínimo, no todo

## 6. Firma

```
Firmado por lote: EP-008
```
