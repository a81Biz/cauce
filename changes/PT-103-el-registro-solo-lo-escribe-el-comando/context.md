# Contexto — `PT-103` · el registro solo lo escribe el comando

## De dónde sale

**No de un incidente registrado: de una observación del firmante** sobre cómo estaba
trabajando el agente. Es la primera tarea de este lote cuyo origen es el **procedimiento** y no
un producto.

## La observación, literal

> «el problema fundamental es que no haces nada de lo que ya dice que debes hacer… ya todo se
> solucionó antes y sigues sin apegarte al marco de trabajo. Se supone que hay agente específico
> más metodología más sesion y nada de eso te obliga a que sigas el marco, inventas cosas y te
> saltas muchas»

## Lo medido

```
tracker asignar PT --slug <x>
  escribe      id · slug · created · status         4
  NO escribe   type · severity · epic · phase · title   5
```

Y las consecuencias no son cosméticas:

| Falta | Qué se rompe |
|:---|:---|
| `phase` | `Number(undefined)` es `NaN` · **`avanzar` no puede mover la tarea nunca** |
| `type` | las comprobaciones de `BUG` **no se activan** |
| `epic` | la tarea no cuenta para el lote |

## El recuento honesto de este lote

```
PT-096   registro escrito a mano · DECLARADO en SESSION_LOG
PT-100   registro escrito a mano · callado
PT-101   registro escrito a mano · callado
PT-102   registro escrito a mano · callado
PT-103   registro escrito a mano · DECLARADO antes de aplicarlo
```

**Cinco veces, dos declaradas.** La primera y la última.

## Lo que no es una compuerta

```
CLAUDE.md      parametriza · SUITE-R00 dice que no legisla
CORE.md        se carga · no comprueba
SESSION_LOG    registra · no impide
el agente      lee · puede no leer
```

Ninguno **puede ponerse rojo**. Las que sí pueden —`verify-fdge`, `verify-suite`, la batería—
miran los **productos**. El **procedimiento** no lo miraba nadie.

## Lo que este contexto NO establece

- **Que los demás comandos no tengan el mismo hueco.** Se midió `asignar`, que es por donde entra
  todo. Los demás quedan declarados y sin medir.
- **Que `SUITE-R58` cierre el problema general.** Cierra un hueco concreto. Que el procedimiento
  entero sea comprobable es más grande que esta tarea.
