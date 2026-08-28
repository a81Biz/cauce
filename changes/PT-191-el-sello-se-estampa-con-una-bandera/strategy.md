# `PT-191` · `strategy.md` — el camino elegido, y los descartados con su porqué

## El camino elegido: un RECIBO que escribe la corrida y exige el sellador

La corrida completa deja `docs/implementation/CORRIDA.json`. `sellar-bloques --verde` se niega si
no hay recibo, si su veredicto no es `OK`, o si su huella de arnés no es la de la batería actual —
y **dice cuál de las tres** (`RULE-06`: no se supone).

```
selftest.sh --todo   ──escribe──▶   CORRIDA.json   ──exige──▶   sellar-bloques --verde
   el HECHO                          la CONSTANCIA               la DECISIÓN
```

Tres piezas, cada una con un dueño distinto. Es lo que hoy no hay: hoy la decisión **es** el hecho.

**Por qué la huella del arnés y no sólo la fecha.** Una fecha no distingue «corrió esta batería» de
«corrió otra». La huella (`git hash-object` del propio `selftest.sh`) hace que **editar la batería
invalide el recibo sin que nadie tenga que acordarse** — que es la lección `-11` del `HANDOFF`
—*«NO editar tools/ con la batería corriendo: invalidó TRES corridas de 34 min»*— convertida en una
comprobación en vez de una nota.

**Por qué sólo `--todo` escribe recibo.** Una corrida acotada no ejecutó lo que no ejecutó. Éste no
es un detalle: es **el caso real que destapó el defecto**. `PT-190` cambió `revisar-secretos.mjs`,
lo que reabrió el bloque 8; la corrida que lo devolvió al verde fue la acotada, de 122 casos.
Sellar ahí habría estampado con fecha de hoy los bloques 9, 10 y 11 — 16 secciones que ese día no
se ejecutaron.

**Dónde va el recibo dentro de `selftest.sh`: ANTES del recuento.** No es estética. `selftest.sh:7284`
mide el recuento por posición (`tail -4` sobre el fuente); escribirlo detrás lo empujaría fuera de
las cuatro últimas líneas y pondría en rojo un caso ajeno a este cambio. `FAILED` y `_cuantos` ya
son definitivos antes del recuento, así que el sitio correcto no cuesta nada.

**Y `sellar-bloques` pasa a honrar `MTH_RAIZ`**, como ya hace `bloques-sellados.mjs:19`. Sin eso el
sellador no es apuntable a un árbol sintético y los casos no podrían plantarle un recibo: medirían
el repositorio real y pasarían o fallarían por el motivo equivocado.

---

## Los caminos descartados

### 1 · Que `sellar-bloques` corra la batería él mismo

**Descartado por dos motivos independientes, cada uno suficiente.**

Sería **juez y parte**: certificaría su propia corrida, que es el mismo defecto con otra forma. Y
metería 34 minutos dentro del comando que existe **para no gastarlos** — el sellador se invoca en
`npm run verify`, que corre en cada push.

### 2 · Ampliar `--verde` a `--verde-de-verdad`, o pedirla dos veces

**Descartado: no cambia nada.** Cualquier bandera sigue siendo la palabra de quien teclea. Dos
banderas son dos palabras. `CE-001` es el proxy en lugar del hecho, y el número de proxies no lo
convierte en hecho.

### 3 · Deducirlo de la marca de tiempo del árbol

**Descartado: `mtime` no dice si la corrida pasó.** Dice cuándo se tocó un archivo. Un árbol recién
tocado y una batería en rojo son indistinguibles para `mtime`, y la dirección del error es la
peligrosa: sellaría lo que falló.

### 4 · Guardar el recibo dentro de `SELLOS.json`

**Descartado: confunde el hecho con su consecuencia.** `SELLOS.json` lo escribe el sellador; si el
recibo viviera ahí, el sellador escribiría su propia prueba. El recibo tiene que venir **de fuera**
de quien decide, o no es prueba. Por eso es un archivo aparte, con otro autor.

### 5 · Arreglar de paso `selftest.sh:7284`, el `tail -4` posicional

**Descartado por alcance, y anotado.** Es un defecto real y de la familia `-18` —cuarta aparición—
pero es **otro** defecto: castiga cualquier añadido al final del archivo, no tiene que ver con el
sello. Mezclarlo haría que esta tarea cambiara dos cosas y ninguna quedara claramente medida.
`PT-191` lo **esquiva a sabiendas**; queda registrado como **`PT-192`** en `EP-026`.

### 6 · Retirar `--verde`

**Descartado: sellar es una DECISIÓN.** El recibo prueba que la corrida ocurrió; la bandera dice
que, además, se quiere estampar. Quitarla convertiría el sellado en un efecto de ejecutar el
comando — exactamente lo que `PT-175` escribió que no debía ser.
