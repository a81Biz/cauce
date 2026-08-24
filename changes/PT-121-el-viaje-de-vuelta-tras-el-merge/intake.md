# PT-121 — El viaje de vuelta tras el merge no lo cubre ninguna fase

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-121
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 8
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
| AC-05 | **Ningún comando escribe el estado que `G1` produce**: al pasar `G1`, un lote debe quedar `READY` en el registro y hoy hay que escribirlo a mano | es el gemelo de `DONE -> INTEGRATED`: la compuerta produce un estado y ningún comando lo apunta (`PT-105`) |
| ~~AC-04~~ | **RETIRADO** — nació de una medición falsa: los tags `v10.0.0`, `v11.0.0` y `v12.0.0` **sí existen**. Ver la corrección al final | — |
| AC-06 | `sellar` comprueba que la versión que va a sellar **tendrá** su tag, y que el anterior existe **de verdad**, derivándolo con `--sort=v:refname` y no del orden por defecto | las que faltan son históricas —`5.2.x`, `6.x`, `7.x`, `8.0`, `8.1`—, anteriores a que `sellar` existiera, y eso se declara en vez de perseguirse |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: cerrar un lote no exige ningún acto que el marco no nombre.

## 4. Qué NO entra   `[AGENTE]`

- OUT: crear tags históricos para versiones anteriores a `8.2.0`. Se declaran ausentes: fecharlos hoy sería inventar cuándo se selló cada una
- OUT: automatizar el merge. G4 sigue siendo humana en los tres modos (EXEC-R04)

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Las tres partes son el mismo hueco visto desde tres sitios**: no hay comando, no hay rama y no hay fase. Se agrupan porque partirlas dejaría a cada una sin la evidencia de las otras dos.
- **Medido cerrando `EP-019`**: el estado terminal se quedó en la rama de tarea y `main` declaró el lote `DRAFT` con sus diecisiete tareas en `DONE` durante todo el ciclo de publicación.

---

## Corrección — 2026-08-22 · los tags existían

Este intake nació afirmando que faltaban tags. **Es falso, y el error fue de medición mía**:
ejecuté `git tag -l | tail -5`, que ordena **lexicográficamente**, así que `v10`, `v11` y `v12`
quedaron *antes* de `v4.13.0` y el final de la lista me dio `v9.0.0`. Leí el final del alfabeto
y lo llamé «el último tag».

El hecho, derivado con `git tag -l --sort=v:refname`:

```
v4.13.0  v5.0.0  v5.1.0  v5.2.0  v8.2.0  v9.0.0  v10.0.0  v11.0.0  v12.0.0

v12.0.0 -> 5b184af   el commit que publicar.yml subió a npm
las cuatro últimas versiones tienen su tag, y apunta donde debe
```

Los criterios de aceptación afectados quedan **retirados** arriba con su motivo. Lo que sí sigue
en pie es lo que no dependía de esa medición.

**Es la clase «el proxy en lugar del hecho», cometida por mí y contra la que corregía**: leí el
orden de una lista en vez de preguntar qué tags existen. Se registra aquí porque un criterio que
nace de un dato falso produce un arreglo que no arregla nada.
