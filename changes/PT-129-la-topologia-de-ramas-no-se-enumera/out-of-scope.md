# Fuera de alcance — `PT-129`

> `SUITE-R44` · La **última columna** es el destino, y es vocabulario cerrado: `—` si no aplaza
> nada, o la cita de quien lo sostiene. Sin eso, aplazar es narrar.

| Qué queda fuera | Por qué | Dónde va |
|:---|:---|:---|
| Borrar `origin/desarrollo` y la efímera de `PT-081` | `SUITE-R06f`: borrar una rama remota no se automatiza. La comprobación las **nombra** y describe el comando (`EXEC-R07`) | — |
| Renombrar las dos ramas de tarea ya creadas | `FDGE-R19` ya lo declara: una rama se termina como empezó, porque renombrarla rompe el pull request abierto sobre ella | — |
| Crear tags históricos para versiones anteriores a `8.2.0` | Fecharlos hoy sería inventar cuándo se selló cada una. Se declaran ausentes | — |
| Regenerar la proyección `cauce/<usuario>` | `tracker proyectar` ya existe y la escribe. `AC-06` construye lo que dice **cuándo está vieja**, no la regenera | — |
| El comportamiento contra Azure | Se mide sobre GitHub, que es la plataforma declarada. No se inventa un adaptador contra ningún caso | — |
| Que `tracker asignar` acepte los cinco tipos que `LEXICON` declara | Es otro defecto, con su propia causa: la lista está escrita a mano en `tracker.mjs:2328` | PT-124 |
| El `type` de `PT-125` y `PT-126` en el registro | No se escribe a mano: el registro sólo lo escribe el comando | PT-124 |
| Que `verify-fdge` corra con acceso a la plataforma en CI | `TS-10` prueba que **sin** acceso sale `SIN EVALUAR`; que CI **tenga** acceso es otra tarea | PT-120 |
| Que el estado terminal de un lote llegue a la rama por defecto | Es el hueco del viaje de vuelta, y es lo que dejó las 17 de `EP-019` contando como deuda de sellado | PT-121 |

---

## La dependencia que hay que decir en voz alta

`PT-129` va **primera** del reparto por decisión del firmante, y `PT-124` va después. Eso deja
`AC-08` con su caso positivo comprobable —`ramaDeTarea` sin `type` devuelve `null`— y su
**consecuencia útil** —que `tracker rama PT-125` proponga el nombre bueno— pendiente de `PT-124`.

**No se altera el orden: se declara.** Cuando `PT-124` cierre, las dos recibirán su `type` con el
comando y el nombre de su rama saldrá bien sin tocar nada de esta tarea.
