# Design — `PT-097`

> `PHASE 4`. Las decisiones y **por qué ésta y no otra**.

## D-1 · `§24` se renombra, y `§24.2`/`§24.4` van dentro

`§24` existe y se llama **«Reglas de transición»**: la tabla de estados de un **producto**
(`PTSA-R38`, `PTSA-R39`). Las citas de `§15.6` y `§13.4` apuntan ahí buscando umbrales de
**certificación**, que es otra cosa.

**Dos lecturas posibles, y sólo una es honesta.** O el número se reusó por error y los umbrales
debían ir a otra sección, o `§24` siempre pretendió cubrir las dos transiciones —la del producto y
la de la certificación—. No hay forma de saberlo leyendo.

Se elige la que **hace ciertas las citas existentes sin tocarlas**:

```
## 24. Reglas de transición y clasificación
### 24.1  Transiciones de estado de producto      <- lo que hoy es §24, intacto
### 24.2  Clasificación base de certificación     <- nuevo
### 24.3  Emisión y ausencia de letra             <- nuevo
### 24.4  Topes que rebajan la clasificación      <- nuevo
```

`PTSA-R38` y `PTSA-R39` se quedan **donde están**, bajo `24.1`. No se mueve ni se reescribe una
línea de lo que ya regía: sólo gana un encabezado por encima.

**Por qué no una sección nueva `§24bis` o `§27`.** Porque las dos citas dicen `§24.2` y `§24.4`
**literalmente**, y son parte de reglas vigentes. Escribir los umbrales en otro número dejaría dos
citas rotas para siempre, o exigiría editar reglas que hoy son correctas.

## D-2 · La base sólo tiene tres letras `AC-01`

```
A    Health >= 90
B    60 <= Health < 90
F    Health < 60
```

**`C` no está, y es la decisión central de la tarea.**

Hacen falta cuatro letras y el documento declara **dos** anclas: `60` (§13.3, el cap de dominio de
la «Regla del Agua Potable») y `90` (§15.6). Dos anclas dan tres tramos.

El movimiento evidente —inventar la tercera frontera— es **exactamente el defecto que esta tarea
corrige**. Lo hizo el agente que auditó, con `(75-89)`.

Lo que había que hacer era releer las dos reglas que nombran la `C`:

```
PTSA-R30   «NO PUEDE clasificarse POR ENCIMA DE C»
§26        «bloquea certificacion >= B»              (o sea: techo C)
```

**Ninguna la define como rango. Las dos la usan como límite superior.** `C` es un estado al que se
**baja**, no una banda a la que se pertenece. Con eso el sistema cierra sin añadir una cifra.

## D-3 · Los topes son un `min`, y el orden no importa `AC-02`

```
letra = min( base(Health), techo(freshness), techo(criticos), techo(unstable), techo(confidence) )
```

sobre el orden `A > B > C > F`. **Que sea un `min` es lo que hace la función determinista**: no hay
«primero aplica éste, luego aquél», así que dos personas no pueden llegar a letras distintas
aplicándolos en otro orden.

`Confidence < 90` se modela como techo `B`, que es lo que `§15.6` dice: *«NO obtiene clasificación
A»*. No dice a qué baja, y `B` es la inmediata inferior.

**`F` no tiene tope propio.** Un `Health < 60` ya es lo más bajo; los topes sólo bajan.

## D-4 · Un dato ausente no produce letra `AC-04`

```
si falta cualquiera de Health · Confidence · freshness · el inventario de hallazgos
   -> la funcion devuelve null, y el RESUMEN publica los scores que si tiene
```

**No es prudencia: es `RULE-06`.** *No saber no es permiso.* Y el marco ya pagó por la alternativa:
`PT-058` midió que `restar(100 MEDIDO, SIN EVALUAR)` devolvía `100` **etiquetado como medido** —un
hueco convertido en dato con autoridad—. Una letra es lo único que un stakeholder lee, así que
aquí el daño sería mayor.

Y es lo que el proyecto legado hizo **por su cuenta** ante este hueco: publicó los tres scores y no
emitió letra. **La salida correcta ya se había tomado sin permiso**; lo único que faltaba era
autorizarla.

## D-5 · La función es pura y exportada `AC-05`

```js
export function letraDeCertificacion(e)   // e: {health, confidence, freshness, healthUnstable, riesgoMaximo}
```

El patrón de `compararEspejo` y de `patrones.mjs`: comprobable **sin red ni disco**, que es lo que
permite tener un caso por banda y por tope.

`verify-ptsa` la usa contra los números que el propio `RESUMEN.md` publica en su frontmatter. Si la
letra publicada difiere de la calculada, **falla**.

**Y el riesgo que eso introduce**, que es el mismo de `PT-096` con su marcador: si el formato del
frontmatter cambia, la lectura devuelve `undefined`, la función devuelve `null` y la comprobación
**se apaga en silencio**. Se cubre con un caso que ata el formato leído al formato escrito, y con
que `null` en la lectura sea un **aviso** —«no pude leer los scores»— y no un silencio.

## D-6 · La `B` se recalcula y lo anterior se declara **no contrastable** `AC-07`

Recalculada da `B`. **La misma letra.**

Y precisamente por eso hay que decir que la anterior **no era contrastable**: si se callara,
quedaría escrito que la banda inventada «acertó», y la lección sería que inventar sale bien.

```
lo que se retira    la banda «(75-89)» — no aparece en ninguna especificacion
lo que se corrige   «A requiere Health >= 90» — consta DESDE AHORA, no constaba entonces
lo que se declara   la letra de PTSA-2026-08-20 no era derivable cuando se emitio
lo que NO cambia    la letra: sigue siendo B, y el CHANGELOG de la 11.0.0 sigue siendo cierto
```

`SUITE-R09`: se **añade** una revisión. No se toca una línea de lo publicado.

## D-7 · Qué NO se cambia

- **Los pesos** (`PTSA-R26` los declara fijos). Tocarlos cambiaría el `Health` de toda auditoría
  pasada.
- **`Risk`** — no entra en la letra. No aparece en ningún tope y tiene sus bandas en `§14.5`.
  Añadirlo sería añadir criterio; y `INC-008` mide que satura con `Σ ≥ 25`, así que atar la letra a
  una escala saturada la empeoraría.
- **`CORE-PTSA.md` a mano.** Lo genera `build-core` (`SUITE-R16`, `SUITE-R25`).

## D-8 · Lo que se declara y no se arregla

`verify-suite` comprueba **reglas citadas que no existen** y no **secciones citadas que no
existen**. Si lo hiciera, este defecto habría saltado el día que se escribió `§15.6`.

No entra aquí: es otra comprobación, sobre otro documento, y con su propio riesgo de falsos
positivos —una cita a `§X` en prosa no siempre es una referencia—. Va al `## Cierre del lote` de
`EP-019` como candidata, con su medición hecha.
