# PT-061 — Escenarios de prueba   `PHASE 4` · `FDGE-R17`

| # | AC | Escenario | Esperado |
|:---|:---|:---|:---|
| E1 | AC-02 | `personaDe` con un par declarado | la persona |
| E2 | AC-02 | …con la **segunda** identidad de la misma persona | la **misma** persona |
| E3 | AC-02 | …y con la tercera | la misma |
| E4 | AC-03 | Mismo correo, **otro** nombre | `null` — el par casa entero |
| E5 | AC-03 | Mismo nombre, **otro** correo | `null` |
| E6 | AC-03 | …y el motivo dice **qué autor** es | el nombre y el correo |
| E7 | AC-03 | …y que **no se adivina** por parecido | el texto |
| E8 | AC-03 | Un commit sin autor | `null` con motivo distinto |
| E9 | AC-01 | Sin `personas` declaradas | `null`, y no revienta |
| E10 | AC-05 | `personaLocal` resuelve el nombre canónico | el canónico, no el de `git config` |
| E11 | AC-05 | …y sin tabla, devuelve `null` para que quien llame use el de hoy | `null` |
| E12 | AC-01 | `tracker personas` enseña a los declarados | el nombre |
| E13 | AC-01 | …con sus identidades y cuántos commits lleva cada una | las cifras |
| E14 | AC-03 | …y los **no declarados**, siempre | la sección |
| E15 | AC-03 | …con qué hacer con ellos | el texto |
| E16 | AC-05 | `ramaDe` usa el canónico si hay tabla | `cauce/alberto-martinez` |
| E17 | AC-05 | …y **sin** tabla se comporta como hoy | igual |
| E18 | AC-04 | `verify-suite` falla si un firmante no es persona | rojo |
| E19 | AC-04 | …y **no** falla si una persona no firma | verde |
| E20 | AC-01 | Las tres identidades de este repositorio están declaradas | las tres |

**`E4` y `E5` son `AC-03` y son lo que sostiene el lote.** El par casa **entero**: solo el correo
no basta —dos personas pueden compartir un buzón de equipo— y solo el nombre tampoco: `a81Biz` no
se parece a nada. Si esto se relajara, las cuatro tareas siguientes heredarían identidades falsas
sin que sus casos lo notaran.

**`E19` es el que impide crear dos listas del mismo hecho.** La comprobación de `AC-04` va en una
sola dirección: todo firmante existe como persona, pero **tener identidad no es poder firmar**. Si
fuera simétrica, `firmantes:` y `personas` serían copias y divergirían.

**`E17` es la compatibilidad.** Un proyecto de una persona no declara nada y todo sigue igual.

## Lo que ningún caso puede comprobar

**Que la tabla esté al día.** Alguien cambia de máquina, aparece una identidad nueva, y las cifras
de `PT-064` empiezan a dejarse trabajo fuera. Lo que sí queda garantizado es que
`tracker personas` lo **enseña siempre**, no bajo una bandera — pero que alguien mire no se puede
comprobar desde aquí.

**Que la persona declarada sea quien dice ser.** Esto es una **declaración**, como `firmantes:`, y
`SUITE-R27` ya dice que una firma no prueba que firmara una persona. Aquí pasa igual: la tabla dice
a quién **atribuir** un commit, no quién lo escribió de verdad.

**Que dos personas de verdad se comporten así.** Todo lo que se prueba aquí es con una persona y
tres identidades, porque es lo que este repositorio tiene. Dos personas reales tendrán casos que
nadie ha visto — y esa es la razón de que `AC-03` reporte en vez de adivinar.
