# PT-055 — Estrategia   `PHASE 3`

## Opciones consideradas

| # | Opción | Por qué no / por qué sí |
|:--|:---|:---|
| A | Que `checkEpics()` sólo recorra el lote objetivo | **No.** Rompe `INTAKE-R09` e `INTAKE-R08`, que deben mirar **todos** los lotes: un intake incompleto es un defecto lo evalúe quien lo evalúe |
| B | Que `enG4` sea global pero sólo avise para los lotes no objetivo | **No.** Un aviso que sale siempre deja de leerse, y son los mismos avisos que el `HANDOFF` ya declara como ruido |
| C | Acotar `enG4` al lote **bajo evaluación**, y enseñar a la herramienta a aceptar `EP-NNN` | **Sí.** Corrige la causa —la herramienta no sabía qué evaluaba— y deja intacto el alcance global de lo que sí debe ser global |
| D | Relajar `SUITE-R45` para que las filas sin resolver no bloqueen | **No.** Es aflojar la compuerta para que no moleste. Se arregla quien pregunta mal, no la regla que responde |

**Elegida: C.**

## Qué significa «bajo evaluación»

Se define explícitamente, porque la ausencia de esta definición **es** el defecto:

```
objetivosEP  =  los EP-NNN pasados como argumento posicional
             u  el «epic» de cada PT-NNN pasado como argumento posicional

enG4(EP)  =  ( gate === 'G4'  y  ( objetivosEP vacio  o  EP en objetivosEP ) )
          o  alloc(EP).status === 'DONE'
```

Las tres piezas, y por qué cada una:

- **`EP en objetivosEP`** — el arreglo. Cierra `AC-01` y `AC-02`.
- **`objetivosEP vacío => todos`** — `AC-05`. Una orden sin objetivo es la que más se parece a
  «compruébalo todo»; acotar ahí convertiría el arreglo en un agujero.
- **`status === 'DONE'`** — `AC-06`, intacta. Un lote terminado exige sus filas resueltas
  aunque nadie pase `--gate`.

## El riesgo, nombrado

**Aflojar `G4`.** Es el único riesgo serio y el arreglo lo roza: toda condición que restringe
cuándo se bloquea puede dejar de bloquear cuando debía.

Se contiene por tres vías, y ninguna es «revisarlo con cuidado»:

1. `AC-02` prueba que el lote objetivo **sí** falla cuando le toca.
2. `AC-05` y `AC-06` fijan por escrito los dos caminos por los que se seguiría bloqueando.
3. **Comprobación inversa obligatoria** en `PHASE 6`: revertir el arreglo y ver caer los casos
   que deben caer. Sin eso, un caso puede pasar por vacío — que es como `PT-050` encontró un
   caso sin protección que llevaba años.

El `HANDOFF` avisa además de la forma vecina: *«escribir `if (gate) fail(...)` en verify-fdge
hace inevaluables las tres compuertas anteriores a G4»*. Este cambio **no** toca esa tabla:
`EXIGIBLE_DESDE` en `patrones.mjs` sigue igual.

## Alcance del cambio

```
docs/methodology/tools/verify-fdge.mjs   el filtro de posicionales · objetivosEP · enG4
docs/methodology/tools/selftest.sh       los casos de AC-01..AC-06 y la inversa
```

Ni una regla, ni un documento normativo, ni el contrato de salida. `SUITE-R06e` aplica —es
`docs/methodology/`— y por eso va dentro de `EP-017`, firmado, y no como trabajo de paso.
