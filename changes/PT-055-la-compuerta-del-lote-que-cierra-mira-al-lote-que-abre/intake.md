# Intake — BUG `PT-055`

```yaml
---
id: PT-055
type: BUG
severity: S2
complexity: TRIVIAL
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-15
origin: DIRECT
---
```

---

## 1. Qué está pasando `[HUMANO]`

```
Al cerrar un lote, la compuerta G4 se pone en rojo por el trabajo de OTRO lote que acaba de
abrirse y que todavía no ha hecho nada. El lote que se está cerrando está en verde.
```

> Termina cuando: `verify-fdge --gate G4 EP-A` no falla por las filas de cierre de ningún lote
> que no sea `EP-A`, y sigue fallando por las de `EP-A` cuando las tiene sin resolver.

## 2. Comportamiento esperado `[HUMANO]`

```
Que --gate G4 sobre un lote evalúe las filas de cierre DE ESE LOTE. Un lote recién abierto
tiene sus filas sin resolver por definición: eso es lo normal, no un fallo, y no puede impedir
que cierre otro que sí terminó.
```

## 3. Comportamiento observado `[HUMANO]`

```
El 2026-08-15, cerrando EP-013 con EP-014 recién abierto: --gate G4 bloqueó por las cuatro
filas de cierre de EP-014, que describen trabajo aún no hecho. EP-013 tenía su fila en verde.
Se integró con el rojo DECLARADO y autorizado, no arreglado.
```

## 4. Reproducción `[HUMANO]`

```
1. Tener un lote terminado (todas sus tareas INTEGRATED) y otro recién abierto.
2. node docs/methodology/tools/verify-fdge.mjs --gate G4 EP-013
3. Falla SUITE-R45 por las filas del lote nuevo.
```

## 5. Entorno `[HUMANO]`

```
Windows 11 · node 22 · suite 8.0.0 cuando se encontró · reproducible hoy en 9.0.0
```

## 6. Impacto `[HUMANO]`

```
Bloquea la compuerta de integración de cualquier lote mientras exista otro abierto. Como el
marco encadena lotes, es la situación NORMAL, no la excepcional. Ya obligó una vez a integrar
con una excepción declarada, que es exactamente lo que las compuertas existen para evitar.
```

## 8. Out of scope `[HUMANO]`

```
OUT: cambiar SUITE-R45 o lo que exige de una sección de cierre    → —
OUT: rellenar filas de cierre de ningún lote                       → —
OUT: el resto de comprobaciones globales de verify-fdge            → —
```

## 9. Criterios de aceptación del arreglo `[HUMANO]`

```
- Que cerrar un lote con otro abierto no falle por el abierto.
- Que la compuerta siga bloqueando de verdad cuando el lote que cierra SÍ tiene filas sin
  resolver: arreglar esto no puede aflojar G4.
```

## 10. Firma `[HUMANO]`

```
Reportado por: Alberto Martínez
Fecha: 2026-08-15
Confirmo que los comportamientos esperado y observado, la severidad y el out-of-scope
reflejan mi intención: SÍ

Firmado por lote: EP-017
```

Reabierto el 2026-08-19 dentro de `EP-017`. La firma original es del reporte de 2026-08-15; la
pertenencia al lote y su compuerta `G1` se heredan de `EP-017` (`INTAKE-R08`), firmado por
delegación con constancia.

---

# A partir de aquí lo completa el agente

## 11. Criterios de aceptación — versión canónica `[AGENTE]`

```
AC-01: `--gate G4 EP-A` con `EP-B` abierto y con filas sin resolver NO falla por `EP-B`.
AC-02: `--gate G4 EP-A` SÍ falla si `EP-A` tiene filas de cierre sin resolver.
AC-03: `verify-fdge` acepta `EP-NNN` como argumento posicional. Hoy `targets` sólo casa
       `/^PT-\d+$/`, así que el lote nombrado en la orden se descarta en silencio.
AC-04: `--gate G4 PT-NNN` evalúa como lote el `epic` de ese PT, no todos los lotes.
AC-05: `--gate G4` SIN ningún objetivo conserva el comportamiento de hoy —evalúa todos los
       lotes vivos—. Acotar ahí convertiría el arreglo en un agujero: una orden sin objetivo
       es la que más se parece a «compruébalo todo».
AC-06: un lote con `status: DONE` sigue exigiendo sus filas resueltas aunque no se pase
       `--gate`. Esa mitad de la condición no se toca.
```

## 12. Complejidad propuesta `[AGENTE]`

```
TRIVIAL. El cambio es la condición de una variable y el filtro de argumentos posicionales.
No cambia ninguna regla, ningún artefacto y ningún contrato de salida.
```

## 13. Verificación de duplicados `[AGENTE]`

```
PT-029  familia, no duplicado: «una comprobación que hace imposible el estado que otra obliga
        a atravesar». Este es el tercer caso; el CHALLENGE de G1 de EP-017 es el cuarto.
PT-046  distinto: una entrada de HISTORY mal formada que ninguna regla permitía corregir.
Sin duplicados en BACKLOG ni en ROADMAP.
```

## 14. Observaciones del agente `[AGENTE]`

```
- La causa raíz es MAYOR que lo que el reporte describe, y conviene decirlo antes de arreglar:
  no es sólo que `enG4` sea global. Es que `verify-fdge` NUNCA ACEPTÓ un `EP-NNN` como
  objetivo. La orden «--gate G4 EP-013» dejaba `targets` vacío y `gate` global, así que la
  herramienta jamás supo qué lote evaluaba. Arreglar sólo `enG4` sin AC-03 dejaría la orden
  del manual sin efecto y el defecto volvería con otra cara.

- Riesgo real de este arreglo: aflojar G4. Por eso AC-02, AC-05 y AC-06 existen y por eso la
  comprobación inversa es obligatoria en PHASE 6 — revertir el arreglo y ver caer los casos.
  El HANDOFF ya avisa de la forma vecina: «escribir `if (gate) fail(...)` en verify-fdge hace
  inevaluables las tres compuertas anteriores a G4».

- Hueco que NO cubre esta tarea y se declara: `checkEpics()` recorre todos los lotes también
  para INTAKE-R09 (intake incompleto) y para INTAKE-R08 (firma por lote). Ahí el alcance
  global es CORRECTO —son defectos del intake, no del cierre— y no se toca.
```

## 15. Resultado de la compuerta G1 `[AGENTE]`

```
DoR-1 comportamiento esperado declarado por el humano      [x]
DoR-2 comportamiento observado con reproducción            [x]
DoR-3 severidad declarada por el humano                    [x]  S2
DoR-4 out-of-scope declarado                               [x]
DoR-5 criterios de aceptación formalizados                 [x]  AC-01..AC-06
DoR-6 duplicados verificados                               [x]
DoR-7 firma presente                                       [x]  por lote EP-017
DoR-8 observaciones registradas                            [x]

VEREDICTO: PASS
```

---

## Revisiones

> Append-only una vez firmado (`SUITE-R09`).

## Revisión 1 — 2026-08-19

Qué cambia: se reabre dentro de `EP-017` y se añaden `AC-03`..`AC-06`.
Motivo: al reproducir el defecto para escribir la estrategia se vio que `verify-fdge` no acepta
`EP-NNN` como objetivo — la causa es más profunda que la descrita en 2026-08-15, y arreglar
sólo `enG4` habría dejado el defecto vivo con otra forma.
Firmado por: Alberto Martínez, por delegación con constancia (`EP-017`).
