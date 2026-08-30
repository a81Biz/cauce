# `PT-204` · `discovery.md` — la deuda tiene forma, y no es la que parecía

## 1. La cifra, y su composición

```
universo                        244     (RULES.md 191 · LEXICON.md 37 · EXECUTION-MODES.md 16)
ejecutadas por una compuerta    142
sin ningún verificador           91

  por familia   FDGE 24 · SUITE 17 · FND 10 · LEX 10 · QA 9 · EXEC 9 · INTAKE 5 · FIDE 4 · FPGE 3
  por severidad HARD 63 · SOFT 9 · fuera de RULES.md 19
```

**63 reglas `HARD` que no ejecuta nada.** Y `audit` lo imprime **en cada `npm run verify`** desde
hace lotes.

## 2. El reparto **no es al azar**, y ahí está el criterio que `AC-02` pedía

| Familia | Sin verificador | Qué gobierna | ¿Se ejercita **aquí**? |
|:---|---:|:---|:---|
| `FDGE` | 24 | Cada sesión de trabajo | **Sí, constantemente** |
| `SUITE` | 17 | La suite y su instalación | **Sí** |
| `FND` | 10 | Foundation | Sólo al documentar |
| `LEX` | 10 | Vocabulario | Sí, indirectamente |
| `EXEC` | 9 | Modos y compuertas | **Sí** |
| `QA` · `FIDE` · `FPGE` | 16 | Componentes de destino | **Casi nunca** |
| `INTAKE` | 5 | La forma del intake | **Sí** |

**Las 16 de `QA`/`FIDE`/`FPGE` no cuestan lo mismo que las 24 de `FDGE`.** Este repositorio es
autoalojado (`SUITE-R41`): gobierna su propio trabajo con `FDGE` a diario y **no ejecuta** `QA`,
`FIDE` ni `FPGE` prácticamente nunca. Una regla sin verificador de un componente que no se usa
aquí es deuda **del destino**, no de la fuente — y se descubre allí, no aquí.

**Ése es el ranking por consecuencia**: no por cuántas son, sino por **cuántas veces al día pasa
por delante de ellas un trabajo real**.

## 3. Lo que ya existe y nadie usa

`SUITE-R26` declara esta cobertura como **«aspira, no exige»**. La cláusula es honesta —no toda
regla es mecanizable— **y es también la puerta**: convierte 91 incumplimientos potenciales en un
número que **se publica y no se cobra**.

Y hay un mecanismo al lado, sin usar para esto: la clasificación exhaustiva de `PT-078` ya separa
**`NO_VERIFICABLE`** —declarada con motivo y firma— de **`PENDIENTE`** —deuda—. Hoy:

```
VERIFICADA  114     NO_VERIFICABLE  6     PENDIENTE  124
```

**Sólo 6 están declaradas como no mecanizables.** Las otras 118 son deuda **por omisión**, no por
juicio: nadie ha dicho de ellas ni que se puedan verificar ni que no.

## 4. La pregunta que nadie ha hecho, y que es la del `AC-03`

**Hoy la cobertura puede bajar sin que nadie se entere.** Añadir una regla `HARD` sin verificador
no lo impide nada: `audit` publicará un número un poco peor y nadie lo comparará con el anterior.

Eso es lo que convierte una deuda en una **tendencia**, y es lo único de esta tarea que **cambia
comportamiento** en vez de producir un documento.

## 5. Lo que NO se puede hacer, y por qué   `SUITE-R26`

**Auditar las 244 está descartado por el firmante**, con motivo:

> *«Llevamos ya muy adelantado el marco y regresar a revisar que esté es una regresión demasiado
> grande»*

Y el resultado sería peor que el problema: 124 rojos sin salida es **la compuerta siempre roja que
enseña a saltársela** — lo mismo que `SECRETOS-EXCEPCIONES.md` describe para su caso.

**Y «subir la cifra» tampoco es criterio**: sería fijar el número de lo correcto (`HANDOFF -18`).
Una cobertura de 200/244 con las 44 peores fuera es peor que una de 150/244 bien elegida.

## Conclusión

**Sí hace falta un lote, y no es el que parecía.**

`EP-029` **no es «verificar las 91»**. Es **juzgar las 123 sin juzgar** y **verificar las que
sobrevivan al juicio siendo además frecuentes** — dos trabajos de tamaño muy distinto que hoy
estaban fundidos en una sola cifra.

### Lo que esta investigación establece

1. **`PENDIENTE` mentía por fusión.** `123 = DEUDA 0 + SIN_JUZGAR 123`. No hay deuda medida: hay
   **123 reglas que nadie ha mirado**. `RULE-02`.
2. **Juzgar cuesta un párrafo; verificar cuesta una tarea.** Y un juicio lo puede emitir cualquier
   tarea que toque esa regla, mientras que «escribir 118 verificadores» no tiene por dónde empezar.
3. **El criterio de orden es la frecuencia, no la severidad.** `FDGE`+`SUITE`+`EXEC`+`INTAKE` = 55
   se ejercitan aquí cada día; `QA`+`FIDE`+`FPGE` = 16 casi nunca, y su deuda se paga en el
   **destino**. Una `HARD` de `FIDE` —que corre una vez, al incubar— no cuesta lo mismo que una de
   `FDGE`, que gobierna cada tarea.
4. **El criterio de éxito de `EP-029` no puede ser «subir la cifra».** Sería fijar el número de lo
   correcto (`HANDOFF -18`): una cobertura de 200/244 con las 44 peores fuera es peor que una de
   150/244 bien elegida. El criterio es **que no quede ninguna sin juzgar**.

### Lo que se hizo aquí, y por qué es tan poco

**Sólo `AC-03`: que la cobertura no pueda bajar en silencio.** Es lo único que cambia
comportamiento, y sin ello esta tarea sería **una investigación que documenta que nadie hace nada,
sin hacer nada** — el defecto que denuncia, cometido al denunciarlo.

### Lo que queda abierto, y para quién

**`EP-029` necesita `G1` del firmante.** Esta investigación dice **que hace falta**, **de qué
tamaño** y **en qué orden**; admitirlo es una decisión suya, como lo fue la de `EP-027` y `EP-028`.
