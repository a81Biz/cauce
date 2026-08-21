# ROADMAP — qué construir a continuación   `FPGE`

> **Sobrescrito en cada corrida.** El histórico está en `ROADMAP_HISTORY.log`.
> Todos los ítems nacen `DRAFT`: `FPGE-R04` prohíbe promover desde aquí.

```yaml
corrida: 2026-08-20
origen: primera ejecución de FPGE sobre este repositorio
```

---

## 1 · Frescura   `FPGE-R05`

| Fuente | Estado | Consecuencia |
|:---|:---|:---|
| **PTSA** | `FRESH` — `PTSA-2026-08-20`, `audit_due 2026-09-20` | ninguna. El score es de hoy |
| **QA** | **no aplica** — `QA-R01` opera sólo desde navegador y aquí no hay | `FPGE-R08` no rebaja nada: **ningún candidato tiene a QA como única evidencia** |
| **Incidentes** | `INC-001` abierto **sin PT de seguimiento** | `Urgency +1.0` al candidato que lo cita |

`FPGE-R07` no se activa: no hay `QA-F` porque no hay `QA`.

---

## 2 · Evidencia leída   `FPGE-R01` · sólo lectura

```
PTSA    Findings/H-001..H-009 · Products/P-001..P-004 · score-history · AUDIT_LOG
FDGE    HANDOFF · HISTORY · INCIDENTS · BACKLOG · DISCOVERY · ENRICHMENT · REFACTOR_SCOPE
Deuda   TD-15 · TD-16 · TD-17 de 10-Technical-Debt.md
```

**Excluido lo que ya tiene PT.** Siete de los nueve hallazgos los trabajó `EP-018`. Lo de abajo es
lo que **nadie está haciendo**.

---

## 3 · Candidatos

| | Qué | Evidencia | Dim | Prioridad |
|:---|:---|:---|:---|---:|
| `R-001` | **Ejecutar `FIDE`**: incubar un proyecto desde una idea de negocio | `H-008` | D1 | **13.5** |
| `R-002` | **`migrate --apply`** contra un legado real, sobre copia desechable | `PT-019` | D1 | **11.3** |
| `R-003` | Elevar la cobertura del registro de **sujetos**, hoy 3 de 107 | `PT-087` | D1 | **9.0** |
| `R-004` | **Segunda corrida de PTSA** sobre el árbol que dejó el lote | `PT-092` | D1 | **8.4** |
| `R-005` | Que un **cierre de PTSA no pueda desaparecer** sin que nada lo note | `INC-001` | D3 | **8.0** |
| `R-006` | Las **7 aserciones sospechosas** de `lint_aserciones`, una a una | `PT-079` | D2 | **4.5** |
| `R-007` | Declarar en `CASOS-DE-USO.md` que **`QA` no aplica** a un paquete CLI | `PT-092` | D4 | **4.0** |
| `R-008` | Las **21 celdas `NO_EVALUADA`** de la matriz de cobertura | `PT-092` | D4 | **3.0** |

### Cómo salen las tres primeras cifras   `FPGE-R06`

```
Priority = (EvidenceWeight x ScoreImpact x Urgency x DomainMultiplier x Confidence) / Effort

primero    EW  8 · SI 15 · U 1.5 · DM 1.5 · C 1.0 / E 2  = 13.5
           evidencia DECLARADA en TD-15 y en el hallazgo; impacto sobre D1, porque es el
           ultimo componente sin ejecutar y P-002 promete que el procedimiento lo es.
segundo    EW  8 · SI 12 · U 1.5 · DM 1.5 · C 1.0 / E 4  = 11.3
           Effort 4: necesita un legado desechable, y SUITE-R06c lo hace irreversible.
quinto     EW 16 · SI 10 · U 2.0 · DM 1.0 · C 1.0 / E 4  =  8.0
           EW 16, el maximo, porque su evidencia es un INCIDENTE OBSERVADO y no una
           inferencia. U 2.0 por el +1.0 de FPGE-R05: incidente abierto sin seguimiento.
```

---

## 4 · Top-3 por impacto

| | Evidencia | Por qué |
|:---|:---|:---|
| `R-001` | `H-008` | Es el **único** componente que no se ha ejecutado nunca. Cerrarlo deja `TD-15` en cero |
| `R-002` | `PT-019` | `RESUMEN.md` lo declara como límite: *«se validó el informe, no la ejecución»*. Es la afirmación más grande que el marco hace sin haberla probado |
| `R-004` | `PT-092` | El score caduca el `2026-09-20` y el lote cambió siete de sus nueve hallazgos. Un `Health` de antes ya no describe el árbol |

## 5 · Top-3 quick wins

| | Evidencia | Esfuerzo |
|:---|:---|:---|
| `R-007` | `PT-092` | `E 1` — una entrada en `CASOS-DE-USO.md` |
| `R-008` | `PT-092` | `E 2` — cada celda tiene su motivo y su coste escritos |
| `R-006` | `PT-079` | `E 2` — `lint_aserciones` ya las enumera |

---

## 6 · Lo que este roadmap **no** hace   `FPGE-R04`

**No promueve nada.** Todos los ítems están en `DRAFT` y entran a `FDGE PHASE 1` sólo cuando una
persona los pase a `READY` (`FPGE-R09`, `FPGE-R10`).

**No cierra hallazgos ni productos.** `FPGE-R03`: si algo debe rechazarse, se emite la instrucción
para el componente dueño y no se ejecuta.

## 7 · Lo que este roadmap **no puede** decir

**Si el orden es el correcto.** La fórmula pondera con cifras que **estima el agente**, y sólo
`EvidenceWeight` sale de un hecho observable — si la evidencia es declarada, medida o un incidente.
`ScoreImpact` y `Effort` son juicios.

Se publica el desglose de tres de los ocho precisamente para que el juicio sea **contrastable**, no
para que parezca un cálculo.
