# PT-148 · `spec-changes.md`

```
PRD / TRD / API / esquema / eventos   sin cambios
LEXICON                               vocabulario NUEVO: los campos del contrato
RULES.md                              UNA REGLA NUEVA, con ID estable y severidad CHECK
CASOS-DE-USO.md                       dos filas nuevas en «E · Publicar y mantener»
CORE.md · CORE-PTSA.md                regenerados (SUITE-R16)
```

## La regla nueva rompe compatibilidad, y hay que decirlo

Una regla `CHECK` **bloquea la integración**. Un proyecto instalado que tenga una herramienta
propia nombrando un componente literalmente **pasa de verde a rojo** al actualizar.

**No se conoce ninguno** —el barrido cubre `docs/methodology/tools/`, que el paquete distribuye y
que un proyecto destino no modifica— pero **prometer que no existe sería afirmar lo que no se ha
medido**. Se declara.

## Efecto en la versión

`EP-022` §3 declaró el lote **aditivo**, y esta tarea es la que más tensa esa restricción: añade
una obligación que antes no existía.

Se sostiene como **`MINOR`** porque **lo exigido no cambia**: los seis componentes ya estaban
declarados en el contrato desde `PT-144`, y ninguna herramienta los nombra desde `PT-147`. La
regla escribe lo que ya es cierto y lo hace comprobable.

**Si el firmante lo lee al revés** —que una comprobación nueva que puede bloquear es ruptura— se
fija al cerrar el lote, que es donde se decide el número (`EP-022` §Cierre).
