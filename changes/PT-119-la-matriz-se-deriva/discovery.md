# Descubrimiento — `PT-119`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió.

---

## 1 · La pregunta que no se podía responder

> «quiero la matriz para saber **qué falta por corregir**, qué errores se repiten y cómo los vamos
> a solventar»

`EP-020` §2.1 la respondió **a mano**: diecisiete clases, con su recuento y su estado. Y esa tabla
ya está desactualizada — se escribió el 2026-08-22 y `PT-125` midió después con otro denominador.

Es `H-007` otra vez, aplicado a una tabla nueva: `PT-091` demostró que una cifra transcrita caduca
**en un día**. Una matriz escrita a mano sería la instancia siguiente de `CE-010`.

## 2 · La fuente ya existe

`PT-125` publicó `EVENTOS.jsonl`: 164 entradas recorridas, 63 instancias, con cita literal,
polaridad y el ordinal que cada entrada declara. Y su cabecera declara el **denominador**, que es
lo que impide sumar entradas con ocurrencias.

## 3 · Lo que faltaba: quién es dueña de cada clase

`AC-04` pide que «regla dueña» se **derive**, no se transcriba. Medido:

```
$ grep -c 'CE-0' docs/methodology/RULES.md    →  0
```

**Ninguna regla citaba ninguna clase.** Con eso, la derivación honesta habría dado *diecisiete de
diecisiete sin dueño* — cierto, pero inútil: hay reglas que **sí** gobiernan una clase y no lo
decían en ninguna parte.

La vía elegida: que **la regla lo diga en su propio texto**. Diez reglas citan ahora su clase
(`SUITE-R59`, `SUITE-R58`, `FDGE-R52`, `SUITE-R14`, `SUITE-R46`, `FND-R14`, `FDGE-R29`,
`SUITE-R09`, `FDGE-R19`, `SUITE-R08`). La pertenencia vive donde vive la regla, y ninguna tabla
aparte puede divergir de ella.

## 4 · Dos formas de definir una regla, y la primera versión sólo veía una

```
| `SUITE-R59` | HARD | texto |        ← fila de tabla
`SUITE-R14` · **(CHECK)** texto…      ← forma suelta, varias líneas
```

Mirar sólo la fila dejaba a `SUITE-R14` fuera, y con ella a `CE-008`: **una clase habría salido
«sin dueño» teniendo dueño**. Peor que no derivar nada, porque parece un hecho.

## 5 · Y una cifra publicada bajo la etiqueta equivocada

La primera versión escribía «142 entradas recorridas». Son **164**. La diferencia: yo contaba
`origen:tarea` distintos, y `PT-094` tiene **tres** entradas. La cifra correcta ya la había
derivado `eventos.mjs` y estaba en la cabecera del `.jsonl`; recontarla aquí era una segunda
fuente del mismo hecho —`CE-008`— que además daba un número distinto —`CE-010`—.

Ahora se lee de su generador, y si no viene se dice `SIN EVALUAR`.

---

## Conclusión

**Nueve de diecisiete clases no tienen regla que las reclame**, y las tres que más se repiten
están entre ellas:

| Clase | Veces | Ordinal declarado |
|:---|--:|--:|
| `CE-004` probar donde trabajo, no donde se decide | 7 | **9** |
| `CE-001` el proxy en lugar del hecho | 6 | **12** |
| `CE-003` un argumento por la detección de `ROOT` | 6 | **7** |

**Y hay una décima, distinta y peor: `CE-002` tiene regla y la regla no puede fallar.**

```
$ grep -oE "(fail|warn|gap)\(\s*'SUITE-R59'" docs/methodology/tools/*.mjs
(vacío)
```

`SUITE-R59` existe desde la `12.0.0`, gobierna la clase medida **27 veces**, y **ninguna
herramienta emite por ella**. `audit` detecta construcciones frágiles, pero lo hace bajo su propio
recuento de huecos, no bajo la regla. Es exactamente `P-003` de la Declaración de Valor: *«cada
regla HARD que declara comprobación tiene un script que puede fallar»*.

Ese hallazgo lo produjo la matriz en su **primera corrida**, y es la prueba de que servía para lo
que se pidió.
