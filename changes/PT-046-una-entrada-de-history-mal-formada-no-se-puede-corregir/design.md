# PT-046 — Diseño   `PHASE 4`

## El encabezado

```markdown
## PT-NNN — CORRIGE: <qué se corrige>
Corrige: la entrada de AAAA-MM-DD
Motivo: <por qué la original no cumple>
Estado: DONE
Estructural: no
```

Misma gramática que `## PT-NNN — REVERTIDO`, que ya existe y ya se descuenta. `CORRIGE` va en
`LEXICON.md` porque es un nombre canónico nuevo (`LEX-R10`), no una convención de escritura.

## El cambio en `verify-fdge.mjs`

```js
// antes
const entries  = [...hist.matchAll(new RegExp(`^##\s+${pt}\s+—`, 'gm')));
const reverted = [...hist.matchAll(new RegExp(`^##\s+${pt}\s+—\s+REVERTIDO`, 'gm'))];
if (entries.length - reverted.length > 1) fail('FDGE-R29', …);
…
const idx = hist.indexOf(entries[0][0]);      // SIEMPRE la primera

// después
const corrige  = [...hist.matchAll(new RegExp(`^##\s+${pt}\s+—\s+CORRIGE`, 'gm'))];
if (entries.length - reverted.length - corrige.length > 1) fail('FDGE-R29', …);
if (corrige.length && entries.length - corrige.length === 0) fail('FDGE-R29', <huérfana>);
…
const cabeza = corrige.length ? corrige[corrige.length - 1] : entries[0];   // la ÚLTIMA corrección
```

Tres decisiones y su porqué:

**La última, no la primera.** Corregir una corrección es legítimo y append-only. Preferir la
primera dejaría la segunda sin efecto y nadie sabría por qué.

**Huérfana ⇒ falla.** Una `CORRIGE` sin entrada original sería una vía para declarar trabajo que
nunca ocurrió. Es el caso que hace que esta puerta no sea un agujero.

**`cabeza` se usa también en `FDGE-R44`.** El bloque que lee `Estructural:` usa el mismo
`entries[0]`. Sin cambiarlo, corregir el `Estado:` dejaría el `Estructural:` leyéndose de la
entrada vieja: la mitad corregida y la otra mitad no, que es peor que ninguna.

## Lo que este diseño **no** hace

No edita nada. No relaja `FDGE-R34`: el campo se sigue exigiendo, solo cambia **dónde** se lee.
No sustituye la entrada original en el relato — quien audite ve las dos, y ve que hubo un error.
