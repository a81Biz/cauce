# PT-029 — Buscar más choques entre reglas

> Tarea de la implementación abierta `EP-013` (`FDGE-R51`).

```yaml
---
id: PT-029
type: CHORE
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

> «hazlos en orden»

Que se busquen los pares de reglas donde una comprobación hace imposible el estado que otra obliga a atravesar. Hay **cinco casos conocidos** y ninguno se encontró buscando: los cinco aparecieron al chocar con ellos.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Los pares conocidos están enumerados con su evidencia | selftest |
| AC-02 | Se busca de forma **repetible**, no por memoria de los que ya dolieron | ejecución |
| AC-03 | Lo que no se puede detectar mecánicamente se declara (`RULE-06`) | selftest |
| AC-04 | Lo que aparezca y no quepa se aplaza con su issue (`SUITE-R44`) | ejecución |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: los pares de reglas que se contradicen están enumerados con su evidencia, y lo que no se puede detectar mecánicamente está **dicho** en vez de omitido (`RULE-06`).

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
