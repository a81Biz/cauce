# PT-082 — Descubrimiento   `PHASE 2`

## Dónde está, con archivo y línea

**`A` · el caso.** [selftest.sh:3245](docs/methodology/tools/selftest.sh#L3245) usaba `TRR`, que
es `node tracker.mjs "$@" "$RAIZ_REAL"` — el **repositorio real**, no el fixture. Y
[tracker.mjs:1508](docs/methodology/tools/tracker.mjs#L1508):

```js
const yo = personaLocal(gitDe(['config', 'user.name']), gitDe(['config', 'user.email']),
  reg.personas ?? []).persona;
```

En CI esa identidad es la del runner. `marcaDe(null, …)` encuentra `SESSION.json` con
`persona: "Alberto Martínez"` y **devuelve `null`** porque no coincide — la guarda que `PT-068`
puso justo para eso.

**`B` · la protección.** Medido con `gh api`:

```
main      required_status_checks: ["marco"] · strict: true · enforce_admins: true
trabajo   404 Branch not protected
```

## La rama que nadie probaba

El `if` de [tracker.mjs:1539](docs/methodology/tools/tracker.mjs#L1539) tiene dos salidas:

```js
marcaSesion?.desde
  ? `en la sesion abierta en ${…}`
  : `en el DIA ${hoy} — no hay sesion abierta, y el dia NO es la sesion (PT-060)`
```

Había un caso para la primera y **ninguno para la segunda**. La segunda es justo la que CI
ejecutaba. Un `if` con una rama sin caso no está probado: está probado a medias, y la mitad sin
probar es la que se rompe donde no miras.

## Cuánto llegó

| PR | Rama destino | CI | ¿Se fusionó? |
|:---|:---|:---|:---|
| `#148` `PT-079` | `trabajo` | **fail** | sí |
| `#149` `PT-067` | `trabajo` | **fail** | sí |
| `#152` `G4` | `main` | **fail** | **no — `BLOCKED`** |

Los dos primeros pasaron porque `trabajo` no tenía protección. El tercero no pasó porque `main`
sí. La diferencia entre las dos filas no es cuidado: es configuración.

## Conclusión

Dos defectos independientes que se taparon el uno al otro. El caso mal escrito produjo el rojo;
la falta de protección hizo que el rojo no importara. Arreglar sólo el caso dejaría el segundo
esperando al siguiente error, y arreglar sólo la protección dejaría CI rojo bloqueándolo todo.

Van los dos, y el orden importa: **primero el caso**, porque con la protección puesta y CI en
rojo no se puede fusionar ni el arreglo de la protección.
