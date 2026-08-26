# PT-144 — el contrato de componentes vive en `patrones.mjs`

> Tarea dentro de la implementación abierta `EP-022` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-144
type: CHORE
epic: EP-022
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-24
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Qué se quiere   `[HUMANO]`

`patrones.mjs` existe para que un hecho tenga **una sola definición y su contrato** (`SUITE-R38`).
Hoy declara `ESTADOS_TERMINALES`, `ORDEN_COMPUERTAS`, `EXIGIBLE_DESDE`, `RIGE_DESDE`,
`PREFIJOS_DE_ID`, `TIPOS_DE_ITEM`… **y no declara los componentes de la suite**, que están
escritos a mano en trece sitios de cuatro herramientas.

Esta tarea añade esa declaración. **No cambia ninguna herramienta**: nadie la consume todavía.
Se hace primero porque nadie puede derivar de un contrato que no existe.

Lo que el contrato tiene que sostener sale de lo que hoy está escrito a mano en esos trece
sitios, y de nada más:

```
nombre          FDGE · FQAGE · PTSA · Foundation · FPGE · FIDE
sigla           la que usan sus reglas — Foundation → FND es hoy un caso especial a mano
prefijo         el prefijo de sus reglas: FDGE-Rnn · QA-Rnn · PTSA-Rnn · FND-Rnn …
directorio      QA/ · PTSA/ · FIDE/ · null si no tiene directorio propio
obligatorio     false solo para FIDE hoy (FIDE-R01: el INSTALL no lo copia)
triggers        [START QA] · [START PTSA] · …
fases           el rango de PHASE que declara LEXICON §3
en_core         si sus reglas entran en CORE.md o en un overlay propio (PTSA)
```

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `patrones.mjs` exporta la declaración de los seis componentes con los ocho campos de §1 | lectura del export |
| AC-02 | Los valores declarados **coinciden con los trece sitios actuales**, campo por campo | comparación mecánica contra los literales de hoy |
| AC-03 | `verify-patrones` comprueba el contrato nuevo como comprueba los demás | el verificador falla si se rompe un campo |
| AC-04 | Ninguna herramienta cambia de comportamiento en esta tarea | `npm run verify` da el **mismo** resultado que antes de la tarea |
| AC-05 | La declaración dice de dónde sale cada valor, y `LEXICON` sigue siendo su fuente | comentario de contrato, como el resto de `patrones.mjs` |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `patrones.mjs` declara los seis componentes con su contrato, `verify-patrones`
> lo comprueba, y `npm run verify` da exactamente el mismo resultado que antes — porque todavía
> nadie lo consume.

## 4. Qué NO entra   `[AGENTE]`

- OUT: tocar cualquiera de las cuatro herramientas. Eso es `PT-145`, `PT-146` y `PT-147`.
- OUT: declarar `DICTAMEN` ni ningún componente que no exista hoy. El contrato describe **lo que
  hay**; inventar una entrada para un componente futuro es afirmar que existe.
- OUT: describir reglas o fases más allá del **rango** que `LEXICON` §3 ya declara.

## 5. Firma

```
Firmado por lote: EP-022
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es `CE-008`** —un hecho, varios nombres—: la clase que `SUITE-R14` y `SUITE-R38` existen para
  impedir, reproducida sobre la definición de qué componentes hay.
- **`Foundation → FND` es el caso que prueba el contrato.** `audit.mjs:214` lo resuelve con un
  ternario a mano porque el nombre del componente y la sigla de sus reglas **no coinciden**. Un
  contrato que no separe `nombre` de `sigla` no serviría para el único caso irregular que hay.
- **`AC-04` es deliberadamente un no-cambio.** Una tarea cuyo éxito es que nada se mueva parece
  vacía y no lo es: es la única forma de saber que el contrato describe lo que hay antes de que
  algo empiece a depender de él.
