# SELLO — la `11.0.0`   `SUITE-R57`

Cada documento de entrada queda **`ACTUALIZADO`** o **`NO PROCEDE` con motivo**. Una celda vacía
no pasa: es indistinguible de una que nadie miró, por lo mismo que no pasa en `LAYOUT.md`
(`FND-R22`).

**No se pide que cambien: se pide que se decida.**

| Documento | Decisión | Motivo |
|:---|:---|:---|
| `MANUAL.md` | NO PROCEDE | `EP-018` no cambió **cómo se trabaja**: cerró hallazgos de la auditoría. Los ocho pasos de sellar, las nueve fases y las cinco fricciones de `PT-072` siguen describiendo el procedimiento tal cual |
| `CASOS-DE-USO.md` | ACTUALIZADO | Entra un hueco nuevo y es de fondo: **`FQAGE` no aplica a un paquete sin interfaz**, con el motivo y con por qué no se forzó. Y una sección que separa «no aplica» de «sin ejecutar» |
| `README.md` | ACTUALIZADO | Su sección «qué está demostrado y qué no» cambia: `PTSA` y `FPGE` pasan de no ejecutados a ejecutados, `QA` a no aplicable, y `FIDE` queda como el único pendiente |
| `Suite-CLAUDE-Template.md` | NO PROCEDE | `EP-018` no cambió **qué parametriza** un proyecto destino. Las tres reglas nuevas viven en `EXECUTION-MODES` y `RULES`; ninguna añade un campo a `REGISTRY` ni a `CLAUDE.md` |
| `graphify-out/` | ACTUALIZADO | Regenerado sobre el alcance declarado: 17 archivos, 734 nodos, 1128 aristas. `FDGE-R43` **al día**, y esta vez comparando **hash de contenido** y no `mtime` — el cambio de `PT-090`, corregido a bytes crudos al descubrir que no casaba con el de `graphify` |

## Lo que este acta **no** prueba

Que los cinco se revisaran **bien**. Una fila que dice `NO PROCEDE` con motivo es una afirmación
contrastable, no una prueba — el mismo límite que `SUITE-R27` declara sobre las firmas, y que
`PT-093` acaba de declarar también para las compuertas.

## Dos filas que cambiaron de decisión respecto de la `10.0.0`

`MANUAL.md` pasó de `ACTUALIZADO` a `NO PROCEDE`, y `Suite-CLAUDE-Template.md` sigue en
`NO PROCEDE` por el mismo motivo que entonces.

**No es inercia: es que este lote arregla comprobaciones, no procedimiento.** Un `MANUAL` que
cambiara aquí sería un retoque cosmético para acallar la comprobación — el equivalente documental
de fabricar un verde, que es lo que `PT-085` escribió al crear esta acta.

## El grafo dejó de ser la fila que bloquea

En la `10.0.0` fue la única que retuvo el sello. Aquí se regeneró tres veces durante el lote, y la
tercera fue **porque `PT-090` había cambiado cómo se mide la deriva** — y `sellar` seguía usando
el `mtime`: dijo «17 de 17 cambiaron» sobre un grafo recién generado.

**Lo cazó el propio sello, no una lectura del código.**

## Firma

```
Resuelto por: Alberto Martínez
Fecha: 2026-08-20
Confirmo que los cinco documentos de entrada están decididos: SÍ
```
