# PT-092 — Descubrimiento   `PHASE 2`

## `QA` no aplica a este sistema, y la regla lo dice sin ambigüedad

`CORE.md`, base de `FQAGE`:

```
BASE  opera SOLO desde el navegador, nunca lee codigo [QA-R01]
      sin captura el paso no ocurrio [QA-R03]
```

Y el inventario de Foundation:

```
inventory/routes.md      «Este sistema no tiene rutas. No hay servidor HTTP, ni router,
                          ni interfaz de usuario»
inventory/endpoints.md   «Este sistema no expone endpoints»
```

**No es que sea difícil: es que `QA-R01` describe una operación que aquí no existe.** Un caso de
QA sin navegador no es un caso de QA relajado — es otra cosa con el mismo nombre.

## Lo que sí se puede hacer, y ya se hizo

Lo más cercano a «el usuario puede usar el sistema» para un paquete de línea de comandos es
instalarlo en un destino limpio y ejecutar un trabajo completo. **`PT-072` lo hizo**, con el
tarball de `npm pack` y nunca contra el publicado:

```
cauce install         52 archivos · CORE con 247 reglas · -70 % de contexto
cauce verify virgen   3 errores accionables -> tras seguirlos, 0
un PT completo        3 tests, dos en rojo primero
```

**Eso ya está**, y llamarlo «QA» ahora sería renombrar trabajo hecho para poner un componente en
verde. `PT-072` es una tarea de `FDGE`, y su evidencia está donde le corresponde.

## `FPGE` sí aplica, y tiene material real

```
2 EVIDENCIA  PTSA: Findings READY|REOPENED · Products BLOCKED_DOMAIN|IN_REVIEW ·
             score-history · PENDIENTES
```

Hoy hay **siete hallazgos vivos** —cuatro en `VALIDATION_PENDING`, dos `OPEN`, uno `IN_REVIEW`—,
tres productos en `IN_REVIEW`, y deuda declarada en `TD-15`, `TD-16` y `TD-17`.

**Es la primera vez que existe ese material**: antes de `PTSA-2026-08-20` no había hallazgos que
priorizar, y por eso `FPGE` nunca había tenido de qué tirar.

## Lo que este descubrimiento cambia respecto del intake

| | Intake decía | Medido |
|:---|:---|:---|
| Alcance | «ejecutar `QA` y `FPGE`» | **`QA` no aplica.** `QA-R01` describe una operación que no existe aquí |
| La salida si no aplica | «se declara en `CASOS-DE-USO.md` como hueco» | Correcto, y es lo que se hace |
| `FPGE` | «ejecutarlo» | Aplica, y **por primera vez tiene evidencia**: los nueve hallazgos de la auditoría |
| `TD-15` | «retirado o con `FIDE` como único pendiente» | Quedarán **dos**: `FIDE` y `QA` — y el de `QA` con motivo, no como pendiente |

## Por qué no se fuerza `QA`

Montar un `QA/` con casos que no usan navegador **pondría `verify-qa` en verde** y dejaría a
`CASOS-DE-USO.md` diciendo que el ciclo completo se ha ejercitado. Sería fabricar un verde en el
componente cuyo lema es *«sin captura el paso no ocurrió»*.

Es exactamente lo que `PT-072` se negó a hacer cuando decidió **no declarar plataforma** en el
proyecto de prueba: un caso configurado para que salga bien no prueba nada.
