# PT-029 — Autorrevisión   `PHASE 6`

## Lo que se buscaba y lo que se encontró

La tarea pedía **buscar**, no recordar. Los cinco casos conocidos habían aparecido al chocar con
ellos, y el `origin` lo decía con todas las letras: *«lo que falta no es otra regla sino detectar
esa FORMA»*.

Se cruzaron dos tablas que ya existían y nadie había cruzado —qué produce cada fase, qué exige
cada comprobación y cuándo— y salieron **tres choques con una sola causa**:

```
FDGE-R23  manifest.json    PHASE 6   exigido desde G1 (PHASE 1)
FDGE-R25  self-review.md   PHASE 6   exigido desde G1
FDGE-R29  HISTORY.log      PHASE 8   exigido desde G1
```

`G1`, `G2` y `G3` exigían **exactamente lo mismo que `G4`**. Tres compuertas de cuatro no se
podían evaluar con la herramienta que existe para evaluarlas, desde que existe el parámetro.

## Los dos riesgos, y son opuestos

**Arreglar los tres y llamarlo detectar.** Tres `if` corregidos dejan la batería verde y el
problema entero: el cuarto se escribe igual, porque nada lo impide. Por eso el entregable es el
caso que caza la **forma**:

```
chkno "ninguna comprobacion se activa con cualquier compuerta"  "if (gate) fail("
```

Hoy hay cero. La cuarta que se escriba pone la batería en rojo **el día que se escriba**, no el
día que alguien tropiece.

**Declarar que los choques ya se detectan.** Lo impide la medida: de los **seis** casos conocidos,
**cinco** son de una familia que este método **no ve**.

## La familia que no se detecta

```
SUITE-R44 con CLOSED · SUITE-R45 con el merge · SUITE-R45 con la verificación posterior
SUITE-R35 con SUITE-R46 · SUITE-R09 + FDGE-R29 (el ledger irreparable de PT-046)
```

`SUITE-R09` prohíbe **editar** una entrada de `HISTORY` y `FDGE-R29` prohíbe **añadir** una
segunda; la comprobación leía siempre la primera. Un ledger mal formado era irreparable. **No hay
fase de por medio:** hay dos prohibiciones que se cierran mutuamente, y detectarlo exigiría razonar
sobre el **contenido** de las reglas, no sobre su calendario.

Y `E8` caza la forma **literal**. `if (gate !== undefined)` o `if (gate?.length)` expresan lo mismo
y no caen. Ampliar la lista de formas es perseguir el idioma —lo que `SUITE-R44` ya decidió no
hacer— y el sinónimo que falte no se ve hasta que algo se ha perdido.

Se detecta **una** forma de **una** familia. Decirlo es el trabajo; decir «los choques ya se
detectan» habría sido el verde por omisión que el marco entero persigue.

## Lo que hizo `EXIGIBLE_DESDE` distinta de una tabla de números

La fase viaja **al lado** de la compuerta, y `E7` comprueba la **relación**, no el valor: la
compuerta declarada tiene que ser la primera **posterior** a la fase del artefacto. Si alguien
pone `manifest.json` en `G1` «porque sí», el caso cae aunque la tabla sea internamente coherente.

Sin eso, `EXIGIBLE_DESDE` sería tres pares que hay que creerse — exactamente lo que `SUITE-R38`
pide evitar cuando un hecho crítico vive en un solo sitio: vive solo, pero con su contrato.

## El arnés se cazó a sí mismo, dos veces

El caso derivado se escribió mal dos veces seguidas:

1. `import { … } from process.env.MTH_PATRONES` — el especificador de un `import` estático no
   puede ser una expresión.
2. La ruta traducida a URL con `sed` desde bash: en Git-Bash quedaba `file:///`, que no es
   absoluta.

Las dos veces `revento()` marcó el caso en **rojo** en vez de dejarlo pasar por verde. Esa función
existe porque una herramienta que revienta no imprime el patrón que se le busca y `chkno` la daba
por buena — y aquí funcionó sobre el caso que la estaba estrenando.

Traducir rutas a mano entre dos mundos es de las cosas que **solo se ven ejecutando**. La versión
final deja que `node` lo haga con `pathToFileURL`.

## Encontrado de paso

Había **dos** casos con el nombre «la compuerta se DERIVA de la fase» —el de `tracker` y el nuevo—.
Dos casos con el mismo nombre hacen **ambiguo un rojo**: la salida dice qué falló y no cuál.
Renombrado.

## Lo que no resuelve

Que la ruta rota fuera la ruta indocumentada. `--gate G1`, `G2` y `G3` llevaban rotas desde que
existe el parámetro porque **nadie las usaba**, y nadie las usaba porque la cabecera solo enseñaba
`--gate G4`. Ahora están documentadas y funcionan, pero la lección general —**lo que no se
documenta no se usa, y lo que no se usa se pudre en silencio**— no tiene comprobación y no la
va a tener.

`AC` sin cubrir: ninguno. Contradicciones con otras reglas: ninguna. Nada queda aplazado: los tres
choques se arreglan aquí.
