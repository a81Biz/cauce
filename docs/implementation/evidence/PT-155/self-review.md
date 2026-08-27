# `PT-155` · autorrevisión — `PHASE 6` Evidence

## Siete patrones críticos vivían **fuera** del contrato, en el archivo del contrato

| | Antes | Ahora |
|:---|---:|---:|
| Patrones con contrato | **12** | **19** |
| Comprobaciones | **106** | **129** |
| Regex de primer nivel sin contrato | **7** | **0** |

**No eran menos críticos: eran menos visibles.** `SUITE-R59` lleva **doce** roturas medidas aquí, y
las que cazó una comprobación fueron las que estaban **en `PATRONES`** —viajan con sus ejemplos—;
las de fuera salieron **por casualidad**: mirando bytes con `cat -A`, o viendo reventar el arranque.
**Tres de los siete se escribieron durante este mismo lote.**

**Un caso negativo es un defecto vivo, y se deja escrito.** `ANUNCIA_AUTORIZACION` lleva
`'Autorizacion expresa de excepcion'` en `noCasa` **porque no casa**: al patrón le falta la `d` de
`autorizad`. Es `PT-170`. Dejarlo ahí **no lo aprueba: lo fija** — cuando se decida reconocer la
constancia por su forma, ese caso tendrá que **moverse a `casa`**, y el cambio será visible.

**Y la batería cazó una regla fuera de la guía**: `FDGE-R15a` no estaba en el `CHANGELOG` y
`SUITE-R19` bloqueó. `EP-024` había escrito cuatro reglas y la guía declaraba tres.

## Lo medido

Batería: **1795 casos, cero rojos**. El detalle por criterio vive en
`changes/PT-155-*/traceability.md`, que es la matriz canónica (`FDGE-R15a`), y en las
paradas de la tarea. Aquí no se repite: `RULE-01`, un hecho tiene un solo sitio.
