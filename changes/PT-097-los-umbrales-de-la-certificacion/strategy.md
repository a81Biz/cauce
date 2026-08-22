# Strategy — `PT-097`

> `PHASE 3`. Derivada de `discovery.md`. Los criterios de éxito salen de los `AC`, no de aquí.

## 1. Objetivo

Que `PTSA-R08` **se pueda cumplir sin inventar nada**: la letra se deriva de números que la
especificación ya declara, o no se emite.

## 2. Solución

### `S-1` · `§24.2` — la clasificación base `AC-01`

Se escribe la sección que dos reglas citan y no encuentran, con las **dos** anclas ya declaradas:

```
A    Health >= 90              §15.6 ya usa 90 como la linea de excelencia
B    60 <= Health < 90
F    Health < 60               §13.3 · la linea de fallo de dominio («Agua Potable»)
```

**`C` no aparece aquí, y es deliberado** (`S-2`).

Y sigue el patrón que `PTSA-R24` fijó para `§12.4`: son **valores por defecto**, y `PHASE 0` puede
declarar otros. La diferencia con hoy es que existir un valor por defecto **derivado** hace que no
haga falta inventarlo cuando `PHASE 0` calla — que es exactamente lo que pasó.

### `S-2` · `§24.4` — los topes, consolidados `AC-02`

```
freshness = UNKNOWN         ->  techo C     PTSA-R30
hallazgo CRITICO (12-16)    ->  techo C     §26 · «bloquea certificacion >= B»
health_unstable = true      ->  techo B     §13.4
Confidence < 90             ->  no A        §15.6
```

Cada fila **cita** la regla que la establece; ninguna es nueva. Lo que hoy está en cuatro sitios
—dos de ellos remitiendo a una sección inexistente— pasa a estar en uno, y los cuatro originales
lo **citan** en vez de enunciarlo (`LEX-R22`).

**Por qué `C` sólo por tope, y no como banda.** Las dos reglas que la nombran la usan como límite
superior. Inventar una banda `C` obligaría a una tercera ancla que el documento no declara — y
sería exactamente el defecto que esta tarea corrige, cometido al corregirlo.

### `S-3` · Un dato ausente no produce letra `AC-04`

La única decisión no derivable (`context.md` §6). Se resuelve con el precedente del propio marco:

```
si falta Health, Confidence, freshness o el inventario de hallazgos
   -> NO se emite letra. Se publican los scores disponibles y se dice cual falta.
```

**Motivo, y no es prudencia.** `RULE-06`: *«no saber no es permiso»*. Y `LEXICON 6.5d` con
`SIN EVALUAR`: tratar un hueco como un valor *«convierte un olvido en un dato válido que se
propaga»*. `PT-058` lo midió — `restar(100 MEDIDO, SIN EVALUAR)` devolvía `100` **etiquetado como
medido**. Aquí sería peor: la letra es lo único que un stakeholder lee.

Y es lo que el proyecto legado hizo **por su cuenta** ante este mismo hueco. Que la salida
correcta ya se haya tomado sin permiso es la mejor prueba de que faltaba autorizarla.

### `S-4` · `verify-ptsa` comprueba la letra `AC-05`

```js
export function letraDeCertificacion({ health, confidence, freshness, healthUnstable, riesgoMaximo })
```

Función **pura y exportada**, el patrón de `patrones.mjs` y de `compararEspejo`: comprobable sin
red ni disco. `verify-ptsa` la usa para contrastar la letra publicada en `RESUMEN.md` contra la
que sale de los números publicados en el mismo archivo.

**Falla si difieren.** Hoy no falla nunca porque no mira.

### `S-5` · La `B` publicada se recalcula `AC-07`

`SUITE-R09` es append-only: **no se borra nada**. Se añade una revisión al `RESUMEN` que:

- recalcula con `§24.2`/`§24.4` → `B`, la misma letra;
- **retira la banda `(75-89)`**, que no aparece en ninguna especificación;
- corrige *«`A` requiere `Health ≥ 90`»* → consta **desde ahora**, no constaba entonces;
- declara que la letra anterior **no era contrastable** aunque coincida.

**Que coincida no la valida retroactivamente**, y decirlo importa: si se callara, quedaría escrito
que la banda inventada «acertó», que es la peor lección posible.

### `S-6` · `CORE-PTSA.md` se regenera `AC-08`

Lleva `PTSA-R08` y `PTSA-R30`. Lo genera `build-core` desde la especificación y **no se edita a
mano** (`SUITE-R16`, `SUITE-R25`). Editarlo directamente es un error clásico aquí.

## 3. Alternativas evaluadas

### `A-1` · Inventar la banda `C` (`60–74` o `75–89`) — **rechazada**

