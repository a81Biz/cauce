# Intake — REFACTOR / CHORE

> Copiar a `changes/PT-XXX-slug/intake.md` y rellenar.
> `[HUMANO]` = lo escribe una persona. `[AGENTE]` = lo completa el agente en PHASE 1.
> Compuerta: [Intake-Protocol.md §4](../Intake-Protocol.md) · Reglas: [RULES.md](../../RULES.md)

---

```yaml
---
id: PT-XXX                 # [AGENTE] asignado desde REGISTRY.json
type: REFACTOR             # [HUMANO] REFACTOR | CHORE
severity: S4               # [HUMANO] S1 | S2 | S3 | S4
complexity:                # [AGENTE] se propone en PHASE 2
track: STANDARD            # [AGENTE] STANDARD | EXPRESS (CHORE suele ser EXPRESS)
status: DRAFT
phase: 1                 # [AGENTE] OBLIGATORIO desde 8.0.0 · SUITE-R08
created: YYYY-MM-DD
origin: DIRECT             # DIRECT | H-NNN | R-NNN
epic:                      # EP-NNN si pertenece a un lote
---
```

> **REFACTOR** cambia la estructura interna sin alterar el comportamiento observable.
> **CHORE** es trabajo necesario que no es bug, feature ni refactor: subir una dependencia,
> mover archivos, ajustar CI, actualizar configuración. Un `CHORE` que cambia comportamiento
> observable no es un `CHORE`: es un `FEATURE` o un `BUG`.

---

## 1. Qué cambia internamente `[HUMANO]` — obligatorio

Qué estructura, abstracción, patrón, dependencia o configuración se modifica.

```
```

> *Ejemplo REFACTOR: «El módulo de pagos concentra la lógica de negocio, el acceso a la
> pasarela y el formateo de respuestas en un solo archivo de 1.400 líneas. Se separa en
> servicio de dominio, adaptador de pasarela y presentador.»*
> *Ejemplo CHORE: «Subir Playwright de 1.38 a 1.49 para poder usar tags nativos de test.»*

---

## 2. Qué NO debe cambiar `[HUMANO]` — obligatorio

El límite explícito. Todo lo que está fuera de esta lista no se toca. **Es el campo que
define un refactor**: sin él, un refactor es una reescritura sin control.

```
No cambia — contratos externos:
No cambia — comportamiento observable:
No cambia — interfaces públicas / firmas:
No cambia — esquema de datos:
No cambia — archivos o módulos:
```

---

## 3. Motivación técnica `[HUMANO]` — obligatorio

Por qué el estado actual es insostenible o subóptimo **ahora**. Un refactor sin coste actual
declarado es una preferencia estética, y compite mal contra trabajo con coste real.

```
Coste que estamos pagando hoy:
Qué se vuelve posible después:
Qué pasa si no se hace:
```

> *Ejemplo: «Cada cambio en pagos requiere tocar el mismo archivo, y en los últimos 4 PTs
> hubo 2 regresiones cruzadas. Después, el adaptador de pasarela podrá testearse aislado y
> se podrá añadir un segundo proveedor sin tocar el dominio.»*

---

## 4. Barra de calidad `[HUMANO]` — obligatorio

El umbral **medible** que certifica que el trabajo terminó. Un número o una condición
verificable, nunca un adjetivo. «Más mantenible» no es una barra de calidad.

```
Métrica:
Valor actual:
Valor objetivo:
Cómo se comprueba:
```

> *Ejemplos válidos:*
> *«Cobertura de tests en `src/payments/` ≥ 80 % (hoy 34 %), medido con el reporte de cobertura.»*
> *«0 apariciones de `new PaymentGateway(` fuera de `src/payments/adapters/`, verificado con grep.»*
> *«Ningún archivo de `src/payments/` supera las 300 líneas.»*

---

## 5. Riesgo de regresión `[HUMANO]`

Comportamientos que **deben** preservarse exactamente. Cada uno necesita un test que lo
certifique **antes** de empezar (`RC-nn`).

