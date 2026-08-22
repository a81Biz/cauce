# Descubrimiento — `PT-110`

## La cuenta, medida

`FND-R14` cayó **siete veces** en este lote. Cada tarea que toca una herramienta desvía las cifras
de `inventory/services.md`, y las siete se reescribieron **a mano**.

```
PT-096 · PT-098 · PT-100 · PT-102 · PT-105 · PT-106 · PT-110
```

## Y el comando existía

```
$ node docs/methodology/tools/tracker.mjs inventario --aplicar
  · version.mjs: services.md dice 121 y son 165.
  · 5 cifra(s) reescritas en services.md.
```

**Desde antes del lote.** No lo llamaba nadie.

## Dónde estaba el hueco de verdad

```
sellar   ->  deuda de sellado
             GRAFO                    FDGE-R43
             DOCUMENTOS DE ENTRADA    FND-R22
             GUIA DE MIGRACION        SUITE-R19
             ...y el inventario NO
```

`sellar` ya recorre tres cosas que exige al día. **El inventario no estaba en la lista**, así que
su deuda solo aparecía en la batería — es decir, **después** de haber decidido sellar.

## Lo que este descubrimiento NO establece

- **Qué más debería mirar `sellar`.** Se añade el que cayó siete veces. Lo demás queda declarado
  y sin medir.
- **Que la descripción en prosa del inventario sea cierta.** Se miden las **cifras**, y `FND-R14`
  ya lo dice en su propio mensaje.
