# PT-008 — Diseño   `PHASE 4`

## La lógica, pura

```js
comentarioSinResponder(comentarios) → boolean
```

`comentarios` es una lista de cuerpos, del más viejo al más nuevo. Devuelve `true` si hay uno
sin marca después del último con marca. Si **ninguno** tiene marca, devuelve `null`: no se puede
saber, y eso se declara (`RULE-06`).

## La marca

```html
<!-- cauce:agente -->
```

Invisible al renderizar, estable, y buscable. La escribe `tracker` al comentar; el agente que
comenta a mano tiene que añadirla, y si no lo hace su propio comentario cuenta como humano —
que es un fallo del lado seguro.

## `SUITE-R43`

Condicionada a plataforma declarada, como `SUITE-R42`. Comprueba `verify-fdge` sobre cada PT
vivo con issue: `fail` si hay pendiente, `warn` con `SIN EVALUAR` si no se puede saber.

## Resolución de `G2`   `FDGE-R13`

```
Veredicto:    APROBADA · 2026-08-13
Resuelta por: Alberto Martínez · escrita por el agente POR DELEGACIÓN
Cubre SUITE-R06e para: tracker.mjs · verify-fdge.mjs · RULES.md · CORE.md · selftest.sh
NO cubre: G4 ni la publicación.
```
