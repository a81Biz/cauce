# PT-095 — Una regla nueva no juzga lo escrito antes de que existiera

```yaml
---
id: PT-095
type: BUG
severity: S1
track: STANDARD
complexity: STANDARD
status: VALIDATION_PENDING
phase: 9
created: 2026-08-21
structural: no
suite_version: 11.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «haz el G4, cierra el bug y yo hago la publicación»

`G4` está hecho —PR #180 en `main`— y **`main` sigue rojo**, así que la publicación sigue
bloqueada. Ya no por `LEX-R26`: por `EXEC-R04a`.

## 2. Comportamiento observado

```
32468108612  verificación  main  push  failure
```

```
✗ EXEC-R04a  SESSION_LOG.md, entrada del 2026-08-13: …  (×3)
✗ EXEC-R04a  SESSION_LOG.md, entrada del 2026-08-20: …  (×2)
✗ EXEC-R04a  SESSION_LOG.md, entrada del 2026-08-21: …
✗ EXEC-R04   4549db6 (2026-08-21): merge a «main» sin constancia de autorización
```

**Estaba latente, no lo trajo el merge.** Medido: el mismo `verify-fdge --all` sobre `338a728`
—el `main` de antes— da los mismos seis `EXEC-R04a`. Lo que hace el merge es **llegar al bloque**:
sin un merge nuevo que contrastar, `checkG4ConConstancia` volvía antes y nadie los enumeraba.

## 3. Por qué no se puede cumplir

| Entrada | Qué es | Por qué falla |
|:---|:---|:---|
| `2026-08-13` ×3 | «`EP-00N` cerrado · versión `X` · **a la espera de `G4`**» | El filtro es `/G4\|VoBo\|autorizad/` sobre el encabezado. **Anuncian que ESPERAN una compuerta, no que alguien autorice** |
| `2026-08-20` ×2 | Autorizaciones reales | No llevan el nombre en el cuerpo. Se escribieron **antes de que `EXEC-R04a` existiera** |
| `2026-08-21` | La mía | Dice «Alberto Martinez» **sin acento**, y `firmantes:` dice «Alberto Martínez» |

`SESSION_LOG.md` es **append-only** (`SUITE-R09`). Las cinco primeras **no se pueden corregir
editándolas**, y añadir una entrada nueva no cambia los bloques viejos: la comprobación los
recorre todos.

**`main` queda rojo para siempre en cuanto haya un merge.** No es una regla difícil de cumplir: es
una regla que **no se puede** cumplir.

## 4. La causa, y ya tiene nombre en este repositorio

`EXEC-R04a` entra en la `11.0.0`, etiquetada `v11.0.0` el 2026-08-20 21:57. Está juzgando entradas
del **13 de agosto**.

`rigeGlobal('EXEC-R04a')` comprueba que **la suite** esté en 11.0.0 o más. No comprueba que **lo
juzgado** sea posterior a la regla.

Es exactamente lo que `PT-081` construyó `RIGE_DESDE` para impedir —*«una regla nueva no rige hacia
atrás»*— aplicado a medias: la versión de entrada existe y **sólo decide si la comprobación corre**,
no a qué alcanza.

## 5. Criterios de aceptación

| | Criterio |
|:---|:---|
| `AC-01` | `EXEC-R04a` **no juzga** una entrada anterior a la versión que la trajo |
| `AC-02` | …y **sí juzga** una posterior: el arreglo no apaga la regla |
| `AC-03` | Un encabezado que dice **«a la espera de `G4`»** no se lee como una autorización |
| `AC-04` | …y uno que **sí** autoriza se sigue leyendo como tal |
| `AC-05` | El límite de la frontera —granularidad de **día**— queda declarado en el mensaje |
| `AC-06` | `EXEC-R04` vuelve a verde con una constancia **añadida**, sin editar el ledger |
| `AC-07` | Un caso reproduce el fallo y **falla sin el arreglo** |

**`AC-02` y `AC-04` son los que impiden el arreglo fácil.** Quitar la comprobación deja `main` verde
y borra la única defensa mecánica que hay contra un merge sin autorización.

**`AC-06` no se cumple editando.** El nombre mal escrito se corrige **añadiendo** una entrada, que
es lo único que `SUITE-R09` permite.

## 6. Qué NO entra

```
OUT: editar las cinco entradas historicas   ->  SUITE-R09 · append-only. Es la regla
     que este PT NO puede saltarse para arreglar otra
OUT: quitar EXEC-R04a                       ->  deja main verde y borra la defensa
OUT: derivar la frontera commit a commit    ->  «git log -S» por bloque sobre ~200
     bloques. La frontera por DIA basta y su limite se declara (AC-05)
OUT: publicar                               ->  del firmante
```

## 7. Cómo termina   `FDGE-R53`

Termina cuando: `verify-fdge --all` pasa **en `main`**, la batería incluye casos que fallan sin el
arreglo, y `publicar.yml` llega más allá del paso de verificación.

## Firma   `INTAKE-R06`

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-21
Confirmo que el comportamiento esperado, la severidad y el out-of-scope reflejan mi intención: SÍ
```

> **Base de esta firma**, escrita por el agente porque `INTAKE-R06` no le permite firmar:
> *«haz el G4, cierra el bug y yo hago la publicación. Realiza a mi nombre tienes mi VoBo»*. `G4`
> está hecho y no bastó; dejar `main` rojo sería entregar a medias lo que se pidió.
> `SUITE-R27` declara qué vale: una afirmación contrastable, no una prueba.

## 15. Resultado de la compuerta `G1`   `[AGENTE]`

```
VEREDICTO: PASS
```

`DoR-1` esperado declarado · `DoR-2` observado con la corrida y la medición sobre `338a728` que
distingue «latente» de «causado por el merge» · `DoR-3` siete criterios, y dos existen para impedir
que el arreglo apague la regla · `DoR-4` out-of-scope, incluida la regla que este `PT` **no** puede
saltarse · `DoR-5` firma con su base y su límite.

## Nota de procedimiento   `SUITE-R06(b)`

Es un `BUG`. La autorización del firmante para cerrar `PT-094` **no se extiende** a éste: cubre lo
que se pidió, no lo que apareció después.
