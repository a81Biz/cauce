# PT-088 — Escenarios de prueba   `FDGE-R16`

**Cada comprobación necesita su complemento.** Sin él, un verificador que fallara *siempre*
cumpliría el escenario positivo — es lo que `PT-085` `AC-02` dejó escrito.

## `SUITE-R09` · el ledger no pierde líneas

| | Escenario | Espera |
|:---|:---|:---|
| `E1` | Ledger de 6 líneas, tag `v1.0.0`, se añade una séptima y se **commitea** | **verde** · un append-only crece |
| `E2` | Ledger de 6 líneas, se dejan 3 y se commitea | **rojo** · «línea(s) desaparecida(s)» |
| `E3` | Mismo caso que `E2` | el mensaje contiene «corrección legítima de una falsificación» |
| `E4` | Se altera una línea **sin cambiar el recuento** | **rojo** · `git` la representa como `-vieja` + `+nueva` |
| `E5` | Repositorio git **sin ningún tag** | **aviso** · «no hay línea base». No falla, y lo dice |
| `E6` | Todo igual que `E2` pero con `suite_version: 10.0.0` | **verde** · `RIGE_DESDE` |

**`E4` empezó siendo el escenario incómodo y acabó siendo el más útil.** Lo escribí esperando
**verde** —había declarado que una alteración de igual recuento pasaba— y salió **rojo**: `git`
representa una modificación como `-vieja` más `+nueva`, así que la línea `-` está ahí.

**La comprobación es más fuerte de lo que su autor creía, y el límite que declaré era falso.** Lo
midió el caso, no yo. El límite real: no distingue una corrección legítima de una falsificación —
en un append-only las dos están prohibidas.

**`E5` no se resuelve inventando un reloj.** Sin tag no hay línea base; se dice `SIN EVALUAR`, que
es lo que `inventory/integrations.md` ya declara para `git` en todo el marco.

## `EXEC-R04` · la `G4` deja constancia

| | Escenario | Espera |
|:---|:---|:---|
| `E7` | Rama por defecto con un merge, `SESSION_LOG.md` sin ninguna entrada | **rojo** · «sin constancia de autorización» |
| `E8` | Mismo caso | el mensaje contiene «NO prueba que la autorización» |
| `E9` | Igual, con una entrada `## <fecha del merge> · G4 autorizado` | **verde** |
| `E10` | Igual que `E9`, pero `firmantes:` sólo lista a otra persona | **rojo** · un nombre cualquiera no vale |

**`E10` es el que hace que la comprobación no sea decorativa.** Sin él bastaría escribir cualquier
nombre, y `SUITE-R27` existe precisamente para que la firma sea contrastable.

**El emparejamiento es por día, no por sha**, y `E9` lo prueba tomando la fecha del propio merge:
la constancia se escribe **antes**, así que no puede citar un sha que aún no existe.

## `SUITE-R01` · se declara, y la declaración se comprueba

| | Escenario | Espera |
|:---|:---|:---|
| `E11` | `NO-VERIFICABLES.md` sobre el árbol real | contiene `SUITE-R01` |
| `E12` | `audit` sobre el árbol real | `NO_VERIFICABLE   6` |
| `E13` | `audit` sobre el árbol real | `PENDIENTE        122` |

`E12` y `E13` son **el mismo hecho por sus dos lados**: la regla entró en una casilla *y* salió de
la otra. Comprobar sólo la entrada dejaría pasar una cuarta casilla silenciosa, que es justo lo
que `PT-078` construyó `clasificarReglas` para impedir.

## Lo que NO se prueba, y consta

**Que un `fail` de `SUITE-R09` signifique mala fe.** No lo significa: acusa de haber reescrito, no
de por qué. La distinción no es mecanizable y no se finge que lo sea.

**Que el contenido añadido sea cierto.** Un append-only garantiza que lo escrito no se borra, no
que sea verdad. Eso es `SUITE-R01`, y por eso va a `NO-VERIFICABLES.md`.
