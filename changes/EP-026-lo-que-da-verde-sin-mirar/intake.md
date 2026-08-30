# Intake — LOTE `EP-026` · lo que da verde sin mirar

> Plantilla: `INTAKE/templates/EPIC-INTAKE.md` (`INTAKE-R09`)

```yaml
---
id: EP-026
created: 2026-08-26
status: READY
mode: SUPERVISED
origin: DIRECT
depende_de: EP-025
---
```

## 1. Objetivo común   `[HUMANO]`

**Que ninguna comprobación de este marco diga «verde» sin haber mirado, ni «rojo» por algo que no
mide, y que cerrar un lote sea un procedimiento y no una lista de comandos que alguien recuerda.**

Las catorce tareas comparten una forma, no un archivo. En todas hay **información correcta, ya
calculada, que nadie exige** — o una comprobación que mide **un proxy** en lugar del hecho:

| | Lo que ya se sabía | Y nadie lo leía |
|:---|:---|:---|
| `PT-195` | `tracker personas` decía «`T <t@t>` · SIN DECLARAR» | Ninguna compuerta lo consultaba. Firmó **tres commits** de `EP-025` |
| `PT-200` | 189 de 198 `PT` están en estado terminal | `verify-fdge` los revisa **todos, cada vez** |
| `PT-199` | El esqueleto del acotado existe para callar errores | Deja **33 por corrida** |
| `PT-179` | La fase de la tarea consta | La compuerta concede sin mirarla |
| `PT-196` | El cierre de un lote está descrito | **Ninguna fase lo ejecuta** |

`EP-025` construyó el sello de la batería y demostró que la forma se puede cerrar: un bloque pasó de
certificarse **por una bandera** a certificarse **por un recibo**. Este lote aplica esa misma
disciplina a la mitad de la verificación que quedó fuera.

## 2. Criterio de éxito del lote   `[HUMANO]`

El lote cierra cuando, **medido y no afirmado**:

1. **`verify-fdge` acota como acota la batería.** Hoy: 198 `PT` por corrida, 9-14 min. El criterio
   no es un número de minutos —eso sería fijar el número de lo correcto (`-18`)— sino que **lo
   terminal no se re-verifique sin una razón declarada**, y que esa razón sea la que invalida su
   sello.
2. **La corrida acotada no escupe un solo error de andamiaje.** Hoy: 33.
3. **`SUITE-R01` dice dónde deja de valer.** Las comprobaciones que sólo pueden correr después de
   commitear o publicar están **declaradas como tales**, o avisan en vez de dar un verde que no
   predice nada.
4. **Cerrar un lote tiene fases, no memoria.** Lo que hoy ocurre después de `G4` —`integrar`,
   `cerrar`, `cierre`, `proyectar`, el tag, las ramas— pertenece a **alguien**, y el ciclo de dos
   viajes a `main` está resuelto o **declarado** con su motivo.
5. **Ninguna regla del marco se contradice con otra** en el camino de cierre. Hoy `SUITE-R45` exige
   en `G4` una respuesta que `SUITE-R06a` prohíbe tener antes del merge.

## 3. Qué NO entra en el lote   `[HUMANO]`   `OUT`

- **Publicar en npm.** Sigue reservado al firmante, y ninguna tarea de aquí lo toca.
- **Reescribir historia.** `SUITE-R06f`. Los commits firmados por `T <t@t>` se quedan como están.
- **Rebajar ninguna comprobación para que pase.** Si algo tarda, se **acota con criterio**; no se
  apaga.
- **La calculadora y el legado.** Tienen su rama y su firmante.

## 4. Firma única   `[HUMANO]` — obligatorio

```
Firmado por: Alberto Martínez
Fecha: 2026-08-28
He leído este Intake y confirmo que refleja mi intención: SÍ
G1 resuelto: 2026-08-28 · Alberto Martínez
```

`INTAKE-R08` · Cada `PT` conserva su intake completo con la línea `Firmado por lote: EP-026`.

### Constancia

El lote se levantó a petición explícita del firmante al cerrar `EP-025`:

> *«éste tipo de problemas suele ocurrir cada que se hace una épica completa, me parece que no está
> contemplado dentro del marco la forma de "terminar" la épica… necesitas terminar la épica y antes
> de pasar con la siguiente debemos crear una nueva con el protocolo completo de cierre»*

Y su alcance lo decidió él: se le ofreció abrir `EP-027` separando el tema de cierre del resto, y
eligió **mantener todo dentro de `EP-026`**.

## 5. PTs que componen el lote   `[AGENTE]`

