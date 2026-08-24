# Diseño — `PT-126`   `PHASE 4`

> La propuesta completa. Es lo que `G2` resuelve.

---

## 1 · Las tres piezas

| Pieza | Dónde | Qué hace |
|:---|:---|:---|
| La medición de la matriz | `tools/tracker.mjs` · `sellar` | lee `MATRIZ.md`, aplica el umbral y nombra los candidatos |
| El umbral y su motivo | `REGISTRY.tracker` | `umbral_clase_sin_dueno: 3` y por qué |
| El aviso de clase | `tools/verify-fdge.mjs` | `LEX-R31`: una entrada nueva sin clase **avisa** |
| La recolección | `FPGE-Implementation.md` §2 | `MATRIZ.md` entra como fuente de candidatos |

## 2 · Qué lee `sellar`, y de dónde

**De la tabla de `MATRIZ.md`, no de `EVENTOS.jsonl`.** Es deliberado: si leyera el `jsonl`
tendría que volver a derivar veces, dueñas y verificadores, y sería una segunda derivación del
mismo hecho —`CE-008`— que además podría dar otro número.

Lee la fila ya derivada. Si `MATRIZ.md` está vieja, quien lo dice es `matriz:check` dentro de
`npm run verify`, que es su sitio.

## 3 · Tres desenlaces

```
17 clases · umbral 3 · N candidatas     se leyó la matriz
17 clases · ninguna llega al umbral     se leyó y no hay candidatas
SIN EVALUAR                             NO se pudo leer, y se dice
```

Una `MATRIZ.md` ausente **no** es una matriz sin candidatos. Decirlas igual es lo que `RULE-06`
prohíbe, y es la lección que `PT-110` dejó escrita.

## 4 · El aviso de `LEX-R31`

```
✓ LEX-R31  PT-119: declara «Clase de evento: CE-002».
! LEX-R31  PT-129: su entrada no declara «Clase de evento: CE-NNN». Es opcional…
```

`warn`, no `fail`, y `rigeGlobal` y no `rige`: la clase la exige **la suite** desde la `13.0.0`,
no cada tarea desde la versión con que se abrió.

## 5 · Lo que NO hace

- **No promueve.** Publica candidatos; `FPGE-R04` reserva la decisión a una persona, y el propio
  mensaje lo dice.
- **No prioriza.** No hay puntuación aquí.
- **No escribe en `MATRIZ.md`.** `sellar` sólo lee.
