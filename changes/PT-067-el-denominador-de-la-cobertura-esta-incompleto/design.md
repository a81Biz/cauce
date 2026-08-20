# PT-067 — Propuesta   `PHASE 4` · `G2`

## 1 · `reglasDelMarco()` en `patrones.mjs`

Una función pura: recibe un lector, devuelve el universo. Sin `fs`, para que el arnés la pruebe
sin tocar el disco — el contrato que `patrones.mjs` ya sigue.

```js
export function reglasDelMarco(leer) {
  const reglas = new Map();
  const meter = (id, sev, doc) => { if (!reglas.has(id)) reglas.set(id, { id, sev, doc }); };
  for (const l of String(leer('RULES.md') ?? '').split(/\r?\n/)) {
    const m = /^\|\s*`([A-Z]+-R\d+[a-z]?)`\s*\|\s*(HARD|SOFT|CHECK)\s*\|/.exec(l);
    if (m) meter(m[1], m[2], 'RULES.md');
  }
  for (const doc of ['LEXICON.md', 'EXECUTION-MODES.md']) {
    for (const l of String(leer(doc) ?? '').split(/\r?\n/)) {
      const m = /^`([A-Z]+-R\d+[a-z]?)`\s*·/.exec(l);
      if (m) meter(m[1], 'HARD', doc);
    }
  }
  return [...reglas.values()];
}
```

**Las dos formas son las de `PT-066`, no unas nuevas.** Aquella tarea ya estableció que `RULES.md`
usa filas de tabla y que `LEXICON` y `EXECUTION-MODES` usan prosa. Reusar el mismo criterio es el
punto: si un día cambia el formato, cambia en un sitio.

**`if (!reglas.has(id))` es deliberado.** Ante un ID definido dos veces —hoy `FDGE-R22`, `R40` y
`R41`— gana `RULES.md`, que es el propietario. No lo arregla: lo hace determinista mientras
`PT-080` lo cierra. Contar 226 en vez de 223 por una duplicidad sería medir mal el arreglo.

**El prefijo no filtra.** El regex de prosa acepta cualquier `XXX-Rnn`, no sólo `LEX-` y `EXEC-`;
por eso las tres duplicadas aparecen. Filtrar por prefijo las habría ocultado, y esconder un
defecto para que salga un número redondo es justo lo contrario de esta tarea.

## 2 · El criterio de verificador

```js
export function verificadoresDe(id, herramientas) {
  return herramientas
    .filter(([nombre]) => nombre !== 'selftest.sh')
    .filter(([, txt]) => String(txt).split(/\r?\n/)
      .some((l) => l.includes(id) && !/^\s*(\/\/|\*|#|<!--)/.test(l.trim() ? l : ' ')))
    .map(([nombre]) => nombre);
}
```

Dos exclusiones, cada una con su motivo:

- **`selftest.sh` fuera.** El arnés prueba las herramientas; no lo ejecuta ninguna compuerta.
  Son 5 reglas —`SUITE-R22`, `R37`, `R41`, `R50`, `R54`— y `SUITE-R41` es la premisa de que
  cauce se instale sobre sí mismo.
- **Las líneas de comentario fuera.** Son 20, y entre ellas **`FDGE-R17`**, que `PT-079` acaba
  de declarar no comprobable en `TD-16`. Publicarla como verificada es la peor forma del error:
  una regla que *sabemos* que no se verifica, contada como que sí.

## 3 · El desglose

Sin él, quien vea `114 → 96` pensará que algo se rompió.

```
Cobertura mecánica de las reglas   (SUITE-R26 · aspira, no exige)
  universo                       223     (RULES.md 183 · LEXICON.md 26 · EXECUTION-MODES.md 14)
  ejecutadas por una compuerta    96 / 223   · HARD ...
  citadas sin compuerta que las corra  ...
  sin verificador                 ...

  El cambio respecto de la medida anterior (114 / 183):
    +40  reglas que el denominador no miraba: 26 LEX-* y 14 EXEC-*
    -NN  dejaban de contar por una MENCIÓN: NN sólo en comentarios, 5 sólo en selftest.sh
```

Las cifras del desglose se **derivan**, no se escriben: un texto a mano envejece en el primer
cambio de `RULES.md`.

## 4 · Lo que esta propuesta NO hace, y consta

- **`regla.mjs` no migra.** Funciona y está verificado desde `PT-066`. Cambiar dos herramientas a
  la vez es cómo se pierde cuál rompió qué. Queda en `TD`.
- **`build-core` y `verify-suite` no se tocan.** Leen `RULES.md` por su cuenta; son la misma
  deuda. `PT-080` trabaja sobre `verify-suite` desde otro ángulo.
- **No se escribe ningún verificador que falte.** La cifra subirá cuando se escriban; esta tarea
  arregla **la medida**, no la cobertura (`OUT` del intake).
- **No se distingue una cita dentro de una condición que puede fallar** de una que no. Eso es
  análisis estático de verdad. Lo que el criterio no puede afirmar se declara en `TD`.

## 5 · Escenarios

| # | Escenario | Espera |
|:---|:---|:---|
| E1 | `reglasDelMarco` con los tres documentos | los tres orígenes aparecen |
| E2 | un ID definido en dos documentos | una sola entrada, y gana `RULES.md` |
| E3 | una fila de `RULES.md` sin severidad reconocida (`PTSA-R*`) | no entra |
| E4 | una mención en línea de comentario | **no** cuenta como verificador |
| E5 | una regla citada sólo por `selftest.sh` | **no** cuenta como verificador |
| E6 | una regla citada en código real | sí cuenta |
| E7 | el universo real del repositorio | 223, y la suma de las clases es exactamente 223 |
| E8 | el desglose | deriva sus dos números, no los lleva escritos |

## 6 · `G2`

```
Firmado por lote: EP-017 · delegada · 2026-08-19 · Alberto Martínez
Viabilidad (FDGE-R54): SAFE · registrada en REGISTRY.allocations[].viabilidad
```
