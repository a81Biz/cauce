# PT-046 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`FDGE-R29` admite una entrada `## PT-NNN — CORRIGE: …`. Las comprobaciones de `G4` leen la
**última** corrección para cada campo que declare y la original para los que no. Una `CORRIGE`
sin original **falla**.

```
selftest              429 → 436 casos
PT-039..PT-042        ✗ FDGE-R34  →  ✓ precondiciones de G4 satisfechas
HISTORY.log           51 lineas añadidas, 0 borradas
```

## Lo que solo se vio ejecutando

**El caso de las dos correcciones falló, y no por lo que yo esperaba.** `cuerpoDe` localizaba la
entrada con `hist.indexOf(m[0])` —por su **texto**— y dos correcciones del mismo PT pueden llevar
el mismo encabezado: devolvía siempre la primera. La segunda corrección no tenía efecto, y el
único síntoma habría sido una compuerta que sigue en rojo sin decir por qué. Se arregla con
`m.index`.

Leyendo el código no se ve: con una sola entrada las dos formas dan lo mismo. Y el `indexOf`
**ya estaba** en el código original —`hist.indexOf(entries[0][0])`—, latente desde que se
escribió, inofensivo mientras solo hubiera una entrada.

## Lo que un revisor debería atacar

**1 · `CORRIGE` permite corregir un `Estado:` para que una compuerta pase.** Es cierto y no es
mecanizable. Lo que hay es que la entrada original queda a la vista con el motivo al lado, y
`SUITE-R27` ya declara que lo mecanizable es que la afirmación sea **contrastable**, no sincera.
Un revisor puede sostener que esto abre una puerta; yo sostengo que la puerta ya estaba, y lo
que no había era registro de haberla usado.

**2 · Nada obliga a que el `Motivo:` sea cierto**, ni a que los campos rehechos correspondan a la
entrada que dice corregir. La comprobación solo mira que exista una original.

**3 · Los otros ocho campos del formato canónico siguen sin verificarse** —`Severidad`,
`Complejidad`, `Track`, `Lote`, `Rama`, `Modo`, `Objetivo`, `Solución`—. `FDGE-R34` solo comprueba
`Estado:`. No entra aquí: exigirlos rompería entradas válidas de proyectos instalados, y eso se
decide (`PT-016`).

**4 · Las cuatro correcciones que escribí declaran `Estado: DONE`**, que es lo que decían las
originales, no `INTEGRATED`, que es lo que dice el registro hoy. Es deliberado: `HISTORY` graba el
estado en `PHASE 8` y el registro lleva el posterior — igual que `PT-038`. Lo escribí mal primero
y lo corregí **antes de commitear**: era un borrador, no una entrada del ledger, y lo digo en vez
de dejarlo pasar.

## Lo que NO he verificado

Que la corrección se use bien. Como en `SUITE-R54` y `SUITE-R55`: el mecanismo se comprueba, el
uso no.

## Desviaciones declaradas

**Sin rama por PT**, como los 45 PT anteriores de este repositorio. Está abierto como `PT-047`
(#69) porque es una contradicción del marco consigo mismo, no una decisión mía de hoy.

## Checklist

- [x] Todos los `AC` verificados con evidencia en disco
- [x] Sin huérfanos en `traceability.md`
- [x] El código hace lo que dice `design.md`
- [x] Delta registrado (arriba: el `indexOf`)
- [x] Sin regresiones: `selftest` 436/436 · `verify-suite` sin errores · `build-core --check`
- [x] `11-Conventions.md` respetado
- [x] Commits atómicos con `PT-046` en el mensaje
- [x] Sin restos de depuración
- [x] `out-of-scope.md` intacto
- [x] Sin problemas de seguridad evidentes · evidencia sin credenciales (`FDGE-R45`)
- [x] Contrato público: `verify-fdge` conserva su interfaz y sus códigos de salida

SELF_REVIEW_COMPLETE
