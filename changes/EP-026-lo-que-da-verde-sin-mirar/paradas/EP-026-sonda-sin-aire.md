# Parada de `EP-026` · la sonda no distingue «sin credencial» de «credencial sin aire»

**Motivo:** `hallazgo` · **Desenlace:** `declara` · **Fecha:** 2026-08-31

## Qué paró

El **tercer viaje** por `G4`, el que `SUITE-R46` impone para cerrar el issue del lote. `CI` rojo en
`main` y en el `PR #391`, los dos en el mismo paso:

```
Plataforma github declarada y sin acceso desde aquí.
  → gh auth login

La credencial se comprueba ANTES de necesitarla (FND-R30): descubrirlo a mitad de sesión
es perder la sesión. Esto no es «el espejo no cuadra» — es que nadie pudo mirar.
```

## Lo que se midió, antes de suponer   `RULE-06`

| Hecho | Valor |
|:---|:---|
| Estado de GitHub | `All Systems Operational` (`githubstatus.com`, 06:28 UTC) |
| Mi token local | `core 5000/5000` — el espejo **cuadra** desde aquí |
| Workflow y `env` | **idénticos** a los del run que pasó a las 06:51 |
| Primer rojo | **06:58**, en `main`, tras el merge de `#390` |
| Qué ocurrió a las ~06:56 | `tracker cerrar` (17 issues) + `tracker cierre` (17 comentarios) |

El paso muere **antes de leer nada**: `gh auth status` devuelve error, la sonda responde `false`
y `decidirSalida` sale con `3`. Lo que se quedó sin aire no es mi credencial sino el
`GITHUB_TOKEN` **del repositorio**, por límite **secundario** de creación de contenido — 34
escrituras en dos minutos.

## El defecto: el mensaje da el consejo equivocado

`decidirSalida` ([`tracker.mjs:1177`](../../../docs/methodology/tools/tracker.mjs)) tiene **una**
casilla para dos causas con arreglos opuestos:

| Causa real | Qué hay que hacer | Qué dice el mensaje |
|:---|:---|:---|
| No hay credencial | `gh auth login` | `gh auth login` ✓ |
| La credencial existe y está **sin aire** | **esperar** | `gh auth login` ✗ |

En `CI` nadie puede «hacer login», así que el consejo no es sólo inútil: manda a buscar el fallo
donde no está. Es la misma forma que `PT-204` corrigió en `audit` — `PENDIENTE` fundía `DEUDA`
con `SIN_JUZGAR`, dos hechos con arreglos distintos bajo un número— y que `decidirSalida`
**ya resolvió una vez** para separar el `2` del `3`. Su propio comentario lo dice:

> «`2` y `3` estaban fundidos en `2` y son decisiones OPUESTAS: una es una elección del proyecto,
> la otra una precondición incumplida.»

Falta partir el `3` por la misma razón por la que se partió el `2`. Es `RULE-02`, y es `RULE-07`:
un diagnóstico que no dice cómo se arregla no ha diagnosticado.

## Lo que hay que proponer

1. **Que la sonda devuelva por qué**, no sólo sí/no: sin credencial, credencial inválida, o
   credencial válida sin cuota. `gh auth status` ya distingue los tres en su salida —
   la sonda la descarta con `stdio: 'pipe'`.
2. **Un código de salida propio para «sin cuota»**, porque la decisión es otra: no es una
   precondición incumplida que alguien deba resolver, es un **esperar y reintentar**.
3. **Que el marco no se dispare a sí mismo.** El cierre de un lote hace ~34 escrituras seguidas
   contra la API y **después** pide `CI` verde, que necesita esa misma API. El protocolo de cierre
   compite consigo mismo por la cuota, y nada lo dice.

## De quién es

**Dueño: el firmante.** No lo arreglo aquí y el motivo es de fondo, no de prisa: `EP-026` está
`CLOSED` y sus 17 tareas `INTEGRATED`. Meter una corrección de herramienta en un lote cerrado
haría exactamente lo que este marco existe para impedir — trabajo sin intake, sin `G1` y sin
tarea que lo reclame.

Cabe en `EP-028` (el lote del coste de verificación, ya declarado por `PT-204`) o en uno propio.
La elección es del firmante.

**Revisión: `2026-09-07`.** `FDGE-R55` no admite un hallazgo declarado sin fecha ni dueño —«sin
eso queda suelto, y es lo que dejó siete paradas de `EP-022` huérfanas»—. El momento natural es
**cuando abra `EP-028`**; la fecha es el tope, no la cita.

## Lo que NO promete   `SUITE-R26`

No promete que el límite secundario deje de existir: es de la plataforma y no se negocia. Lo que
se persigue es que **cuando ocurra, el mensaje diga lo que pasa** — y que el protocolo de cierre
no lo provoque sin avisar.
