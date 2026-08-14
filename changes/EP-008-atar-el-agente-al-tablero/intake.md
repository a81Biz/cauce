# EP-008 — Atar el agente al tablero

```yaml
---
id: EP-008
type: EP
status: DRAFT
created: 2026-08-13
suite_version: 7.2.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «¿Es necesario que te lo diga en cada instrucción? Deberíamos incluir alguna convención para
> que no se te olvide o hacer un agente propio de cauce para que esté amarrado.»
>
> «`PT-032` debería ser una épica completa por sí solo. **Haremos los dos**, la convención y el
> agente cauce.»

## 2. Por qué no cabía en una tarea   `[AGENTE]`

`PT-032` nació como aplazado de `EP-007` y estaba mal dimensionado. Son **dos mecanismos
distintos** con riesgos opuestos, y uno de ellos es estructural:

| | Qué ata | Qué puede fallar |
|:---|:---|:---|
| **Convención** | El texto que el agente carga al empezar | Depende de que lo lea y lo respete — es lo que ya falla |
| **Agente propio** | El **punto de entrada**: consultar el tablero deja de ser un paso | Cambia cómo se instala y se arranca; es estructural |

Meterlos en una tarea habría obligado a decidir entre los dos, y la petición humana es
explícita: **los dos**. La convención cubre hoy; el agente cubre el caso en que la convención se
ignore, que es precisamente el caso que motivó todo esto.

## 3. Objetivo común del lote   `INTAKE-R09`

Que consultar el tablero deje de depender de que el agente se acuerde.

## 4. Criterio de éxito del lote   `INTAKE-R09`

Un agente que empieza una sesión **no puede llegar a la primera decisión** sin el estado del
tablero delante, y si lo intenta hay algo que falla y lo dice — no un recordatorio, un fallo.

`PT-030` dejó la respuesta consultable (`tracker siguiente`); lo que falta es la obligación.
**Un comando no puede exigir haber sido llamado**, y ese es exactamente el hueco que este lote
existe para cerrar.

## 5. Análisis de solapamiento   `INTAKE-R09`

| PT | Tipo | Sev | Qué resuelve |
|:---|:---|:---|:---|
| `PT-033` | FEATURE | S1 | La convención: el estado del tablero abre el contexto y ninguna fase avanza sin haberlo consultado |
| `PT-034` | FEATURE | S1 | El agente propio de cauce: el tablero **es** el punto de entrada |

Se solapan en **qué se considera «haber consultado»**, y esa definición debe ser una sola:
`PT-033` la escribe y `PT-034` la usa. Orden obligado: `PT-033` primero. Un agente construido
sobre una definición que aún no existe la inventaría, y sería la segunda copia divergiendo
(`SUITE-R38`).

`PT-034` es **estructural**: cambia cómo se arranca. Requiere grafo presente y no se resuelve
`G2` con el grafo ausente o `STALE`.

## 6. Qué NO entra

- OUT: sustituir `CORE.md` por el agente. El marco debe seguir siendo usable sin él
- OUT: que el tablero asigne identificadores. El registro asigna (`SUITE-R08`)
- OUT: automatizar ninguna compuerta. `G4` sigue siendo humana en los tres modos (`EXEC-R04`)

## 7. Cómo termina

> Termina cuando: empezar a trabajar sin haber consultado el tablero produce un fallo, no un
> olvido.

## 8. Firma   `INTAKE-R06`

```
Firmado por: Alberto Martínez (delegada — «firma con mi nombre EP-008 y continúas hasta terminar», 2026-08-13)
Fecha: 2026-08-13
Severidad declarada: S1 en las dos. Sin esto, todo lo anterior depende de que el agente se
acuerde, y esta sesión demostró cuatro veces que no basta.
Estado: FIRMADA · G1 PASS
```

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` y número de versión | HECHO — 7.3.0 |
| Regenerar `CORE.md` | HECHO |
| `PT-032`, promovido a este lote, queda cubierto por `PT-033` y `PT-034` | HECHO |

> El merge, la publicación y lo que se verifique después del cierre no son filas: `SUITE-R45`.
