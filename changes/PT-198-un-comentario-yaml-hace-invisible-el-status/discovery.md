# `PT-198` · `discovery.md` — lo medido, que corrige al intake en dos cifras

## 1. El alcance es **siete** expresiones y **cuatro** campos, no tres y uno

El intake dice *«la misma expresión está escrita a mano en tres sitios»* y habla sólo de `status`.
Medido sobre el árbol:

```
tracker.mjs:3105   /^type:[ \t]*([A-Z]+)[ \t]*$/m
tracker.mjs:3754   /^phase:[ \t]*\d+[ \t]*$/m
tracker.mjs:3757   /^status:[ \t]*\S+[ \t]*$/m
tracker.mjs:4594   /^status:[ \t]*(\S+)[ \t]*$/m     ← RE_ESTADO
tracker.mjs:4859   /^status:[ \t]*\S+[ \t]*$/m
tracker.mjs:5158   /^epic:[ \t]*\S+[ \t]*$/m
tracker.mjs:5209   /^status:[ \t]*\S+[ \t]*$/m
```

**Siete expresiones, cuatro campos, un solo archivo.** Ningún otro `.mjs` de `tools/` los tiene.
`status` es donde se vio; `type`, `phase` y `epic` tienen el defecto **idéntico** y nadie lo ha
disparado todavía.

Esto no amplía el alcance por gusto: `AC-04` pide que la expresión viva **en un sitio**, y arreglar
`status` dejando tres campos con la misma avería sería escribir el sitio único y **no usarlo** —
`CE-007` en la misma tarea que lo persigue.

## 2. Hoy **ningún** intake lo dispara, y eso cambia el argumento

```
$ grep -rnE '^(status|phase|type|epic):[ \t]*\S+[ \t]+#' changes/*/intake.md
changes/PT-198-un-comentario-yaml-hace-invisible-el-status/intake.md
```

**Una sola coincidencia, y es la cita del propio intake dentro de un bloque de código.** El de
`EP-023` —el que lo destapó— ya se corrigió quitando el comentario.

Así que no se está arreglando un rojo: **el defecto está latente**. Lo que se compra es que no
reincida y que el mensaje deje de mentir. Decirlo importa porque la evidencia no puede ser «ahora
pasa»: no pasaba nada antes tampoco. Tiene que ser un caso que **plante** el comentario.

## 3. Lo que hace daño no es el regex: es el mensaje

```js
throw new Error(`el intake de ${id} no declara «status»: no se puede sincronizar (SUITE-R08).`)
```

El fallo real es **«no supe leerlo»** y el texto afirma **«no lo declara»**. Quien lo lea irá a
añadir un campo que ya está en la línea 5. Es la distinción que `PT-093` hizo entre una constancia
**malformada** y una **ausente**: dos defectos distintos con arreglos distintos (`RULE-02`).

## 4. Dónde va el sitio único

`sincronizaIntake` ([tracker.mjs:5158](../../docs/methodology/tools/tracker.mjs), [:5209](../../docs/methodology/tools/tracker.mjs))
ya existe y ya recibe la expresión **como parámetro** — es decir, hoy es el sitio único de la
*escritura* y **no** de la *expresión*. Ahí es donde falta: que el campo se nombre y la expresión
se derive, en vez de que cada llamada traiga la suya.

## 5. Un riesgo de la propia tarea   `CE-017`

Este documento y el intake **contienen** las cadenas que la comprobación busca. Una comprobación de
alcance «todo el texto» fallaría acusando a quien documenta el hecho — es `CE-017`, y `PT-193` ya
pagó esta lección con las contraseñas del fixture. El caso planta su comentario **en un fixture**,
no lo busca en el árbol.

## 6. Lo que NO se toca

- **No se prohíben los comentarios**: son YAML válido y llevan información (`EP-023` guardaba ahí
  el motivo del `CHALLENGE`).
- **No se toca el YAML de otros artefactos** —`HANDOFF`, `CHECKPOINT`— que no son intakes.
