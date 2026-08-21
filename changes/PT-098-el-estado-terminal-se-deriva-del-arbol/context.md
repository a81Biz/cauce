# Context — `PT-098`

## 1. Qué se leyó

| Fuente | Para qué | Estado |
|:---|:---|:---|
| `INC-011` y `INC-009` de la calculadora | la medición independiente | 2026-08-21 |
| `LEXICON` §5.1 | qué significa `INTEGRATED` | *«mergeado a la línea principal»* |
| `tools/tracker.mjs` · `avanzar` | quién escribe el estado | `:2437` — sin mirar nada |
| `tools/verify-fdge.mjs` | quién se exime de lo terminal | **cinco** sitios |
| `tools/patrones.mjs` · `ESTADOS_TERMINALES` | el conjunto | 5 estados, 22 usos |
| `tools/tracker.mjs` · `refDurableDe` | el mecanismo de contraste | lo construyó `PT-096` |
| `SUITE-R46` · `FDGE-R34` | el borde vecino | miran lo mismo del otro lado |

## 2. Lo medido, y es lo que hace viable el arreglo

```
allocations                    116
  terminales                   113
  INTEGRATED                    91

de las 91 INTEGRATED:
  con rama declarada            33     <- lo que parecia el unico camino
  SIN rama declarada            58     <- por lo que parecia inviable

contrastadas por su directorio en «main»:
  su changes/ ESTA en main      91     <- 91 de 91, y todas CIERTAS
  solo en «trabajo»              0
  sin directorio                 0
```

**El contraste no necesita la rama.** `refDurableDe` pregunta a git si `changes/<ID>-<slug>/` está
en un ref, y eso funciona para las 91 — incluidas las 58 sin rama.

## 3. Los cinco sitios que la exención apaga

```
verify-fdge.mjs
:1368   SUITE-R08 · la fase declarada
:1388   FDGE-R54 · el veredicto de viabilidad
:1432   la rama declarada sigue viva
:1466   fase >= 9
:1559   fase >= 5 sin rama
:1591   FDGE-R52 · las notas de reanclaje
```

Seis, no cinco — `INC-011` contó las que alcanzaban a **sus** dos tareas. Aquí se cuentan las que
existen.

## 4. Confianzas — `FDGE-R09`

```
RootCause     97%   el codigo esta citado por linea y el efecto lo midio OTRO proyecto de
                    forma independiente. -3 porque «INC-011» declara que hay mas usos de
                    ESTADOS_TERMINALES sin medir, y no los he contado uno a uno.

Architecture  92%   una comprobacion, una guarda y su bateria. El mecanismo de contraste ya
                    existe y no hay que inventarlo. -8 porque «avanzar» es el comando mas
                    delicado del marco: hace CINCO actos atomicos y una guarda mal puesta
                    los rompe.

Solution      88%   -12 por una decision que no es derivable: si «avanzar» debe NEGARSE o
                    AVISAR cuando el arbol no sostiene el estado. Ver §5.
```

Los tres por encima de `70%`: no procede `INVESTIGATION`.

## 5. Lo que hay que decidir en `PHASE 3`

**¿`avanzar` se niega, o avisa?**

```
(a) se NIEGA   -> impide el falso terminal por construccion. Pero bloquea el flujo normal:
                  el estado terminal se apunta ANTES del merge, y SUITE-R46 lo EXIGE asi
(b) AVISA      -> no rompe nada y deja el falso terminal ocurrir
```

**`(a)` tal cual es incorrecta y hay que decirlo**: `SUITE-R46` obliga a apuntar el estado
terminal **antes** de mergear —*«el orden es: apuntar el estado terminal en la rama de trabajo,
mergear, y cerrar después»*—. Negarse haría imposible el orden que otra regla exige.

La salida está en distinguir **`DONE`** de **`INTEGRATED`**: `DONE` es «terminado y esperando
`G4`»; `INTEGRATED` es «mergeado». `SUITE-R46` habla del primero. `PHASE 3` lo resuelve.

## 6. Lo que este contexto NO establece

- **Cuántos de los 22 usos de `ESTADOS_TERMINALES` dependen de este dato.** Seis en `verify-fdge`
  están contados; los de `tracker` y `patrones` no se han revisado uno a uno. `INC-011` lo declara
  sin medir y aquí tampoco se mide: se arregla el **dato**, no cada consumidor.
- **Que los 91 sigan ciertos mañana.** Se midieron hoy. El arreglo existe justamente para que esa
  pregunta tenga respuesta mecánica en vez de una medición manual.
