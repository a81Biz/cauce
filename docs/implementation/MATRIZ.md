# `MATRIZ.md` — qué se repite, y qué no tiene dueño

> **GENERADO.** No se edita a mano: `node docs/methodology/tools/matriz.mjs`.
> Toda cifra se deriva de `EVENTOS.jsonl` (`PT-125`), `LEXICON` §4.4, `RULES.md` y los
> `fail()` reales del código. Una cifra transcrita caduca — es `CE-010`, medida quince
> veces en este repositorio.

169 entradas recorridas · 147 identificadores · 76 instancias · 17 clases declaradas · datos de 2026-08-13 a 2026-08-23

| Clase | Qué es | Veces | Ordinal declarado | Primera | Última | Regla dueña | ¿Puede fallar? |
|:---|:---|--:|--:|:---|:---|:---|:---|
| `CE-001` | El proxy en lugar del hecho | 8 | 12 | 2026-08-20 | 2026-08-23 | **—** | **sin dueño** |
| `CE-002` | Rotura de escapado | 10 | 7 | 2026-08-21 | 2026-08-23 | `SUITE-R59` | **NO**: la regla existe y nada emite por ella |
| `CE-003` | Un argumento se cuela por la detección de `ROOT` | 8 | 7 | 2026-08-18 | 2026-08-23 | **—** | **sin dueño** |
| `CE-004` | Probar donde trabajo, no donde se decide | 9 | 9 | 2026-08-18 | 2026-08-23 | **—** | **sin dueño** |
| `CE-005` | Verde por no haber mirado | 7 | 2 | 2026-08-14 | 2026-08-23 | **—** | **sin dueño** |
| `CE-006` | El acto hecho fuera del comando | 4 | — | 2026-08-21 | 2026-08-23 | `SUITE-R58` · `FDGE-R52` | `SUITE-R58` avisa · `FDGE-R52` falla |
| `CE-007` | Existe la herramienta y nada la echa en falta | 4 | 7 | 2026-08-19 | 2026-08-23 | **—** | **sin dueño** |
| `CE-008` | Un hecho, varios nombres | 3 | 5 | 2026-08-13 | 2026-08-21 | `SUITE-R14` | `SUITE-R14` falla |
| `CE-009` | El estado terminal escrito a mano o adelantado | 1 | — | 2026-08-21 | 2026-08-21 | `SUITE-R46` | `SUITE-R46` falla |
| `CE-010` | La cifra transcrita caduca | 1 | — | 2026-08-20 | 2026-08-20 | `FND-R14` | `FND-R14` avisa |
| `CE-011` | Un arreglo deja tests del estado anterior | 1 | 4 | 2026-08-13 | 2026-08-13 | **—** | **sin dueño** |
| `CE-012` | Filtrar la salida antes de mirarla | 2 | 3 | 2026-08-20 | 2026-08-20 | **—** | **sin dueño** |
| `CE-013` | Un encabezado mal formado bloquea la integración | 5 | — | 2026-08-14 | 2026-08-21 | `FDGE-R29` | `FDGE-R29` falla |
| `CE-014` | Una regla nueva juzga hacia atrás | 2 | — | 2026-08-20 | 2026-08-22 | `SUITE-R09` | `SUITE-R09` falla |
| `CE-015` | El cierre destapa más que el reparto | 5 | 6 | 2026-08-20 | 2026-08-23 | **—** | **sin dueño** |
| `CE-016` | Trabajar sin allocation | 4 | 3 | 2026-08-21 | 2026-08-23 | `SUITE-R08` · `FDGE-R19` | `SUITE-R08` falla · `FDGE-R19` falla |
| `CE-017` | La comprobación acusa a quien documenta el hecho | 2 | — | 2026-08-19 | 2026-08-20 | **—** | **sin dueño** |

## Qué falta por corregir

**9 de 17 clases no tienen regla que las reclame.**
Ordenadas por cuántas veces han ocurrido:

- `CE-004` **Probar donde trabajo, no donde se decide** — 9 instancia(s) · la propia entrada llegó a declarar **9**
  PT-056 · PT-064 · PT-082 · PT-098 · PT-099 · PT-128 · PT-125 · PT-119
- `CE-001` **El proxy en lugar del hecho** — 8 instancia(s) · la propia entrada llegó a declarar **12**
  PTSA-2026-08-20 · PT-087 · EP-019 · PT-131 · PT-124 · PT-125 · PT-119 · PT-126
- `CE-003` **Un argumento se cuela por la detección de `ROOT`** — 8 instancia(s) · la propia entrada llegó a declarar **7**
  PT-053 · PT-057 · PT-060 · PT-062 · PT-064 · PT-125 · PT-119 · PT-126
- `CE-005` **Verde por no haber mirado** — 7 instancia(s) · la propia entrada llegó a declarar **2**
  PT-044 · PT-047 · PT-016 · PT-057 · EP-019 · PT-126 · PT-135
- `CE-015` **El cierre destapa más que el reparto** — 5 instancia(s) · la propia entrada llegó a declarar **6**
  PTSA-2026-08-20 · EP-018 · EP-019 · PT-125 · PT-126
- `CE-007` **Existe la herramienta y nada la echa en falta** — 4 instancia(s) · la propia entrada llegó a declarar **7**
  PT-079 · PT-114 · PT-125 · PT-126
- `CE-012` **Filtrar la salida antes de mirarla** — 2 instancia(s) · la propia entrada llegó a declarar **3**
  PT-092 · INC-001
- `CE-017` **La comprobación acusa a quien documenta el hecho** — 2 instancia(s)
  PT-066 · EP-018
- `CE-011` **Un arreglo deja tests del estado anterior** — 1 instancia(s) · la propia entrada llegó a declarar **4**
  PT-036

**Esta matriz no prioriza ni abre nada.** Enumera. Puntuar es `FPGE` y tiene su propia
fórmula; abrir una tarea lo decide una persona (`FPGE-R04`).

