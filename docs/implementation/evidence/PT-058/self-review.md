# PT-058 — Autorrevisión   `PHASE 6`

## Lo entregado

```
MEDIDO · ESTIMADO · SIN EVALUAR    vocabulario cerrado y ORDENADO
cifra(valor, naturaleza)           inmutable · sin naturaleza LANZA
sumar · restar                     contagian hacia la peor
peorNaturaleza · textoCifra
verify-suite                       comprueba la CONSTANTE, no la prosa
LEXICON §6.5c                      el contrato · sin regla nueva
casos                              706 → 738
```

## Lo que la tarea resultó ser

No introduce vocabulario nuevo: **regulariza el que el marco ya usaba sin declarar**.

```
SIN EVALUAR   →  50 usos en 13 archivos   ·   0 en LEXICON
MEDIDO        →  0 usos                    ·   0 en LEXICON
ESTIMADO      →  0 usos                    ·   0 en LEXICON
```

Trece archivos: seis documentos normativos —incluido **`RULES.md`**— y siete herramientas. Es
exactamente lo que `LEX-R21` prohíbe, y el marco llevaba ocho lotes haciéndolo. Declararlo no
amplía nada: lo pone al día con su propia regla.

**`verify-suite` no lo veía** porque comprueba vocabulario *derogado* (`LEX-R20`) —una lista
cerrada, escrita a mano— y no lo contrario: un término usado como si fuera canónico sin estar
declarado. Son dos comprobaciones distintas y solo existía una.

## Por qué un tipo y no una convención

Los 50 usos son **prosa en mensajes**. Funcionan para quien lee la salida y no son comprobables:
sobre texto no hay forma de que «una cifra sin naturaleza» falle, y `AC-04` pide exactamente eso.

## El caso que da nombre a la tarea

La inversa lo enseña mejor que ninguna explicación. Con `SIN EVALUAR` valiendo `0` y sin contagio:

```
restar(100 MEDIDO, SIN EVALUAR)  →  { valor: 100, naturaleza: MEDIDO }
```

El presupuesto de `PT-059` diría que **queda todo** justo cuando no sabe nada — y lo diría **con la
autoridad de un dato medido**. Es el `estimated_used: 67` que `LEX-R26` dejó fuera de
`CHECKPOINT.json` por criterio, con otra cara.

Siete casos caen al neutralizarlo.

## Una decisión que podría discutirse

Una cifra sin naturaleza **lanza**. La alternativa conservadora era asumir `SIN EVALUAR`: nunca
mentiría a favor. La descarté porque convertiría **un olvido del programador en un dato válido**
que se propaga en silencio, y el sitio donde alguien puede arreglarlo es donde se escribió.

Es la diferencia entre un marco que se defiende de sus datos y uno que se defiende de sí mismo.

## Tres veces la misma respuesta, sin planificarlo

```
PT-056   corresponde: null    no tener checkpoint ≠ tener uno equivocado
PT-057   referencia: null     no hay datos suficientes ≠ el coste es cero
PT-058   valor: null          no saber ≠ no haber
```

No lo diseñé así. Sale de que las tres tareas tocan la misma frontera, y de que en las tres el
cero era la respuesta cómoda y falsa.

## Lo que no queda comprobado

**Que alguien use `cifra()`** en vez de un número pelado — nada obliga a envolver. Lo garantizado
es que **lo envuelto no puede mentir**.

**Que los 50 usos en prosa digan la verdad** — siguen siendo texto y esta tarea no los toca. Está
en el `out-of-scope` con su razón: refactor de trece archivos, siete de ellos herramientas que CI
ejecuta, sin mejora hoy.

**Que la inversa demuestre `E13`** — «…y al revés también» siguió verde con el criterio
neutralizado, porque la neutralización tomaba la naturaleza del primer operando y con
`(ESTIMADO, MEDIDO)` acierta por casualidad. El caso distingue; esa inversa concreta no lo prueba.

**Que tres naturalezas basten** para lo que `PT-059` y `PT-060` necesiten. No está demostrado:
está apostado. Si hiciera falta una cuarta, `verify-suite` se pone en rojo — que es lo que se
quiere.

## Un defecto mío, de camino

Escribí los ocho artefactos de `PHASE 4` en `changes/PT-058-cada-cifra-dice-que-es`,
**inventándome el slug**. El registro dice `el-presupuesto-dice-de-que-tipo-es-cada-cifra`. Lo
detectó `--gate G2` al no encontrar el `intake.md` — que seguía donde debía, solo.

El slug lo **asigna** el registro igual que el ID (`SUITE-R08`), y yo lo derivé del título de la
tarea de memoria. Es el mismo error de fondo que `AC-04` persigue en las cifras: un dato de
memoria presentado como si fuera derivado.
