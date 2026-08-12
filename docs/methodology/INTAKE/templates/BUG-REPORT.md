# Intake — BUG / INVESTIGATION

> Copiar a `changes/PT-XXX-slug/intake.md` y rellenar.
> `[HUMANO]` = lo escribe una persona. El agente **no puede** rellenar estos campos ni darlos
> por deducidos del código (`INTAKE-R01`).
> `[AGENTE]` = lo completa el agente en PHASE 1 tras leer los campos humanos.
> Compuerta: [Intake-Protocol.md §4](../Intake-Protocol.md) · Reglas: [RULES.md](../../RULES.md)

---

```yaml
---
id: PT-XXX                 # [AGENTE] asignado desde REGISTRY.json — nunca inventado
type: BUG                  # [HUMANO] BUG | INVESTIGATION
severity: S2               # [HUMANO] S1 | S2 | S3 | S4
complexity:                # [AGENTE] TRIVIAL | STANDARD | MAJOR — se propone en PHASE 2
track: STANDARD            # [AGENTE] STANDARD | EXPRESS | HOTFIX (HOTFIX solo si severity=S1)
status: DRAFT              # [AGENTE] DRAFT hasta que G1 dé PASS
created: YYYY-MM-DD
origin: DIRECT             # DIRECT | QD-NNN | H-NNN | R-NNN
---
```

---

## 1. Qué está pasando `[HUMANO]`

Una o dos frases, en lenguaje llano. Sin diagnóstico, sin hipótesis de causa.

> *Ejemplo: «Al guardar el formulario de alta de cliente, la página se queda en blanco y el
> cliente no aparece en el listado.»*

---

## 2. Comportamiento esperado `[HUMANO]` — obligatorio

**Qué debería pasar.** Este es el campo más importante del documento.

Es un hecho de negocio, no una propiedad del código. Si lo dejas vacío y el agente lo
deduce del código, deducirá el comportamiento *con el defecto dentro* y "arreglará" el bug
hacia el estado equivocado —con todos los tests en verde.

> *Ejemplo: «Al guardar, el sistema debe crear el cliente, mostrar un aviso de confirmación
> con su nombre y redirigir al detalle del cliente recién creado. El cliente debe aparecer
> en el listado sin recargar.»*

---

## 3. Comportamiento observado `[HUMANO]`

Qué pasa realmente. Descriptivo y observable, no interpretativo.

> *Ejemplo: «La página queda en blanco. La URL no cambia. Al recargar manualmente el
> listado, el cliente tampoco aparece. No se muestra ningún mensaje de error.»*

---

## 4. Reproducción `[HUMANO]`

```
1.
2.
3.
```

Si no es reproducible de forma fiable, decláralo aquí junto con lo que sí sabes:
cuándo ocurrió, qué se estaba haciendo, si hay un patrón.

- [ ] Reproducible siempre siguiendo los pasos
- [ ] Intermitente — ocurre aproximadamente ___ de cada 10 intentos
- [ ] Ocurrió una vez y no he podido reproducirlo

---

## 5. Entorno `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Entorno | producción / staging / local |
| URL o host | |
| Build o commit | |
| Rol de usuario | |
| Navegador / cliente | |
| Fecha y hora del suceso | |

---

## 6. Impacto `[HUMANO]`

| Campo | Valor |
|:---|:---|
| Usuarios afectados | todos / un rol concreto / un cliente / yo solo |
| Volumen estimado | |
| ¿Hay pérdida de datos? | sí / no / no lo sé |
| ¿Existe workaround? | descríbelo, o «no» |
| Impacto de negocio | |

---

## 7. Evidencia adjunta `[HUMANO]` `[OPCIONAL]`

Capturas, logs, IDs de request, mensajes de error literales, grabaciones. Ruta o pegado.

```
```

---

## 8. Out of scope `[HUMANO]` — obligatorio

Qué **no** debe tocarse al arreglar esto, aunque esté relacionado y sea tentador.

```
OUT:
OUT:
```

Si de verdad no hay nada, escribe «ninguno» de forma consciente. Un out-of-scope vacío por
descuido es la puerta de entrada del alcance que crece solo.

---

## 9. Criterios de aceptación del arreglo `[HUMANO]`

Cómo sabrás que está arreglado. Escríbelos como te salgan; el agente los formalizará en §11,
que es **la versión canónica** a la que apuntarán los tests y la evidencia. Aquí no numeres:
la numeración `AC-nn` la asigna el agente para que exista una sola fuente de identificadores.

```
-
-
```

> *Ejemplo: «AC-01: al guardar un cliente con datos válidos, el sistema redirige a
> `/clientes/{id}` en menos de 3 s y muestra el nombre del cliente.»*
> *«AC-02: si el guardado falla, se muestra un mensaje de error visible que indica la causa
> y el formulario conserva los datos introducidos.»*

---

## 10. Firma `[HUMANO]` — obligatorio

El agente **no puede** escribir este bloque (`INTAKE-R06`).

```
Reportado por:
Fecha:
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote:            (solo si pertenece a un EP-NNN — INTAKE-R08; si no, dejar vacío)
```

---

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

Normalización de §9 y §2. **Esta es la lista con la que trabaja el resto de la suite**:
`traceability.md`, `manifest.json` y los casos QA citan estos `AC-nn` y ningún otro
(`FDGE-R15`, `QA-R19`). El agente **no añade intención nueva**: hace medible lo que el
humano declaró y, si detecta un hueco, lo lleva a §14 en vez de inventarlo.

```
AC-01: 
AC-02: 
```

## 12. Complejidad propuesta `[AGENTE]`

```
Complejidad: TRIVIAL | STANDARD | MAJOR
Justificación:
```

## 13. Verificación de duplicados `[AGENTE]`

```
BACKLOG.md consultado:        sí / no
PTs vivos relacionados:       
HISTORY.log — PTs similares:  
Roadmap — R-NNN relacionado:  
```

## 14. Observaciones del agente `[AGENTE]` — obligatorio

Desafíos al Intake (`INTAKE-R07`). Escribir «ninguna» solo si de verdad no hay ninguna.

```
- Ambigüedad detectada:
- Contradicción con el PRD / Conventions:
- Out-of-scope que parece indispensable:
- Severidad que no cuadra con el impacto descrito:
```

## 15. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-01 tipo declarado                    [ ]
DoR-02 severidad declarada por el humano [ ]
DoR-03 firma humana presente             [ ]
DoR-04 out-of-scope declarado            [ ]
DoR-05 PT asignado desde REGISTRY.json   [ ]
DoR-06 no duplica trabajo vivo           [ ]
DoR-07 observaciones registradas         [ ]
DoR-B1 comportamiento esperado humano    [ ]
DoR-B2 comportamiento observado          [ ]
DoR-B3 reproducción o «no reproducible»  [ ]
DoR-B4 entorno identificado              [ ]
DoR-B5 frecuencia declarada              [ ]
DoR-B6 impacto y usuarios declarados     [ ]

VEREDICTO: PASS | FAIL | CHALLENGE
Motivo (si FAIL o CHALLENGE):

CHALLENGE aceptado por:      (solo si el veredicto fue CHALLENGE y el humano decidió
                              proceder igualmente — sin esta línea el PT no avanza)
```

---

## Revisiones

> El `intake.md` es append-only una vez firmado. Toda corrección se añade aquí con su propia
> firma, nunca editando lo anterior (`SUITE-R09`).

<!-- ## Revisión 1 — YYYY-MM-DD
Qué cambia:
Motivo:
Firmado por: -->
