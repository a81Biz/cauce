# PT-013 — Estrategia   `PHASE 3`

## Las tres piezas

**1 · `DEFERRED` se vuelve usable.**

| Dónde | Qué cambia |
|:---|:---|
| `verify-fdge` · descubrimiento de PTs | `DEFERRED` se une a los terminales: **no se le exigen artefactos** |
| `tracker` · `VIVOS` | `DEFERRED` **sí es vivo**: su issue permanece abierto y en el tablero |

Parece contradictorio y no lo es: para la **verificación** no es trabajo en curso —no tiene
intake ni fases—; para el **espejo** sí lo está, porque lo que se aplaza sigue pendiente. Es
la misma distinción que ya se hizo con `DONE`: terminado para las fases, vivo hasta el merge.

**2 · Lo aplazado se asigna.** Una fila de `out-of-scope.md` que apunta a trabajo futuro cita
el identificador que lo sostiene:

```
| Fuera | Por qué | Dónde va |
| Derivar la lista de herramientas | Es un hecho copiado | `PT-015` |
```

El identificador sale del registro (`SUITE-R08`), la allocation nace `DEFERRED` y `tracker`
le abre su issue como a cualquier otra.

**3 · `SUITE-R44` · cerrar un lote no borra lo que aplazó.** Al resolver `G4`, toda fila de
out-of-scope que apunte a trabajo futuro tiene que citar una allocation existente. Fuera de
`G4` se avisa; en `G4` bloquea.

## Por qué el corte está en `G4` y no antes

Porque aplazar **durante** el trabajo es legítimo y frecuente: se descubre algo, se acota, se
sigue. Bloquear en `PHASE 4` obligaría a decidir el destino antes de saber si el hallazgo
aguanta. `G4` es el momento en que el lote se cierra — y es exactamente donde `EP-001` perdió
la migración.

## Alternativas evaluadas

**A · Una salida que enumere lo aplazado.** Es lo que pedía el intake antes de la revisión.
**Rechazada por el humano y con razón:** una lista hay que ir a mirarla.

**B · Un ledger `DEFERRED.md`.** **Rechazada:** un registro nuevo para un hecho que ya está
escrito en los `out-of-scope.md` es una copia que puede divergir (`RULE-01`), y el marco tiene
cicatrices de eso.

**C · Issues sin allocation, solo con etiqueta.** **Rechazada:** el espejo los denunciaría como
huérfanos, y crear identificadores fuera del registro rompe `SUITE-R08`.

**D · Bloquear en cuanto aparezca un out-of-scope sin destino.** **Rechazada:** convierte cada
«esto no toca aquí» en una parada, y la mayoría de las filas de out-of-scope no aplazan nada —
declaran lo que simplemente no entra.

## Análisis de regresión   `FDGE-R12`

| Qué | Riesgo | Mitigación |
|:---|:---|:---|
| Todas las filas de out-of-scope existentes se vuelven exigibles | **Alto si se hace mal** | Solo se exige a las que **apuntan a trabajo futuro**; las que dicen «—» o solo explican, no |
| `DEFERRED` deja de verificarse y alguien lo usa para esconder trabajo | Medio | Su issue queda **abierto** y visible; esconder algo en `DEFERRED` lo pone en el tablero, no lo saca |
| Los 266 casos | Bajo | Batería completa |

## Criterios de éxito

Los seis `AC` con `AC-01` y `AC-04` reformulados por la Revisión 1: lo aplazado **tiene issue**,
y **cerrar el lote sin recogerlo no pasa `G4`**.
