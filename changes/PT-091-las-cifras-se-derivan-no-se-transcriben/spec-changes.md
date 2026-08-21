# PT-091 — Cambios de especificación   `SUITE-R00` · `LEX-R22`

**Ninguna regla nueva.** `FND-R14` ya existía: *«el grafo forma parte del paquete… y registra en
`REGISTRY.graph` con `generated`, `scope` y `pt_at_generation`»*.

Lo que hace esta tarea es **extender su idea al inventario**: un artefacto derivado necesita
declarar de cuándo es, o «al día» y «nadie lo ha vuelto a mirar» son indistinguibles.

| Documento | Cambio |
|:---|:---|
| — | ninguno |

## Sin `RIGE_DESDE`, y por qué

La comprobación **avisa**, no falla. Un proyecto que hoy pasa, sigue pasando: lo único que nota es
un aviso nuevo con el comando que lo arregla.

`RIGE_DESDE` protege de una regla que empieza a **fallar** sobre el pasado. Aquí no hay ninguna, y
es la tercera vez en el lote que se decide no anclar — `PT-089` `AC-05` y `PT-090` fueron las otras
dos, cada una con su motivo.

## Lo que un proyecto destino nota

```
! FND-R14  8 de 16 cifras de inventory/services.md ya no describen el arbol —
           selftest.sh 3541→4919, … Se recalculan:
           node docs/methodology/tools/tracker.mjs inventario --aplicar
           NO establece que la descripcion en prosa sea cierta: solo las cifras.
```

Una línea en la guía de migración cuando el lote cierre, y es opcional: nada falla si no se
ejecuta.
