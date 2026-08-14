# PT-026 — Descubrimiento   `PHASE 2` · `FDGE-R42`

## Dos registros, no uno

`SUITE-R35` dice «el registro asigna, la plataforma espeja». Pero hay **un registro por rama**:

| Rama | Qué contiene |
|:---|:---|
| `trabajo` | el registro que **asigna** — se escribe en cada fase |
| `main` | la **foto** de ese registro en el momento del último merge |

El tablero espeja el trabajo. Comparar la foto contra el tablero diverge **siempre**, porque el
trabajo sigue: `PT-024`, `PT-026`, `EP-006`, `PT-025` existen y `main` no los conoce.

## Es estructural, no una ventana

Lo comprobé arreglando `PT-024` y volviendo a mirar: el fallo no desapareció, **cambió de
forma** — de «issue cerrado» a «etiqueta desalineada». Cualquier cosa que el tablero publique
desde la rama de trabajo hace fallar a `main`, y publicar es lo que el tablero existe para hacer.

## El daño

Un rojo permanente en la compuerta de `main`, que nadie puede arreglar **desde** `main` —el
arreglo es siempre en la rama de trabajo—. Un rojo que no se puede arreglar deja de leerse:
es exactamente el falso indicador que `SUITE-R35` existe para evitar, causado desde dentro.

## Lo que NO hay que hacer

Quitar el espejo de la CI. Perderíamos la comprobación real, que corre en la rama de trabajo y
en el PR: ahí es donde el registro asigna, y ahí sí decide algo — `G4` la ejecuta.
