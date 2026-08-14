# PT-043 — Escenarios de prueba   `PHASE 4`

Todos se ejecutan sobre el fixture `mk_v412` de `selftest.sh` —un proyecto en `4.12.0` sin bloque
`ESTADO`, sin fase declarada y sin plataforma—, que es el que produce decisiones pendientes.

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-02 | `SUITE-R55` está en `RULES.md` | presente |
| E2 | AC-02 | …y llega al núcleo que carga el agente | presente en `CORE.md` |
| E3 | AC-02 | `PHASES.md` la cita | presente |
| E4 | AC-02 | `FDGE-Prompts.md` la cita | presente |
| E5 | AC-01 | Migrar **conduce**: las decisiones van numeradas | `1/` sobre el total |
| E6 | AC-01 | El bloque se presenta por lo que es | «que te toca decidir, y por que es tuyo» |
| E7 | AC-02 | Cada decisión dice **por qué no puede decidirla una máquina** | el porqué de la fase, y el del bloque `ESTADO` |
| E8 | AC-02 | **Ninguna** cae en el `RULE-06` por defecto | «No se reconoce el motivo» **no aparece** |
| E9 | AC-02 | Ningún titular parte una palabra: si se corta, se marca | 0 titulares largos sin `…` |
| E10 | AC-03 | El modo restringido se **explica** al entrar en él | «No es un castigo» y `SUITE-R17` |
| E11 | AC-04 | `SUITE-R17` no se relaja: la lista queda en el registro | `migration_pending` poblado tras `--apply` |
| E12 | AC-04 | …y el código de salida sigue siendo `1` con pendientes | `1` |
| E13 | AC-01 | Sin decisiones pendientes **no hay conductor**: no se recita lo que no aplica | el bloque **no aparece** en un proyecto ya en la vigente |

## El caso que no es un caso   `AC-01`

`AC-01` dice «se comprueba por ejecución». Los escenarios de arriba corren contra el fixture; la
comprobación que cierra el `AC` es la **salida real sobre el proyecto legado**
(`Inteligencia de Mercados Energéticos Mexicanos`, `4.12.0`), guardada en
`evidence/PT-043/salidas/legado.txt`. Un fixture prueba que el mecanismo funciona; solo el legado
prueba que sirve — y es donde aparecieron `D1` y `D2`.

## Lo que ningún escenario prueba

Que las seis decisiones se **tomen**. Nada puede probarlo: es lo que la regla dice de sí misma.
