# PT-046 — Una entrada de `HISTORY.log` mal formada no se puede corregir

> Tarea de la implementación abierta `EP-012` (`FDGE-R51`).

```yaml
---
id: PT-046
type: BUG
epic: EP-012
track: STANDARD
status: DONE
created: 2026-08-14
structural: no
suite_version: 7.6.0
phase: 9
---
```

## 1. Qué se quiere   `[HUMANO]`

> «hazlos en orden»

Que un error de escritura en un ledger append-only deje de ser irreparable.

## 2. Comportamiento esperado y observado   `[HUMANO]`

**Observado.** `verify-fdge --gate G4 PT-039` falla con «la entrada de `HISTORY.log` no declara
"Estado:"». Las cuatro entradas de `PT-039`…`PT-042` escriben `Fecha: … · Estado: … ·` en una
línea; la comprobación exige `^Estado:` y el formato canónico de `FDGE-Implementation.md` las
pone en líneas separadas. **Y no hay forma escrita de corregirlas**: `SUITE-R09` prohíbe editar
una entrada, `FDGE-R29` prohíbe una segunda, y la comprobación lee `entries[0]`.

**Esperado.** Que exista una vía —una sola, escrita— para corregir una entrada pasada sin
reescribirla y sin desactivar ninguna regla.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Existe una forma declarada de corregir una entrada de `HISTORY.log` **sin editarla** | selftest |
| AC-02 | `SUITE-R09` no se relaja: la entrada original sigue intacta y sigue siendo la que se lee para auditar | selftest |
| AC-03 | Las precondiciones de `G4` leen la corrección cuando existe, y la original cuando no | selftest, sobre `PT-039`…`PT-042` reales |
| AC-04 | Una entrada de corrección **sin** entrada original a la que referirse falla, y lo dice | selftest |

## 4. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: `verify-fdge --gate G4` pasa en `PT-039`, `PT-040`, `PT-041` y `PT-042` sin que
> ninguna de sus cuatro entradas de `HISTORY.log` haya sido modificada.

Observable y contrastable: la comprobación es un comando, y que no se tocaron lo dice `git`.

## 5. Qué NO entra   `[AGENTE]`

- OUT: editar cualquier entrada existente de `HISTORY.log`. Es lo que esta tarea existe para
  evitar tener que hacer
- OUT: relajar `FDGE-R34` para que acepte el formato condensado. El formato canónico está en
  `FDGE-Implementation.md` y las entradas son las que se desvían
- OUT: reabrir `PT-039`…`PT-042`. Están `INTEGRATED` y se quedan

## 6. Firma

```
Firmado por lote: EP-012
```
