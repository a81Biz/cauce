# PT-068 — Descubrimiento   `PHASE 2-B`

## Causa raíz: dos lecturas, y las dos van al archivo equivocado

```js
// tracker.mjs:1359  —  viabilidad()
const marcaSesion = leerJSON(join(IMPL, 'SESSION.json'));          // SIEMPRE el huerfano

// tracker.mjs:1485  —  sesion()
const marca = leerJSON(F_SESION()) ?? leerJSON(join(IMPL, 'SESSION.json'));   // el propio, o el huerfano
```

`PT-065` movió la **escritura** a `SESSION-<persona>.json` y dejó **dos** lecturas apuntando a
`SESSION.json`. Una lo usa siempre; la otra como respaldo.

## Los dos síntomas, reproducidos

**1 · Un usuario no declarado hereda el trabajo de otro.**

```
$ GIT_CONFIG_KEY_0=user.name GIT_CONFIG_VALUE_0="ci-runner" tracker sesion
  sesion desde 258be16 (2026-08-18)
    commits    32 (MEDIDO)
    archivos   144 (MEDIDO)
    lineas     13194 (MEDIDO)
    tareas     PT-055 · PT-060 · PT-065 · PT-075 · PT-076
```

Treinta y dos commits y trece mil líneas de Alberto, presentados a otra identidad como suyos y
etiquetados **`MEDIDO`**. No es una estimación optimista: es un dato con autoridad de medida
sobre trabajo ajeno.

**2 · `viabilidad` y `sesion` no coinciden.** El mismo `tracker`, dos respuestas sobre qué
sesión está abierta:

```
tracker sesion      ->  desde 7735ff4   (SESSION-alberto-martinez.json)
tracker viabilidad  ->  desde 258be16   (SESSION.json, el huerfano)
```

Por eso los quince veredictos de `EP-017` llevan `medido_en: 258be16`.

## Por qué el respaldo no se puede quitar sin más

`AC-05` de `PT-065` dice: *«con una sola persona, el comportamiento de hoy no cambia»*. El
respaldo existe para los proyectos anteriores a la `8.3.0`, cuyo único archivo es
`SESSION.json` sin campo `persona`. Quitarlo dejaría a esos proyectos sin sesión.

**La distinción que falta no es «hay respaldo o no»: es de QUIÉN es el respaldo.**

```
sin archivo propio + SESSION.json SIN persona    -> es mio (proyecto de una sola persona)
sin archivo propio + SESSION.json CON otra persona -> NO es mio: no hay sesion, y se dice
con archivo propio                                -> es mio
```

## Por qué pasó los seis AC de `PT-065`

`AC-03` decía «todo lo que la sesión deriva sale del trabajo de **su** persona» y `AC-06` «una
sesión ajena **se distingue** de la propia». Los dos se comprueban con casos que construyen la
marca **a mano** y llaman a `sesionDe`, que es pura.

**Ninguno ejercita la elección de archivo** — que es lo único que `PT-065` cambió, y así lo dice
su propio `out-of-scope`: *«`sesionDe` y `handoffDeSesion` son puras y reciben la marca; no la
leen. Esta tarea solo cambia de qué archivo sale.»*

Es el patrón que el `HANDOFF` llama «probar donde trabajo, no donde se decide».
