# PT-090 — Estrategia   `PHASE 3`

## Las tres salidas del hallazgo, con su coste medido

| | Coste | Veredicto |
|:---|:---|:---|
| **Versionar `graphify-out/`** | **2,3 MB**, medio de ellos `graph.html` regenerable, y un conflicto de merge por regeneración | **descartada** |
| **`mtime` → hash de contenido** | **casi cero: el hash ya está en el manifiesto** | **adoptada** |
| **`MISSING` → «no evaluable aquí»** | una línea | **adoptada** |

**La primera se descarta con la cifra, no con una intuición.** `SUITE-R37` ya declara
`graphify-out/` regenerable y el `no hacer` prohíbe corregirlo a mano: versionar un artefacto que
el marco declara desechable es contradecirse.

## Por qué la segunda es casi gratis, y por qué eso importa

```json
"C:\DevOps\…\bin\cauce.mjs": { "mtime": 1787100823.9, "ast_hash": "3cd2ef84…" }
```

**El dato bueno estaba en la misma línea.** No hay que calcularlo ni guardarlo: hay que dejar de
mirar el otro.

Es la forma más pura del patrón que `EP-018` persigue — no «faltaba información», sino «había dos
señales y se eligió la barata».

## La mitad que `H-005` no vio

Las rutas del manifiesto son **absolutas**. Versionar el grafo **no habría bastado**: el
manifiesto sólo sirve en un disco donde el proyecto esté exactamente ahí.

Eso invalida el análisis del hallazgo, no lo matiza. Se dice.

## Caminos considerados y descartados

| | Por qué |
|:---|:---|
| Generar el grafo en CI | Lo dispara una persona (`FDGE-R32`), y automatizarlo es justo lo que esa regla impide |
| Guardar sólo `manifest.json` versionado | Es el 0,1 % del peso y resolvería la frescura… pero un manifiesto sin grafo describe algo que no está: `FDGE-R43` pasaría a comprobar la frescura de un archivo ausente |
| Hash de bytes crudos | Un checkout con `CRLF` y otro con `LF` darían hashes distintos para el mismo archivo — **el defecto que se está cerrando**. Se normaliza el `\r` antes |
| Dar todo por cambiado si el manifiesto no trae hash | Nace rojo en cualquier proyecto con manifiesto viejo. Se cae al `mtime`, que es lo que medía antes |

## Lo que no se resuelve, y va declarado

**En un clon limpio el grafo sigue sin existir.** La comprobación pasa de un bloqueo que nadie
alcanzaba a un «no evaluable aquí».

Es honesto y **no es lo mismo que comprobarlo**. Cerrarlo exige versionar el grafo o generarlo en
CI, y las dos son decisiones de alcance que esta tarea no toma — la primera con su coste ya medido
arriba, la segunda contra `FDGE-R32`.
