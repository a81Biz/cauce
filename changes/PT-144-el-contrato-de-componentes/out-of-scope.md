# PT-144 · `out-of-scope.md` — `PHASE 4` Proposal

> Lo que **no** entra, y qué se hace en su lugar. Un contrato compartido es la clase de
> abstracción que crece sola: este archivo es el límite contra el que se contrasta.

## Heredado del intake y del lote

```
OUT: tocar verify-suite.mjs, comparar-marco.mjs, build-core.mjs o audit.mjs.
     Son PT-145, PT-146 y PT-147, cada una con su G1 heredada del lote.
OUT: declarar DICTAMEN ni ningun componente que no exista hoy.
     El contrato describe LO QUE HAY. Una entrada para un componente futuro AFIRMA
     que existe, y EP-023 esta abierta justamente para construirlo.
OUT: describir reglas o fases mas alla del RANGO que LEXICON 3 ya declara.
     Es el limite verificable de EP-022 3: si aparece la palabra «plugin» aplicada
     a una regla, el lote se salio.
OUT: la escala de severidad. Es PT-150, serializada detras de esta tarea.
```

## Añadido durante `PHASE 2` y `PHASE 3`

```
OUT: parsear LEXICON.md en tiempo de ejecucion.
     No es solo «fuera de alcance»: se RECHAZO en design.md 5 por RULE-02. Un parseo
     degradado devuelve lista vacia y todo pasa en verde.

OUT: anadir eventos.mjs y matriz.mjs al alcance del grafo.
     Se declaro en context.md 6: el grafo decia cubrir «bin, docs/methodology/tools»
     y contenia 17 de 19 archivos. Ninguna de las dos nombra componentes, asi que no
     afecta a EP-022. Corregir el alcance del grafo es otra decision.

OUT: escribir el apartado que falta en LEXICON 3 para FPGE.
     PHASE 3 5.1 lo midio: LEXICON declara el rango de cinco componentes y NO tiene
     apartado para FPGE. Es un hueco de la metodologia, no de esta tarea. El contrato
     lo lleva como SIN_EVALUAR y lo DICE. Escribirlo aqui seria inventar un dato de
     LEXICON desde una herramienta, que es la direccion prohibida (LEX-R21).

OUT: corregir que FPGE y FIDE no tengan auditadas sus fases.
     Es el hallazgo que PT-147 destapa. Que aparezcan es su objetivo; que salgan bien
     no lo es.

OUT: unificar el vocabulario de audit.mjs entre nombre y sigla.
     design.md 3 lo describe: audit usa siglas como clave salvo para Foundation. El
     contrato lo separa y cada consumidor pide lo que necesita. Cambiar las claves de
     audit seria un cambio de comportamiento, y esta tarea declara no tener ninguno.
```

## Lo que se pensó y **no** se declara fuera de alcance

Que quede escrito para no volver a discutirlo:

- **`verify-patrones` no comprueba `ESTADOS_TERMINALES` ni las demás constantes con contrato.**
  Es cierto y salió en `context.md` §4. No entra aquí porque `AC-03` pide comprobar **el contrato
  nuevo**, no auditar los viejos. Pero **es un candidato real** —cinco constantes canónicas sin
  aserción propia— y el lote lo deja mejor documentado que como lo encontró.

- **Los catorce sitios podrían ser más.** El conteo ya subió de trece a catorce durante `PHASE 1`.
  `EP-022` §7 declara el supuesto y su consecuencia: si aparece un decimoquinto durante la
  ejecución, `FDGE-R41` detiene el lote entero. No es out-of-scope: es una condición de parada.
