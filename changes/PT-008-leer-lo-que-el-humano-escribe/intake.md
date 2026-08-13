# PT-008 — No se cierra fase con comentarios humanos sin responder

> Tarea de la implementación abierta `EP-002` (`FDGE-R51`). Plantilla `TAREA.md`.

```yaml
---
id: PT-008
type: FEATURE
epic: EP-002
track: STANDARD
status: READY
created: 2026-08-13
structural: no
suite_version: 5.3.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «me da la oportunidad de comentar cada uno directamente y que puedas revisar mis comentarios
> directamente ahí sin perder control del contexto ni de lo que se trata cada cosa»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un comentario humano posterior a la última nota del agente bloquea el avance de fase | `verify-fdge` falla mientras quede sin responder |
| AC-02 | Responder lo desbloquea | Una nota del agente posterior al comentario |
| AC-03 | Los comentarios del propio agente no cuentan como pendientes | Se distingue por **autor**, no por contenido |
| AC-04 | Sin plataforma declarada no cambia nada | Caso de `selftest.sh` |
| AC-05 | Sin acceso, `SIN EVALUAR` | Nunca un aprobado silencioso |
| AC-06 | La regla existe en `RULES.md`, no solo en el código | Una comprobación sin regla es un capricho del verificador |

## 3. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: un comentario humano sin responder en el issue de un PT hace fallar
> `verify-fdge` sobre ese PT, y contestarlo lo pone en verde.

## 4. Qué NO entra   `[AGENTE]`

- OUT: interpretar el contenido del comentario. Se comprueba que haya respuesta, no que sea buena
- OUT: responder automáticamente. Una respuesta generada para satisfacer un contador es el falso verde que este marco existe para eliminar
- OUT: comentarios del pull request. Solo los issues de `PT` y `EP`

## 5. Firma

```
Firmado por lote: EP-002
```

---

## Por qué es `S2` y las otras dos `S3`

Porque es la única de las tres que ataca una pérdida **ya ocurrida**. Durante esta sesión el
agente escribió en los issues y **no releyó ninguno**: `gh issue view --json comments` existía
y no se usó nunca. Un comentario humano podía quedar sin leer indefinidamente y nada lo
señalaba.

Las otras dos mejoran cómo se lee el estado. Esta impide que se pierda información que una
persona se molestó en escribir.

## Lo que esta regla NO puede garantizar

Que la respuesta sea buena. Comprueba que exista una nota posterior del agente, y eso es
falsificable escribiendo cualquier cosa. Es la misma limitación que `SUITE-R27` reconoce en
las firmas: lo que se puede mecanizar es que la afirmación sea **contrastable**, no que sea
sincera. Se declara aquí para que nadie lea la compuerta como más de lo que es.

---

## Revisiones

### Revisión 1 — 2026-08-13 · `AC-03` se reformula: no se puede distinguir por autor

**Qué cambia.** `AC-03` decía «se distingue por **autor**, no por contenido». Pasa a: «se
distingue por **marca de procedencia** en los comentarios del agente».

**Motivo.** Medido en `PHASE 2`: el agente comenta con la credencial de `gh` de la persona, así
que los dos comentarios llevan el mismo autor (`a81Biz`). No es una peculiaridad de este
repositorio — `tracker` habla CLI para funcionar con un token, y ese token es de alguien.
Distinguir por autor exigiría una cuenta de máquina, que es infraestructura que el marco no
debe imponer.

**Lo que la reformulación cuesta:** la marca es falsificable. Se declara, como `SUITE-R27`
declara qué prueba una firma.
