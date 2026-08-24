# `PT-123` — Estrategia   `PHASE 3`

## Lo que se deriva y lo que no

`D-5` deja la pregunta: **¿todo `BACKLOG.md` es derivable?** No.

```
DERIVABLE del registro          la implementacion abierta, sus tareas, su orden,
                                estado, fase, issue · y los aplazados con su motivo
NO DERIVABLE                    el PORQUE del orden —«PT-088 va antes que PT-087
                                porque sus tres comprobaciones son el banco de
                                pruebas del mecanismo»— y el analisis de solapamiento
```

**El porqué es lo más valioso que tiene el archivo** y no sale de ningún campo. Es la misma
frontera que `LEX-R26` traza en `CHECKPOINT.json` —«un campo que sólo pueda rellenar la memoria no
entra»— y que `HANDOFF.md` traza entre lo derivado y `decisiones`/`no hacer`.

## Los tres caminos

```
A  generar el archivo entero        -> borra la prosa en cada corrida
B  dejarlo a mano y quitar la regla -> vuelve a divergir; solo hace falta tiempo
C  generar el BLOQUE derivable y CONSERVAR la prosa   <- ELEGIDO
```

### `A` — generarlo entero

**Descartado.** Borraría el porqué del orden en cada corrida. El archivo perdería justo lo que lo
hace útil, y la primera persona que lo notara volvería a escribirlo a mano.

### `B` — declararlo manual

**Descartado.** Su propia cabecera dice qué pasa: ocho lotes de retraso la primera vez, cuatro
ahora. No es disciplina: es que un acto sin consecuencia inmediata se salta (`PT-053`).

### `C` — el bloque derivado entre marcas, la prosa intacta — **ELEGIDO**

El mismo patrón que `HANDOFF.md` ya usa con `<!-- ESTADO -->`: **una región delimitada que la
herramienta reescribe entera, y todo lo de fuera no se toca.**

```
<!-- BACKLOG:DERIVADO -->     la implementacion abierta, su tabla, y los aplazados
<!-- /BACKLOG:DERIVADO -->
   ... y aqui abajo la prosa: el porque del orden, el solapamiento razonado
```

**Y así `DoR-E7` se cumple sin excepción**: el solapamiento **calculado** lo escribe la
herramienta —qué pares comparten archivo, derivado de `tasks.md`— y el **razonado** lo escribe
quien reparte, fuera de la marca.

## Los tres movimientos

| # | Qué | Dónde |
|:--|:---|:---|
| `E-1` | `BACKLOG.md` recibe las marcas y `tracker indices` reescribe **sólo** lo de dentro | `tools/tracker.mjs` · `BACKLOG.md` |
| `E-2` | El bloque deriva: lote abierto, sus tareas en orden con estado/fase/issue, y los `DEFERRED` con su motivo | `tools/tracker.mjs` |
| `E-3` | `verify-fdge` avisa cuando el bloque declara una implementación que el registro no tiene abierta | `tools/verify-fdge.mjs` |

**`E-3` es lo que impide que vuelva a pasar.** Sin ella, el generador existe y **nada lo echa de
menos** — que es exactamente la clase que este lote persigue, y la razón por la que `BACKLOG.md`
llegó a ocho lotes de retraso teniendo escrito que era derivable.

## Lo que NO se hace

- **No se regenera el histórico de lotes cerrados.** El bloque describe **lo abierto**.
- **No se toca la prosa existente.** Queda fuera de la marca, intacta.
- **No se borra la cabecera** que registra los ocho lotes: es la evidencia de por qué esto existe.