| Orden | `PT` | Tipo | Sev | Qué cierra |
|---:|:---|:---|:---|:---|
| 1 | `PT-199` #361 | BUG | S2 | El esqueleto del acotado no cubre lo que el andamiaje toca — 33 errores por corrida |
| 2 | `PT-201` #363 | BUG | S2 | Hay comprobaciones que no pueden correr en local, y `SUITE-R01` no lo declara |
| 3 | `PT-179` #327 | BUG | *(sin declarar)* | `verify-fdge` concede sin mirar la fase |
| 4 | `PT-181` #329 | BUG | *(sin declarar)* | La expectativa de un caso se compara **como regex** — 257 de 1384 llevan metacaracteres |
| 5 | `PT-192` #349 | BUG | S2 | El final del arnés se mide por **posición** |
| 6 | `PT-200` #362 | BUG | S2 | `verify-fdge` no acota: 189 de 198 son terminales |
| 7 | `PT-196` #355 | BUG | S2 | **Lo posterior a `G4` no tiene dueño** |
| 8 | `PT-198` #357 | BUG | S3 | Un comentario en línea hace invisible `status:` |
| 9 | `PT-203` #365 | BUG | S3 | Citar un identificador en una fila lo convierte en miembro del lote |
| 10 | `PT-195` #353 | BUG | S2 | La identidad git del repositorio no se comprueba |
| 11 | `PT-194` #351 | BUG | S2 | `cauce:senuelos` exime el árbol y no la historia |
| 12 | `PT-202` #364 | BUG | S3 | `publicar.yml` viaja a donde no aplica |
| 13 | `PT-187` #342 | BUG | S2 | Las versiones no cuadran: npm va por la `13.1.0` y el repositorio por la `13.4.0` |
| 14 | `PT-197` #356 | FEATURE | S2 | **DICTAMEN**: el séptimo componente |

### De dónde salió cada una   `FDGE-R55`

Fuera de la tabla **a propósito**, y ése es `PT-203`: `verify-fdge` extrae los miembros del lote de
cualquier identificador que aparezca en una fila, así que citar un origen en una celda lo afiliaba
al lote. Se dice en prosa hasta que esa tarea lo arregle.

Nacen del cierre de `EP-025`: `PT-199`, `PT-200`, `PT-201`, `PT-202`, `PT-203` y `PT-196`.
De la ejecución de `PT-191`: `PT-192`, `PT-194` y `PT-195`.
De `EP-023`, aplazado: `PT-197` y `PT-198`.
De lotes anteriores: `PT-179` (de `PT-178`) y `PT-187` (de `PT-180`).
`PT-181` viene de `PT-178`, como sus tres hermanas: lo registró esta apertura leyendo el
`SESSION_LOG`, que enumera las cuatro en el mismo párrafo. **Ninguna allocation del repositorio
queda ya sin citar su parada.**

### El orden no es preferencia

- **`PT-199` y `PT-201` van primero** porque son las que hacen **legible** la propia corrida. Mientras
  la salida escupa 33 errores y el verde local no prediga la CI, cualquier medida que tomen las
  demás se toma sobre un instrumento sucio.
- **`PT-200` va después de `PT-192` y `PT-179`**: acotar lo que se verifica sólo es seguro cuando lo
  que se verifica **falla cuando debe**. Acotar primero sería acelerar una comprobación que
  todavía concede sin mirar.
- **`PT-196` va en la mitad, no al final**, porque las cinco que quedan detrás **se cerrarán con el
  protocolo que él defina** — y ése es su banco de pruebas, igual que `PT-088` lo fue en `EP-018`.
- **`PT-197` va última** y es la única `FEATURE`: construir el Dictamen sobre un marco cuya
  verificación aún miente sería auditar con una regla torcida.
- **`PT-203` va junto a `PT-198`** porque son la misma familia: una extracción frágil y un mensaje
  que presenta como hecho un fallo de lectura. Arreglar una sin mirar la otra dejaría media.

### El lote creció a DIECISÉIS, y se declara aquí   `2026-08-30`

Las catorce de arriba son las que `G1` admitió. **Dos más salieron de ejecutarlas**, y se añaden en
vez de aplazarse porque encajan en el criterio de éxito mejor que varias de las catorce — y porque
aplazarlas repetiría el fallo que las origina: decirlo en una épica más y que no le toque a nadie.

| Orden | `PT` | Tipo | Qué cierra | De dónde sale |
|---:|:---|:---|:---|:---|
| 15 | `PT-204` | INVESTIGATION | **124 de 244 reglas son `PENDIENTE` y 91 no tienen verificador** (82 `HARD`, entre ellas `EXEC-R05`). `audit` lo dice en cada `npm run verify` y no le pertenece a nadie | `paradas/PT-204.md` |
| 16 | `PT-205` | BUG | El estado **sólo** se sella avanzando de fase, así que cumplir `SUITE-R34` exige un acto fuera del comando (`CE-006`) | `paradas/PT-205.md` |

**`PT-204` no es auditar las 244.** El firmante lo descartó: *«regresar a revisar que esté es una
regresión demasiado grande»*. Es una `INVESTIGATION` cuyo entregable es **la decisión y su alcance**
—separar deuda de límite, rankear por consecuencia, y decidir si hace falta un lote propio—.

**`PT-205` es del lote y no de otro** porque lo destapó su propio CI, dos veces, y porque una regla
que sólo se puede cumplir saliéndose de la herramienta es exactamente lo que este lote persigue.

### Y una tercera parada que NO entra: `EP-028`

