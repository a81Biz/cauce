# PT-063 — Autorrevisión   `PHASE 6`

## Lo entregado

```
FDGE-R19                   MODIFICADA · <type>/<usuario>/PT-NNN-slug
normalizaRef               compartido con cauce/<usuario> · una sola normalización
ramaDeTarea                pura · sin usuario, dos niveles como hoy
ramaLlevaUsuario           tres niveles con el ID al final
tracker rama PT-NNN        PROPONE · no crea
verify-fdge                AVISA, y dice desde cuándo
casos                      899 → 930
```

## El cambio es más pequeño de lo que el lote declaró

`PHASE 2` midió que **el formato de rama no se comprueba**: `FDGE-R19` lo fija y ninguna
herramienta lo parsea — `verify-fdge` mira que la rama **exista**, no cómo se llama.

```
22 ramas declaradas · todas de dos niveles · 0 comprobaciones que se rompan
```

Sigue siendo `MAJOR` —cambia el texto de una regla `HARD` y los proyectos instalados tienen que
enterarse— pero **la migración es leer**. El intake del lote lo llamó «el único que puede romper
compatibilidad», y medido eso es menos cierto de lo que parecía. Lo digo porque escribirlo al revés
habría sido más cómodo.

## La decisión difícil: avisar

Si nada comprobaba el formato, ¿se comprueba ahora?

| | |
|:---|:---|
| **Fallar** | Las 22 ramas existentes fallarían todas. Rompe `AC-04` |
| **Nada** | La regla sigue siendo un texto que nadie aplica — el defecto que `FDGE-R19` **documenta de sí misma** |
| **Avisar** | Se ve, no bloquea, las existentes valen |

Avisa. Y el aviso **dice desde cuándo** aplica: una rama de antes de `8.3.0` no es un
incumplimiento, es una rama de antes.

Lo que **no** hice: fallar «a partir de la próxima versión». Una comprobación que cambia de
severidad con el tiempo es una que nadie puede razonar — hoy pasa, mañana no, y el código es el
mismo.

## `AC-04`, demostrado por accidente

La rama de **esta misma tarea** es `chore/PT-063-…` — dos niveles, creada antes de que el formato
existiera. Y el aviso la señala:

```
✓ FDGE-R19  PT-063: rama «chore/PT-063-el-usuario-vive-en-la-rama-de-tarea» declarada.
! FDGE-R19  PT-063: la rama no lleva usuario. Desde 8.3.0 el formato es
            «<type>/<usuario>/PT-NNN-slug». Las ramas anteriores siguen valiendo.
```

No hay mejor demostración de `AC-04` que ésta: **la tarea que cambia el formato tiene una rama del
formato anterior, y el marco la deja terminar como empezó.**

## Lo que se comprobó que NO cambió

`AC-02` y `AC-03` son criterios sobre lo que **no** debe pasar, y son los que más fácil se dan por
buenos sin mirar. Hay casos para los dos: no existe `trabajo/<usuario>` en ninguna parte del marco,
y `G4` sigue siendo una por lote.

Y `E17` protege lo que la regla **sigue** diciendo: `FDGE-R19` habla de commits atómicos, sus
prefijos, los tres niveles, que el PR de tarea es revisión, que `G4` no se multiplica. Esta tarea
cambia **una** cosa. Un caso que solo mirase el formato nuevo pasaría aunque el resto se hubiera
perdido.

## Un `AC` a medias, y lo digo

`AC-06` tiene dos mitades: *«`FDGE-R19` dice el formato nuevo, y el `CHANGELOG` trae guía de
migración»*. La primera está hecha y comprobada. **La segunda no**: la guía se escribe al cerrar
`EP-016`, y es una de sus filas de cierre.

Lo marco como **no verificado** en el manifiesto en vez de darlo por bueno. Marcar la casilla aquí
sería exactamente lo que `SUITE-R45` existe para impedir.

## Lo que no queda comprobado

**Que dos personas trabajen sin pisarse.** El formato lo hace posible; que ocurra necesita dos
personas.

**Que alguien use `tracker rama`.** Propone; crear la rama sigue siendo un comando a mano, por
decisión de `PT-054` y `EXEC-R07`.

**Que el aviso se lea.** Hay uno vivo ahora mismo, señalando esta tarea.
