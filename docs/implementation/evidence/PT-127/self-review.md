# Autorrevisión — `PT-127`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

Un detector de trabajo sin allocation: `git log` cruzado con `REGISTRY.json`, dentro de
`verify-fdge`. Cinco clases de hallazgo, tres salidas limpias, agrupado por lo que dice y con los
`sha` nombrados uno a uno.

**Lo que hace distinta a esta clase de defecto** no es que exista una herramienta que no se usó —
eso es «el acto fuera del comando»— sino que **no había gobierno en absoluto**. Dieciséis
instancias medidas en el ledger, y a las dieciséis las cortó una persona o no las cortó nadie.

## Los cuatro defectos que aparecieron construyéndolo

Van aquí porque son la evidencia de que la comprobación se **comprobó**, y no sólo se escribió.

**1 · El parseo veía un commit de sesenta.** Separador al final del formato, con `--name-only`
escribiendo los archivos después: la cabecera de cada commit quedaba pegada al bloque anterior.
Lo delató una salida que decía `1 commit(s)` sobre una ventana de 60 — el número era absurdo y
por eso se vio; si hubiera dicho `48` habría pasado.

**2 · `merge` en la lista de tipos de commit.** `FDGE-R19` enumera seis y `merge` no es uno:
añadirlo era legislar desde una herramienta lo que la regla no dice. Se sustituyó por el número
de padres, que es un dato de git y no un vocabulario inventado.

**3 · La clasificación mentía en 34 de 34.** `clasificaRodeo` buscaba el identificador y la
palabra «excepción» en el ledger **entero**. Como el documento menciona `EP-019` en un sitio y
«excepción» en otro, todos los hallazgos salían `FORZADO`: un motivo plausible y falso, que
además repartía la culpa al revés — decía «el marco te obligó» donde nadie había declarado nada.

**4 · Y el arreglo del 3 tampoco troceaba.** `split(/\b(?=## )/)` devuelve **una** entrada de
226: un límite de palabra no cae entre un salto de línea y una almohadilla, porque las dos son
no-palabra. «La misma entrada» volvía a ser el documento entero — exactamente la laxitud que el
troceo existía para quitar.

**El cuarto es el que hay que retener.** El arreglo de un defecto de laxitud era igual de laxo,
y *parecía* correcto: leyéndolo, `\b(?=## )` se ve como «trocea por encabezado». Sólo contar las
entradas lo desmintió. Por eso `TS-10` mide el troceo en vez de confiar en él.

## Lo que esta tarea NO establece

- **Que los 34 commits detectados sean incumplimientos.** No lo son. 15 de `EP-020` son trabajo
  *de lote*, que no pertenece a ningún `PT` porque **no existe** un `PT` al que pertenezca. Si
  `FDGE-R19` debe admitir el identificador del lote para eso es una pregunta sobre la **regla**;
  el detector la hizo visible y va a `PT-130`.
- **Que `FORZADO` pruebe que el marco obligó.** Observa co-ocurrencia declarada en una entrada del
  ledger. Una forma estricta necesita un campo estructurado, que es lo que construye `PT-125`.
- **Que un `PT` abierto después del commit que lo cita se detecte.** No aquí.
- **Que impida nada.** Avisa. `AVISA_AHORA_FALLA_EN` lo mapea a `G4`, así que el aviso tiene
  fecha de caducidad mecánica; hoy no bloquea, y eso es deliberado (`strategy.md`).

## Una corrección al propio intake

`AC-03` decía que la fila de `RIGE_DESDE` era lo que impedía juzgar los 200+ commits anteriores.
**Es falso**: la fila de `FDGE-R19` es `7.7.0`, así que la obligación **estaba en vigor** cuando
se escribieron. Lo que acota la lectura es la ventana de 60 commits. Escrito en
`traceability.md` — es la lección de `PT-100`, donde afirmé antes de medir y resultó falso.

## El quinto defecto: lo encontró la propia batería, y era mío de la tarea anterior

Al correr la batería completa —lo que `PT-128` **no** hizo— salieron **nueve casos en rojo**, y
todos suyos. La causa:

```
cur128() { node "$SUITE/tools/tracker.mjs" cursor "$@"; }
```

Sin directorio. Suelto desde la raíz, el cursor lee el registro real y encuentra `PT-128`. Dentro
de la batería, el directorio activo es el fixture vigente en ese punto, y la salida es *«PT-128 no
está en el registro»*. **Mi `TS-11` tenía el mismo defecto** y todavía no se había commiteado.

Es la clase **«probar donde trabajo, no donde se decide»**: novena instancia en la matriz del
lote, **décima** aquí, y sigue **sin dueño**. Este párrafo es su número, no su arreglo.

Lo grave no es el `cd` que faltaba: es que `PT-128` declaró `verified: true` sobre nueve casos
**sin abrir la salida de la batería**, y escribió en `HISTORY.log` el nombre de un archivo que
iba a generar y no generó. La corrección va en `SESSION_LOG.md` —`HISTORY.log` es append-only
(`SUITE-R09`)— y el manifiesto de `PT-128` la lleva.

`TS-11` además cambió de observable: busca `commit(s)` **sin** los dos puntos, porque eso aparece
tanto habiendo hallazgos como no habiéndolos. Con los dos puntos, el caso se pondría rojo el día
que los 34 commits salgan de la ventana — es decir, el día en que la comprobación iría mejor.

---

## Estado

| | |
|:---|:---|
| Escenarios | 11 de 11 |
| Prueba inversa | 4 supresiones, 4 rojos distintos y únicos |
| Orphan Criterion | ninguno: los cinco `AC` tienen `TS`, test y evidencia |
| Tipo | **BUG** ⇒ termina en `VALIDATION_PENDING` (`FDGE-R26`, `LEX-R08`). Cerrarlo es humano (`SUITE-R06b`) |
