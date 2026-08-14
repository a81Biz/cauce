# PT-035 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

Una tarea con `epic` es **sub-issue** de su lote en la plataforma. La historia completa quedó
reanidada: **24 tareas bajo siete lotes**, incluidos los ya cerrados.

```
selftest   359 → 371 casos (con PT-036)
```

## Lo incómodo: lo estaba causando la propia herramienta

`SUITE-R35` existe para impedir dos representaciones del mismo hecho. La jerarquía estaba en el
registro —cada tarea declara su `epic`— y `tracker` la publicaba **narrada**, como enlaces en el
cuerpo del lote. Una representación estructural y otra en prosa, escritas por la herramienta que
existe para que eso no pase.

No lo vi en meses de uso. Lo vio quien miraba el tablero.

## Lo que un revisor debería atacar

**1 · `null` frente a `[]` es todo el diseño.** Si `subIssues()` devolviera `[]` al fallar, el
tracker intentaría anidar todo en cada pasada contra una plataforma que no responde. La
distinción está en una línea y un `catch`; es frágil y es lo que sostiene `AC-03`.

**2 · Se anida también lo cerrado, y eso escribe sobre issues cerrados.** Es deliberado —el árbol
se mira después de cerrar— pero significa que una ejecución toca historia. No es destructivo: la
API de sub-issues no reabre nada.

**3 · La lista del cuerpo se conserva.** Ahora hay dos formas de ver lo mismo: la lista y el
árbol. Un revisor podría llamarlo la copia que acabo de criticar. La diferencia es que la lista
es **derivada y regenerada** en cada pasada, no una segunda fuente — pero la línea es fina y
conviene decirlo.

## Lo que NO he verificado

El adaptador de Azure. Sin proyecto que lo use sería código sin ejecución; va en `PT-025`.

SELF_REVIEW_COMPLETE
