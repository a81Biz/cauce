# PT-139 — nada mide la edad de un aplazado

> Tarea dentro de la implementación abierta `EP-021` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-139
type: BUG
epic: EP-021
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-24
structural: no
suite_version: 13.0.0
origen_parada: EP-021
---
```

## 1. Qué se quiere   `[HUMANO]`

`PT-137` construyó la puerta de vuelta y `PT-138` escribe cuándo cruzarla. Sin compuerta, los dos
son documentación: un campo que nadie mira es un campo que se rellena mal.

Un aplazado de ayer y uno de hace meses son **idénticos** en el tablero. La numeración pasó de
`PT-134` a `PT-143` sin que nada lo notara.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un `DEFERRED` sin bloque `aplazamiento` **avisa** durante el trabajo y **falla en `G4`** | dos casos: fuera de `G4` y con `--gate G4` |
| AC-02 | Un `DEFERRED` cuya `revision` ya pasó falla en `G4`, y dice **cuántos días** lleva caducado | un caso con fecha vencida |
| AC-03 | La fecha de hoy se **deriva**, no se cablea: un caso que caduca hoy no caduca mañana por accidente | el caso usa una fecha relativa, no una literal |
| AC-04 | Lo anterior a la regla no se juzga hacia atrás (`RIGE_DESDE`) | un aplazado con `suite_version` previa no falla |
| AC-05 | El aviso dice **qué hacer**: el comando de `PT-137` o el de `PT-138` | el texto del mensaje |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `verify-fdge --gate G4` falla si algún aplazado vivo carece de bloque o tiene la
> revisión vencida, y avisa —sin bloquear— fuera de la compuerta.

## 4. Qué NO entra   `[AGENTE]`

- OUT: cerrar automáticamente un aplazado caducado. Decidir qué pasa con él es humano
  (`SUITE-R06`): la compuerta **obliga a mirarlo**, no decide por nadie.
- OUT: avisar por correo o fuera del repositorio. El marco no tiene reloj propio.
- OUT: retrofechar los aplazados anteriores a la regla. Es `CE-014`.

## 5. Firma

```
Firmado por lote: EP-021
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-03` existe porque `CE-010` ya mordió**: una cifra transcrita caduca. Un caso que compare
  contra una fecha literal pasará hoy y fallará el mes que viene por una razón que no es la suya.
- **`AC-04` existe porque `CE-014` ya mordió**: una regla nueva que juzga hacia atrás convierte
  trabajo correcto en deuda. `RIGE_DESDE` es el mecanismo y ya está.
