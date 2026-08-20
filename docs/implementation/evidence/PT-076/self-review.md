# PT-076 — Autorrevisión   `PHASE 6`

## Qué se arregló

`selftest.sh` invocaba `tracker sesion abrir` y `tracker sesion cerrar` **contra el repositorio
real** a través de `TRR()`. Cada pasada completa pisaba `SESSION-<persona>.json` y apilaba nueve
entradas en `SESSION_LOG.md`, que es append-only.

**140 entradas acumuladas.** Catorce aperturas sobre `258be16` no son catorce sesiones: son
catorce pasadas de la batería.

`TRR` **no sobra**. `coste`, `viabilidad` y `personas` necesitan el historial real: sobre el
fixture medirían cuatro tareas de mentira. Lo que sobraba era **escribir**. Y `asignar` ya
demostraba el patrón seguro con `--ver` — alguien vio que asignar contra el registro real
quemaría identificadores. Nadie hizo lo mismo con `sesion`.

## Por qué esto era lo primero de la cadena

No es ruido en un log. Es la base de cálculo de tres cosas encadenadas:

```
SESSION-<persona>.json
   └── tracker sesion       lo que la sesion lleva movido
   └── tracker viabilidad   el «mayor hecho» -> SAFE | MARGINAL | UNSAFE
          └── FDGE-R54      que REGISTRA ese veredicto en el registro
```

`FDGE-R54` la creó `PT-075` unas horas antes. **La batería de pruebas corrompía el dato sobre el
que una compuerta recién creada decide.** Los quince veredictos de `EP-017` se registraron con
`medido_en: 258be16`, una sesión cerrada el día anterior.

## Dos guardas, y hacen falta las dos

**De resultado — `AC-01`.** Huella de los dos archivos antes y después de una pasada completa.
No se puede engañar: o cambian o no cambian.

**De forma — `AC-04`.** Deriva del código qué acciones escriben —las que llaman a
`writeFileSync`— y comprueba que ninguna se invoque por `TRR` con un disparador de escritura. No
es una lista a mano: una lista se queda corta en cuanto alguien añade una acción, que es
literalmente lo que `SUITE-R53` dice de la tabla del manual.

La inversa las demuestra a la vez. Devolviendo **un solo caso** a `TRR`:

```
✗ ninguna accion que escriba va por TRR      <- la guarda de forma CAE
a5518790… → a4a7817a…                        <- la huella CAMBIA
```

Probarlo volvió a pisar la marca una vez más. Es la ironía de este defecto: demostrarlo cuesta
cometerlo.

## El límite de la guarda de forma, declarado

Tres disparadores se nombran **a mano** y con su motivo: `abrir`, `cerrar` y `--registrar`. Una
acción que puede escribir no escribe siempre —`sesion` sólo con sus dos subcomandos,
`viabilidad` sólo con `--registrar`, `asignar` no escribe con `--ver`—, y derivarlos exigiría
entender en qué rama de cada función cae el `writeFileSync`.

Una heurística que se equivoque ahí haría **fallar casos correctos**, que es peor que no tenerla
(`PT-023`: 75 % de falsos positivos, cuatro causas, ninguna afinable). Si alguien añade un
disparador nuevo a esas tres, esta guarda no lo verá — y por eso existe `AC-01`, que sí.

## Las 140, declaradas y no borradas

`SUITE-R09` hace el ledger append-only. Limpiarlo destruiría la prueba de que ocurrió. Se añade
una nota que dice qué son, cuántas y desde cuándo, para que quien lea el historial no cuente una
sesión por entrada.

Es el criterio de `PT-046` con una entrada mal formada de `HISTORY.log`: la original no se toca,
se añade la corrección.

## Dos errores míos, los dos de colocación

**1 · El bloque de casos corría antes de existir la función que usan.** Lo puse en la línea 2170
y `TRR()` se define en la 2598. Dos casos fallaban por eso, no por el arreglo. Lo dijo la
ejecución.

**2 · La guarda de forma era demasiado gruesa.** Marcaba `viabilidad` y `sesion` como inseguras
por poder escribir, sin mirar si la invocación llevaba el disparador. Habría fallado contra
trabajo correcto — el fallo que `AC-06` de `PT-075` prohíbe y que ya cometí allí.

Los dos son la misma clase: escribir la comprobación sin ejecutarla contra el caso real primero.

## Delta real contra lo planificado

| | Planificado | Real |
|:---|:---|:---|
| Casos movidos | 9 | 9 |
| Casos nuevos | 2 | **8** — al mover los bloques hubo que reconstruir los que leían `$RAIZ_REAL` directamente |
| Archivos | 2 | 2 |

`AC-01`..`AC-05`, los cinco verificados.
