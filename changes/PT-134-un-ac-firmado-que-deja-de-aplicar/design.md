# Diseño — `PT-134`   `PHASE 4`

## Cómo se declara un `AC` caído

```
traceability.md   | AC-06 | … | `CAÍDO` | — decayó con … | … |
manifest.json     { "ac": "AC-06", "verified": false, "caido": "por qué decayó" }
```

**Las dos cosas.** La fila sola sería una palabra que apaga una comprobación; el motivo solo no se
vería al leer la matriz.

## Lo que el verificador hace

| Situación | Resultado |
|:---|:---|
| `CAÍDO` + motivo (≥ 12 caracteres) + no verificado | `✓` · no es Orphan |
| `CAÍDO` sin motivo, o con un motivo trivial | **error** — «no dice POR QUÉ» |
| `CAÍDO` + `verified: true` | **error** — el verde fingido |
| Sin la palabra y sin `TS` | **error** — sigue siendo Orphan |

## Por qué el motivo tiene longitud mínima

Es lo mismo que `PT-138` hizo con la condición de reentrada: se puede exigir que **diga** algo; que
diga algo **honesto** no es mecanizable y se declara (`SUITE-R26`). Doce caracteres no juzgan la
calidad — sólo impiden que la celda se rellene con «x» para callar la comprobación.

## `AC-04` — `PT-113`, y por qué se **añade** y no se reescribe

Su `AC-06` estaba **fuera** de la matriz. Ahora vuelve, declarado `CAÍDO`, con el motivo en su
manifiesto. La prosa anterior **se conserva** y encima se escribe la corrección con su fecha:
`SUITE-R09` es append-only y `FDGE-R29` dice que una corrección se **añade**.

`PT-113` está `INTEGRATED`, así que `verify-fdge` no la juzga (`SUITE-R36`: lo cerrado es
evidencia, no estado). La declaración es **documental**, y el mecanismo se demuestra sobre
fixture. Se dice así en vez de afirmar que el verificador la aprueba.
