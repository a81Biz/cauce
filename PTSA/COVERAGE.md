# COVERAGE — matriz de auditoría   `PTSA-R76`..`PTSA-R80`

```yaml
corrida: 2026-08-20
universo: 196        # celdas del universo = elementos x 4 dimensiones, menos NO_APLICA
evaluadas: 175       # celdas con veredicto PASS o FAIL
coverage = 0.89    # evaluadas / universo — se publica junto al score [PTSA-R78]
```

> **Auditoría por enumeración, no por descubrimiento** (`PTSA-R79`). Esta matriz cierra cuando
> toda celda tiene veredicto, no cuando dejan de aparecer hallazgos. «No encontré más»
> describiría dónde dejé de buscar.

---

## 1. Universo enumerado — `PTSA-R76`

Enumerado desde fuentes **mecánicas**, nunca desde lo que el auditor recuerde:

| Fuente | Qué aportó | Elementos |
|:---|:---|---:|
| `PTSA/Products/P-NNN.md` | productos identificados en `PHASE 4` | 4 |
| Declaración de Valor (`CLAUDE.md`, `PHASE 0`) | reglas de dominio `RD-01`..`RD-04` | 4 |
| `docs/enterprise-documentation/inventory/services.md` | las herramientas | 16 |
| `docs/enterprise-documentation/inventory/integrations.md` | sistemas externos | 8 |
| `docs/enterprise-documentation/inventory/entities.md` | artefactos de estado persistente | 12 |
| `bin/cauce.mjs` · `03-TRD.md` | comandos del binario | 7 |
| `docs/enterprise-documentation/inventory/routes.md` | **no aplica**: no hay servidor HTTP | 0 |
| `docs/enterprise-documentation/inventory/endpoints.md` | **no aplica**: no expone API | 0 |
| | **total** | **51** |

> Los 36 documentos de `inventory/components.md` **no** son filas propias: `PTSA-R15` prohíbe
> auditar módulos aislados sin trazarlos a un producto, y aquí se auditan como `P-001` y `P-002`,
> que es lo que son. `verify-suite` los cubre a los 36 para `D4`.

**Lo que está en el código y no en el inventario es un hallazgo `D4`.** Apareció: ver `H-006`
y `H-007`.

---

## 2. Matriz — `PTSA-R77`

| Elemento | D1 dominio | D2 técnica | D3 observabilidad | D4 documental |
|:---|:---|:---|:---|:---|
| P-001 Marco normativo | PASS | PASS | NO_APLICA | PASS |
| P-002 Procedimiento ejecutable | FAIL H-008 | PASS | PASS | PASS |
| P-003 Verificacion mecanica | FAIL H-002 | FAIL H-003 | PASS | PASS |
| P-004 Paquete e instalacion | PASS | FAIL H-001 | PASS | FAIL H-006 |
| RD-01 toda decision irreversible pasa por una persona | FAIL H-009 | NO_APLICA | PASS | PASS |
| RD-02 toda afirmacion tiene evidencia verificable | FAIL H-002 | NO_APLICA | PASS | PASS |
| RD-03 una regla, un documento propietario, una vez | PASS | NO_APLICA | NO_APLICA | PASS |
| RD-04 sincronizar a ciegas es imposible | PASS | PASS | PASS | PASS |
| `audit.mjs` | PASS | PASS | PASS | FAIL H-007 |
| `build-core.mjs` | PASS | PASS | PASS | PASS |
| `comparar-marco.mjs` | PASS | PASS | PASS | PASS |
| `migrate.mjs` | PASS | NO_EVALUADA | NO_EVALUADA | PASS |
| `patrones.mjs` | PASS | PASS | NO_APLICA | FAIL H-007 |
| `plan-layout.mjs` | PASS | NO_EVALUADA | NO_EVALUADA | FAIL H-007 |
| `regla.mjs` | PASS | PASS | PASS | FAIL H-007 |
| `revisar-secretos.mjs` | PASS | PASS | PASS | PASS |
| `selftest.sh` | PASS | PASS | PASS | FAIL H-007 |
| `tracker.mjs` | PASS | PASS | PASS | FAIL H-007 |
| `verify-fdge.mjs` | PASS | PASS | PASS | FAIL H-007 |
| `verify-patrones.mjs` | PASS | PASS | PASS | PASS |
| `verify-ptsa.mjs` | PASS | PASS | PASS | PASS |
| `verify-qa.mjs` | PASS | PASS | PASS | PASS |
| `verify-suite.mjs` | PASS | PASS | PASS | FAIL H-007 |
| `version.mjs` | PASS | PASS | PASS | PASS |
| `cauce install` | PASS | PASS | PASS | FAIL H-006 |
| `cauce verify` | PASS | PASS | PASS | PASS |
| `cauce compare` | PASS | NO_EVALUADA | NO_EVALUADA | FAIL H-006 |
| `cauce core` | PASS | PASS | PASS | FAIL H-006 |
| `cauce start` | PASS | NO_EVALUADA | NO_EVALUADA | FAIL H-006 |
| `cauce regla` | PASS | PASS | PASS | FAIL H-006 |
| `cauce version` | PASS | PASS | PASS | FAIL H-006 |
| **git** | PASS | PASS | PASS | PASS |
| **GitHub · issues** | PASS | PASS | PASS | PASS |
| **GitHub Actions** | FAIL H-009 | PASS | PASS | PASS |
| **npm (registro)** | PASS | FAIL H-001 | NO_EVALUADA | PASS |
| **npm (OIDC / Trusted Publisher)** | PASS | NO_EVALUADA | NO_EVALUADA | PASS |
| **Azure DevOps** | PASS | NO_APLICA | NO_APLICA | PASS |
| **graphify (python)** | PASS | PASS | FAIL H-005 | PASS |
| **Claude Code** | PASS | NO_EVALUADA | NO_EVALUADA | PASS |
| `REGISTRY.json` | PASS | PASS | PASS | PASS |
| `CHECKPOINT.json` | PASS | PASS | PASS | PASS |
| `HANDOFF.md` | PASS | PASS | FAIL H-004 | PASS |
| `HISTORY.log` | FAIL H-002 | PASS | PASS | PASS |
| `INCIDENTS.log` | PASS | NO_EVALUADA | NO_EVALUADA | PASS |
| `SESSION_LOG.md` | PASS | PASS | PASS | PASS |
| `RECONCILIATION.log` | PASS | NO_EVALUADA | NO_EVALUADA | PASS |
| `MIGRATION.log` | PASS | NO_EVALUADA | NO_EVALUADA | PASS |
| `INSTALL.log` | PASS | NO_EVALUADA | NO_EVALUADA | PASS |
| `BACKLOG.md` | PASS | PASS | PASS | PASS |
| `LAYOUT.md` | PASS | PASS | PASS | PASS |
| `SECRETOS-EXCEPCIONES.md` | PASS | PASS | PASS | PASS |

