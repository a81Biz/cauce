# PT-124 — tracker asignar rechaza tres de los cinco tipos que LEXICON declara

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-124
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 8
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que una tarea escrita siguiendo la documentación no falle la herramienta.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `TIPOS_DE_ITEM` deriva del vocabulario canónico y no de una lista escrita a mano en `tracker.mjs` | un caso que compara la constante con lo que LEXICON declara |
| AC-02 | `tracker asignar --tipo INVESTIGATION` y `--tipo CHORE` funcionan | hoy responden «no es un tipo de item» |
| AC-03 | El mensaje de error deja de ATRIBUIR a `LEXICON` una lista que `LEXICON` no contiene | hoy dice «LEXICON declara: BUG · FEATURE · CHANGE · TAREA» y LEXICON §943 declara otros cinco |
| AC-04 | `CHANGE` y `TAREA` se resuelven: o entran en `LEXICON`, o salen de la herramienta. No conviven dos vocabularios | LEX-R22: un hecho, un nombre |
| AC-05 | `PT-125` y `PT-126` reciben su `type` con el comando, no a mano | las dos están hoy SIN TIPO en el registro por este defecto |
| AC-06 | `tracker asignar` escribe también `suite_version` en la allocation | `SUITE-R58` dice «la allocation nace completa» y hoy nacen sin él: `verify-fdge` avisa por `SUITE-R18` sobre las catorce de este lote |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: los tipos que la documentación declara y los que la herramienta acepta son la misma lista, derivada de un solo sitio.

## 4. Qué NO entra   `[AGENTE]`

- OUT: escribir el type a mano en REGISTRY.json para desbloquear. El registro sólo lo escribe el comando (PT-103, PT-107)
- OUT: renombrar los 32 CHORE e INVESTIGATION ya escritos. SUITE-R09 no retrofecha

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es `LEX-R28` otra vez, en otro campo.** Aquella regla nació porque «la herramienta esperaba un conjunto y tres documentos decían otro: un plan escrito siguiendo la documentación fallaba la verificación». Aquí es idéntico, con los tipos de ítem.
- **Y el registro le da la razón a la documentación, no a la herramienta**: 30 `CHORE` y 2 `INVESTIGATION` ya escritos, contra 0 `CHANGE` y 0 `TAREA`. La lista de la herramienta describe un vocabulario que nadie usa.
- **La consecuencia se midió al verificar, y encadena**: `tracker indices` reparte por `type`
  —`BUG`/`INVESTIGATION` a `DISCOVERY`, `FEATURE` a `ENRICHMENT`, `REFACTOR` a `REFACTOR_SCOPE`—,
  así que `PT-125` y `PT-126`, sin `type`, **no caen en ningún índice** y `verify-fdge` los pone en
  rojo por `FDGE-R31`: *«no aparece en ningún índice. FPGE no podrá verlo»*. Son los **dos únicos**
  errores que quedan en el árbol tras firmar el lote. No se escriben a mano: cerrarlos es cerrar
  esta tarea.
- **Bloqueó la apertura de este lote**: `PT-125` y `PT-126` están en el registro sin `type` porque el comando rechaza el suyo, y se dejó ausente antes que inventado (`RULE-06`).
