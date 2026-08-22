# Test scenarios — `PT-099`

### `TS-01` — un `BUG` que entra en validación queda `VALIDATION_PENDING` `AC-01`
```
trlib "un BUG en la fase de validacion queda VALIDATION_PENDING"  "^VALIDATION_PENDING$"
  estadoDeFase({type:'BUG',status:'IN_PROGRESS'}, 7, {faseValidacion:7})
```

### `TS-02` — un `FEATURE` **no** se detiene `AC-05`
```
trlib "…y un FEATURE no se detiene"   "^NADA$"
  estadoDeFase({type:'FEATURE',status:'IN_PROGRESS'}, 7, {faseValidacion:7}) ?? 'NADA'
```
**El freno.** Sin él, «detenerse siempre» pasaría `TS-01` y bloquearía todo el marco.

### `TS-03` — ni en otra fase `AC-01`
```
trlib "…ni un BUG en otra fase"   "^NADA$"
  estadoDeFase({type:'BUG',status:'IN_PROGRESS'}, 5, {faseValidacion:7}) ?? 'NADA'
```

### `TS-04` — un `BUG` ya en `DONE` no vuelve atrás `regresión`
```
trlib "un BUG ya validado no vuelve a VALIDATION_PENDING"   "^NADA$"
  estadoDeFase({type:'BUG',status:'DONE'}, 7, {faseValidacion:7}) ?? 'NADA'
```
Si volviera, un humano que ya firmó `G3` vería su firma deshecha al avanzar.

### `TS-05` — la última fase sigue funcionando como `L-1` la dejó `regresión`
```
trlib "la ultima fase sigue dando DONE sin merge"   "^DONE$"
  estadoDeFase({type:'BUG',status:'VALIDATION_PENDING'}, 10, {esFinal:true, integrado:false})
```

### `TS-06` — `verify-fdge` reporta el que no pasó `AC-03`
```
chk "verify-fdge vigila la entrada a VALIDATION_PENDING"   "LEX-R08"
  cat verify-fdge.mjs
```
**Rojo válido hoy:** `grep -rn LEX-R08 tools/` no devuelve nada.

### `TS-07` — la fase se ata a su nombre `RIE-3`
```
chk "la fase de validacion se identifica por su nombre"   "Validación"
  cat tracker.mjs
```
Si alguien la renombra, la transición se apagaría **en silencio** — el riesgo que `PT-096`
documentó con su marcador.

## Mapa

| TS | AC | Rojo válido |
|:---|:---|:---|
| `TS-01` `TS-03` | `AC-01` | especificación — la función no existe |
| `TS-02` | `AC-05` | freno |
| `TS-04` `TS-05` | regresión | frenos |
| `TS-06` | `AC-03` | **sí** |
| `TS-07` | `RIE-3` | por construcción |

**Un rojo válido y cinco frenos.** Se dice: los de `estadoDeFase` no pueden estar en rojo válido
porque la función no existe — es la misma declaración que `PT-096` y `PT-097` hicieron.
