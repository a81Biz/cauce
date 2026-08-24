# Descubrimiento — `PT-118`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió.

---

## 1 · Lo que el firmante pidió no se puede responder hoy

> «quiero saber qué ocurrió, qué se mejoró, **qué se repite**»

Las dos primeras las contesta `HISTORY.log`. La tercera **no**, y la razón es concreta: el mismo
tropiezo está escrito con quince redacciones distintas a lo largo de 131 entradas. Nada las junta,
porque nada las **nombra**.

`EP-020` §2.1 ya hizo el trabajo de agruparlas a mano: diecisiete clases, con su recuento y su
estado. Ese es el material. Lo que falta es que cada una tenga **un nombre canónico y un solo
sitio donde se define** — sin eso, `PT-125` clasificaría contra una lista que vive en el intake de
un lote, y `PT-119` derivaría una matriz de algo que no es autoridad de nada.

## 2 · Qué dice `LEXICON` hoy sobre identificadores

```
$ sed -n '150,205p' docs/methodology/LEXICON.md
```

Dos clases, y sólo dos: **de trabajo** (§4.1, quince prefijos) y **de regla** (§4.2, diez). Las
quince de trabajo se asignan **exclusivamente** desde `REGISTRY.json` (`LEX-R04`), y `LEX-R06`
detalla el acto de asignar.

Una clase de evento **no es ninguna de las dos**: no se abre ni se cierra, no tiene fases ni
compuertas, y no obliga a nada. Si no se declara la tercera clase, sólo hay dos salidas y las dos
son malas: meterla en el asignador —y hacer que el número de clases dependa del orden en que
alguien las escribió— o dejarla sin declarar y que alguien la numere contando filas, que es
exactamente lo que `LEX-R04` prohíbe.

## 3 · El prefijo, medido

```
$ sed -n '157,177p' LEXICON.md | grep -oE '`[A-Z]+-'   # trabajo
AC E EP H INC P PT QA QD QR R RC TS U
$ sed -n '177,205p' LEXICON.md | grep -oE '`[A-Z]+-[RP]'   # regla
EXEC FDGE FIDE FND FPGE INTAKE LEX PTSA QA SUITE
$ grep -ra 'CE-[0-9]' docs/ bin/
(vacío)
```

**`CE` está libre en las dos tablas.** Pero el riesgo no era el prefijo: era la **subcadena**.
`CE-001` contiene `E-001`, así que una expresión que buscara `E-\d+` sin anclar lo cazaría.

```
$ grep -hoE "[^A-Za-z]E-.?d" docs/methodology/tools/*.mjs
(vacío)
```

Ninguna. Los `E-\d+` que hay son `EP-\d+`, precedidos de letra. Y los únicos patrones de una
sola letra son `P-\d+` y `H-\d+`, que no pueden casar dentro de `CE-NNN`.

## 4 · Un hallazgo colateral, y se declara

La misma medición encontró que **`tools/verify-ptsa.mjs:203` usa `/H-\d+/` sin anclar**:

```js
const h = c.match(/H-\d+/)?.[0];
```

No afecta a `CE` —`CE-001` no contiene `H-`— pero es un riesgo latente para cualquier prefijo
futuro acabado en `H`. Va declarado en `LEXICON` §4.4 y en `out-of-scope.md`: **no se arregla
aquí**, porque arreglarlo es tocar el verificador de otro componente sin allocation que lo
cubra — que es justo lo que `CE-016` nombra.

## 5 · Qué llega al núcleo, medido

```
$ grep -c '^CE-0' docs/methodology/CORE.md
0
```

Cero antes del cambio. `build-core` compila **reglas**, y la lista de IDs de `CORE.md` estaba
**escrita a mano** dentro del generador:

```
PT EP QA QR QD H E P R INC · AC-nn TS-nn RC-nn por PT · RULE-nn en 11-Conventions
```

Una transcripción dentro de la herramienta que existe para que el núcleo no sea una copia. Es
`CE-010` —la cifra transcrita caduca— aplicado a una lista.
