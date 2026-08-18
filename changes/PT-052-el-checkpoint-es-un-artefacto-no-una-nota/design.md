# PT-052 — Diseño   `PHASE 4`

## El artefacto

`docs/implementation/CHECKPOINT.json` — **uno**, sobrescrito, versionado.

```json
{
  "pt": "PT-052",
  "type": "CHORE",
  "epic": "EP-014",
  "status": "IN_PROGRESS",
  "phase": 5,
  "fase": "Implementación",
  "rama": "chore/PT-052-el-checkpoint-es-un-artefacto-no-una-nota",
  "sha": "5f34b06…",
  "sucio": true,
  "archivos": ["docs/methodology/tools/tracker.mjs", "…"],
  "compuerta": null,
  "produce": [],
  "siguiente": "PHASE 5 · Implementación — cierra con: …",
  "generado": "2026-08-15"
}
```

**Cada campo, y de dónde sale:**

| Campo | Fuente | Por qué no se recuerda |
|:---|:---|:---|
| `pt` `type` `epic` `status` `phase` `rama` | `REGISTRY.json` | El registro asigna (`SUITE-R08`) |
| `fase` `compuerta` `produce` `siguiente` | la tabla `FASES` de `tracker` | Ya está derivada; duplicarla sería `SUITE-R38` |
| `sha` `sha_corto` | `git rev-parse HEAD` | El único reloj que no depende de nadie |
| `sucio` `archivos` | `git status --porcelain` | Lo que hay, no lo que se cree que hay |
| `generado` | la fecha del commit `HEAD` | El reloj del agente no es una fuente |

**No hay campo libre.** Si un dato no se deriva, no está — y lo que haga falta y no se pueda
derivar se declara como hueco, no se rellena.

## `tracker checkpoint PT-NNN`

El productor. `PT-053` lo llamará en cada transición; aquí existe como acción propia para que el
artefacto se pueda escribir, leer y **probar** sin depender de la tarea siguiente.

```
tracker checkpoint PT-052              lo escribe
tracker checkpoint PT-052 --ver        lo imprime sin tocarlo
```

Escribe **siempre el mismo archivo**: escribirlo sobre otra tarea lo **sustituye**. Es correcto —el
estado en curso es uno— y por eso el propio checkpoint declara de qué `pt` es: leerlo sin mirar ese
campo es el error que lo haría peligroso.

## La comprobación del SHA   `AC-04`

```js
// verify-fdge · el SHA declarado tiene que ser ALCANZABLE, no tener forma de SHA
git cat-file -e <sha>^{commit}
```

Si el commit no existe, **falla**. Un checkpoint que apunta a nada miente con la autoridad de un
dato estructurado, y el que no existe se nota mientras el que miente no.

**Solo se comprueba que exista.** Que el árbol **corresponda** a ese SHA es `STATE_MISMATCH`, y es
de `EP-015`: prometerlo aquí haría que el lote siguiente heredara una casilla marcada.

## Dónde vive el contrato

En `LEXICON.md`, con los demás artefactos y **antes** que en el código (`LEX-R21`). El nombre y la
lista de campos son vocabulario canónico; nacer en `tools/` los haría un nombre fuera de sitio, que
es un defecto declarado y no un descuido.

## Lo que este diseño **no** hace

No sustituye a `HANDOFF.md` —uno responde por el **proyecto**, otro por la **tarea**—, no toca
`SUITE-R33`/`R34`, no crea un ledger, no lo escribe en cada transición (`PT-053`) y no lo proyecta
a ninguna rama (`PT-054`).

Y **se versiona**. Un checkpoint en `.gitignore` no viaja, y un estado que no viaja no sirve para
retomar nada — que es la única razón por la que existe.
