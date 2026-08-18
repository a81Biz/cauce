# PT-056 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | `estadoDelArbol` con `sha` y `rama` iguales | `corresponde: true` |
| E2 | AC-02 | …con el `sha` distinto | `corresponde: false` |
| E3 | AC-02 | …con la `rama` distinta | `corresponde: false` |
| E4 | AC-03 | …con el árbol **sucio** y el `sha` igual | `corresponde: true` — lo sucio no es discrepancia |
| E5 | AC-03 | …con la **lista de archivos** distinta y el `sha` igual | `corresponde: true` |
| E6 | AC-04 | La discrepancia enumera **campo, declarado y real** | los tres |
| E7 | AC-04 | Con dos discrepancias | las enumera **las dos**, no solo la primera |
| E8 | AC-01 | Sin checkpoint | `corresponde: null` — no es `false` |
| E9 | AC-01 | Con `sha: null` en el checkpoint | no es discrepancia: no se contrasta lo que no se declaró |
| E10 | AC-02 | `tracker siguiente` con discrepancia | **bloquea** antes de decir qué toca |
| E11 | AC-05 | …y dice que reanudar es decisión **humana** | cita `SUITE-R06` |
| E12 | AC-05 | …y **propone** el comando sin ejecutarlo | no repara |
| E13 | AC-02 | `verify-fdge` con discrepancia | **falla**, como el resto de `LEX-R26` |
| E14 | AC-01 | Tras `tracker avanzar`, el checkpoint **corresponde** | `corresponde: true` |
| E15 | AC-01 | `LEX-R26` declara la correspondencia y `STATE_MISMATCH` está en `LEXICON` | los dos |

**`E4` y `E5` son los que separan esto de una herramienta que molesta.** Medido en `PHASE 2`: la
lista de archivos pasó de 3 a 5 con el `sha` intacto, en el tiempo de escribir tres párrafos. Si
eso fuera discrepancia, el aviso saltaría siempre — y entonces el día que sea real tampoco se
leería.

**`E8` distingue no saber de no haber.** `corresponde: null` no es `false`: no tener foto y tener
una foto equivocada son cosas distintas.

**`E7` importa porque el mensaje es el producto.** Una discrepancia que dice «hay diferencias» sin
decir cuáles obliga a investigar justo cuando el estado no es de fiar.

## Lo que ningún caso puede comprobar

**Que alguien haga caso al bloqueo.** Nada impide seguir trabajando con la discrepancia delante;
`tracker siguiente` la reporta y `verify-fdge` falla, pero editar archivos sigue siendo posible.

Lo que sí queda garantizado es lo que `PT-059` necesitará: **que el estado sobre el que decide se
pueda demostrar**, o que se sepa que no.

**Y que la correspondencia sea suficiente.** Se comprueba `sha` y `rama`; un árbol con el mismo
`sha` y contenido manipulado sin commitear pasaría. Comparar contenido archivo a archivo costaría
leer el árbol entero en cada arranque —el gasto que este lote existe para reducir— y está declarado
en el `out-of-scope`.
