# Intake — FEATURE

> Copiar a `changes/PT-XXX-slug/intake.md` y rellenar.
> `[HUMANO]` = lo escribe una persona. El agente **no puede** inventar estos campos
> (`INTAKE-R02`, `INTAKE-R03`).
> `[AGENTE]` = lo completa el agente en PHASE 1 tras leer los campos humanos.
> Compuerta: [Intake-Protocol.md §4](../Intake-Protocol.md) · Reglas: [RULES.md](../../RULES.md)

---

```yaml
---
id: PT-XXX                 # [AGENTE] asignado desde REGISTRY.json
type: FEATURE
severity: S3               # [HUMANO] S1 | S2 | S3 | S4
complexity:                # [AGENTE] se propone en PHASE 2
track: STANDARD            # [AGENTE] STANDARD | EXPRESS
status: DRAFT
created: YYYY-MM-DD
origin: DIRECT             # DIRECT | R-NNN | H-NNN
epic:                      # EP-NNN si pertenece a un lote
---
```

---

## 1. Qué se quiere `[HUMANO]`

Descripción funcional en lenguaje llano. Qué debe poder hacerse que hoy no se puede.

> *Ejemplo: «Los usuarios deben poder exportar el detalle de un pedido a PDF desde la
> pantalla de detalle.»*

---

## 2. Objetivo de negocio `[HUMANO]` — obligatorio

Qué cambia, para quién, y **por qué ahora**. Sin esto, la feature no tiene criterio para
resolver ningún compromiso que aparezca durante el diseño.

```
Qué cambia:
Para quién:
Por qué ahora:
```

> *Ejemplo: «Soporte dedica ~2 h/día a enviar detalles de pedido copiados a mano. Los
> clientes empresariales los piden en PDF para su contabilidad. Se pierden operaciones por
> el retraso.»*

---

## 3. Actor y disparador `[HUMANO]`

```
Actor (rol que lo usa):
Disparador (qué hace para iniciarlo):
Frecuencia esperada de uso:
```

---

## 4. Criterios de aceptación `[HUMANO]` — obligatorio

**Este es el campo más importante del documento.** Son la definición del negocio, no una
propiedad derivable del código. Escríbelos tú aunque queden torpes: el agente los
formalizará en §11.

Cada criterio debe poder responderse con ✓/✗ observando el sistema (`INTAKE-R05`).
«Funciona correctamente» no es un criterio. «El PDF contiene nombre, fecha y total» sí.

No los numeres: el agente les asignará `AC-nn` en §11, que es **la versión canónica** a la
que apuntarán tests, evidencia y casos QA. Así existe una sola fuente de identificadores.

```
-
-
-
```

> *Ejemplo:*
> *«AC-01: desde el detalle de un pedido, un botón "Exportar PDF" descarga un archivo.»*
> *«AC-02: el PDF incluye número de pedido, fecha, cliente, líneas y total.»*
> *«AC-03: el archivo se llama `pedido-{numero}-{fecha}.pdf`.»*
> *«AC-04: si el pedido no existe, se muestra un error legible y no se descarga nada.»*

---

## 5. Qué NO debe hacer `[HUMANO]` — obligatorio

Comportamientos explícitamente excluidos. Distinto del out-of-scope: aquí van cosas que el
sistema **no debe** hacer, no cosas que se harán más tarde.

```
```

> *Ejemplo: «No debe enviar el PDF por email. No debe quedar guardado en el servidor.
> No debe ser accesible sin autenticación.»*

---

## 6. Out of scope `[HUMANO]` — obligatorio

Qué queda **fuera de esta entrega** aunque esté relacionado y se vaya a pedir después.
Una feature sin límites declarados no tiene límites (`DoR-F6`).

```
OUT:
OUT:
OUT:
```

> *Ejemplo: «OUT: exportación a Excel. OUT: envío por email. OUT: historial de
> exportaciones. OUT: exportación masiva de varios pedidos.»*

---

## 7. Métrica de éxito `[HUMANO]` — obligatorio

Cómo sabrás dentro de un mes si mereció la pena. Una señal observable, no una intención.

```
Métrica:
Valor actual:
Valor objetivo:
Cómo se mide:
```

