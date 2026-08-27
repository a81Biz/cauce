# `PT-161` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un **trigger sin caso** se caza, y se dice cuál | TS-01 · TS-02 | `selftest` ×2 · fixture | `evidence/PT-161/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | El catálogo real no tiene ninguno | TS-03..TS-06 | `audit` · los tres casos nuevos | `evidence/PT-161/salidas/audit.out` | n/a | `CUMPLIDO` |
| AC-03 | Lo que **no** es comprobable se declara | TS-07 | `chk` sobre el enunciado que `audit` publica | `evidence/PT-161/salidas/audit.out` | n/a | `CUMPLIDO` |

**`AC-01` encontró cuatro** en su primera corrida:

```
triggers declarados:     11
sin caso en el catálogo:  4   [CIERRA] · [IMPLEMENTACIÓN] · [FOUNDATION VALIDATED] · [START RECONCILE]
```

**Dos de ellos son el bucle por el que pasa todo el trabajo de `FDGE`** — abrir y cerrar una
implementación. La puerta más transitada del marco no estaba en el catálogo que se declara contrato
de cobertura.

Escritos como `E7`, `E8` y `E9` **leyendo qué hace cada trigger** —`FDGE-R50`, `FND-R15`, `PHASE 6`
de Foundation—, no inventándolo.

**`AC-03` es el que impide que esto prometa de más.** La promesa entera —«todo caso está aquí»— no
se puede verificar: nadie sabe qué casos **existen**. Se comprueba su parte derivable y **se dice
cuál no lo es**.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | `audit` sigue en verde sobre el árbol real | `EXIT=0` | `CUMPLIDO` |
| RC-02 | Los triggers se derivan del contrato, no de una lista | `triggers()` | `CUMPLIDO` |

**`RC-02` es lo que hace que un componente nuevo entre solo**: si mañana se declara `DICTAMEN`, su
trigger aparecerá en la comprobación sin tocarla — que es exactamente lo que falló en `EP-022`.

## Lo que esta tarea destapó, y **se cerró aquí**

`EXEC-R15` —renumerada en `PT-163`— **no la citaba ningún documento operativo**. Renumerar movió
las citas existentes, pero la regla **nunca había estado** en `PHASES` ni en los prompts. Citada en
las dos.
