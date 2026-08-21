# PT-095 — Fuera de alcance   `SUITE-R44`

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Editar las cinco entradas históricas | `SUITE-R09` · append-only. Es la regla que este `PT` **no puede saltarse** para arreglar otra | — |
| Quitar `EXEC-R04a` | Deja `main` verde y borra la defensa mecánica contra un merge sin autorización | — |
| Derivar la frontera commit a commit | `git log -S` por bloque sobre ~200 bloques. La frontera por día basta y su límite se declara | — |
| Aplicar la frontera a **todas** las reglas de `RIGE_DESDE` | Sólo se ha medido que haga falta en `EXEC-R04a`. Extenderlo a ciegas es lo contrario de lo que este `PT` hace | — |
| Publicar | Es irreversible y la dispara el firmante | — |

## La cuarta fila es la que más me tienta y por eso está escrita

**Cualquier regla de `RIGE_DESDE` podría estar juzgando hacia atrás**, y `alcanzadaPor` ya existe.
Aplicarlo a las ocho de la tabla cabría en una tarde.

No entra porque **no lo he medido**. `EXEC-R04a` muerde porque lo juzgado es un ledger append-only;
las otras juzgan artefactos que sí se pueden corregir, y ahí la retroactividad es un aviso, no un
bloqueo sin salida. Extenderlo a ciegas sería exactamente lo que este `PT` corrige: aplicar un
criterio donde nadie ha comprobado que aplique.
