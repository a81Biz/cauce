# PT-076 — Estrategia   `PHASE 3`

## Opciones

| # | Opción | Por qué no / por qué sí |
|:--|:---|:---|
| A | Eliminar `TRR` y montar todo en el fixture | **No.** `coste`, `viabilidad` y `personas` miden el historial real; con cuatro tareas de mentira medirían nada. Es la razón por la que `TRR` existe |
| B | Mover los nueve casos de `sesion` a `TR` (el fixture) | **Sí, pero no basta.** Arregla los de hoy y deja el defecto abierto para el siguiente que añada uno |
| C | `--ver` en `sesion abrir`/`cerrar`, como ya tiene `asignar` | **No como único arreglo.** Añade una bandera que hay que acordarse de poner: el mismo olvido, un nivel más abajo |
| D | Que la **forma** sea detectable: derivar qué acciones escriben y fallar si se invocan por `TRR` | **Sí.** Es lo que impide la reincidencia |

**Elegidas: B y D.** `B` arregla lo que hay; `D` impide que vuelva.

## Cómo se deriva «qué acciones escriben»

No se mantiene a mano —una lista escrita a mano se queda corta en cuanto alguien añade una
acción, que es literalmente lo que `SUITE-R53` dice de la tabla del manual—. Se deriva del
código: una acción escribe si su función llama a `writeFileSync`.

```
para cada accion de «const acciones = { ... }» en tracker.mjs
    cuerpo = el texto de su funcion
    escribe = /writeFileSync/.test(cuerpo)
```

Y el caso del arnés compara ese conjunto con las acciones que aparecen invocadas por `TRR`. Si
alguien añade `TRR <accion que escribe>`, cae.

**Límite declarado:** es una heurística de texto, igual que la de `fallosPosibles` en
`regla.mjs`. Una acción que escriba indirectamente —llamando a otra que escribe— no la detecta.
Se declara en vez de fingir que la cubre; hoy ninguna lo hace.

## Las 140 entradas ya escritas

**No se borran.** `SUITE-R09` es append-only y el ledger es lo que se audita. Se **declara** lo
que son: una nota que diga desde cuándo y por qué, para que quien lea el historial no cuente
catorce sesiones donde hubo una.

Es el mismo criterio con el que `PT-046` trató una entrada mal formada de `HISTORY.log`: la
original no se toca, se añade la corrección.

## Alcance

```
docs/methodology/tools/selftest.sh    los nueve casos a TR · el caso de la forma
docs/implementation/SESSION_LOG.md    la nota que declara las 140
```

Ninguna regla nueva. Ninguna herramienta cambia de comportamiento: cambia **desde dónde se la
invoca al probarla**.
