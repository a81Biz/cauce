# `PT-130` — Cambios de especificación   `PHASE 4`

> `SUITE-R06e`: modificar `docs/methodology/` **no se automatiza**.

---

## Ningún documento normativo cambia

Y conviene decir por qué, porque «ninguno» suele esconder trabajo no hecho.

**`SUITE-R34` sigue estableciendo lo mismo**: que el estado retomable no contradiga al registro.
El hecho que vigila es correcto y el intake lo dejó **fuera de alcance** explícitamente. Lo que
fallaba era **cómo lo leía**, y eso es código.

Es un caso de `P-003` de la Declaración de Valor —la comprobación— y no de `P-001` —la norma—.

## Lo que sí cambia, y no es normativo

| Dónde | Qué |
|:---|:---|
| `tools/patrones.mjs` · `contradiceElRegistro` | la línea `tarea:` se lee por su **sujeto** |
| `tools/patrones.mjs` · `SUJETOS` | `SUITE-R34` declara qué establece y qué **no** |
| `tools/patrones.mjs` · `lecturasDeAlcanceAmplio` | enumera las once que quedan |

## La pregunta que NO se responde, y consta

`PT-127` midió que **15 commits de `EP-020` citan el lote** donde `FDGE-R19` pide un `PT`, y su
`out-of-scope` mandó la decisión aquí.

**No se toca `FDGE-R19`.** Cambiar qué exige una regla de commits desde una tarea cuyo alcance es
el alcance de las **lecturas** sería la ampliación silenciosa que este lote persigue. Queda
declarada, con su medición hecha y su detector construido.

## Autoridad

`LEX-R22` · `RULES.md` enuncia las obligaciones y aquí no se enuncia ninguna nueva.
`PT-087` · el registro de sujetos es donde una comprobación declara su alcance.
