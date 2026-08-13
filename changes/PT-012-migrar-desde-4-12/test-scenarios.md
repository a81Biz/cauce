# PT-012 — Escenarios de test   `PHASE 4`

Sobre un fixture en 4.12: registro moderno, sin bloque `ESTADO`, sin `phase` y sin plataforma.

| TS | AC | Montaje | Esperado |
|:---|:---|:---|:---|
| `TS-01` | `AC-01` `AC-05` | fixture 4.12 | pide el bloque `ESTADO` citando `SUITE-R33`, y nombra el PT vivo sin `phase` |
| `TS-02` | `AC-02` | ídem | enumera lo que llega nuevo |
| `TS-03` | `AC-03` | ídem | **ofrece** la plataforma; con ella declarada, pide sincronizar |
| `TS-04` | `AC-04` | ídem | menciona `SECRETOS-EXCEPCIONES.md` |
| `TS-05` | `AC-01` | fixture **con** el bloque `ESTADO` ya escrito | **no** lo pide |
| `TS-06` | `AC-06` | fixture ya en `6.0.1` | el tramo **no aparece** |
| `TS-07` | `AC-03` | fixture sin plataforma | **no** exige el pull request |

## Los inversos

`TS-05`, `TS-06` y `TS-07` son los que impiden que «enumerar» se implemente imprimiendo
siempre la lista completa. Sin ellos, un tramo que recitara los nueve pasos a todo el mundo
pasaría `TS-01` a `TS-04`.

## Un aserto que estaba mal

`TS-07` comprobaba al principio que sin plataforma **no se mencionara** `SUITE-R42`. Está mal:
sí se menciona, dentro del mensaje que explica qué activaría declararla. Lo que no debe
aparecer es la **exigencia**, y así quedó escrito. La herramienta tenía razón; el aserto no.
