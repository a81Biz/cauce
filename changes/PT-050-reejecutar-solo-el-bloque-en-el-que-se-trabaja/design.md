# PT-050 — Diseño   `PHASE 4`

## Dónde se filtra, y por qué ahí

```sh
# tools/selftest.sh:64-75
chk()   { local name="$1" pat="$2"; shift 2; local out; out="$("$@" 2>&1)"; … }
chkno() { local name="$1" pat="$2"; shift 2; local out; out="$("$@" 2>&1)"; … }
```

**Son las dos únicas puertas.** Los 453 `chk`/`chkno` del archivo pasan por ahí, así que el filtro
cubre todos sin tocar ninguno — y sin que añadir un caso nuevo mañana requiera acordarse de nada.

El filtro va **antes** de ejecutar `"$@"`: un caso descartado no lanza su comando, y de ahí sale
el ahorro.

## El universo y los ejecutados son dos cifras

```
UNIVERSO   todo caso que PASA POR LA PUERTA
TOTAL      los que ademas se EJECUTAN
```

Con `--solo`, la salida final dice **las dos**:

```
selftest: OK · 16 de 536 casos   (--solo "PT-049")
```

Sin `--solo` las dos coinciden y se imprime como siempre. Es la forma de que un subconjunto no
pueda leerse como la batería **ni siquiera fuera de contexto** — en una evidencia, en un PR, en
una captura que alguien mire dentro de tres lotes.

## El parseo, extendido y no reescrito

`PT-049` dejó el bucle que separa banderas de posicionales. `--solo` **toma un valor**, así que
consume dos posiciones — y ahí está la trampa: sin eso, el patrón acabaría en el posicional y de
ahí en `WORK`, que es exactamente el defecto que `PT-049` encontró con `-q`.

`--solo` **sin valor** es un error explícito: un patrón vacío casaría con todo, y entonces la
bandera diría que filtró cuando no filtró nada. Ese silencio es el que `AC-03` persigue.

## Cómo casa el patrón

Sobre el **nombre** del caso y de forma **literal**, no como expresión regular. Un nombre lleva
`«»`, `·`, `…` y paréntesis; pedir que se escapen convertiría el filtro en un acertijo, y un
paréntesis sin cerrar sería un error de sintaxis en vez de un «no casa» — que es justo el defecto
que `PT-049` se encontró al escribir sus propios casos.

## Lo que este diseño **no** hace

No salta los 181 `build_fixture`: el techo medido es el 55 %. No parte el archivo. No cambia lo
que un caso comprueba. Y no toca `revento()` — un caso filtrado no se ejecuta, así que no puede
reventar.
