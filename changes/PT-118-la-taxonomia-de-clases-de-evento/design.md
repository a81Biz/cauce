# Diseño — `PT-118`   `PHASE 4`

> La propuesta completa. Es lo que `G2` resuelve.

---

## 1 · Las tres piezas

| Pieza | Dónde | Qué hace |
|:---|:---|:---|
| `LEXICON` §4.4 + `LEX-R31` + `LEX-R32` | `LEXICON.md` | declara la tercera clase, su excepción a `LEX-R04`, y las diecisiete filas |
| La comprobación de `LEX-R32` | `tools/verify-suite.mjs` | **falla** si un documento cita un `CE-NNN` que §4.4 no declara |
| La derivación | `tools/build-core.mjs` | lleva la tabla al núcleo **derivándola**, y dice `SIN EVALUAR` si no está |

## 2 · El identificador

```
CE-NNN     Clase de Evento
```

- **No** se asigna desde `REGISTRY.json`. Es la única excepción a `LEX-R04`, y `LEX-R31` la
  enuncia con su motivo en lugar de dejarla implícita.
- **No** se abre ni se cierra: se **cita**.
- El número no cambia nunca. `LEX-R04` sigue rigiendo lo demás: único, permanente, nunca
  reutilizado.

**Por qué `CE` y no otra cosa** está en `discovery.md` §3, con los comandos. Lo que importa del
diseño es que la elección se **midió**: el riesgo no era el prefijo sino la subcadena `E-001`
dentro de `CE-001`, y ninguna herramienta busca un `E-\d+` suelto.

## 3 · Qué cuenta como DECLARAR y qué como CITAR

La comprobación necesita distinguirlo, y usa el mismo criterio que `SUITE-R14` usa para las
reglas — **la posición**, no la presencia:

```
DECLARAR   la línea empieza por  | `CE-NNN` |     (primera celda de una fila de tabla)
CITAR      el ID en cualquier otra posición
```

Así, un documento que **explica** una clase citándola no la está redeclarando, y `LEXICON` sigue
siendo el único propietario (`LEX-R23`).

Se excluyen dos archivos del barrido: `LEXICON.md` —es la fuente— y `CORE.md` —es su compilado, y
tratarlo como un citador sería acusar al espejo.

## 4 · Falla, no avisa

`LEX-R32` produce `fail`, no `warn`. Una clase inventada no es un detalle de estilo: `PT-119`
derivará `MATRIZ.md` cruzando clases con reglas y verificadores, y una clase que no existe
produce una fila de la matriz que no se puede contrastar contra nada.

Cuando `LEXICON` no se puede leer, o no declara ninguna clase, se dice **`SIN EVALUAR`** y no se
da nada por bueno (`RULE-06`).

## 5 · La derivación al núcleo

```js
const clasesDeEvento = (() => {
  const filas = [...lexicon.matchAll(/^\|\s*`(CE-\d{3})`\s*\|([^|]*)\|/gm)]
    .map((m) => `${m[1]}  ${m[2].trim()}`);
  return filas.length ? filas.join('\n')
    : 'SIN EVALUAR: LEXICON §4.4 no declara ninguna clase de evento.';
})();
```

Y la línea de IDs del núcleo, que estaba escrita a mano, gana la frase que faltaba:

```
CE-nnn NO sale del registro: es la tercera clase, y se declara en LEXICON §4.4 (LEX-R31)
```

**Coste**: `CORE.md` pasa de ~25 696 a ~25 990 tokens. Unos 300 tokens por que el agente pueda
citar una clase sin abrir un segundo documento.

## 6 · Lo que este diseño NO hace

- **No clasifica ninguna entrada.** Eso es `PT-125`.
- **No deriva ninguna matriz.** Eso es `PT-119`.
- **No cierra la lista para siempre.** Cerrada por versión, ampliable por cambio de metodología.
- **No arregla el `/H-\d+/` sin anclar de `verify-ptsa.mjs:203`.** Se declara; arreglarlo es
  tocar otro componente sin allocation que lo cubra.
