# PT-095 — Trazabilidad   `FDGE-R15`

| AC | Criterio | Caso | Evidencia | Estado |
|:---|:---|:---|:---|:---|
| AC-01 | No juzga una entrada anterior a la versión que la trajo | `lo anterior al sello NO lo alcanza` · `sin frontera no alcanza a nada` | `salidas/verde.txt` | VERIFICADO |
| AC-02 | …y **sí** juzga una posterior | `…lo POSTERIOR si` | `salidas/verde.txt` | VERIFICADO |
| AC-03 | «a la espera de `G4`» no se lee como autorización | `«a la espera de G4» NO es autorizacion` | `salidas/verde.txt` | VERIFICADO |
| AC-04 | …y una autorización real sí | `…y «autorizados al agente» SI lo es` · `…y un VoBo tambien` · `…y un encabezado sin nada de eso, no` | `salidas/verde.txt` | VERIFICADO |
| AC-05 | El límite de la frontera queda declarado en el mensaje | `…y el MISMO dia del sello escapa` | `salidas/verde.txt` | VERIFICADO |
| AC-06 | `EXEC-R04` vuelve a verde con una constancia **añadida** | `una entrada CORRIGE posterior excusa` + las **cuatro** que la acotan | `salidas/verde.txt` | VERIFICADO |
| AC-07 | Un caso reproduce el fallo y falla sin el arreglo | la inversa, que además encontró un agujero mío | `salidas/inversa.txt` | VERIFICADO |

## `AC-02` y `AC-04` son la mitad que impide apagar la regla

Cada arreglo tiene su contrapeso: `AC-01` no cuenta sin `AC-02`, y `AC-03` no cuenta sin `AC-04`.
Sin ellos, «arreglado» sería «ya no comprueba nada».

`AC-06` tiene **cinco** casos y **cuatro** son negativos: una `CORRIGE` sin nombre no vale, una
anterior tampoco, una que no diga `CORRIGE` tampoco, y una de **otro día** tampoco.

El último lo encontró la **prueba inversa**, no yo. Con «cualquier día posterior», una sola entrada
`CORRIGE` excusaba **todo el ledger anterior para siempre** — y la inversa salía en **cero**, o sea
que el caso no probaba nada. La ventana es el mismo día, que es la real: una constancia mal escrita
se corrige al notarlo, y `EXEC-R04` ya empareja merges con constancias **por fecha**.

**Una inversa que sale en cero no es un verde: es un aviso.** Es la mejor lección de este `PT`.

## Un caso que no está en ningún `AC`

```
ningun byte de control en patrones.mjs
```

Escribiendo `corregidaDespues`, la clase de palabra de un regex acabó siendo el **byte 0x08** al
pasar por el editor. `/‹0x08›CORRIGE‹0x08›/` **no casa nunca y no se ve al leer**: la comprobación
daba verde por vacío y tardé dos vueltas en verlo.

Y el comentario que escribí para advertirlo **contenía el mismo byte**.

Es la lección de `PT-085` sobre secuencias de escape en `tools/`, repetida. El caso existe para que
la siguiente vez cueste un rojo en vez de dos vueltas.
