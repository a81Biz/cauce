# Autorrevisión — `PT-125`   `PHASE 6`

> `FDGE-R23`: la evidencia existe en disco o no existe.

---

## Qué se construyó

`docs/implementation/EVENTOS.jsonl`: **163 entradas recorridas**, **56 instancias** clasificadas
contra `CE-001..CE-017`, **14 menciones** separadas a mano, y **40 entradas** que afirman
recurrencia sin nombrar la forma, declaradas con su cita. Más su generador,
`tools/eventos.mjs`, para que se pueda rehacer y contradecir.

Lo pidió el firmante: *«quiero saber qué ocurrió, qué se mejoró, **qué se repite**»*.

## La frontera que había que trazar bien

`AC-02` dice que la clase es un **juicio**. Los dos extremos eran malos: clasificar 163 entradas
a mano da un juicio real pero irreproducible; clasificar con un matcher y llamarlo medición es
`CE-001` en estado puro.

**Se automatiza el material, no el juicio.** El matcher busca las frases con que el ledger se
**autodescribe** y devuelve la cita **literal**. Una persona lee y decide.

## Los cuatro defectos que aparecieron construyéndolo

**1 · El primer matcher salió inflado.** `a mano` y `diverg` dieron **43** `CE-006` y **41**
`CE-008` en 162 entradas. Cifras que no pueden ser ciertas. Apretado a frases autodescriptivas:
70 señales.

**2 · Catorce de las 70 eran menciones.** `PT-127` dice literalmente *«**No** es el acto fuera del
comando»* y quedaba contada como instancia. Nombrar una clase no es incurrir en ella — `CE-001`
cometido dentro de la herramienta que existe para contar instancias de `CE-001`. **No se
borran**: se marcan con su motivo, porque un registro borrado no se puede contradecir.

**3 · La clave `(tarea, clase)` no distinguía dos entradas de la misma tarea.** `EP-019` tiene
tres, y la lista marcaba las dos de `CE-002` cuando una sí es instancia.

**4 · Una rotura de escapado más.** El extractor de ordinales devolvía **1** de 26 porque un `\b`
escrito a través de un heredoc llegó como barra literal seguida de `b`. Es `CE-002`, y la
respuesta fue la que `SUITE-R59` prescribe: escribir el archivo, no pasar el texto por la línea de
comandos.

## Y la prueba inversa tuvo dos defectos suyos

El escenario de la cita comprobaba que **contuviera** el texto. Con eso, quitar `fraseDe` no
tumbaba nada: el recorte de respaldo también lo contiene. Un caso pasando por el motivo
equivocado —`CE-005`— dentro de la prueba que existe para detectarlos.

Y al hacerlo estricto, **falló sobre el módulo intacto**: el fixture no tenía un punto antes de la
frase, así que la «frase» era el texto entero. Se corrigió **el fixture**, no el comportamiento —
que es el error que estuve a punto de cometer en `PT-111`.

## El quinto defecto, y es el más caro de los cinco

**El ordinal se tomaba del bloque, no de la línea de su señal.** La entrada de `PT-125` —ésta—
lleva una **tabla** con una clase por fila. «instancia doce», escrito en la fila de `CE-001`, se
le atribuía también a `CE-003`, `CE-004`, `CE-007` y `CE-015`.

Cuatro cifras plausibles y **falsas** sobre cuánto se repite cada clase, dentro de la herramienta
que existe para medir cuánto se repite cada clase. Es `CE-001` en el sitio más caro posible.

Y costó **dos intentos**:

1. Una ventana de 140 caracteres alrededor de la señal. En una tabla densa alcanza la fila de
   arriba.
2. «La misma línea» **de la cita**. Tampoco: `fraseDe` **aplana** los saltos, así que sobre una
   cita aplanada «la misma línea» es todo el texto.

El arreglo lee el **texto original**, en la línea donde cae la señal. Un ordinal partido por el
salto se pierde y devuelve `null` —«no lo declara»—: perderlo es seguro, inventarlo no.

Dos casos lo fijan, y el segundo es el que impide sobrecorregir: si el ordinal **sí** está en su
línea, se toma.

## Una desviación del intake, declarada

El intake dijo *«no produce código, así que está exenta de la matriz de trazabilidad»*. **Deja de
ser cierto**: se publica `tools/eventos.mjs` y la exención decae. Se dice en `strategy.md` en vez
de aplicarse en silencio — ampliar el alcance sin declararlo es el defecto que este lote persigue.

## Lo que esta tarea NO establece

- **Que las 56 sean todas las instancias.** Son las que el ledger **nombra**. Las 40 mudas son un
  hueco medido, no una ausencia.
- **Que el recuento sea de ocurrencias.** Es de **entradas**. `EP-020` §2.1 contó ocurrencias —27
  roturas de escapado frente a 6 entradas—. Sumarlos sería falso, y la diferencia va escrita en la
  cabecera del archivo para que `PT-119` no tenga que adivinarla.
- **Que la separación `INSTANCIA`/`MENCION` sea incontestable.** Es un juicio, va `DECLARADO`, y
  las catorce decisiones están escritas con su motivo precisamente para que se puedan contradecir.
- **Que los cinco `INC` de `EP-019` estén cubiertos.** Viven en otra máquina. Se declaran ausentes.

## Lo que produce, y no resuelve

Las dos clases que más se repiten **no tienen regla con verificador**: `CE-001` llega a doce
instancias declaradas y sólo la vigila un registro de sujetos al 3 %; `CE-004` llega a nueve
—diez con la que produjo la corrida de `PT-118`— y no la vigila nada.

Con el umbral que `PT-126` va a aplicar —recuento ≥ 3 sin regla con verificador— hoy entrarían
seis candidatos: `CE-001`, `CE-003`, `CE-004`, `CE-013`, `CE-015` y `CE-016`. Salen de la
evidencia, no de la impresión de nadie.

## Y el mismo error de operación, dos veces en la misma sesión

Dos corridas de la batería escribiendo el **mismo archivo de salida** a la vez. El resultado:
`selftest: HAY FALLOS · 1501 casos` con **cero** marcas de fallo en el archivo — un informe que no
describe ninguna corrida.

Ya me había pasado con `PT-118`, y lo escribí en el `HANDOFF` bajo «no hacer» con esas palabras.
**Volvió a pasar de todas formas.** No es una clase nueva de la taxonomía: es la prueba de que
escribir una advertencia en el estado retomable no impide nada por sí sola — que es, literalmente,
la tesis de `EP-020`.

Lo que sí funcionó las dos veces: un «HAY FALLOS» sin un solo `✗` **no** se tomó por un fallo
real. La pista es que el informe se contradice a sí mismo, y eso obliga a mirar en vez de a
reaccionar.

## Estado

| | |
|:---|:---|
| Escenarios | 16 de 16 |
| Prueba inversa | 4 supresiones, 4 escenarios distintos |
| Orphan Criterion | ninguno |
| `verify-fdge` | sin errores |
