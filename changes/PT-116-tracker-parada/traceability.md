# Trazabilidad — `PT-116`

| AC | Criterio | Escenario de test | Test | Evidencia |
|:---|:---|:---|:---|:---|
| AC-01 | `tracker parada` publica la nota en el issue con `MARCA_AGENTE` | `TS-01` | `selftest.sh:la parada lleva la marca de procedencia` | `salidas/publicada.txt` |
| AC-02 | El texto largo entra por ARCHIVO, nunca por la línea de comandos | `TS-02` | `tracker parada --texto <texto>` | `salidas/negativas.txt` |
| AC-03 | Sin plataforma escribe en `TRANSICIONES.log`, append-only | `TS-03` | la rama sin `adaptador.comentar` | `salidas/negativas.txt` |
| AC-04 | La nota NO casa `RE_NOTA` | `TS-04` `TS-05` | `selftest.sh:la parada NO se confunde con un reanclaje` | `salidas/casos.txt` |
| AC-05 | Motivo o desenlace fuera de la lista cerrada se RECHAZA | `TS-06` `TS-07` | `selftest.sh:los motivos de la parada son seis` | `salidas/casos.txt` |
| AC-06 | Lo irreversible —publicar— va el ÚLTIMO | `TS-08` | las seis negativas antes de tocar la plataforma | `salidas/negativas.txt` |
| AC-07 | El valor de un flag NUNCA se toma por la raíz | `TS-09` `TS-10` | `selftest.sh:el valor de una bandera no es ROOT` | `salidas/casos.txt` |

**Siete criterios, siete con `TS`, siete con evidencia ejecutada.**

## La evidencia que decide

`salidas/publicada.txt` — la parada de `PT-116` en su propio issue `#234`, **escrita por el
comando**. Es la primera del repositorio que no se publica a mano; las siete anteriores fueron con
`gh issue comment`.

## `AC-07` salió probando el comando

Instancia **ocho** de «un argumento nuevo se cuela por la detección de `ROOT`». Las ocho se
arreglaron añadiendo el flag a una lista escrita a mano, y el comentario de `PT-057` decía **hace
cuatro instancias** que *«se arreglan con una regla de FORMA, no con un caso más»*.

Y su caso —`TS-09`— **también hubo que reescribirlo**: assertaba sobre el fuente (`CON_VALOR.has`),
así que se puso rojo cuando la implementación mejoró. Ahora asserta el comportamiento, con la
inversa `TS-10`: **una ruta de verdad sí debe tomarse por raíz**.
