# PT-047 — Ningún PT ha creado su rama

> Tarea de la implementación abierta `EP-013` (`FDGE-R51`).

```yaml
---
id: PT-047
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

> «Rama por PT, de verdad» — decisión del firmante, 2026-08-14

Que el marco y su uso dejen de contradecirse: `PHASE 5` manda crear la rama y ningún PT de este
repositorio la ha creado.

## 2. Comportamiento esperado y observado   `[HUMANO]`

**Observado.** `PHASES.md:198` manda `git checkout -b <type>/PT-XXX-slug` y `PHASE 4` obliga a
**proponerla**. Los 46 PT de este repositorio se han implementado sobre `trabajo`, y el
`CLAUDE.md` declara dos ramas y ninguna por tarea. **Nada lo detecta.**

**Esperado.** Que la rama se cree, que el marco declare a **dónde** mergea, y que no cumplirlo se
vea en vez de pasar 46 veces seguidas.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La **topología** está declarada: a dónde mergea una rama de PT y dónde se resuelve `G4` | selftest |
| AC-02 | Un PT en `PHASE 5` o posterior que no declara su rama se **reporta** | selftest |
| AC-03 | El `CLAUDE.md` de este repositorio deja de contradecir a `PHASE 5` | selftest |
| AC-04 | `G4` sigue siendo humana, y si pasa a haber más de una se **declara** cuántas y dónde | selftest |

## 4. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `PHASES.md`, `RULES.md` y el `CLAUDE.md` de este repositorio declaran la misma
> topología de ramas, y `verify-fdge` reporta un PT que no declara la suya.

## 5. Qué NO entra   `[AGENTE]`

- OUT: rehacer las ramas de los 46 PT ya integrados. La historia no se reescribe (`SUITE-R06f`)
- OUT: cambiar quién resuelve `G4`. Sigue siendo humana en los tres modos (`EXEC-R04`)
- OUT: borrar `origin/desarrollo`, que sigue sobrando (`TD-06`, `SUITE-R06f`)

## 6. Firma

```
Firmado por lote: EP-013
```

## Estado de cierre   `FDGE-R35`

```
INTEGRATED · integrado en la rama por defecto el 2026-08-15
G4 de EP-013 resuelta por Alberto Martinez: «Cierra primero G4 de EP-013». El
directorio se CONSERVA: es el registro de la propuesta y de su evidencia.
```
