# Test scenarios — `PT-098`

## Los que reproducen el defecto

### `TS-01` — el registro afirma un merge que el árbol no tiene `AC-02`
```
trlib "un INTEGRATED que main no sostiene se reporta"   "SUITE-R08"
  estadoContrastado({id:'PT-1',status:'INTEGRATED'}, () => false)
```
**Hoy falla:** la comprobación no existe.

### `TS-02` — el caso NEGATIVO, y es el que impide «reportar siempre» `AC-05`
```
trlibno "…y uno que SI esta, no"   "SUITE-R08"
  estadoContrastado({id:'PT-1',status:'INTEGRATED'}, () => true)
```
**Sin este, `TS-01` pasaría con una función que reporte siempre.** Es la trampa que `PT-096`
documentó con `TS-04` y que `PT-095` documentó con su inversa en cero.

### `TS-03` — lo que no se puede saber no se acusa `AC-03`
```
trlib "sin poder comprobarlo, SIN EVALUAR"   "SIN EVALUAR"
  estadoContrastado({id:'PT-1',status:'INTEGRATED'}, () => null)
```
`RULE-06`: no saber no es permiso, **y tampoco es una acusación**.

### `TS-04` — `avanzar` escribe `DONE` cuando el árbol no lo sostiene `AC-04`
```
trlib "sin merge, la ultima fase da DONE"   "^DONE$"
  estadoTerminalDe({status:'IN_PROGRESS'}, false)
```

### `TS-05` — …y `INTEGRATED` cuando sí `AC-04`
```
trlib "con merge, da INTEGRATED"   "^INTEGRATED$"
  estadoTerminalDe({status:'IN_PROGRESS'}, true)
```
**El par de `TS-04`.** Sin él, «escribe siempre `DONE`» pasaría el primero — y sería peor que el
defecto, porque nada llegaría nunca a `INTEGRATED`.

### `TS-06` — un `null` no afirma el merge `AC-03` `AC-04`
```
trlib "sin poder saberlo, tampoco INTEGRATED"   "^DONE$"
  estadoTerminalDe({status:'IN_PROGRESS'}, null)
```

## Los que protegen lo que ya funciona

### `TS-07` — un estado ya terminal no se pisa `regresión`
```
trlibno "lo ya terminal no se reescribe"   "INTEGRATED"
  estadoTerminalDe({status:'CLOSED'}, true)
```
`avanzar` sólo escribía si `!ESTADOS_TERMINALES.has(status)`. Esa guarda **se conserva**: un
`CLOSED` o un `REVERTED` no vuelven a `INTEGRATED` porque alguien avance de fase.

## Mapa

| TS | AC | Rojo válido hoy |
|:---|:---|:---|
| `TS-01` | `AC-02` | **sí** |
| `TS-02` | `AC-05` | no — es el freno |
| `TS-03` | `AC-03` | **sí** |
| `TS-04` `TS-06` | `AC-04` | **sí** — hoy escribe `INTEGRATED` siempre |
| `TS-05` | `AC-04` | no — es el par de `TS-04` |
| `TS-07` | regresión | no — pasa y debe seguir |

**Cuatro rojos válidos y tres frenos.** Los frenos no son relleno: cada uno impide una forma
concreta de «arreglarlo» que pasaría los positivos sin arreglar nada.
