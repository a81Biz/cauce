# PT-013 — Discovery   `PHASE 2` · análisis `2-B`

## Qué falla

Aplazar trabajo se escribe **en prosa**: una fila de `out-of-scope.md` con una columna «Dónde
va» que dice «decisión posterior» o «la implementación siguiente». Nada lo enumera, nada lo
recoge, y nada impide cerrar un lote dejándolo atrás.

## La evidencia es esta sesión

`EP-001` declaró en su out-of-scope: «la migración del proyecto legado — es la implementación
siguiente». Se abrieron `EP-002` y `EP-003` sin recogerla. **Cuatro versiones después seguía
sin hacerse**, y lo detectó una persona preguntando.

Estaba escrito en tres sitios —el out-of-scope, el `HANDOFF`, el `SESSION_LOG`— y ninguno era
**algo que alguien tuviera que mirar**.

## Lo que el marco ya tiene y no usa

```
LEXICON §5.1   | DEFERRED | Aparcado. Puede volver en una corrida futura. |
LEXICON §5.1   READY --> DEFERRED --> READY
```

**`DEFERRED` existe como estado del ciclo de vida y no se usa en ninguna parte.** Ni una
allocation, ni una comprobación. Está declarado y muerto.

## Por qué «enumerar» no basta — y lo dijo el humano

> «que se integre en un issue en github para retomarlo al final y que no se pierda»

Una lista hay que ir a mirarla; un issue abierto **está en el tablero**, con su fase y su
compuerta, y el espejo lo comprueba en cada verificación. `EP-001` no falló por falta de
apunte: falló porque el apunte no era algo que ninguna compuerta tocara.

## El riesgo de hacerlo mal

Un issue **sin allocation** lo denuncia el propio espejo como huérfano (`SUITE-R35`), y crear
identificadores fuera del registro rompe `SUITE-R08`. Así que lo aplazado tiene que ser una
**asignación de verdad** —con su ID, su estado `DEFERRED` y su issue— y no un post-it en
GitHub.

Y una asignación `DEFERRED` **no puede verificarse como un PT normal**: no tiene intake, ni
`traceability`, ni ha recorrido fases. Exigírselo la convertiría en un rojo permanente, que es
la patología que este repositorio lleva toda la sesión cazando.

## Conclusión

Defecto confirmado, con la evidencia dentro de esta misma sesión. La corrección tiene tres
piezas: **`DEFERRED` se vuelve usable**, lo aplazado se **asigna** en vez de narrarse, y
**cerrar un lote con algo aplazado sin recoger no pasa la compuerta**.

Confianzas: RootCause 100 % · Architecture 85 % · Solution 80 %.
