# PT-031 — Los tres modos exigen lo mismo

> Tarea de la implementación abierta `EP-007` (`FDGE-R51`).

```yaml
---
id: PT-031
type: BUG
epic: EP-007
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 7.1.0
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «El marco trabaja de forma supervisada y autónoma, **las dos deben tener lo mismo**»

## 2. Qué hay que comprobar   `[AGENTE]`

`EXECUTION-MODES.md` describe `MANUAL`, `SUPERVISED` y `AUTONOMOUS`. Lo único que debería
cambiar entre ellos es **quién resuelve las compuertas y cuándo se pide confirmación** — nunca
qué artefactos se exigen, qué reglas se comprueban ni qué evidencia hace falta.

Si un modo exime de algo, el marco tiene dos varas de medir y la más floja se convierte en la
tentación permanente.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Ningún modo exime de un artefacto, una regla o una evidencia | verificador + selftest |
| AC-02 | Lo que sí puede diferir —quién resuelve la compuerta— está declarado como la única diferencia | selftest |
| AC-03 | `G4` sigue siendo humana en los tres (`EXEC-R04`) | selftest |
| AC-04 | Si un modo declarara una exención, falla y dice cuál | selftest, caso inverso |

## 4. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: elegir modo de ejecución no puede cambiar qué se exige, solo quién lo resuelve.

## 5. Qué NO entra   `[AGENTE]`

- OUT: eliminar modos. La diferencia legítima existe
- OUT: cambiar quién resuelve `G4`. Es humana en los tres, sin excepción

## 6. Firma

```
Firmado por lote: EP-007
```
