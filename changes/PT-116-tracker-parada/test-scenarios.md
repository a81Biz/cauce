# `PT-116` — Escenarios de test   `PHASE 4`

| TS | Escenario | Espera | Inversa que lo tumba |
|:---|:---|:---|:---|
| `TS-01` | El cuerpo lleva `MARCA_AGENTE`, motivo y desenlace | los tres | sin marca ⇒ `SUITE-R43` lo cuenta como humano |
| `TS-02` | `--texto` con contenido en vez de ruta ⇒ se rechaza | error claro | aceptarlo ⇒ `SUITE-R59`, y cinco roturas esta sesión |
| `TS-03` | Sin plataforma ⇒ `TRANSICIONES.log` | escribe | exigir issue ⇒ rompe `SUITE-R22` (`PT-084`) |
| `TS-04` | El cuerpo **no** casa `RE_NOTA` | `false` | casar ⇒ infla el recuento de `FDGE-R52` |
| `TS-05` | Un reanclaje **sí** casa `RE_NOTA` | `true` | sin esto, `TS-04` pasaría con el patrón roto |
| `TS-06` | Motivo fuera de la lista ⇒ rechazo enumerando | error | aceptar ⇒ la clase se vuelve prosa y `PT-119` no cuenta nada |
| `TS-07` | Desenlace fuera de la lista ⇒ rechazo | error | igual |
| `TS-08` | `abre` sin `--abre`, o con un ID que no existe ⇒ rechazo | error | aceptar ⇒ «abre trabajo» sin contraste |
| `TS-09` | El valor de un flag **no** se toma por raíz | no dice «REGISTRY.json legible» | tomarlo ⇒ instancia nueve |
| `TS-10` | Una ruta de verdad **sí** es la raíz | la usa | sin esto, `TS-09` pasaría ignorando todo posicional |

## Las dos inversas que decidan

`TS-05` y `TS-10`. Sin ellas, `TS-04` y `TS-09` pasarían **por el motivo contrario**: un patrón
roto que no casa nada, y una guarda que ignora todos los posicionales.
