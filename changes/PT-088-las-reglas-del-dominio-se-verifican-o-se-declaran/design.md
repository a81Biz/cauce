# PT-088 — Diseño   `PHASE 4`

## Dónde vive cada pieza

```
patrones.mjs                lineasPerdidas(archivos, diffDe)          contrato puro
                            mergesSinConstancia(merges, constancias, firmantes)
                            RIGE_DESDE  SUITE-R09 y EXEC-R04 -> [11,0,0]

verify-fdge.mjs             rigeGlobal(id)          la version del REGISTRO, no la del PT
                            checkLedgers()          SUITE-R09
                            checkG4ConConstancia()  EXEC-R04

NO-VERIFICABLES.md          SUITE-R01, con motivo y firma

selftest.sh                 13 casos, seccion propia
```

Las dos funciones van a `patrones.mjs` **porque son puras y por tanto probables sin fixture**, y
porque es donde `verify-patrones` comprueba su contrato — 11 patrones, 52 comprobaciones.

---

## La decisión que casi se me escapa: `rigeGlobal`

`verify-fdge` ya tenía un `rige(id)`, y usarlo era lo obvio:

```js
const rige = (id) => rigeDesde(id, suiteDelPT);      // verify-fdge.mjs:1165
```

Está **dentro de `checkPT`** y usa la versión **del PT**, que es lo correcto para una comprobación
por tarea. `SUITE-R09` y `EXEC-R04` son **del repositorio**: no hay tarea de la que sacar versión.

Escribirlas con ese `rige` reventaba con `ReferenceError`, y **mi propio `grep` sobre la salida lo
escondió**:

```
$ node verify-fdge.mjs PT-088 2>&1 | grep -E "SUITE-R09|EXEC-R04|✗"
  if (!rige('SUITE-R09')) return;          <- la unica linea: el codigo fuente, no la salida
exit=0
```

**Filtrar antes de mirar es la versión de consola del patrón que `PT-087` cierra**: el `grep`
respondía «qué líneas casan» y yo leía «qué hizo la herramienta». Se ve ejecutando sin filtro.

La pieza es una línea:

```js
const rigeGlobal = (id) => rigeDesde(id, reg?.suite_version ?? '0.0.0');
```

---

## `SUITE-R09` · por qué la ventana es el tag

```js
const tag = (git(['tag','--list','v*','--sort=-v:refname']) ?? '').trim().split(/\s+/)[0];
if (!tag) { warn('SUITE-R09', 'sin ningún tag v*: no hay línea base…'); return; }
const fuera = lineasPerdidas(presentes, (f) => git(['diff', tag, 'HEAD', '--', f]));
```

| Ventana | Por qué no |
|:---|:---|
| `HEAD~1` | una reescritura de hace tres commits pasa **para siempre** |
| `origin/main` | es el error de `PT-081`: la comprobación se apaga el día que lo que busca aterriza allí |
| **el tag** ✅ | marca inmutable y deliberada, y `SUITE-R57` garantiza que el anterior no queda lejos |

**`git diff tag HEAD` compara commits, no el árbol de trabajo** — y eso hizo que mi primera
prueba inversa no disparara. No es un defecto: una reescritura sólo *cuenta* cuando se commitea.
La prueba se rehízo en una rama temporal con el borrado commiteado, y salió roja.

**`null` no es cero.** Sin repositorio, `diffDe` devuelve `null` y el archivo sale como
`SIN EVALUAR`, no como «ninguna línea borrada». Es la lección de `PT-058`, y sin ella un fallo de
`git` se leería como un ledger íntegro.

---

## `EXEC-R04` · por qué se empareja por fecha y no por sha

```js
const constancias = [...sesion.matchAll(RE_CONSTANCIA)]
  .flatMap((m) => lista.map((n) => ({ nombre: n, fecha: m[1] })));
```

**La constancia se escribe *antes* del merge** — es una autorización, no un acta. No puede citar
un sha que todavía no existe. Se empareja por día.

Lo que se pierde: dos merges el mismo día quedan cubiertos por una sola constancia. Es correcto —
una autorización cubre una sesión de trabajo, no un commit.

---

## Lo que ninguna de las dos establece, y va escrito **en el mensaje**

```
SUITE-R09  «Cuenta las lineas «-» del diff, asi que una modificacion cuenta. Lo que NO
            distingue es una correccion legitima de una falsificacion.»
EXEC-R04   «NO prueba que la autorizacion fuera real (SUITE-R27, H-009).»
```

**La primera frase decía otra cosa hasta que el arnés la corrigió.** Yo había escrito que una
alteración de igual recuento pasaba, y es falso: `git` representa una modificación como `-vieja`
más `+nueva`. **Declarar un límite sin medirlo** es exactamente el patrón que `PT-087` cierra, y lo
cometí describiendo la comprobación que lo combate.

Y hay **dos casos de la batería que asertan sobre esas frases**. Sin ellos, alguien las borraría
por ruidosas y el verde pasaría a decir más de lo que mide.

Es el banco de pruebas de `PT-087`: si su mecanismo no sabe expresar estas dos frases, está mal, y
se sabrá antes de imponerlo a 224 reglas.
