# PT-001 — Escenarios de test   `PHASE 4`, reescrito en `PHASE 5`

> **Por qué se reescribió.** El plan original probaba las ramas de plataforma con un `gh` de
> mentira en el `PATH`. No funciona: node resuelve el `gh` real en Windows, y ningún caso del
> arnés puede exigir `gh` autenticado porque el arnés corre en CI, donde un PR desde fork no
> tiene credencial. Ver Revisión 3 del [intake](intake.md).

El arnés prueba **la lógica**, no el adaptador. Ningún caso invoca `gh`.

## Lógica del espejo — función pura, sin plataforma

Se importa `tracker.mjs` y se llama a la comparación con datos en memoria.

| TS | AC | Entrada | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` | una allocation viva sin `issue`, lista de issues vacía | una divergencia que nombra el PT |
| `TS-02` | `AC-02` | issue abierto que ninguna allocation viva reclama | una divergencia que lo nombra |
| `TS-03` | `AC-01` | allocation viva cuyo `issue` no está entre los abiertos | una divergencia — el issue murió y el registro no se enteró |
| `TS-04` | `AC-01` `AC-02` | vivas e issues en correspondencia exacta | **cero** divergencias |
| `TS-05` | `AC-06` | allocations **cerradas** sin issue | cero divergencias — `SUITE-R36`: solo lo vivo |

## Contrato de salida — sin tocar la plataforma

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-06` | `AC-06` | `REGISTRY.json` sin clave `tracker` | `tracker` sale `2` y lo dice; `verify-fdge --all` no menciona `SUITE-R35`; nada falla |
| `TS-07` | `AC-05` | plataforma declarada, adaptador sin acceso | sale **`3`**, distinto de `2`, con el comando para autenticarse (`RULE-07`) |

## `FDGE-R52` — las dos ramas

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-08` | `AC-07` | **sin** plataforma, PT en `PHASE 4` sin `bitacora.md` | `✗ FDGE-R52` — el comportamiento de hoy, intacto |
| `TS-09` | `AC-07` | **sin** plataforma, PT en `PHASE 4` con bitácora al día | `✓ FDGE-R52` — intacto |
| `TS-10` | `AC-05` `AC-07` | plataforma declarada, PT con `issue`, sin acceso | `SIN EVALUAR`, no `✗`; y **sí** `✗` con `--gate G4` |

## Precondiciones de `G4`

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-11` | `AC-04` | sin plataforma, `--gate G4` | la compuerta no se bloquea por el espejo |
| `TS-12` | `AC-04` | plataforma sin acceso, `--gate G4` | `✗` — la credencial es exigible en `G4` |

## Etiquetas

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-13` | `AC-08` | la función que prepara etiquetas, con la lista de existentes vacía | devuelve las dos que hay que crear, sin invocar `gh` |

## Los inversos, y por qué no son opcionales

`TS-04`, `TS-05`, `TS-06`, `TS-09` y `TS-11` existen para que **apagarlo todo** no pase por
arreglo:

- `TS-04` y `TS-05` — si la comparación devolviera siempre divergencia, `TS-01` a `TS-03`
  pasarían igual.
- `TS-06` y `TS-11` — son la garantía para **todo proyecto que no declara plataforma**. Sin
  ellos, este PT podría romper a todos los proyectos destino instalados y el arnés callaría.
- `TS-09` — sin él, «`FDGE-R52` acepta el issue» podría implementarse dejando de comprobar
  `FDGE-R52`.

## `TS-07`, `TS-10` y `TS-12` son la decisión humana

Comprueban las tres mitades del criterio del 2026-08-13: sin credencial no se aprueba en
silencio (`SIN EVALUAR` visible y distinguible del `2`), no bloquea donde no puede estar, y
**sí** bloquea en `G4`, que es donde la credencial es exigible.

## Lo que el arnés NO cubre, declarado

La conversación real con GitHub —`gh issue list`, `gh issue create`, `gh label create`, el
recuento de comentarios— **no se prueba aquí**, por las dos razones de arriba. Se verifica por
**ejecución real contra este repositorio** en `PHASE 6`, con las salidas guardadas en
`evidence/PT-001/`.

Es una limitación declarada, no un hueco: lo que no se puede comprobar se dice (`RULE-06`).

## Regresión

Los 188 casos existentes. El fixture no declara plataforma, así que todos caen en la rama de
hoy: si alguno cambia de resultado, el cambio ha alcanzado a proyectos que no debía tocar.
