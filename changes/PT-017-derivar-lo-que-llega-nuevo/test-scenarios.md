# PT-017 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-01 | Destino sin una herramienta que el paquete tiene | la nombra |
| E2 | AC-02 | Un archivo nuevo en `tools/` del paquete | aparece **sin tocar el código** |
| E3 | AC-03 | Destino sin `docs/methodology/tools/` | «la suite entera», no dieciséis nombres |
| E4 | AC-04 | Destino con las mismas herramientas | **no** se emite fila |
| E5 | AC-01 | La frase `lo que llega nuevo` se conserva | presente en `migrate.mjs` |

## `E4` y `E5`, los que protegen lo demás

`E4`: un aviso sobre una lista vacía es ruido, y el ruido se aprende a ignorar.

`E5`: el `PORQUE` de `PT-043` reconoce esta acción **por esa frase**. Si se pierde, la fila cae
en el `RULE-06` por defecto y el conductor deja de explicarla — un acoplamiento entre dos tareas
del mismo lote que se rompe sin querer al reescribir un mensaje.
