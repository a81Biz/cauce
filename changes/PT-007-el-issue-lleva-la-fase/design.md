# PT-007 — Diseño   `PHASE 4`

## La derivación, en una función pura

```js
etiquetasDe(alloc) → ['fase: 4', 'G2']      // dos, o una si no hay compuerta esperando
```

Pura y exportada, como `compararEspejo`: es lo que permite probarla sin plataforma. El mapa
fase→compuerta se declara una vez y sale de `CORE.md` §Fases.

## El espejo, con una comprobación más

```
toda allocation viva  →  issue abierto                    (ya estaba)
todo issue abierto    →  allocation viva                  (ya estaba)
las etiquetas del issue  →  las que el registro deriva    (nuevo)
```

La tercera es lo que convierte «publicar el estado» en «espejar el estado». Publicar sin
comprobar es escribir en dos sitios y esperar que no se separen.

## `tracker estado`

Lee **solo el registro** y no toca la plataforma: por eso funciona sin credencial y sin
plataforma declarada. Responde la misma pregunta que el tablero, en local.

```
EP-002 · github-como-maquina-de-estados        IN_PROGRESS
  PT-006  CHORE    S3  DONE     fase 8   —              #10
  PT-007  FEATURE  S3  READY    fase 1   G1 pendiente   #11
```

## Qué NO cambia

- El registro sigue asignando. **Ninguna lectura de GitHub alimenta el registro.**
- Sin `tracker.plataforma`, nada de esto ocurre.
- El cuerpo del issue no se reescribe: sigue referenciando el intake.

## Resolución de `G2`   `FDGE-R13`

```
Veredicto:    APROBADA · 2026-08-13
Resuelta por: Alberto Martínez · escrita por el agente POR DELEGACIÓN («toma mi VoBo y firma a
              mi nombre», 2026-08-13)
Cubre SUITE-R06e para: docs/methodology/tools/tracker.mjs · selftest.sh
NO cubre: G4 ni la publicación.
```
