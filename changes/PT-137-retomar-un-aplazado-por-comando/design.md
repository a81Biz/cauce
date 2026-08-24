# Diseño — `PT-137`   `PHASE 4`

## `tracker retomar`

```
tracker retomar PT-NNN --firmante "Nombre" [--fecha YYYY-MM-DD] [--epica EP-NNN] [--aplicar]
```

| Paso | Qué hace | Si falla |
|:---|:---|:---|
| 1 | La allocation existe en el registro | error: `SUITE-R08`, el registro asigna |
| 2 | Su estado es `DEFERRED` | error que **dice el estado que encontró** |
| 3 | El firmante está en `firmantes:` de `CLAUDE.md` | error: `SUITE-R27` |
| 4 | Si hay `--epica`, el lote existe y está **vivo** | error: reasignar a un lote cerrado devuelve al limbo |
| 5 | Escribe `status: DRAFT`, `phase: 1`, `retomada: {por, fecha, de}` | — |
| 6 | Publica en el issue, o en `TRANSICIONES.log` si no hay plataforma | consta, no revienta |

**Sin `--aplicar` no escribe nada** y enseña la transición, como el resto de acciones que tocan
el registro.

## Por qué `DRAFT` y `PHASE 1`, y no `READY`

Retomar devuelve la tarea **al principio**, no a donde estaba: un aplazado no tiene intake, y
`READY` significa «`G1` resuelta sobre un alcance escrito». Devolverla a `READY` afirmaría una
firma que nadie dio. `DRAFT`/`PHASE 1` es literalmente cierto: hay que escribir su intake.

## El campo `retomada`, y por qué no basta con cambiar el estado

```json
"retomada": { "por": "Alberto Martínez", "fecha": "2026-08-24", "de": "DEFERRED" }
```

Sin él, una allocation retomada es **indistinguible** de una que nunca se aplazó: el estado
`DRAFT` no recuerda de dónde viene. `SUITE-R44` existe porque algo aplazado se perdió; perder el
rastro de lo **des**aplazado sería el mismo defecto con el signo cambiado.

## `--epica`, y por qué no es un extra

`PT-134` está aplazada con `epic: EP-020`, que está `CLOSED`. Retomarla sin moverla la deja viva
bajo un lote que ya no responde de nada: vuelve al limbo por otra puerta. Reasignar la épica
**es parte de retomar**, no un comando aparte.

Se exige que el lote destino esté **vivo**, contrastado contra el registro. Reasignar a otro
lote cerrado sería el mismo agujero.

## `retomar` NO escribe el intake

Devuelve la tarea a `PHASE 1`. Escribir el intake **es** `PHASE 1` y lo hace una persona o un
agente recorriendo la fase, no un comando de estado. Un comando que generase el intake
produciría el artefacto que `G1` tiene que juzgar, que es lo que `FDGE-R25` prohíbe en su
espíritu.

## `SIN_PLATAFORMA`

`retomar` entra en el conjunto: no necesita tablero para escribir el registro, y `PT-133` ya
demostró qué pasa cuando una acción que no lo necesita lo exige.
