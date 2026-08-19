# PT-061 — Autorrevisión   `PHASE 6`

## Lo entregado

```
REGISTRY.personas          nombre canónico + identidades de git
personaDe(autor, tabla)    pura · la persona, o null CON MOTIVO
personaLocal               quién usa esta máquina
tracker personas           declarados y NO declarados, siempre
ramaDe                     pasa por la tabla · sin tabla, como antes
verify-suite               todo firmante existe como persona
LEXICON §6.5f              el contrato · sin regla nueva
casos                      829 → 865
```

## Lo que la tarea encontró antes de empezar

En un repositorio de **una sola persona**:

```
221 commits   Alberto Martínez <alberto@a81.biz>
  9 commits   a81Biz <albe.mtz@gmail.com>
  1 commit    Alberto Martínez <albe.mtz@gmail.com>
```

Tres identidades. Ninguna es «la mala» — las tres son trabajo real. El desorden no viene de
trabajar con más gente: viene de **cambiar de máquina**.

Y el hallazgo tranquilizador: la identidad **casi no se usa todavía**. Solo `ramaDe` la tocaba, y
desde la máquina de los 9 commits habría escrito `cauce/a81biz` — otra rama, para la misma persona,
sin que nada lo notara. `PT-064` y `PT-065` la van a usar mucho; por eso esto va primero.

## La decisión que sostiene el lote entero

El par `(nombre, correo)` casa **entero**. No por correo, no por dominio, no por apellido.

La inversa lo enseña: relajándolo a «mismo correo o mismo dominio», `Otro <alberto@a81.biz>`
pasa a **ser** Alberto Martínez. Y con eso, `PT-062`…`PT-065` construirían sobre una identidad
falsa **sin que sus propios casos lo notaran** — cada una comprobaría *correctamente* sobre un dato
equivocado. Es el riesgo que declaré en el intake del lote, y la única defensa es que aquí no se
adivine.

Dos casos caen al neutralizarlo. Son pocos, y son los que importan.

## La asimetría, que es deliberada

Poner `personas` en el registro crea, a primera vista, una segunda lista de personas junto a
`firmantes:`. Eso es exactamente el patrón que este marco existe para eliminar — así que la
comprobación va en **una sola dirección**:

```
firmante sin persona   →  FALLA   alguien puede firmar y el marco no sabe quién es
persona sin firmar     →  bien    tener identidad no es poder firmar
```

Si fuera simétrica serían **copias del mismo hecho** y divergirían, que es lo que le pasó a las
reglas en la v3. Un becario puede tener identidad y no poder firmar; lo que no puede pasar es que
alguien firme sin existir.

## La reconciliación es una tabla, no una cirugía

Unificar tres autores en 231 commits sería `git filter-branch` — reescritura de historia, que
`SUITE-R06f` reserva a una decisión humana explícita. No hizo falta: la historia sigue teniendo las
tres identidades, y la tabla dice que son la misma persona.

## Lo que no queda comprobado

**Que la tabla esté al día.** Una máquina nueva trae una identidad nueva, y hasta que alguien la
declare queda `SIN DECLARAR` — visible, pero fuera de las cifras. Por eso los no declarados salen
**siempre**, no bajo una bandera: esconderlo detrás de una opción es garantizar que nadie lo mire.

**Que la persona declarada sea quien dice ser.** Es una declaración, como `firmantes:`. Dice a
quién **atribuir** un commit, no quién lo escribió.

**Que dos personas de verdad se comporten así.** Todo lo probado es con una persona y tres
identidades, porque es lo que hay. Dos personas reales traerán casos que nadie ha visto — y esa es
justamente la razón de que `AC-03` reporte en vez de adivinar.