Es lo que hizo el agente que auditó. Requiere una tercera ancla que el documento no declara.
**Sería cometer el defecto al corregirlo.**

### `A-2` · Retirar `PTSA-R08` y no exigir letra — rechazada

Es la salida que el enunciado del lote admite: *«`PTSA` define sus umbrales, **o deja de exigir
una letra**»*. Se rechaza porque la letra **sí se puede derivar**: retirar una regla que se puede
cumplir es perder capacidad para no hacer el trabajo.

Pero se recoge lo que tenía de razón: `S-3` autoriza **no emitirla** cuando falta un dato, que era
el caso real que la hacía imposible.

### `A-3` · Meter `Risk` en la letra — rechazada

`Risk` no aparece en ninguno de los cuatro topes y tiene sus propias bandas en `§14.5`. Añadirlo
sería **añadir criterio**, no derivarlo — y lo que puede hacer falta es lo contrario: `INC-008`
mide que `Risk` satura con `Σ ≥ 25` y deja de discriminar. Atar la letra a una escala saturada la
empeoraría.

### `A-4` · Que `PHASE 0` sea obligatorio declarar umbrales — rechazada

Trasladaría el hueco al proyecto destino: cada auditoría inventaría los suyos y dejarían de ser
comparables entre proyectos, que es justo lo que una certificación existe para permitir.

## 4. Dependencias y riesgos

```
DEP    ninguna con L-0..L-8. L-6 no comparte un solo archivo con las demas, y por eso el
       firmante la puso primera: por el hueco, no por el solapamiento

RIE-1  CORE-PTSA.md es GENERADO. Si se edita a mano, «core:check» lo caza — y si se
       olvida regenerarlo, tambien. Las dos direcciones estan cubiertas

RIE-2  el RESUMEN es un documento PUBLICADO y citado por el CHANGELOG. La revision se
       AÑADE; no se toca una linea de lo anterior (SUITE-R09)

RIE-3  «letraDeCertificacion» leera numeros del RESUMEN. Si el formato cambia, la
       comprobacion se apaga en silencio — el riesgo de PT-096 con su marcador. Se cubre
       con un caso que ata el formato leido al formato escrito

RIE-4  la especificacion tiene 80 reglas y §24 ya existe con otro contenido. Insertar
       §24.2 y §24.4 dentro de «Reglas de transicion» seria incoherente: van como
       subsecciones NUEVAS con su propio encabezado, y §24 se renombra para admitirlas
```

## 5. Análisis de regresión — `FDGE-R12`

```
verify-ptsa     gana una comprobacion. Los casos existentes (PTSA-R37, R47, R76..R79)
                no se tocan y deben seguir verdes

CORE-PTSA.md    se regenera: cambia porque §24 gana subsecciones. «core:check» lo compara

RESUMEN.md      gana una revision al final. verify-ptsa lo lee para el coverage: el
                formato del frontmatter NO cambia

la especificacion  gana dos subsecciones. verify-suite comprueba enlaces y reglas citadas:
                las citas §24.2 y §24.4 pasan de rotas a resueltas, que es una mejora
                medible — hoy verify-suite NO las caza, y eso es un hallazgo aparte
```

**Ese último punto merece decirse:** `verify-suite` comprueba «reglas citadas que no existen» pero
no «secciones citadas que no existen». Si lo hiciera, este defecto habría saltado el día que se
escribió. **No se arregla aquí** —es otra comprobación, sobre otro documento— y va declarado.

## 6. Criterios de éxito — derivados de los `AC`

```
AC-01 AC-02   §24.2 y §24.4 existen, y toda cifra suya esta ya en el documento
AC-03         misma entrada -> misma letra, sin juicio del auditor
AC-04         falta un dato -> no hay letra, y se dice cual falta
AC-05         verify-ptsa contrasta la letra publicada y FALLA si difiere
AC-06         la bateria falla SIN el arreglo: un caso por banda y uno por tope
AC-07         la «B» recalculada, la banda inventada retirada, y lo anterior declarado
              NO CONTRASTABLE aunque coincida
AC-08         CORE-PTSA.md regenerado por build-core, no a mano
```

## 7. Autorrevisión

- **¿Contradice el intake?** No.
- **¿Alguna regla violada?** `S-5` toca un documento publicado: se **añade** una revisión,
  `SUITE-R09` intacta.
- **¿Algún `AC` sin cubrir?** Ninguno.
- **¿Dependencia no declarada?** `S-4` necesita leer números del `RESUMEN`; `RIE-3` la cubre.
- **¿Estoy inventando algo?** La única decisión no derivada es `S-3`, y va con su precedente
  citado. Lo digo explícitamente porque es la pregunta que esta tarea existe para responder.
