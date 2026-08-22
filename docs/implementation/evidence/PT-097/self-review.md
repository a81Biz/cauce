# PT-097 — Autorrevisión `PHASE 6`

## Estuve a punto de cometer el defecto al corregirlo

Hacen falta cuatro letras y la especificación declara **dos** anclas: `60` (§13.3, el cap de
dominio) y `90` (§15.6). Dos anclas dan tres tramos.

Mi primer impulso fue el mismo que tuvo el agente que auditó: **inventar la tercera frontera**. Ya
tenía escrito `B: 75 ≤ Health < 90` cuando me detuve a preguntarme de dónde salía el `75`.

De ningún sitio. Exactamente igual que el `(75-89)` que esta tarea existe para retirar.

Lo que faltaba era releer las dos reglas que nombran la `C`:

```
PTSA-R30   «NO PUEDE clasificarse POR ENCIMA DE C»
§28.2      un CRITICO «bloquea certificacion >= B»      (o sea: techo C)
```

**Ninguna la define como rango. Las dos la usan como límite superior.** `C` es un estado al que se
**baja**. Con eso el sistema cierra con las dos anclas que hay.

La lección no es «leer mejor»: es que **cuando un diseño exige una cifra que no está, la respuesta
casi nunca es inventarla — es que el diseño es otro**.

## El `min` no es estilo: es lo que hace la regla cumplible

`PTSA-R08` exige una letra *«auditable y defendible»*. Con una secuencia de ajustes —«primero
éste, luego aquél»— dos auditores pueden llegar a letras distintas aplicándolos en otro orden, y
la regla deja de poder cumplirse.

Por eso `PTSA-R81` dice **mínimo** y hay un caso que lo prueba: `health_unstable` (techo `B`) y un
`CRÍTICO` (techo `C`) juntos deben dar `C`, no `B`. Retirar el `min` hace caer ese caso y sólo ése
— la inversa lo confirma.

## Nuestra `B` sobrevive, y por eso hay que decir que no valía

Recalculada da `B`. **La misma letra.**

Y es justo por eso que la revisión del `RESUMEN` declara que la anterior **no era contrastable**.
Si se callara, quedaría escrito que la banda inventada «acertó», y la lección sería que inventar
sale bien. **Coincidió, no se dedujo**, y son cosas distintas.

## La comprobación pasaba por el camino equivocado

Cuando `verify-ptsa` dio verde por primera vez, el mensaje decía:

```
✓ PTSA-R08   Certificacion «B» contrastada contra §24.2/§24.4.
```

Sin topes. Y este `RESUMEN` declara **en su prosa** que *«con una métrica `D5` en Rojo el techo es
`B`»* — pero no publicaba `health_unstable` en el frontmatter, así que la función lo leía como
`false` y la letra salía de la **base**, no del tope.

**Mismo resultado, camino distinto, e indistinguible mirando sólo el verde.** Es la forma exacta
del defecto que este lote persigue: un verificador que da verde sin haber mirado.

De ahí sale `PTSA-R82`: un tope que no se puede leer no se puede contrastar. Ahora el mensaje dice
`· topes: B · §13.4 · health_unstable`, y si la bandera falta, **falla**.

## `verify-ptsa` no era comprobable, y lo descubrí intentándolo

Escribí `letraDeCertificacion`, monté el caso, y el proceso moría sin imprimir nada.

`verify-ptsa.mjs` **se ejecuta al importarlo** y termina en `process.exit()`. `tracker.mjs` ya
resolvió esto en `PT-084` con `EJECUTADO_DIRECTO`, y `verify-ptsa` nunca lo tuvo — así que ninguna
parte de su lógica ha sido nunca comprobable desde el arnés.

No es alcance que crece: **`AC-05` no se puede cumplir sin eso**. Una función que no se puede
probar no es una comprobación, es una afirmación.

Y obligó a un helper genérico: `trlib` está atado a `tracker.mjs` por su variable de entorno.
`mlib` hace lo mismo para cualquier módulo.

## Un número que casi duplico

Escribí la regla nueva como `PTSA-R55`. **Ya existe** en `:1613` — el Acid Test. Habría creado dos
reglas con el mismo identificador en el mismo documento, que es la avería que `LEX-R04` y
`SUITE-R08` existen para impedir, cometida dentro de la tarea que arregla una regla mal definida.

Lo cazó comprobar el máximo antes de asumirlo: `PTSA-R80`. La nueva es `PTSA-R81`.

## Y una sección mal citada, en el documento que arregla citas rotas

Escribí `§27` para la regla del hallazgo `CRÍTICO`. Es **`§28.2`**. `§27` es «Severidad».

Citar mal una sección **en la tarea que existe porque dos citas apuntan a secciones inexistentes**
habría sido difícil de superar. Lo cazó ir a mirar el número en vez de recordarlo.

## Lo que no hice, y por qué

**No recalculé el `Risk`.** El `73` publicado se calculó con `H-001` y `H-006` activos; hoy están
`CLOSED` y quedan siete activos. Pero la letra **no depende de `Risk`** —no aparece en ninguno de
los cuatro topes— así que recalcularlo no cambiaría ninguna letra y sí abriría `INC-008`: el
multiplicador `×4` satura con `Σ ≥ 25` y el score deja de discriminar al cuarto hallazgo.

Va declarado, con su medición, al `## Cierre del lote` de `EP-019`.

**No metí `Risk` en la función**, por lo mismo: sería añadir criterio en una tarea que existe para
no inventar ninguno.

**No hice obligatorio que `PHASE 0` declare umbrales.** Trasladaría el hueco al proyecto destino y
las certificaciones dejarían de ser comparables entre proyectos — que es para lo único que sirven.
