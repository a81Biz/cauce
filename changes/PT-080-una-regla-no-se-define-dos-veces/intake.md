# PT-080 — Una regla no se define dos veces

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-080
type: BUG
epic: EP-017
track: STANDARD
status: READY
phase: 1
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Que ninguna regla tenga dos textos. Es la razón por la que existe la v4: la v3 tenía la misma
> regla escrita a mano en cuatro documentos y las cuatro divergieron. Tres siguen así en la v9, y
> nada lo detecta.»

## 2. Los tres casos, medidos   `[AGENTE]`

Encontrados en `PT-067` al derivar el universo de reglas de sus tres documentos propietarios.
**Los tres ya divergen**, y siempre en la misma dirección: la copia de `EXECUTION-MODES.md`
suelta una obligación que `RULES.md` sí exige.

| Regla | `RULES.md` exige | La copia de `EXECUTION-MODES.md` **omite** | Consecuencia |
|:---|:---|:---|:---|
| `FDGE-R22` | «Solo para `severity: S1`»; completar `PHASE 2, 3, 4, 7 y 8` retroactivas | **las dos** | quien lea sólo `EXECUTION-MODES` puede meter un `S3` por el carril HOTFIX, que difiere `G2` y `G3` |
| `FDGE-R40` | los PTs que comparten archivos **se serializan** | la serialización | el solapamiento se calcula, se declara… y se ejecuta en paralelo igual |
| `FDGE-R41` | **el `EP-NNN` pasa a `BLOCKED`**, con causante y motivo en `BACKLOG.md` | la transición de estado | el lote se para y el registro sigue diciendo que está vivo |

`FDGE-R22` es la peor de las tres: la copia débil abre una puerta a saltarse dos compuertas.

## 3. Por qué no lo vio nadie

`verify-suite` comprueba vocabulario derogado, reglas citadas que no existen, obligaciones en
documentos que sólo explican, enlaces rotos y versiones desalineadas. **No comprueba que una
regla se defina una sola vez** — que es la única de esas cinco cosas por la que se escribió la v4.

`LEX-R22` («ningún documento salvo `RULES.md` enuncia obligaciones: las citan por ID») y
`SUITE-R38` («no dos fuentes del mismo hecho») ya lo prohíben. Lo que falta es quien lo mire.

## 4. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `verify-suite` **falla** si un ID se define en dos documentos propietarios | caso con dos definiciones inyectadas |
| AC-02 | …y no falla con una sola | caso con una |
| AC-03 | El mensaje dice **los dos sitios**, no sólo que hay conflicto | la salida nombra ambos documentos y sus líneas |
| AC-04 | Los tres casos reales quedan resueltos | `verify-suite` en verde sobre el repositorio |
| AC-05 | La resolución **conserva la obligación fuerte** | las tres copias débiles se convierten en cita por ID; ninguna obligación se pierde |
| AC-06 | La comprobación entra en la batería | `selftest.sh` la ejecuta |

## 5. Cómo se resuelve cada caso   `FDGE-R53`

**No se borra el texto de `EXECUTION-MODES.md`: se convierte en cita.** Ese documento explica
cómo se ejecuta un lote y necesita nombrar la regla en su sitio; lo que no puede es **enunciarla**
(`LEX-R22`). Queda el ID, su remisión a `RULES.md` y la explicación —que es lo que ese documento
sí debe aportar—.

`RULES.md` no se toca: es el propietario y su texto es el fuerte en los tres casos.

## 6. Cómo termina   `FDGE-R53`

> Termina cuando: ningún ID se define en dos documentos propietarios, `verify-suite` lo comprueba,
> y las tres obligaciones que hoy sólo están en `RULES.md` siguen estando.

## 7. Qué NO entra   `[AGENTE]`

- OUT: Las 20 filas `PTSA-R*` de `RULES.md` que espejan la especificación de PTSA. Son un índice
  declarado, no una segunda definición, y tienen su propio bloque de auditoría. Si resultan serlo,
  es otra tarea.
- OUT: Reescribir el contenido de las reglas. Esta tarea quita copias; no legisla.
- OUT: El denominador de `audit` — eso es `PT-067`, de donde sale este hallazgo.

## 8. Firma

```
Firmado por lote: EP-017
```
