# PT-092 — Estrategia   `PHASE 3`

## La decisión de alcance, que el intake ya anticipaba

`FQAGE` **no aplica a este sistema**, y no por dificultad: `QA-R01` describe una operación —*«opera
sólo desde el navegador, nunca lee código»*— que aquí no existe.

## Caminos considerados para `QA`

| | Por qué se descarta |
|:---|:---|
| Montar `QA/` con casos sin navegador | Pondría `verify-qa` en verde y dejaría `CASOS-DE-USO.md` diciendo que el ciclo completo se ha ejercitado. **Fabricar un verde en el componente cuyo lema es *«sin captura el paso no ocurrió»*** |
| Levantar una interfaz mínima para tener qué probar | Construir producto para satisfacer un verificador. Es la inversión exacta del marco |
| Renombrar `PT-072` como QA | Ya está hecho, es de `FDGE`, y su evidencia está donde le corresponde. Llamarlo QA sería renombrar trabajo hecho para poner un componente en verde |
| Dejarlo como «nunca ejecutado» en `TD-15` | **Indistinguible de «no se pudo»**, que es lo que el intake prohibió explícitamente |
| **Declararlo hueco en `CASOS-DE-USO.md`, con motivo** ✅ | Es lo que se adopta |

**Es la misma decisión que `PT-072` tomó al no declarar plataforma** en el proyecto de prueba: un
caso configurado para que salga bien no prueba nada — y aquel silencio destapó `H7`.

## `FPGE` sí aplica, y era la primera vez que podía

```
2 EVIDENCIA  PTSA: Findings READY|REOPENED · Products BLOCKED_DOMAIN|IN_REVIEW · PENDIENTES
```

**Antes de `PTSA-2026-08-20` no había hallazgos que priorizar.** Por eso el componente nunca se
había ejecutado: no le faltaba oportunidad, le faltaba insumo.

## Lo que la ejecución de `FPGE` obligó a decidir

**Qué excluir.** `FPGE-R01` dice que se excluye lo que ya tiene `PT`, y siete de los nueve
hallazgos los trabajó `EP-018`. Sin esa exclusión el roadmap habría listado el trabajo recién
hecho — un roadmap que se felicita a sí mismo.

**Qué cifras publicar.** Sólo `EvidenceWeight` sale de un hecho observable —si la evidencia es
declarada, medida o un incidente—. `ScoreImpact` y `Effort` son juicios, y publicar ocho números
con decimal sin decirlo los haría parecer un cálculo.

Se publica el desglose de **tres de los ocho** para que el juicio sea contrastable.

## El incidente, y por qué se registra en vez de arreglarse

`INC-001` apareció **ejecutando `PHASE 2`**: los hallazgos que se leían como vivos estaban cerrados
diecisiete commits antes, y el commit de cierre nunca existió.

Arreglarlo —una comprobación de que un cierre siga cerrado— es trabajo de otra tarea. Aquí se
reconstruye lo perdido, se registra el incidente y **entra como candidato con la máxima
`EvidenceWeight`**: su evidencia es un incidente observado, no una inferencia.
