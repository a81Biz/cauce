# PT-087 — Trazabilidad   `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Estado |
|:---|:---|:---|:---|:---|:---|
| AC-01 | Una comprobación declara su **sujeto**: qué hecho establece | E1 | `selftest.sh`: «una celda vacia del sujeto no pasa» | `salidas/sujetos.txt` | VERIFICADO |
| AC-02 | Un sujeto incompleto **no pasa** `verify-suite` | E2 | `selftest.sh`: «…y falta noEstablece tampoco» | `salidas/sujetos.txt` | VERIFICADO |
| AC-03 | El límite declarado **llega al mensaje** que el usuario lee | E4 · E5 | `selftest.sh`: «un limite que no llega al mensaje CAE» · «…y uno que si llega, pasa» | `salidas/sujetos.txt` | VERIFICADO |
| AC-04 | `null` es una **declaración**, no una celda vacía | E3 | `selftest.sh`: «…y «null» SI vale: es una declaracion» | `salidas/sujetos.txt` | VERIFICADO |
| AC-05 | La **quinta** instancia queda corregida: la guía enumera lo nuevo | E6 · E7 · E8 | `selftest.sh`: «una guia que olvida una regla nueva CAE» · «…y una que las nombra todas, pasa» · «…y sin entrada dice null» | `salidas/guia.txt` | VERIFICADO |
| AC-06 | La **séptima** queda corregida: `revento()` mira la traza | E9 · E10 | `selftest.sh`: «revento() caza un reviente de verdad» · «…y NO acusa a quien solo nombra el error» | `salidas/revento.txt` | VERIFICADO |
| AC-07 | El mecanismo se estrena en **tres** reglas, no en 224 | E11 | `selftest.sh`: «verify-suite publica cuantas lo declaran» | `salidas/sujetos.txt` | VERIFICADO |
| AC-08 | La **octava**, encontrada sellando: «tag anterior» era un proxy | E12 | `selftest.sh`: la deuda de sellado cae a 0 tras etiquetar | `salidas/deuda.txt` | VERIFICADO |

## `AC-03` se estrechó en `PHASE 3`, y hay que leerlo aquí

El intake decía *«el sujeto declarado y lo que la comprobación lee se contrastan mecánicamente»*.
**No es mecanizable**: exigiría entender el código.

Lo que sí se entrega —y es lo que hace trabajo— es que **el límite llegue al mensaje**. En las
siete instancias, cuando el límite estaba escrito vivía en un comentario del código fuente: donde
sólo lo ve quien ya está leyendo el código, es decir quien no lo necesita.

Entregar una comprobación de presencia llamándola «contraste sujeto–observable» habría sido **la
novena instancia**, escrita por la tarea que cierra el patrón.

## `AC-08` no estaba en el intake

Apareció ejecutando `sellar` **después** de crear el tag `v10.0.0`: contaba **21 de deuda** porque
buscaba «el tag *anterior*», saltándose el de la versión en curso.

Era inofensivo mientras la versión no estuviera etiquetada —el caso para el que se escribió— y
dejó de serlo en cuanto se selló de verdad. Con umbral 3, bloqueaba `G2` **justo después de
sellar**. El hecho es «lo que ya viajó en algún tag», y su observable es el **tag más alto**.
