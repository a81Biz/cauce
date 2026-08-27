# `PT-163` · autorrevisión — `PHASE 6` Evidence

## Cazó un ID reutilizado **vivo** en su primera corrida

`definidasDosVeces` guardaba un `Set` de **documentos**: dos definiciones del mismo id en el mismo
archivo **colapsaban en una**. `SUITE-R14` prometía rechazar *«cualquier definición duplicada»* y
cumplía **la mitad** — y la que fallaba es **la más fácil de cometer**, porque nadie mira si un ID
está libre antes de escribirlo.

```
EXEC-R08 está DEFINIDA 2 veces DENTRO de EXECUTION-MODES.md
```

Dos obligaciones **distintas**: *«los tres modos exigen lo mismo»* (`HARD`, §5) y *«la ejecución de
un lote es secuencial»* (§7.4). Las citas apuntaban **todas a la primera**, así que la segunda no la
citaba nadie y renumerarla a `EXEC-R15` no rompió ninguna referencia.

**Lo demostró `PT-148`**: escribió dos reglas sobre IDs ocupados y **las dos anteriores
desaparecieron de `CORE.md`** —el único archivo que el agente carga— sin que nada avisara.

**Los dos hechos se separan porque se arreglan distinto**: «en dos documentos» eligiendo
propietario; «dos veces en el mismo» renumerando.

## Lo medido

Batería: **1795 casos, cero rojos**. El detalle por criterio vive en
`changes/PT-163-*/traceability.md`, que es la matriz canónica (`FDGE-R15a`), y en las
paradas de la tarea. Aquí no se repite: `RULE-01`, un hecho tiene un solo sitio.