El coste de la verificación —`verify-fdge` corre 71 comprobaciones de repositorio en **toda**
invocación, y el sello por `PT` incluye el archivo **entero** del verificador— es un lote propio,
decidido por el firmante el `2026-08-29`. **No cabe aquí**: cerrar eso no demostraría nada sobre
«nada da verde sin mirar», y cada tarea nueva paga su corrida, así que atacar el coste desde dentro
lo aumenta antes de bajarlo. Queda en `paradas/EP-028.md` y se abre al cerrar este lote.

## 6. Análisis de solapamiento   `[AGENTE]` — obligatorio   `FDGE-R40`

| Archivo | Tareas que lo tocan | Serialización |
|:---|:---|:---|
| `tools/selftest.sh` | `PT-199` · `PT-192` · `PT-181` | **Estricta.** Las tres tocan el arnés, y editarlo **reabre bloques sellados** (`EP-025`): cada una obliga a una corrida completa. Van seguidas para pagar el sello **una vez**, no tres |
| `tools/verify-fdge.mjs` | `PT-179` · `PT-200` · `PT-198` | Estricta |
| `tools/tracker.mjs` | `PT-198` · `PT-195` · `PT-187` | Estricta |
| `RULES.md` · `EXECUTION-MODES.md` | `PT-196` · `PT-201` | Estricta — y **`SUITE-R06(e)`**: `docs/methodology/` no es trabajo de paso |
| `.github/workflows/` | `PT-202` · `PT-201` | Estricta |

**Ninguna tarea corre en paralelo con otra.** El lote es secuencial (`FDGE-R41`), y aquí además hay
un motivo económico medido: tocar `selftest.sh` cuesta una corrida completa de **~28 minutos**.

## 7. Supuestos compartidos   `[AGENTE]`

- El mecanismo del sello de `EP-025` **funciona y es el precedente**: un artefacto se certifica por
  un hecho ocurrido, con la huella de aquello que podría invalidarlo.
- `origin` es la fuente (`SUITE-R31`). Nada de este lote reescribe lo publicado.
- El modo sigue siendo `SUPERVISED`: `G1` y `G4` humanas, `G3` humana para todo `BUG`
  (`EXEC-R05`) — y trece de las catorce son `BUG`.

## 8. Observaciones del agente   `[AGENTE]` — obligatorio

**Dos cosas que este Intake NO puede afirmar, y se dicen ahora:**

1. **`PT-197` es el que peor encaja.** Es la única `FEATURE` y viene de `EP-023`, aplazado durante
   este cierre. Su objetivo —construir el séptimo componente— no es «que nada dé verde sin mirar».
   Está aquí porque el firmante decidió no abrir un lote nuevo, y eso se registra: el criterio de
   éxito de §2 **no la cubre**, y cerrarla no demuestra nada sobre el objetivo del lote.
2. **Dos tareas no declaran severidad.** `PT-179` y `PT-181` la tienen pendiente desde `PT-183`,
   con vuelta declarada al `2026-09-30`. `PT-179` se describió como `S1` en el `HANDOFF` y **eso no
   se transcribe aquí como si fuera un hecho del registro**: el registro asigna (`SUITE-R08`), y hoy
   no dice nada.

**Y una que sí se afirma, con su medida:** catorce tareas y **nueve** salieron de **ejecutar**
`EP-025`, no de planificarlo. Seis de ellas del propio acto de cerrarlo. Es esperable que
ejecutar éste destape más, y ése no será un fallo del Intake.

## 9. Resultado de la compuerta G1   `[AGENTE]`

```
VEREDICTO: PASS
Fecha: 2026-08-28
Firmante: Alberto Martínez
```

`DoR-E6` se cumple: las catorce tienen allocation, issue, **intake propio** y origen, y trece citan
la parada que las produjo (`FDGE-R55`). La única que no es `PT-181`, **anterior a la regla** y ya declarada como
deuda en el `HANDOFF`: es la última allocation del repositorio entero sin parada.

**No es un `CHALLENGE`**, y la diferencia importa: `EP-023` se admitió con uno, sin descomponer, y
cuatro días después bloqueaba el `G4` de otro lote. Este nace descompuesto.

## Cierre del lote   `SUITE-R45`

| Qué se resuelve al cerrar | Estado |
|:---|:---|
| Entrada de `CHANGELOG.md` | PENDIENTE |
| Número de versión | PENDIENTE — **`MINOR` esperado**: son correcciones y acotamientos, no reglas nuevas. Un `MAJOR` significaría que se cambió un contrato público |
| La severidad de `PT-179` y `PT-181` | PENDIENTE — vence el `2026-09-30` (`PT-183`) |
| Si `PT-197` debió estar en este lote | PENDIENTE — se responde con lo medido al cerrar, no ahora |
| Qué invalida el sello de un `PT` terminal | PENDIENTE — es la decisión de diseño de `PT-200` |
| Lo que aparezca **al cerrar** | PENDIENTE — en `EP-025` fueron cinco hallazgos, cuatro del propio cierre |
| El tag y la publicación | PENDIENTE — el tag es posterior al merge (`SUITE-R06a`); `npm publish` sigue **reservado** |
