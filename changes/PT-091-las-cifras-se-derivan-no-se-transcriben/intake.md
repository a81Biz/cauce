# PT-091 — Las cifras del inventario se derivan, no se transcriben

> Plantilla de **tarea dentro de una implementacion abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-018` (`INTAKE-R08`).

```yaml
---
id: PT-091
type: BUG
epic: EP-018
track: STANDARD
status: INTEGRATED
phase: 10
created: 2026-08-20
structural: no
suite_version: 10.0.0
severity: S3
---
```

## 1. Que se quiere   `[HUMANO]`

Origen: [`H-007`](../../PTSA/Findings/H-007.md) `D4` MEDIA · [`H-006`](../../PTSA/Findings/H-006.md) `D4` BAJA.
**Son el mismo defecto** y por eso van juntos.

## 2. El hallazgo, medido

`inventory/services.md` lleva fecha **2026-08-19**. Un dia despues:

```
herramienta          documentado    real
selftest.sh                 3541    4533     y «697 casos» cuando son 1118
tracker.mjs                 2070    2515
verify-fdge.mjs             1618    1859
patrones.mjs                 588    1082     casi el doble
verify-suite.mjs             596     665
audit.mjs                    502     554
plan-layout.mjs              327     371
regla.mjs                    228     261
```

**8 de 16.** Todas hacia arriba: `EP-017` aterrizo despues de que Foundation corriera.

Y `CLAUDE.md` decia **15 herramientas** y **4 comandos** cuando son 16 y 7 — corregido a mano
durante la auditoria (`H-006`, `VALIDATION_PENDING`), que es **exactamente el arreglo que vuelve a
caducar**.

## 3. Por que importa mas que las cifras

`PTSA-R76` obliga a construir el universo auditable **desde el inventario**. Un inventario que
envejece en un dia convierte la fuente mecanica de la auditoria en una fuente de memoria.

En `PTSA-2026-08-20` no llego a estropear nada porque el auditor enumero contra `ls` y contra el
codigo. **Eso fue una decision del auditor, no una propiedad del marco** — y la siguiente
auditoria puede no tomarla.

## 4. Criterios de aceptacion

| | Criterio |
|:---|:---|
| `AC-01` | Las cifras del inventario se **generan**: un comando las recalcula desde el arbol |
| `AC-02` | Una cifra transcrita a mano que no coincide con la derivada **falla**, no avisa |
| `AC-03` | El recuento de herramientas y de comandos de `CLAUDE.md` entra en la misma comprobacion |
| `AC-04` | El inventario declara su **ancla** —de que commit sale— como `REGISTRY.graph` declara `pt_at_generation` (`FND-R14`) |
| `AC-05` | Las 8 cifras falsas quedan corregidas por el generador, no a mano |
| `AC-06` | El generador declara su **sujeto** segun `PT-087`: recuenta lineas y archivos, **no** comprueba que la descripcion en prosa sea cierta |

`AC-06` no es una formalidad: es el limite honesto de esta tarea. Que `services.md` diga bien
cuantas lineas tiene `tracker.mjs` no dice nada sobre si describe bien lo que hace.

## 5. Que NO entra

```
OUT: regenerar Foundation entera. Se ha ejecutado dos veces y no es lo que falla: falla que
     sus cifras no se recalculen entre ejecuciones.
OUT: derivar la prosa. Solo las cifras y las enumeraciones.
```
## Condicion de cierre   `FDGE-R53`

Termina cuando: un comando recalcula las cifras del inventario y de `CLAUDE.md`, una cifra transcrita que no coincide falla, y las 8 cifras falsas quedan corregidas por el generador y no a mano.

## Firma

```
Firmado por lote: EP-018
```
