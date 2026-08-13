# PT-001 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`tracker` separa **adaptador** de **lógica**: la comparación del espejo es ahora una función
pura y exportada. Gana el código de salida `3` («declarada y sin acceso», antes fundido con
`2`), la acción `notas` y la preparación de sus etiquetas. `verify-fdge` ejecuta el espejo en
`G4` y lee el reanclaje donde `CORE.md` manda. `npm run verify`, CI y `cauce verify` lo
invocan.

## Resultado medido

```
selftest            188 → 202 casos, 0 fallos
espejo real         5 allocations vivas = 5 issues abiertos · sin divergencias
G4 de PT-004        ✓ SUITE-R35  el espejo con github cuadra     ← AC-04 en verde
tracker notas PT-004  → 2                                        ← AC-07 leyendo el issue
```

## Tres cosas que encontré ejecutando, no leyendo

**1 · El arnés se engañaba a sí mismo.** Mi primer intento pasaba la ruta del módulo como
`argv[1]` para importarlo — que es **exactamente** lo que el guard entiende por «me están
ejecutando directamente». Los 14 casos daban rojo por la razón equivocada. La ruta va ahora
por entorno.

**2 · `VIVOS` no incluía `DONE` ni `VALIDATION_PENDING`.** Se vio al correr el espejo de
verdad: `PT-004` pasó a `DONE` esperando su `G4` y su issue quedó denunciado como huérfano. Un
PT que espera el merge no es trabajo cerrado — es lo más abierto que hay, porque lo que le
queda es una compuerta humana. Corregido, con el motivo en el código.

**3 · `tracker notas PT-004 .` resolvía la ruta como el directorio «PT-004».** El
identificador colisionaba con el posicional de ruta.

Ninguna de las tres estaba en el análisis. Las tres salieron de ejecutar.

## Lo que un revisor debería atacar

**1 · El guard `EJECUTADO_DIRECTO` compara rutas en minúsculas.** Es lo correcto en Windows y
laxo en Linux, donde dos archivos pueden diferir solo en mayúsculas. El riesgo real es nulo
—compara el módulo consigo mismo— pero es una comparación laxa y está a la vista.

**2 · El CLI vive dentro de un `if` de 150 líneas.** Un `main()` sería más limpio. No lo hice
para no reescribir el archivo entero dentro de un PT cuyo objetivo es otro; es deuda y la
declaro.

**3 · `RE_NOTA` decide qué comentario cuenta como reanclaje.** Reconoce «PHASE n → m». Un
comentario que reanclara con otras palabras no contaría, y uno que mencione la forma de
pasada contaría de más. Es la misma clase de heurística que `RE_NOTA_BITACORA` ya usaba.

**4 · `verify-fdge` lanza un proceso por PT con issue.** En un repositorio con muchos PTs
vivos, `--all` hace una llamada a `gh` por cada uno. Aceptable hoy con 5; no lo será con 50.

## Lo que NO he verificado

- **La rama de fork en CI.** El `if:` que salta el paso está escrito y **no se ha ejecutado**:
  hace falta un PR desde un fork real. Es una limitación declarada, no un verde.
- **`gh` en el runner de CI.** El paso pasa `GH_TOKEN: secrets.GITHUB_TOKEN`, y que ese token
  alcance para `issue list` no está comprobado desde aquí. Lo dirá el primer PR.
- **El adaptador de Azure.** Sigue declarando el contrato sin implementarlo, a propósito.

## Lo que la regla me pilló a mí

`FDGE-R52` ahora lee el issue, y lo primero que ha hecho es acusarme: `PT-001` tiene 1 nota
para `PHASE 4` (faltan 2) y `PT-004` tiene 2 para `PHASE 8` (faltan 5).

**Tiene razón.** Escribí comentarios consolidados —«PHASE 2 → 6» en uno solo— en vez de una
nota por transición. La regla existe precisamente contra eso: reanclar al final no es
reanclar, es resumir. Escribir las notas que faltan ahora, de golpe y con fecha de hoy, sería
el falso verde que este lote entero existe para eliminar, así que **no lo he hecho**.

Queda como error abierto y como decisión humana. No es un defecto de la herramienta: es la
herramienta funcionando.

SELF_REVIEW_COMPLETE
