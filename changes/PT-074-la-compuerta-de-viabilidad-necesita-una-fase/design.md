# PT-074 — Diseño   `PHASE 4`

## 1 · La línea, en `cuerpoDeIssue`

Va junto al resto del estado, en la cabecera del cuerpo. En pseudocódigo, para no repetir aquí
lo que el commit dirá con precisión:

```
si la allocation tiene «viabilidad» registrada:
    Viabilidad (FDGE-R54): <VEREDICTO> · coste <valor> (<naturaleza>) · medida contra <sha7>
    si MARGINAL -> «no prohibe: obliga a trabajo ATOMICO con checkpoint entre pasos»
    si UNSAFE   -> «DETIENE: checkpoint, handoff y parada»
si no:
    no se emite nada. No inventar una linea es parte del arreglo.
```

**Las dos notas no son adorno.** El issue existe para consultarse sin abrir el repositorio; un
`MARGINAL` sin decir qué obliga es un dato sin consecuencia, y `PT-059` escribió la consecuencia.

**Se espeja el veredicto y su base, no el razonamiento.** `SUITE-R35` prohíbe copiar contenido
al issue; y un veredicto sin decir contra qué se midió es lo que `PT-058` corrigió.

## 2 · Los quince, re-registrados

```bash
for p in <las quince de EP-017>; do
  node tools/tracker.mjs viabilidad "$p" --registrar
done
node tools/tracker.mjs abrir --aplicar     # y el espejo los publica
```

No se editan a mano: `--registrar` es lo único que los escribe, y ahora lee la marca correcta
gracias a `PT-068`.

## 3 · Lo que NO cambia

| Pieza | Por qué |
|:---|:---|
| `FDGE-R54` | Ya existe, citada en `PHASE 4` y en el prompt de `G2`, y `verify-fdge` la exige (`PT-075`) |
| El cálculo de `viabilidadDe` | `PT-059` lo fijó y se deriva |
| El campo `medido_en` | Es lo que hace auditable el re-registro: sin él, rehacerlos borraría la historia |
| El resto del cuerpo del issue | Se toca **una** línea |

## Delta respecto a la estrategia

Ninguna. Las dos notas de `MARGINAL` y `UNSAFE` estaban implícitas en «el veredicto y su base»;
aquí se hacen explícitas porque sin ellas el veredicto no dice qué hacer.
