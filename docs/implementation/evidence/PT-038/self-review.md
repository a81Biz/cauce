# PT-038 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`MANUAL.md` en nueve secciones, y tres puntos de entrada para que se encuentre: el `README` raíz
—arriba del todo, que era la queja literal—, el `README` de la suite y `CLAUDE.md`.

```
selftest   371 → 382 casos
```

## Las dos secciones que no existían en ningún sitio

**§7 «cuando algo falla»**: un marco de 177 reglas produce mensajes que parecen errores del
usuario. Sin esa tabla, un `SIN EVALUAR` se lee como «está bien» y una compuerta que bloquea se
lee como un estorbo.

**§8 «las diez ideas»**: sin ellas el manual es una lista de obligaciones. Con ellas alguien
puede **deducir** la regla que no ha leído — que es lo único que escala a 177.

## La fila más incómoda, y es verdad

> *«Una compuerta bloquea y crees que no debería → cuatro veces en la historia de este marco la
> compuerta tenía razón y quien la leyó, no.»*

Está medido en este repositorio y las cuatro veces el que leyó mal fui yo. Lo dejo escrito
porque quien venga después va a sentir lo mismo, y saber que ya pasó cambia qué hace a
continuación.

## Lo que un revisor debería atacar

**1 · Ningún caso prueba que el manual sirva.** Comprueban que existe, que empieza por donde debe
y que no duplica reglas. Que alguien de cero llegue al final solo lo dirá alguien que no haya
estado aquí mientras se escribía, **y no lo hay todavía**. Es el `AC` que de verdad importa y no
está verificado por nadie.

**2 · «Se lee de principio a fin una vez» es una afirmación sobre mí.** Lo escribí yo, que ya sé
todo lo que cuenta. La primera persona que lo lea en frío es la prueba, y ahí puede aparecer que
falta la mitad.

**3 · El `README` de la suite sigue llamándose manual.** Le puse un aviso en vez de renombrarlo.
Un revisor podría decir con razón que dos «manuales» siguen siendo confusos.

## Lo que NO he verificado

Lo dicho: que funcione. Y no puedo — es el único trabajo de esta sesión cuya validación exige a
otra persona.

SELF_REVIEW_COMPLETE
