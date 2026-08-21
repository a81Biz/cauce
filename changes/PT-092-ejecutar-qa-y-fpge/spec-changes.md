# PT-092 — Cambios de especificación   `SUITE-R00` · `LEX-R22`

**Ninguna regla nueva, ninguna modificada.** Esta tarea **ejecuta** componentes; no legisla.

| Documento | Cambio | Por qué |
|:---|:---|:---|
| `CASOS-DE-USO.md` | un hueco declarado más: `FQAGE` sobre un paquete sin interfaz | `RULE-06` · lo que no se cubre se dice |
| `10-Technical-Debt.md` | `TD-15` separa «no aplica» de «pendiente» | eran dos hechos sumados como uno |

`CASOS-DE-USO.md` **no es un documento de reglas** (`LEX-R21`): cataloga casos y declara huecos.
Añadir una fila no cambia ninguna obligación.

## Lo que un proyecto destino nota

**Nada.** No hay regla nueva que cumplir, ni verificador que empiece a fallar.

Lo que gana es un catálogo que dice **por qué** `QA` puede no aplicarle — si su producto tampoco
tiene interfaz, ahora sabe que eso está previsto y cómo se declara.

## Sin `RIGE_DESDE`

Cuarta vez en el lote que se decide no anclar, y por el motivo más simple de los cuatro: **no hay
regla**. `RIGE_DESDE` protege de una regla que empieza a fallar sobre el pasado, y aquí no entra
ninguna.