---

## 3. Celdas `NO_EVALUADA` — motivo y coste   `PTSA-R78`

**`NO_EVALUADA` no es un aprobado.** No penaliza el Health, degrada la Confianza.

| Elemento | Dimensiones | Motivo | Coste de evaluarla |
|:---|:---|:---|:---|
| migrate.mjs | D2 · D3 | No se ejecutó en esta pasada. `migrate --apply` sigue sin ejecutarse nunca contra un legado real (`PT-019` validó el **informe**, no la ejecución) | Un proyecto legado desechable y una sesión completa |
| plan-layout.mjs | D2 · D3 | No se ejecutó en esta pasada: su salida depende de un terreno sin resolver, y aquí ya está firmado en `LAYOUT.md` | Instalar en un destino virgen |
| cauce compare | D2 · D3 | `comparar-marco` respondió «no hay referencia con la que comparar»: este repositorio **es** la copia canónica | Un destino instalado con una versión distinta |
| cauce start | D2 · D3 | Emite el texto de arranque de una sesión de agente; observarlo exige una sesión nueva, que es el propio contexto en que se audita | Una sesión de agente limpia |
| npm (registro) | D3 | No se ha publicado nunca desde este árbol: no hay rastro que observar | Publicar, que es justo lo que esta auditoría condiciona |
| npm (OIDC / Trusted Publisher) | D2 · D3 | Su configuración vive **fuera del repositorio**, en npmjs.com. `TD` ya lo declara como no determinable | Acceso a la cuenta de npm |
| Claude Code | D2 · D3 | El agente es el auditor: auditarse a sí mismo por observación directa no produce evidencia independiente (`PTSA-R14`) | Un segundo auditor |
| INCIDENTS.log | D2 · D3 | 8 líneas y ningún `INC-NNN` real: no hay incidente que haya ejercitado el formato | Un incidente, que no se provoca para auditarlo |
| RECONCILIATION.log | D2 · D3 | Escrito por Foundation en reconciliación; no hubo reconciliación en esta pasada | Una segunda ejecución de Foundation |
| MIGRATION.log | D2 · D3 | 21 líneas de migraciones pasadas; ninguna migración ocurrió hoy | Una migración de versión real |
| INSTALL.log | D2 · D3 | Escrito por la instalación; este repositorio no se instala sobre sí mismo (`AUTOALOJADO`) | Una instalación en destino virgen |

---

## 4. Celdas `NO_APLICA` — justificación   `PTSA-R78`

**`NO_APLICA` sale del universo**, así que sin justificar infla el coverage.

| Elemento | Dimensión | Por qué no aplica |
|:---|:---|:---|
| P-001 Marco normativo | D3 | Un cuerpo normativo no se ejecuta: no emite rastro. Su observabilidad es la de las herramientas que lo aplican, ya auditadas |
| RD-01 toda decision irreversible pasa por una persona | D2 | Es una regla de dominio, no un artefacto técnico |
| RD-02 toda afirmacion tiene evidencia verificable | D2 | Ídem |
| RD-03 una regla, un documento propietario, una vez | D2 · D3 | Ídem, y no deja rastro de ejecución |
| patrones.mjs | D3 | Es una **biblioteca**: no se ejecuta por sí sola, no tiene salida propia que observar. Sus ocho importadores sí la tienen |
| Azure DevOps | D2 · D3 | Contrato declarado y **sin implementar a propósito** (`TD-07`). Lanza con un mensaje que lo explica |

---

## 5. Lo que esta matriz no dice

`coverage 0.89` significa que **21 celdas de 196 no se miraron**, y arriba está por qué cada
una. Un `Health` publicado sin esta cifra sería nulo (`PTSA-R21`).

La matriz **está completa**: toda celda lleva veredicto. Eso es la condición de parada
(`PTSA-R79`), y es distinta de `coverage = 1.00`, que no se alcanzó y se declara.