> *Ejemplo: «Tickets de soporte pidiendo el detalle de un pedido: 40/mes hoy → menos de 10.
> Se mide en el panel de soporte por categoría.»*

---

## 8. Restricciones `[HUMANO]` `[OPCIONAL]`

```
Fecha límite y su motivo:
Restricciones legales o de cumplimiento:
Sistemas externos con los que debe convivir:
Presupuesto o límite de esfuerzo:
```

---

## 9. Referencias `[HUMANO]` `[OPCIONAL]`

Mockups, capturas de un producto que lo hace bien, documentos, conversaciones, tickets.

```
```

---

## 10. Firma `[HUMANO]` — obligatorio

El agente **no puede** escribir este bloque (`INTAKE-R06`).

```
Solicitado por:
Fecha:
Confirmo que los criterios de aceptación, el «qué NO debe hacer» y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote:            (solo si pertenece a un EP-NNN — INTAKE-R08; si no, dejar vacío)
```

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

Normalización de §4. **Esta es la lista con la que trabaja el resto de la suite**:
`traceability.md`, `manifest.json` y los casos QA citan estos `AC-nn` y ningún otro
(`FDGE-R15`, `QA-R19`). El agente hace medible lo que el humano declaró; **no añade
intención nueva**. Si detecta un criterio que falta, lo propone en §16 y espera decisión —
no lo inserta aquí.

```
AC-01: 
AC-02: 
AC-03: 
```

## 12. Escenarios de test derivados `[AGENTE]`

Cada `TS` cita el `AC` que verifica (`FDGE-R15`).

```
Happy path
  TS-01 (AC-01, AC-02): 

Edge cases
  TS-02 (AC-03): 

Failure cases
  TS-03 (AC-04): 
```

## 13. Capas técnicas afectadas `[AGENTE]`

```
Backend:
Frontend:
API:
Base de datos:
Servicios externos:
```

## 14. NFRs derivados `[AGENTE]`

Extraídos de `11-Conventions.md`, `09-Security-Architecture.md` y `03-TRD.md`. Se cita la
fuente de cada uno.

```
Rendimiento:      (fuente: )
Seguridad:        (fuente: )
Accesibilidad:    (fuente: )
Observabilidad:   (fuente: )
Compatibilidad:   (fuente: )
```

## 15. Complejidad propuesta y duplicados `[AGENTE]`

```
Complejidad: TRIVIAL | STANDARD | MAJOR
Justificación:

BACKLOG.md consultado:               sí / no
ENRICHMENT.md — features similares:  
Roadmap — R-NNN relacionado:         
```

## 16. Observaciones del agente `[AGENTE]` — obligatorio

Desafíos al Intake (`INTAKE-R07`). Escribir «ninguna» solo si de verdad no hay ninguna.

```
- Criterio ambiguo o no verificable:
- Contradicción con el PRD o con Conventions:
- Criterio que parece faltar:
- Out-of-scope que resulta indispensable para cumplir un AC:
- Métrica de éxito no medible con lo que hoy existe:
```

## 17. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-01 tipo declarado                       [ ]
DoR-02 severidad declarada por el humano    [ ]
DoR-03 firma humana presente                [ ]
DoR-04 out-of-scope declarado               [ ]
DoR-05 PT asignado desde REGISTRY.json      [ ]
DoR-06 no duplica trabajo vivo              [ ]
DoR-07 observaciones registradas            [ ]
DoR-F1 objetivo de negocio declarado        [ ]
DoR-F2 actor y disparador identificados     [ ]
DoR-F3 al menos un AC escrito por el humano [ ]
DoR-F4 todo AC es verificable con ✓/✗       [ ]
DoR-F5 métrica de éxito declarada           [ ]
DoR-F6 out-of-scope no vacío                [ ]

VEREDICTO: PASS | FAIL | CHALLENGE
Motivo (si FAIL o CHALLENGE):

CHALLENGE aceptado por:      (solo si el veredicto fue CHALLENGE y el humano decidió
                              proceder igualmente — sin esta línea el PT no avanza)
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

<!-- ## Revisión 1 — YYYY-MM-DD
Qué cambia:
Motivo:
Firmado por: -->
