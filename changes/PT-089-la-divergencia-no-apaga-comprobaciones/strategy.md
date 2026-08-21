# PT-089 — Estrategia   `PHASE 3`

## Lo que la medición decidió

```
status divergente con estado TERMINAL en el registro:  6
status divergente entre estados NO terminales       :  0
phase divergente en tareas ya terminales            : 22
```

**Cero benignas en `status`.** El aviso protegía una mezcla que no existe.

## Caminos considerados

| | Por qué se descarta |
|:---|:---|
| Que **mande el registro** y se ignore el YAML | `PT-004` decidió lo contrario con motivo: el PT es lo que dice de sí mismo. Y el YAML es lo que hace legible un PT sin abrir `REGISTRY.json` |
| **Eliminar** el YAML y dejar una sola fuente | Misma objeción, y además rompe todos los intakes existentes |
| Subir **toda** divergencia a error | Nace con 22 fallos de `phase` sobre trabajo cerrado. Es el error que `PT-088` evitó con `RIGE_DESDE` |
| Dejarlo en aviso y «acordarse» | Es lo que hay, y `PT-044` ya lo documentó. Un aviso entre 24 se lee como ruido — `PT-023` midió esa frontera |
| **Error sólo cuando el registro es terminal y el YAML no** ✅ | Es lo que se adopta |

## Por qué el criterio es exactamente ése

La consecuencia de la divergencia no es simétrica:

```
registro INTEGRATED · YAML READY   ->  se usa READY
                                   ->  «fase >= N» no se cumple
                                   ->  las comprobaciones posteriores NO SE EJECUTAN
```

**Un verificador que da verde por no haber mirado** es lo que `RULE-06` prohíbe, ocurriendo dentro
del verificador que la hace cumplir. Lo escribió `PT-044` hace ochenta tareas y le puso un aviso.

Al revés —`phase` viejo en una tarea ya terminal— no apaga nada: las comprobaciones de fase ya no
aplican a algo terminal.

## `phase` sigue siendo aviso, y es una decisión, no un olvido

22 divergencias sobre trabajo cerrado. Convertirlas en error pondría el árbol en rojo por
artefactos que **ya cumplieron su función**, y una comprobación que nace roja se apaga.

## La otra mitad: cerrar dónde nacían

`AC-03` del intake decía *«`avanzar` escribe las dos fuentes»*. **Ya lo hacía para `phase`.** Lo que
no hacía era `status`:

```
avanzar --a 10   ->  phase 10 en el registro Y en el YAML
                 ->  status: sin tocar
                 ->  alguien marca INTEGRATED a mano, en el registro
                 ->  el YAML se queda atras            <- las seis
```

**Ese alguien he sido yo, en este mismo lote.** Marcar terminal entra ahora en el acto atómico.

### Y no decide por la tarea

`FDGE-R53` dice que la tarea declara cómo termina. Una `DEFERRED` que llegue a la última fase
sigue `DEFERRED`: sólo se rellena lo que **nadie ha declarado**.

## Lo que se acepta, y se declara

**La comprobación no dice cuál de las dos fuentes tiene razón.** El arreglo es sincronizar, y
elegir sigue siendo de `PT-004`. Va en el mensaje, no en un comentario — `PT-087` lo hace
obligatorio.
