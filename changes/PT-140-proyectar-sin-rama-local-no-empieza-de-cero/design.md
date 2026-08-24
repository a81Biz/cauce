# Diseño — `PT-140`   `PHASE 4`

## Las tres respuestas

| Local | Remoto | Qué hace |
|:---|:---|:---|
| falta | **está** | `✗ SUITE-R31` · dice `git branch <rama> origin/<rama>` |
| falta | no está | la **crea**, y dice «es la primera proyección» |
| falta | **no evaluable** | `✗ SUITE-R31` · dice cómo comprobarlo |
| está | — | igual que siempre |

## `null` no es `false`

`git ls-remote` puede fallar por red, por credenciales o porque no hay remoto. Tratar ese `null`
como «no existe» convertiría un fallo de acceso en permiso para descartar historia. Es `RULE-06` y
es la mitad del diseño.

## Por qué **no** trae la rama

Un `fetch` dentro de un comando que escribe es un efecto colateral. `EXEC-R07` dice que lo que no
se automatiza se **describe**, y aquí el comando cabe en una línea.

## Por qué decir «es la primera vez»

Crear el linaje es correcto cuando de verdad no existe en ninguna parte. Lo que no puede es ser
**indistinguible** del caso malo: el mensaje es la única diferencia observable, y por eso existe.
