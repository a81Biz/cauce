# PT-048 — El issue de un `DEFERRED` enlaza a un directorio que no existe

> Tarea de la implementación abierta `EP-013` (`FDGE-R51`).

```yaml
---
id: PT-048
type: BUG
epic: EP-013
track: STANDARD
status: INTEGRATED
created: 2026-08-14
structural: no
suite_version: 7.7.0
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «revisa que estés usando github de forma correcta»

Que el cuerpo de un issue no apunte a un 404. `SUITE-R44` exime a un `DEFERRED` de tener artefactos, pero `tracker.mjs:259` enlaza igual a `changes/PT-NNN-slug/`. Es lo que `PT-036` existe para impedir.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El cuerpo de un issue sin directorio **no** enlaza a él | selftest |
| AC-02 | Dice en su lugar qué hay: una allocation aplazada, aún sin artefactos (`SUITE-R44`) | selftest |
| AC-03 | Con directorio, el enlace sigue igual que hoy | selftest |
| AC-04 | Comprobado sobre `PT-019` y `PT-025`, las dos que quedan sin artefactos | ejecución |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: el issue de una allocation sin directorio **no enlaza a él**, y dice en su lugar qué hay — comprobado sobre `PT-019` y `PT-025`, que son las que quedan sin artefactos.

## 4. Qué NO entra   `[AGENTE]`

- OUT: lo que resuelven las otras siete tareas de `EP-013`
- OUT: publicar. Decisión humana explícita, sostenida en tres lotes

## 5. Firma

```
Firmado por lote: EP-013
```

## Estado de cierre   `FDGE-R35`

```
INTEGRATED · integrado en la rama por defecto el 2026-08-15
G4 de EP-013 resuelta por Alberto Martinez: «Cierra primero G4 de EP-013». El
directorio se CONSERVA: es el registro de la propuesta y de su evidencia.
```
