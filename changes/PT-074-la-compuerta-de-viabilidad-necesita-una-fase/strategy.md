# PT-074 — Estrategia   `PHASE 3`

## Opciones para hacerlo visible

| # | Opción | Por qué no / por qué sí |
|:--|:---|:---|
| A | Copiar el bloque `viabilidad` entero al cuerpo del issue | **No.** `SUITE-R35` prohíbe copiar contenido al issue: *«dos copias del mismo texto divergen»*. El issue dice **qué está abierto**, no lo que se decidió |
| B | Una línea con el veredicto y su `medido_en` | **Sí.** Es estado, no contenido: cabe en la misma frase que el tipo, la severidad y el lote |
| C | Un enlace al registro | **No.** `REGISTRY.json` no es legible para quien mira el tablero, y el enlace no dice el veredicto |

**Elegida: B.** Una línea, con la naturaleza de la cifra y contra qué se midió — porque un
veredicto sin su base es lo que `PT-058` corrigió.

## Y los quince veredictos se vuelven a registrar

Con la base ya arreglada por `PT-068`. No se editan a mano: se ejecuta
`tracker viabilidad PT-NNN --registrar`, que es lo único que los escribe.

**El `medido_en` anterior no se pierde**: la entrada de `HISTORY.log` de esta tarea deja escrito
que los quince previos apuntaban a `258be16`, y por qué.

## El riesgo

**Que la línea del issue se convierta en una segunda fuente.** Se contiene porque se **deriva**
del registro en cada `tracker abrir --aplicar`, igual que el resto del cuerpo: nadie la escribe
a mano, y si el registro cambia el cuerpo se resincroniza solo.

Y porque **no se copia el razonamiento**, sólo el veredicto y su base. El porqué sigue viviendo
en `changes/PT-NNN-slug/`, que es donde `SUITE-R35` lo pone.

## Alcance

```
docs/methodology/tools/tracker.mjs   cuerpoDeIssue(): la linea · re-registro de los quince
docs/methodology/tools/selftest.sh   el caso, y el de la ausencia
```

Ninguna regla nueva: `FDGE-R54` ya existe y esto es `SUITE-R35` aplicada a un campo que se
quedó fuera. `CHANGELOG`: `PATCH`.
