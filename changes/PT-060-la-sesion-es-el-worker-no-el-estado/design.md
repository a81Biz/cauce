# PT-060 — Diseño   `PHASE 4`

## `SESSION.json`

```json
{
  "desde": "ea4e867…",
  "abierta": "2026-08-18",
  "commits": 12,
  "archivos": 34,
  "lineas": 4821,
  "tareas": ["PT-059", "PT-060"],
  "pt": "PT-060",
  "phase": 6,
  "generado": "2026-08-18"
}
```

**`desde` es lo único capturado.** Todo lo demás sale de `git log desde..HEAD` y de
`CHECKPOINT.json`. Sin `SESSION.json`, `desde` es `null` y se **dice** — no se cae al día en
silencio.

## La función pura

```js
/**
 * El estado de la SESION, derivado. `marca` es lo que `sesion abrir` capturo; el resto lo trae
 * quien llama, ya leido de git.
 *
 * TRES resultados otra vez: hay sesion abierta, no hay ninguna, o la marca apunta a un commit que
 * ya no existe (historia reescrita). Los tres son distintos y ninguno es cero.
 */
export function sesionDe(marca, git = {}, checkpoint = null) {
  if (!marca?.desde) {
    return { abierta: false, desde: null,
      motivo: 'no hay sesion abierta: «tracker sesion abrir» marca el inicio. Sin marca, lo que '
        + 'lleva la sesion es SIN EVALUAR — el dia NO es la sesion.' };
  }
  return {
    abierta: true,
    desde: marca.desde,
    desde_corto: String(marca.desde).slice(0, 7),
    commits: cifra(git.commits ?? null, git.commits == null ? SIN_EVALUAR : MEDIDO),
    archivos: cifra(git.archivos ?? null, git.archivos == null ? SIN_EVALUAR : MEDIDO),
    lineas: cifra(git.lineas ?? null, git.lineas == null ? SIN_EVALUAR : MEDIDO),
    tareas: git.tareas ?? [],
    pt: checkpoint?.pt ?? null,
    phase: checkpoint?.phase ?? null,
  };
}
```

Cada cifra llega envuelta con su naturaleza (`PT-058`): `MEDIDO` si git respondió, `SIN EVALUAR` si
no. Sin cero por medio.

## El handoff derivado

```js
/**
 * El handoff de CAMBIO DE SESION. Se DERIVA del checkpoint y de la sesion: ni una linea de prosa.
 *
 * NO sustituye a HANDOFF.md. Su bloque ESTADO lleva las decisiones del firmante y los «no hacer»
 * que salieron de ejecutar — lo unico del estado que NO se puede derivar, y lo mas valioso que
 * tiene. Derivarlo seria perderlo (AC-05).
 */
export function handoffDeSesion(sesion, checkpoint) {
  const l = [];
  l.push(`sesion       ${sesion?.abierta ? `desde ${sesion.desde_corto}` : 'SIN EVALUAR (no se abrio)'}`);
  if (sesion?.abierta) l.push(`             ${textoCifra(sesion.commits)} commits · ${textoCifra(sesion.lineas)} lineas`);
  if (sesion?.tareas?.length) l.push(`tareas       ${sesion.tareas.join(' · ')}`);
  if (!checkpoint) {
    l.push('en curso     SIN EVALUAR: no hay CHECKPOINT.json. «tracker checkpoint PT-NNN» lo escribe.');
    return l.join('\n');
  }
  l.push(`en curso     ${checkpoint.pt} · PHASE ${checkpoint.phase} ${checkpoint.fase ?? ''}`.trimEnd());
  l.push(`sobre        ${checkpoint.sha_corto ?? 'SIN EVALUAR'}  ${checkpoint.rama ?? ''}`.trimEnd());
  l.push(`sigue        ${checkpoint.siguiente ?? 'SIN EVALUAR: «tracker siguiente» lo deriva.'}`);
  return l.join('\n');
}
```

## Los tres subcomandos

```
tracker sesion abrir     captura HEAD → SESSION.json · apila en SESSION_LOG.md
tracker sesion           lo derivado, con cada cifra y su naturaleza
tracker sesion cerrar    el handoff derivado · apila el cierre en SESSION_LOG.md
```

`abrir` es lo **único** que marca. `sesion` y `cerrar` solo leen y derivan — y `cerrar` **no**
borra `SESSION.json`: la sesión siguiente la sobrescribe al abrir (`AC-03`), y borrarla dejaría un
hueco donde antes había un dato.

En `SIN_PLATAFORMA`: sale de git y del disco.

## `PT-059` usa el `desde` si lo hay

```js
// tracker.mjs · viabilidad()
const marca = leerJSON(join(IMPL, 'SESSION.json'));
const rango = marca?.desde ? `${marca.desde}..HEAD` : null;
// Con marca, el precedente sale de la SESION REAL. Sin marca, del dia — que es una aproximacion
// y se DICE, en vez de pasar por lo mismo.
```

**No cambia `viabilidadDe`.** Cambia de dónde sale una de sus entradas, y con qué naturaleza llega.

## Lo que NO se construye

| Qué | Por qué |
|:---|:---|
| Estados de sesión en `REGISTRY.json` | `AC-02` · `SUITE-R09` los haría permanentes |
| `CHECKPOINTING` · `HANDOFF_REQUIRED` · `WAITING_NEW_SESSION` como estados de tarea | La corrección a la especificación · la tarea sigue `IN_PROGRESS` |
| Un ledger de sesiones aparte | `SESSION_LOG.md` ya lo es (`SUITE-R38`) |
| Reescribir la prosa de `HANDOFF.md` | `AC-05` · es lo único no derivable del estado |
| Cerrar la sesión automáticamente | Nadie sabe cuándo acaba salvo quien la cierra |
| Medir el contexto restante | Decisión 4 · `SIN EVALUAR` |
