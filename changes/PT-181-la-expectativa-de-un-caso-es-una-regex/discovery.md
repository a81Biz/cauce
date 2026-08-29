# `PT-181` · `discovery.md` — dónde está el defecto, con archivo y línea

## 1. El defecto

```
docs/methodology/tools/selftest.sh:272
```

```bash
if printf '%s' "$out" | grep -q -- "$pat"; then pass "$name"; else
```

`grep -q` sin `-F` interpreta el patrón como **expresión regular básica**. La expectativa de cada
caso del arnés —el segundo argumento de `chk`— se compara **como regex**, y nada permite decir «esto
es texto literal».

## 2. La medida, hoy

```
expectativas leidas                                    1401
con metacaracteres                                      215
AMBIGUAS: punto entre alfanumericos y NINGUN
  metacaracter a proposito                               96
```

Las 96 son las que importan. Ejemplos reales, tal cual están escritos:

```
"regla.mjs"        "instrucctions.md"     "REGISTRY.graph"
"4.0.1"            "Versión detectada: 3.x"    "### 24.2"
```

En `"regla.mjs"` el punto casa **cualquier carácter**: el caso pasaría igual con `reglaXmjs`. Nadie
lo pretendió.

## 3. Por qué es un defecto y no una curiosidad

Un caso cuya expectativa **casa de más** puede pasar **por la razón equivocada**, y eso no se ve
leyéndolo: se ve el día que el defecto que vigila aparece con una forma parecida y el caso sigue
verde.

Es la forma que da nombre al lote. Y no es hipotética en este arnés: `PT-199` cometió exactamente
esta clase de error hace unas horas —un `-f` que casaba de más y hacía pasar un caso por el motivo
equivocado— y lo destapó ejecutarlo, no leerlo.

## 4. Lo que `SUITE-R59` NO cubre, y por eso hace falta esta tarea

`SUITE-R59` gobierna el caso en que **el patrón se rompe**: un corchete sin cerrar es un error de
sintaxis de `grep`, no un «no casa». Su comentario en `:7273` lo dice:

> *«El patron NO puede llevar «[»: `chk` usa grep BRE y un corchete sin cerrar es un error de
> sintaxis, no un «no casa».»*

**Aquí el patrón no se rompe: funciona y significa otra cosa.** Son dos defectos con la misma causa
—no hay forma de decir «literal»— y `SUITE-R59` sólo cubre uno.

## 5. Lo que NO está roto

- **Las 215 con metacaracteres.** Muchas los llevan **a propósito**: `"^phase:"`, `"^NO$"`,
  `"^0$"`. Convertir `chk` en literal por defecto las rompería todas.
- **`grep -q` como mecanismo.** Es correcto; lo que falta es poder elegir `-F`.

## 6. El límite de la medida, y se dice

Las 96 salen de una **heurística**: punto entre alfanuméricos, sin `^ $ [ ] * \`. No es una
auditoría. Puede marcar alguna que quisiera ser regex —`"### 24.2"` podría serlo— y puede escaparse
alguna que no marque. Establece el **orden de magnitud**, y por eso la tarea no promete revisarlas
una a una (`SUITE-R26`).