```
RC-01:
RC-02:
```

> *Ejemplo: «RC-01: un pago con tarjeta válida sigue devolviendo el mismo objeto de
> respuesta, campo por campo.»*
> *«RC-02: un pago rechazado sigue registrando la misma línea de log con el mismo formato.»*

---

## 6. Out of scope `[HUMANO]` — obligatorio

Mejoras tentadoras que **no** entran en este trabajo. Un refactor es el tipo de trabajo que
más fácilmente crece solo.

```
OUT:
OUT:
```

---

## 7. Estrategia de rollback `[HUMANO]` `[OPCIONAL]`

Cómo se deshace si sale mal. Para `MAJOR` es obligatorio.

```
```

---

## 8. Firma `[HUMANO]` — obligatorio

El agente **no puede** escribir este bloque (`INTAKE-R06`).

```
Solicitado por:
Fecha:
Confirmo que el límite «qué NO debe cambiar», la barra de calidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote:            (solo si pertenece a un EP-NNN — INTAKE-R08; si no, dejar vacío)
```

---

---

# A partir de aquí lo completa el agente

## 9. Criterios de aceptación — versión canónica `[AGENTE]`

Derivados de la barra de calidad (§4) y de los controles de regresión (§5). Cada uno debe
poder responderse con ✓/✗. **Esta es la lista con la que trabaja el resto de la suite**:
`traceability.md`, `manifest.json` y los casos QA citan estos `AC-nn` y ningún otro
(`FDGE-R15`, `QA-R19`).

```
AC-01 (barra de calidad): 
AC-02 (RC-01 preservado): 
AC-03 (RC-02 preservado): 
```

## 10. Cobertura de tests: estado actual `[AGENTE]`

`FDGE-R17` exige tests en rojo antes de implementar. En un refactor, además, los tests de
regresión deben existir **y estar en verde** antes de empezar: son la red que certifica que
el comportamiento no cambió.

```
Cobertura actual del área afectada:   %
Cobertura requerida antes de empezar: %
Tests de regresión que faltan:
  - RC-01 → test a escribir:
  - RC-02 → test a escribir:

¿Se puede empezar hoy?  sí / no — si no, qué falta:
```

## 11. Acoplamiento `[AGENTE]`

Qué depende del área a modificar. Fuente: grafo de dependencias, o declaración de su
ausencia (`FDGE-R08`).

```
Componentes dependientes:
Radio de impacto:
Breaking changes posibles:
Fuente consultada:              graphify-out/ · análisis directo · no disponible
```

## 12. Complejidad propuesta y duplicados `[AGENTE]`

```
Complejidad: TRIVIAL | STANDARD | MAJOR
Justificación:

BACKLOG.md consultado:                 sí / no
REFACTOR_SCOPE.md — trabajo similar:   
Roadmap — R-NNN relacionado:           
```

## 13. Observaciones del agente `[AGENTE]` — obligatorio

Desafíos al Intake (`INTAKE-R07`). Escribir «ninguna» solo si de verdad no hay ninguna.

```
- Barra de calidad no medible con lo que hoy existe:
- «Qué NO cambia» que en la práctica cambiará:
- Comportamiento de regresión no cubierto por ningún RC:
- Contradicción con Conventions:
- Cobertura insuficiente para empezar con seguridad:
```

## 14. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-01 tipo declarado                       [ ]
DoR-02 severidad declarada por el humano    [ ]
DoR-03 firma humana presente                [ ]
DoR-04 out-of-scope declarado               [ ]
DoR-05 PT asignado desde REGISTRY.json      [ ]
DoR-06 no duplica trabajo vivo              [ ]
DoR-07 observaciones registradas            [ ]
DoR-R1 qué cambia internamente declarado    [ ]
DoR-R2 qué NO cambia declarado              [ ]
DoR-R3 barra de calidad medible             [ ]
DoR-R4 motivación técnica declarada         [ ]

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
