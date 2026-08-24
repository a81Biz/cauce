# Trazabilidad — `PT-123`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `tracker indices` incluye BACKLOG.md y lo escribe con `--aplicar` | `TS-01` | `tracker indices --aplicar` | `salidas/indices.txt` |
| AC-02 | El bloque se DERIVA del registro: lote, tareas, orden, estado, fase e issue | `TS-02` `TS-03` | `selftest.sh:el bloque declara la implementacion abierta` | `salidas/casos.txt` |
| AC-03 | El solapamiento tiene su sitio: `DoR-E7` deja de ser incumplible | `TS-04` | `tracker indices --aplicar` | `salidas/backlog.txt` |
| AC-04 | `verify-fdge` avisa si declara una implementacion que el registro no tiene abierta | `TS-05` | `verify-fdge PT-123` | `salidas/inversa.txt` |
| AC-05 | La herramienta NO toca el archivo si no lleva las marcas | `TS-06` | `tracker indices` | `salidas/indices.txt` |
| AC-06 | `FDGE-R31` enumera los CUATRO indices, no tres | `TS-07` | `verify-suite` · `core:check` | `salidas/indices.txt` |

**Seis criterios, seis con `TS`, seis con evidencia ejecutada.**

## La evidencia que decide

`salidas/inversa.txt` — con el archivo declarando otro lote:

```
! FDGE-R31  BACKLOG.md y el registro no dicen lo mismo sobre que hay abierto ·
            declara EP-015 y el registro no lo tiene abierto ·
            el registro abre EP-020 y el archivo no lo declara
```

**Nombra exactamente el defecto que estuvo cuatro lotes vivo.** Sin `AC-04` el generador existiría
y nada lo echaría de menos, que es la clase entera de este lote.

## `AC-06` salió al corregir un caso roto

Emití la comprobación bajo `SUITE-R35` y rompí un caso cuyo comentario decía: *«si este caso se
pone rojo, el cambio ha alcanzado a proyectos que no debía tocar»*. Tenía razón — `SUITE-R35` es
la regla del **espejo con la plataforma**, y esto compara un archivo con el **registro**.

Al moverlo a `FDGE-R31` salió que esa regla enumera **tres** índices y hay **cuatro**. Es lo mismo
que `PT-129` encontró en `FDGE-R19`: **dos reglas del mismo lote con el mismo defecto.**
