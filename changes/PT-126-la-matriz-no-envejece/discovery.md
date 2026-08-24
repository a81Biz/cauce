# Descubrimiento — `PT-126`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió.

---

## 1 · El bucle estaba abierto por el último tramo

`PT-118` nombró las clases. `PT-125` las aplicó a 163 entradas. `PT-119` las contó y publicó
`MATRIZ.md`. Y ahí se paraba: **la matriz existía y nada la miraba.**

Es `CE-007` —«existe la herramienta y nada la echa en falta»— con **siete instancias declaradas**
en el ledger, la última en `PT-114`. Construir una octava habría sido el desenlace más irónico
posible del lote que las cuenta.

## 2 · Dónde ya se mira

```
$ node docs/methodology/tools/tracker.mjs sellar
  deuda de sellado   …
  inventario         …
  grafo              …
  documentos de entrada  …
```

`sellar` **ya recorre** cuatro cosas antes de una versión. Es el patrón que `PT-110` estableció:
una medición en un comando nuevo es una medición que nadie ejecuta.

## 3 · El umbral, y de dónde sale

El intake lo declara como juicio: **3**, porque las cuatro clases hoy `CERRADA` se cerraron cuando
alguien **contó**, y la menor de esas cuentas fue tres.

No se esconde en el código: vive en `REGISTRY.tracker.umbral_clase_sin_dueno`, con su motivo
escrito al lado, para que subirlo o bajarlo sea un acto visible (`SUITE-R38`).

## 4 · Lo que el umbral selecciona hoy, medido

```
  matriz de eventos  17 clases · umbral 3 para ser candidata
                     6 sin regla que las reclame y con 3+ instancias:
                       CE-004  8x  Probar donde trabajo, no donde se decide
                       CE-001  7x  El proxy en lugar del hecho
                       CE-003  7x  Un argumento se cuela por la detección de ROOT
                       CE-005  5x  Verde por no haber mirado
                       CE-015  4x  El cierre destapa más que el reparto
                       CE-007  3x  Existe la herramienta y nada la echa en falta
                     CE-002: tiene regla (SUITE-R59) y NADA EMITE POR ELLA.
```

**Seis candidatos, y ninguno lo eligió nadie.** Salen de la evidencia.

## 5 · Y un séptimo caso, que es peor

`CE-002` **sí** tiene regla dueña —`SUITE-R59`, escrita tras medir 27 roturas— y **ninguna
herramienta emite por ella**. Una obligación que no puede fallar es distinta de una clase sin
dueño, y peor: la primera parece cubierta.

Por eso se publica aparte, con su frase propia.

---

## Conclusión

La cadena queda cerrada: **una clase que se repite tres veces sin dueño aparece sola**, en el
comando que ya se ejecuta antes de sellar una versión, y `FPGE` la recoge de `MATRIZ.md` sin que
nadie transcriba la cifra.

Lo que **no** se cierra, y es deliberado: **no se promueve nada**. `FPGE-R04` dice que el marco
propone y la persona dispone, y esta tarea no lo toca.
