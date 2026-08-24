# `PT-115` — Autorrevisión   `PHASE 6`

## El principio ya estaba escrito; faltaba granularidad y destino

`SUITE-R04` dice desde la v4 exactamente lo que el firmante pidió: *«una decisión que sólo existe
en el chat no existe»*. Lo que faltaba no era la regla — era **dónde** y **cada cuánto**.

```
unidad de registro     la FASE       nueve por tarea      FDGE-R52
unidad de interaccion  la PARADA     decenas por tarea    no tenia nombre
```

**Medido sobre el propio lote que lo corrige**: seis tareas cerradas con **todos** sus hallazgos
explicados sólo en la conversación, y sus issues con únicamente las notas de `FDGE-R52`. Lo
señaló el firmante, y las seis explicaciones hubo que publicarlas a mano.

## Las seis clases de motivo no se inventaron

Cada una salió de una instancia **medida en esta sesión**. Inventar casos habría producido una
lista que se rodea —`PT-103` midió qué pasa entonces: *«cumplir el marco exigía saltárselo»*— y
por eso `PT-119` publicará cuántas paradas hubo **por clase**: una clase en cero o sobra, o la
lista está mal.

## Tres huecos que cerró el marco, no yo

```
verify-suite  «FDGE-R55 es HARD nueva y no declara desde que version rige»
SUITE-R20     «PHASES cita 3 reglas que los prompts no mencionan. En MANUAL no se verian»
reciprocidad  FDGE-R52 tenia que citar que es el caso particular, o divergirian
```

Los tres al primer intento, y ninguno lo vi antes de ejecutar.

## La versión la decidió un caso, no yo

Puse `RIGE_DESDE 13.0.0` y un caso dijo: *«ninguna fila mira más allá de la versión que entra»*.
Su comentario aclaraba **salvo las que entran CON esta versión**, así que o las filas bajaban a
`12.0.0` —y las reglas juzgarían trabajo anterior a existir— o **subía la versión**.

Subió. El proyecto declara `13.0.0` con su entrada de `CHANGELOG` abierta.

## Y el caso que me hizo dudar estaba mal

Seguía rojo con la versión ya en `13.0.0`, porque tenía la cifra **quemada**: `v[0] > 12`.

Es lo que el bloque `no hacer` advierte con todas las letras —*«atar una aserción a una cifra que
CRECE: fallará algún día sin que eso signifique nada»*— y **ya había pasado**: `PT-088` lo hizo
con «PENDIENTE 122» y falló dos tareas después. **La advertencia estaba escrita y no impidió la
segunda instancia**, que es la tesis entera de este lote: una nota no es un mecanismo.

Mi primer impulso fue revisar mis filas. **No estaban mal.** El código no cumplía lo que su propio
comentario prometía.

**Y mi primer arreglo reventó**: metí `await` de nivel superior y un regex con barras dentro del
cuerpo de `mlib`. `revento()` lo distinguió de un fallo real —*«la herramienta reventó: no
verifica nada»*—, que es para lo que existe desde `PT-050`. El segundo arreglo **quita la
necesidad**: bash deriva la versión, el JS sólo compara. Quinta rotura de escapado de la sesión,
resuelta igual que las cuatro anteriores.

## Lo que esta tarea **no** hace

- **No exige nada todavía.** `FDGE-R55` nace **sin verificador**, lo cual `SUITE-R26` llama *una
  recomendación* si se queda ahí. Quien lo pone es `PT-117`, y por eso las tres van seguidas.
- **No construye el comando.** Es `PT-116`.
- **No relaja `FDGE-R52`.** Conserva sus tres líneas y su verificador.
- **No promete que las seis clases sean las correctas.** Salen de una sesión; `PT-119` las medirá.
