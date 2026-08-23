# PT-126 — sellar mide la matriz y FPGE la lee

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-126
type: CHORE
epic: EP-020
track: STANDARD
status: READY
phase: 1
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

> **El campo `type` NO está en `REGISTRY.json`**, y no es un olvido: `tracker asignar` rechaza
> `CHORE` diciendo que «LEXICON declara: BUG · FEATURE · CHANGE · TAREA». `LEXICON` §943 declara
> otra cosa. Es el defecto de `PT-124`, y hasta que cierre el campo se queda **ausente antes que
> inventado** (`RULE-06`).

## 1. Qué se quiere   `[HUMANO]`

> «teniendo las explicaciones y la matriz tendremos una nutrida base de conocimiento y estas reglas se pueden aplicar a cualquier trabajo»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker sellar` mide la matriz y la publica junto a las otras cuatro cosas que ya recorre | el patrón de PT-110: se pone donde ya se mira, no en un comando nuevo |
| AC-02 | Toda entrada nueva de `HISTORY.log` declara su clase de evento, y `verify-fdge` avisa cuando falta | avisa, no falla: SUITE-R09 no retrofecha las 131 anteriores |
| AC-03 | `FPGE` lee `MATRIZ.md` y toda clase con recuento >= 3 sin regla con verificador entra como candidato, sin que nadie la transcriba | FPGE-Implementation cita la fuente y un caso lo comprueba |
| AC-04 | El umbral 3 está DECLARADO con su motivo y es un parámetro, no un número escondido en el código | SUITE-R38 |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: una clase que se repite tres veces sin dueño aparece sola en el ROADMAP.

## 4. Qué NO entra   `[AGENTE]`

- OUT: priorizar los candidatos. La fórmula de FPGE-R06 no cambia
- OUT: promover nada. FPGE-R04 lo prohíbe y sigue prohibiéndolo

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es el cierre del bucle y por eso va al final**: sin `PT-125` y `PT-119` no hay matriz que medir.
- **El umbral 3 es un juicio y se declara como tal.** Sale de que las cuatro clases hoy `CERRADA` se cerraron cuando alguien contó, y la menor de esas cuentas fue tres (`INC-001`, filtrar la salida).
