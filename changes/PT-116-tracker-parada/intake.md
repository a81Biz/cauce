# PT-116 — tracker parada: el comando que escribe la parada en su tarea

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-116
type: FEATURE
epic: EP-020
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «se detiene -> en github lo que motiva la explicación -> la explicación -> si se abre una nueva tarea o épica o qué -> continuar. Así no nos perdemos de lo que ocurre y se puede reconsultar después»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker parada PT-NNN --motivo <clase> --texto <ruta> --desenlace <clase> [--abre PT-NNN|EP-NNN]` publica la nota en el issue de la tarea con `MARCA_AGENTE` | un caso que publica y otro que comprueba la marca |
| AC-02 | El texto largo entra por ARCHIVO, nunca por la línea de comandos | SUITE-R59; el comando rechaza --texto con contenido en vez de ruta |
| AC-03 | Sin plataforma declarada escribe en `TRANSICIONES.log`, append-only, y NO exige issue | el fixture sin plataforma publica y no revienta (PT-084) |
| AC-04 | La nota NO casa con `RE_NOTA`, así que no infla el recuento de `FDGE-R52` | tracker notas antes y después da el mismo número |
| AC-05 | Un motivo o un desenlace fuera de la lista cerrada se RECHAZA, con el mensaje que enumera los válidos | la inversa: motivo inventado ⇒ falla |
| AC-06 | Lo irreversible —publicar— va el ÚLTIMO, y todo lo anterior se restaura si algo falla | el mismo contrato que avanzar (PT-053) |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: publicar una parada es un comando y no una secuencia de actos que hay que recordar.

## 4. Qué NO entra   `[AGENTE]`

- OUT: exigir la parada: es PT-117. Aquí se construye el medio, no la obligación
- OUT: editar o borrar una parada publicada. Append-only (SUITE-R09)
- OUT: publicar la conversación literal: la nota es la explicación, no el transcript

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **El adaptador ya tiene `comentar(numero, cuerpo)` y `MARCA_AGENTE`**: esta tarea no construye plataforma, expone lo que ya existe. Comprobarlo antes de escribir es lo que `PT-110` no hizo siete veces.
- **El orden por reversibilidad no se reinventa**: `avanzar` ya lo resolvió y la constante debe ser la misma, no una parecida (`SUITE-R38`, lección de `PT-077`).
