# PT-147 — `audit` deriva fases, sigla y referencias del contrato

> Tarea dentro de la implementación abierta `EP-022` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-147
type: REFACTOR
epic: EP-022
track: STANDARD
status: DRAFT
phase: 8
created: 2026-08-24
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Qué se quiere   `[HUMANO]`

`audit.mjs` mide la **cobertura mecánica** del marco: enumera reglas, fases, triggers, artefactos
y herramientas, y dice qué no está cubierto. **Cuatro** de los catorce sitios están aquí:

```
audit.mjs:192-195   PROMPTS    = { FDGE, Foundation, QA, PTSA, FPGE }        5 componentes
audit.mjs:197-202   esperadas  = { FDGE, Foundation, QA, PTSA }              4 componentes
audit.mjs:214       const sigla = comp === 'Foundation' ? 'FND' : comp
audit.mjs:341       refs: ['PTSA/PTSA-V3-Especificacion-Oficial.md', 'PTSA/PTSA-Prompts.md']
```

**Los dos primeros son dos mapas del mismo hecho y no coinciden.** De los seis componentes:

```
              PROMPTS   esperadas     consecuencia
FDGE             sí        sí         sus fases se auditan
Foundation       sí        sí         sus fases se auditan
QA               sí        sí         sus fases se auditan
PTSA             sí        sí         sus fases se auditan
FPGE             sí        NO         tiene prompts declarados y NADIE audita sus fases
FIDE             NO        NO         invisible a la auditoría de fases, entera
```

Es el mismo patrón que `verify-qa.mjs:7` documenta para las reglas —«dos componentes enteros en
cero: QA 0/19 y FPGE 0/10»— repetido ahora sobre las **fases**, y sobre otros dos componentes.
Nadie lo notó porque **una entrada que falta en un mapa a mano no falla: no aparece**.

**Y `:214` es la evidencia más limpia del lote.** No es una lista repetida: es una **excepción
codificada como condicional**, el único caso donde el nombre del componente y la sigla de sus
reglas no coinciden. Cualquier componente futuro con esa forma necesitaría un segundo ternario al
lado.

`audit.mjs` es, de las cuatro herramientas, la que **mide si el marco se cumple**. Un componente
que no esté en su tabla no aparece como incumplido: **aparece como inexistente**.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | No queda ningún literal de componente en `audit.mjs` | `grep` de los nombres y prefijos: cero |
| AC-02 | `PROMPTS` y `esperadas` dejan de ser dos mapas: **uno solo**, derivado del contrato | lectura: una sola fuente para ambos usos |
| AC-03 | **`FPGE` y `FIDE` entran en la auditoría de fases**, y sus rangos salen de `LEXICON` §3 | el informe los nombra, con cifra o con `SIN EVALUAR` — nunca ausentes |
| AC-04 | El ternario `Foundation → FND` desaparece: la sigla es un campo | lectura |
| AC-05 | Las `refs` de PTSA salen del contrato | lectura |
| AC-06 | Las cifras de los **cuatro componentes ya auditados** no cambian | ejecución antes/después, comparadas componente a componente |
| AC-07 | Un componente añadido al contrato aparece en el informe de cobertura con sus fases | caso con el componente ficticio de `PT-145` |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `audit.mjs` no nombra ningún componente, los **seis** aparecen en la auditoría
> de fases, las cifras de los cuatro que ya se auditaban no cambian, y un componente añadido solo
> al contrato aparece en el informe con su rango de fases y su sigla correctos.

## 4. Qué NO entra   `[AGENTE]`

- OUT: cambiar qué mide `audit` ni cómo puntúa. Las cifras de los cuatro componentes ya cubiertos
  son la barra (`AC-06`).
- OUT: **corregir la cobertura que `FPGE` y `FIDE` destapen al entrar.** Que aparezcan es el
  objetivo; que salgan bien no lo es. Lo que salga rojo se declara y, si merece trabajo, entra
  como tarea propia — no dentro de un `REFACTOR`.
- OUT: `verify-suite.mjs`, `comparar-marco.mjs`, `build-core.mjs`.

## 5. Firma

```
Firmado por lote: EP-022
```

---

## Observaciones del agente   `INTAKE-R07`

- **Esta tarea destapó un hallazgo antes de empezar, y por eso el lote pasó de trece sitios a
  catorce.** `audit.mjs` tiene **dos** mapas por componente, no uno, y discrepan: `FPGE` está en
  `PROMPTS` y no en `esperadas`, y `FIDE` no está en ninguno. **Dos de los seis componentes no
  tienen auditadas sus fases, y nunca lo dijeron.** Se descubrió comprobando una afirmación que
  yo mismo había escrito mal en este intake, no ejecutando el lote.

- **Aviso sobre `AC-06`.** Si al derivar los rangos desde `LEXICON` las cifras de los cuatro
  actuales **cambian**, eso no es un fallo de la tarea: es que la tabla a mano y `LEXICON` no
  dicen lo mismo hoy. Sería un hallazgo y, por `FDGE-R41`, motivo legítimo para detener el lote y
  decidir — **no** para ajustar el contrato hasta que las cifras cuadren.

- **`FPGE` y `FIDE` pueden no tener rango declarado en `LEXICON`.** Si es así, el contrato debe
  poder decir «no lo sé» en vez de inventarlo (`RULE-06`), y el informe mostrará `SIN EVALUAR`.
  Un rango inventado apagaría la comprobación en silencio, que es justo el fallo que esta tarea
  existe para quitar.
