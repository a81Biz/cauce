# `PT-129` — Fuera de alcance   `PHASE 4`

> Destino de vocabulario cerrado (`PT-018`): `—` si no va a ningún sitio, o la cita del `PT`/`EP`
> que lo recoge. La cita es **recíproca**.

| Qué queda fuera | Destino | Por qué |
|:---|:---|:---|
| Borrar `origin/desarrollo` y la efímera de `PT-081` | — · **acción humana descrita** | `SUITE-R06f`: borrar una rama remota no se automatiza. La comprobación las **nombra** y describe el comando |
| Renombrar las dos ramas de tarea ya creadas | — | `FDGE-R19` ya lo declara: una rama se termina como empezó, porque renombrarla rompe el pull request abierto sobre ella |
| Crear tags históricos para versiones anteriores a `8.2.0` | — | Fecharlos hoy sería inventar cuándo se selló cada una. Se declaran ausentes |
| Que `tracker asignar` acepte los cinco tipos de `LEXICON` | `PT-124` | Es su defecto, y `PT-129` **depende** de que cierre: mientras `PT-125` y `PT-126` no tengan `type`, `AC-08` sólo se puede probar sobre ellas como caso negativo |
| El `type` de `PT-125` y `PT-126` en el registro | `PT-124` | No se escribe a mano: el registro sólo lo escribe el comando (`PT-103`, `PT-107`) |
| Que `verify-fdge` corra con acceso a la plataforma en CI | `PT-120` | `TS-10` prueba que sin acceso sale `SIN EVALUAR`; que CI **tenga** acceso es otra tarea |
| Regenerar la proyección `cauce/<usuario>` | — | `tracker proyectar` ya existe. `AC-06` construye lo que dice **cuándo está vieja**, no la regenera |
| El comportamiento contra Azure | `PT-025` | `DEFERRED` desde `EP-004`. Se mide sobre GitHub, la plataforma declarada |

---

## La dependencia que hay que decir en voz alta

**`PT-129` va primera del reparto por decisión del firmante, y `PT-124` va tercera.** Eso deja
`AC-08` con su caso positivo —`ramaDeTarea` sin `type` devuelve `null`— comprobable, y su
**consecuencia útil** —que `tracker rama PT-125` proponga el nombre correcto— **pendiente de
`PT-124`**.

No se altera el orden: se declara. Cuando `PT-124` cierre, `PT-125` y `PT-126` recibirán su `type`
con el comando y el nombre de su rama saldrá bien sin tocar nada de esta tarea.
