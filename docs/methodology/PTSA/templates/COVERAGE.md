# COVERAGE — matriz de auditoría

> Plantilla de `PTSA/COVERAGE.md` · reglas `PTSA-R76` a `PTSA-R80`.
> El agente la copia al espacio de trabajo en **PHASE 3 (Scope)** y la completa hasta
> **PHASE 12 (Consolidation)**. Borrar los comentarios `>` y las filas de ejemplo al usarla.

```yaml
corrida: YYYY-MM-DD
universo: 0        # celdas totales = elementos × 4 dimensiones
evaluadas: 0       # celdas con veredicto PASS o FAIL
coverage = 0.00    # evaluadas / universo — se publica junto al score [PTSA-R78]
```

---

## 1. Universo enumerado — `PTSA-R76`

> El universo sale de fuentes **mecánicas**, nunca de lo que el auditor recuerde:
>
> | Fuente | Qué aporta |
> |:---|:---|
> | `docs/enterprise-documentation/inventory/routes.md` | rutas de la aplicación |
> | `…/inventory/endpoints.md` | endpoints de la API |
> | `…/inventory/entities.md` | entidades del modelo de datos |
> | `…/inventory/services.md` | servicios y módulos |
> | `…/inventory/integrations.md` | integraciones externas |
> | `PTSA/Products/P-NNN.md` | productos identificados en PHASE 4 |
> | `PTSA/Phases/PHASE-00-*.md` | reglas de dominio declaradas |
>
> **Lo que está en el código y no en el inventario es, en sí mismo, un hallazgo D4.**
> Regístralo como `H-NNN` y añádelo igualmente al universo: la matriz cubre lo que existe,
> no lo que está documentado.

| Elemento | Clase | Origen |
|:---|:---|:---|
| P-001 Manual del participante | producto primario | PHASE 4 |
| POST /api/cursos | endpoint | inventory/endpoints.md |
| Curso | entidad | inventory/entities.md |
| RD-03 «un curso cerrado no admite inscripciones» | regla de dominio | PHASE 0 |

---

## 2. Matriz — `PTSA-R77`

> Toda celda lleva veredicto. **No existe la celda en blanco**: una celda ausente es
> indistinguible de una que nadie miró.
>
> | Veredicto | Significa | Exige |
> |:---|:---|:---|
> | `PASS` | evaluada y correcta | — |
> | `FAIL` | evaluada y defectuosa | referencia `H-NNN` en la misma celda |
> | `NO_APLICA` | la dimensión no tiene sentido para este elemento | fila en §4 |
> | `NO_EVALUADA` | no se miró | fila en §3 con motivo y coste |

| Elemento | D1 dominio | D2 técnica | D3 observabilidad | D4 documental |
|:---|:---|:---|:---|:---|
| P-001 | PASS | FAIL H-003 | NO_EVALUADA | PASS |
| POST /api/cursos | NO_APLICA | PASS | PASS | FAIL H-007 |
| Curso | PASS | PASS | NO_APLICA | PASS |
| RD-03 | FAIL H-011 | PASS | NO_EVALUADA | PASS |

---

## 3. Celdas `NO_EVALUADA` — motivo y coste · `PTSA-R78`

> `NO_EVALUADA` **no es un aprobado**. No penaliza el Health —no hay hallazgo— pero degrada
> el Confidence: baja el `coverage` de la cabecera. Un Health de 95 sobre el 30 % del
> universo se publica como «95 con `coverage 0.30`», no como 95.
>
> Sin motivo declarado, «no evaluada» quiere decir «no me acordé». Toda fila necesita el
> coste estimado: es lo que convierte una laguna en una decisión de presupuesto.

| Elemento | Dim | Motivo | Coste estimado |
|:---|:---|:---|:---|
| P-001 | D3 | Sin acceso a los logs de producción | 1 sesión con credenciales |
| RD-03 | D3 | No hay métrica que registre inscripciones rechazadas | 1 PT de instrumentación |

---

## 4. Celdas `NO_APLICA` — justificación

> `NO_APLICA` sale del universo: no cuenta como evaluada **ni** como pendiente. Por eso la
> justificación es obligatoria — sin ella es la vía fácil para inflar el `coverage`.

| Elemento | Dim | Por qué no aplica |
|:---|:---|:---|
| POST /api/cursos | D1 | Endpoint de infraestructura: no entrega producto de dominio |
| Curso | D3 | Entidad sin comportamiento propio en runtime |

---

## 5. Cierre — `PTSA-R79`

> La auditoría cierra cuando **esta matriz** está completa, no cuando dejaron de aparecer
> hallazgos. «No encontré más» no es un criterio de compleción: describe dónde dejó de
> buscar el auditor.

```
[ ] Todo elemento del §1 tiene su fila en el §2
[ ] Ninguna celda del §2 está en blanco
[ ] Toda NO_EVALUADA tiene fila en el §3 con motivo y coste
[ ] Toda NO_APLICA tiene fila en el §4 con justificación
[ ] El coverage de la cabecera coincide con evaluadas/universo
[ ] node docs/methodology/tools/verify-ptsa.mjs pasa sin errores    [PTSA-R80]
```

Solo entonces puede escribirse `auditoria_estado: COMPLETE` en `RESUMEN.md` (`PTSA-R74`
puntos 8 y 9). **Un score cuya matriz no cuadra no se certifica.**
