# `PT-187` — Las versiones no cuadran entre CHANGELOG, tags y npm, y nada lo comprueba

```yaml
---
id: PT-187
type: BUG
severity: S2
epic: EP-026
track: STANDARD
status: READY
phase: 8
created: 2026-08-28
structural: no
suite_version: 13.4.0
---
```

## 1. Qué pasó   `[MEDIDO]`

Cuatro fuentes dicen qué versión es cauce, y **no coinciden**. Medido hoy:

| Fuente | Dice |
|:---|:---|
| `package.json` | `13.4.0` |
| tags de git | …`v13.2.0` `v13.3.0` `v13.4.0` |
| `CHANGELOG.md` | `13.4.0` `13.3.0` `13.2.0` |
| **npm** | **`13.1.0`** — tres versiones por detrás |

Y las divergencias históricas que el `HANDOFF` ya declaraba:

- `v9.0.0`, `v10.0.0` y `v5.2.0` **tienen tag y no están en npm**
- `4.13.0`, `5.0.0` y `5.1.0` **están en npm y no en el `CHANGELOG`**

**Nada de esto lo comprueba nadie.**

## 2. Por qué es un defecto   `[HUMANO]`

`SUITE-R19` obliga a la guía de migración; `SUITE-R06a` reserva el tag y la publicación al firmante.
Las dos reglas gobiernan **actos**, y ninguna gobierna la **coherencia** entre lo que los cuatro
sitios afirman.

La consecuencia: quien instala cauce desde npm recibe la `13.1.0` mientras el `CHANGELOG` del
repositorio describe la `13.4.0`. **La documentación de un paquete describe un paquete que no es el
que se descarga.**

Es la forma del lote: cuatro fuentes correctas por separado, y **nadie las contrasta**.

## 3. Cómo se arregla, y cómo NO

**No** publicando para cuadrarlas: publicar es acto del firmante y está fuera de este lote (`§3` del
intake del lote).

**Sí** haciendo que la divergencia **se diga**, con su cifra y su dirección: qué hay en npm y no en
el `CHANGELOG`, qué tiene tag y no está publicado. Que decidir qué hacer siga siendo humano no
justifica que el dato no exista.

## 4. Lo que NO promete   `SUITE-R26`

**No promete que las cuatro coincidan**: es legítimo que un tag exista antes de publicar, y que una
versión publicada hace meses no tenga entrada retroactiva (`SUITE-R09`, append-only). Promete que la
diferencia sea **visible y contable**, no una sorpresa.

## 5. Criterios de aceptación

| | Criterio | Escenario |
|:---|:---|:---|
| `AC-01` | La divergencia entre las cuatro fuentes se **enumera**, con dirección | `TS-01` |
| `AC-02` | Sin acceso a npm, **se dice** — no se da por cuadrado (`RULE-06`) | `TS-02` |
| `AC-03` | Una diferencia legítima —tag sin publicar— **no** bloquea | `TS-03` |

`AC-02` importa porque `SUITE-R22` declara soportado el proyecto sin red, y una comprobación que
necesita npm no puede reventar ahí.

## Cómo termina   `FDGE-R53`

> Termina cuando: nadie tenga que consultar npm a mano para saber si lo publicado es lo que el
> repositorio dice que es.

## 6. Firma   `INTAKE-R06` · `SUITE-R27`

```
Firmado por lote: EP-026
Solicitado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
```

`INTAKE-R08` · La firma es la única del lote, resuelta el `2026-08-28`. `G3` sigue siendo humana
para todo `BUG` (`EXEC-R05`), y se pedirá con la evidencia delante.
