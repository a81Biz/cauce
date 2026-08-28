# `PT-191` — El sello se estampa con una bandera, no con una corrida

```yaml
---
id: PT-191
type: BUG
severity: S2
epic: EP-025
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

`sellar-bloques` decide el veredicto que estampa así:

```js
const veredicto = process.argv.includes('--verde') ? 'OK' : null;
```

`PT-175` introdujo ese veredicto por un motivo exacto: **un bloque se certifica por haber PASADO,
no por no haber cambiado.** El sello guarda `"veredicto": "OK"` para que eso conste.

Y lo que lo determina es **una bandera en la línea de órdenes**. Nada comprueba que la corrida
ocurriera, ni que fuera completa, ni que terminara en verde.

**El caso que lo destapa es real y de esta misma sesión.** `PT-190` cambió
`revisar-secretos.mjs`, lo que reabrió el bloque **8**. La corrida que lo devolvió al verde fue la
**acotada** — `122 casos`, la evidencia de `PT-190` lo dice. Sellar en ese punto habría estampado
con fecha de hoy los bloques **9, 10 y 11**, que ese día **no corrieron**.

| | lo que el sello afirmaría | lo que ocurrió |
|:---|:---|:---|
| bloque 8 | pasó hoy | pasó hoy |
| bloques 9, 10, 11 | pasaron hoy | **no se ejecutaron** |

## 2. Por qué es un defecto y no un descuido   `[HUMANO]`

- **Es un proxy en lugar del hecho** (`CE-001`) — en el mecanismo construido para eliminar
  exactamente eso. La bandera no es evidencia de nada: es la palabra de quien tecleó el comando.
- **Falla en la dirección cara.** El sello no se lee cuando se estampa: se lee **meses después**,
  para decidir qué bloques NO correr. Un sello falso no da rojo; da **silencio**, y el silencio de
  `bloques-sellados` significa «no acotes» — aquí significaría «acota lo que no probaste».
- **Es universal.** Todo destino que instale la suite hereda un sellador que certifica por
  bandera.

## 3. Cómo se arregla, y cómo NO

**No** haciendo que `sellar-bloques` corra la batería: entonces certificaría **su propia** corrida
—juez y parte— y metería 34 minutos dentro de un comando que se invoca para no gastarlos.

**No** confiando en la marca de tiempo del árbol: `mtime` no dice si la corrida pasó.

**Sí** con un **recibo**: `selftest.sh --todo` —y sólo `--todo`— escribe `CORRIDA.json` con su
veredicto, el número de casos, la **huella del arnés** y la fecha. `sellar-bloques --verde` se
niega sin un recibo que case, y **dice cuál de las tres cosas falla** (`RULE-06`: no se supone).

La huella del arnés es la pieza que cierra el círculo: editar la batería invalida el recibo **sin
que nadie tenga que acordarse** — que es la lección de `-11` en el `HANDOFF`, escrita en una
comprobación en vez de en una nota.

## 4. Lo que este arreglo NO promete   `SUITE-R26`

- **`--verde` se queda.** Sellar es una **decisión**, no un efecto de ejecutar el comando. El
  recibo prueba que la corrida ocurrió; la bandera dice que además se quiere estampar.
- **El recibo no prueba que el árbol esté intacto**, sólo que esa batería corrió y en qué acabó.
  Lo que cubre el arnés lo cubre su huella; lo demás no.
- **«Sólo `--todo` escribe recibo» queda declarado y sin caso propio.** Probarlo exigiría anidar
  la batería dentro de sí misma, que es justo lo que `PT-188` acaba de impedir. Se declara aquí en
  vez de fingir que un `grep` al código lo comprueba — un `grep` sería otro proxy (`CE-001`).

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | Sin recibo no se sella, **aunque venga `--verde`** | `TS-01` |
| `AC-02` | Un recibo cuyo veredicto no es `OK` no certifica | `TS-02` |
| `AC-03` | Un recibo de **otra** batería se rechaza | `TS-03` |
| `AC-04` | Un recibo válido **sí** sella: el arreglo no es «negarse siempre» | `TS-04` |

`AC-04` no es adorno. Sin él, los tres primeros los pasa un sellador que rechace todo, y el
mecanismo quedaría roto en verde.

## Cómo termina   `FDGE-R53`

> Termina cuando: `sellar-bloques --verde` sólo estampa si existe un recibo de una corrida
> **completa**, **en verde** y **de esta misma batería**; cuando negarse dice **por qué**; y cuando
> los cuatro escenarios lo ejecutan en vez de describirlo.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-025
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
G1 resuelto: 2026-08-28 · Alberto Martínez
```

### Constancia   —   y una irregularidad que se declara, no se tapa

**El orden se invirtió, y consta.** La sesión anterior se cortó **después** de registrar `PT-191` y
**después** de escribir su código en `sellar-bloques.mjs` y `selftest.sh` — sin intake, sin `G1`,
sin `G2`. La implementación existió antes que el documento que la autoriza, que es exactamente lo
que las compuertas existen para impedir.

Lo que se hizo con ese código: **apartarlo del árbol** hasta que esta firma existiera, y dejar el
árbol en el estado exacto que la evidencia de `PT-190` describe. La firma se pidió **sin** el
código puesto, para que fuera una decisión y no la ratificación de un hecho consumado. El `HISTORY`
lo declarará en «Delta real vs planificado»: el marco no puede borrar que ocurrió, sólo dejar
constancia de que ocurrió.

**Y el código apartado estaba roto.** Sus tres casos invocaban `MTH_RAIZ="$d"
sellar-bloques.mjs`, pero `sellar-bloques.mjs` nunca ha leído `MTH_RAIZ` —deriva `RAIZ` de
`git rev-parse`—, así que el recibo del fixture no se habría leído nunca: el primer caso pasaba
**por el motivo equivocado** y los otros dos fallaban. Se arregla en `PHASE 5` igualando el
tratamiento de `bloques-sellados.mjs:19`, que sí lo honra.

La firma se recabó en sesión, en respuesta a la pregunta directa de si `G1` se firmaba dentro de
`EP-025`. `SUITE-R27` dice lo que esto **no** prueba —que la escribiera una persona, porque la
teclea el agente— y lo que sí: el nombre está en `firmantes`, y quien aparece en ella responde de
lo que lleva su nombre.

**El `VoBo` anterior del lote NO se invocó.** Cubrió a `PT-189` y `PT-190`, se dio con `EP-025` en
curso, y este lote se había **cerrado** y se reabrió para admitir esta tarea. Extender una
autorización a través del cierre del lote que la enmarcaba habría sido inventarla.
