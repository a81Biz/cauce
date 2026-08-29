# `PT-200` · `strategy.md` — el camino elegido, y los descartados con su porqué

## El camino: el sello de `PT-191`, aplicado al artefacto

```
verify-fdge --all             lee SELLOS-PT.json y SALTA los que casan
verify-fdge --all --sellar    sella los terminales, y solo si la corrida acabo EN VERDE
```

### Qué entra en la huella de un `PT`

Todo lo que, si cambiara, podría cambiar su veredicto:

| Pieza | Por qué |
|:---|:---|
| su allocation en `REGISTRY.json` | estado, fase, lote, compuertas, viabilidad |
| `changes/PT-NNN-slug/**` | intake, strategy, traceability… lo que las reglas leen |
| `docs/implementation/evidence/PT-NNN/**` | manifest, self-review |
| sus entradas en `HISTORY.log` | `FDGE-R29` las lee |
| **`verify-fdge.mjs` y `patrones.mjs`** | **un cambio en el verificador cambia el veredicto sin tocar el artefacto** |

La última es la que `PT-191` demostró que hace falta: su sello incluye las herramientas, *«así que un
destino que las modifique deja de casar y vuelve a correr el bloque»*.

### Y sólo se sella lo TERMINAL

`INTEGRATED`, `CLOSED`, `REJECTED`, `REVERTED`, `DEFERRED`. **Un `PT` vivo se verifica siempre**,
tenga sello o no: su trabajo está en curso y su veredicto es justamente lo que interesa.

---

## Los caminos descartados

### 1 · Añadir `INTEGRATED` a la lista de terminales, y ya

**Descartado: dejaría la compuerta ciega para el 93 % del repositorio.** Los artefactos de un `PT`
integrado siguen en el árbol y nada impide editarlos o borrarlos después. Es exactamente el defecto
que `PT-191` cerró: *«un bloque no se certifica por no haber cambiado, sino por haber PASADO»*.

### 2 · Acotar por fecha, o verificar sólo los N más recientes

**Descartado: cualquier número es arbitrario** y sólo mueve el día en que vuelve a doler. Es el
argumento con el que `PT-190` rechazó ampliar los 4000 caracteres y `PT-192` rechazó ampliar la
ventana de 40.

### 3 · Sellar automáticamente lo que pase en verde

**Descartado: es el defecto de `PT-191` con otra ropa.** Certificaría por el hecho de ejecutar el
comando. Sellar es una **decisión**, y por eso lleva `--sellar` — igual que el sello de bloques
lleva `--verde`.

### 4 · Que el sello sólo cubra los artefactos, sin el verificador

**Descartado, y es el error más fácil de cometer.** Cambiar una regla de `verify-fdge` cambia el
veredicto de tareas cuyos artefactos no se han tocado. Sin la huella del verificador, el sello
certificaría contra una versión de las reglas que ya no existe.

### 5 · Guardar el sello dentro de `REGISTRY.json`

**Descartado: el registro asigna, no certifica** (`SUITE-R08`). Y meter la huella en el mismo archivo
que la huella cubre crea una dependencia circular: sellar cambiaría lo sellado. Va en
`SELLOS-PT.json`, como `SELLOS.json` para la batería.

### 6 · Reutilizar `SELLOS.json`

**Descartado: son dos cosas distintas** —bloques del arnés y tareas— con ciclos distintos. Mezclarlas
haría que tocar el arnés invalidara sellos de tareas, y al revés.

---

## Lo que NO promete   `SUITE-R26`

**No promete una cifra de minutos.** Fijar «baja a N minutos» sería fijar el número de lo correcto
(`HANDOFF -18`). Lo que promete es que **lo terminal y sin cambios no se re-verifique**, y que
cualquier cambio lo devuelva entero.

**Y no promete que el sello cubra todo lo que podría afectar al veredicto.** Un cambio en
`RULES.md` que no toque `verify-fdge.mjs` no invalida el sello — igual que en la batería. Se declara.

## La comprobación inversa

Con el sello puesto: tocar un artefacto de un `PT` sellado tiene que **devolverlo** a la
verificación. Un sello que aguanta cualquier cambio no sella nada.
