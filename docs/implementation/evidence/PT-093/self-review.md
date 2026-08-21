# PT-093 — Autorrevisión   `PHASE 6`

## La decisión, y por qué no hay otra

`H-009` es `INVESTIGATION` porque no estaba claro que tuviera arreglo dentro del repositorio.
**Medido, no lo tiene** — y los cuatro caminos que lo parecen mueven el problema:

| Camino | Dónde acaba |
|:---|:---|
| Un revisor aprobador | Imposible para el equipo de una persona (`SUITE-R22`) |
| Retirar credenciales de `gh` | Rompe el espejo (`SUITE-R35`) |
| Firma criptográfica | El agente ejecuta donde estaría la clave |
| Un segundo agente | Dos agentes con las mismas credenciales no son dos personas |

`SUITE-R27` ya resolvió el mismo dilema para las firmas con la respuesta honesta. Se aplica donde
la consecuencia es irreversible.

**Prometer una prevención sería peor que declarar el límite**: daría por resuelto lo que sigue
abierto, que es el patrón que este lote combate.

## Lo que apareció y no buscaba nadie

Escribí `EXEC-R04a`. El marco la contó como regla —**225**— y **no llegó a `CORE.md`**.

```
patrones.mjs   reglasDelMarco   [A-Z]+-R\d+[a-z]?    la aceptaba
build-core     RE_PROSE_HEAD    [A-Z]+-[RP]\d+       la rechazaba
build-core     rulesFrom        [A-Z]+-[RP]\d+       la rechazaba
```

**`LEX-R24` admite explícitamente los sub-identificadores**, y los dos extractores del compilador
los descartaban **en silencio** — y `CORE.md` es lo único que el agente carga.

Dos lectores del mismo hecho, divergentes. Es la enfermedad que la v4 existe para eliminar,
dentro de la herramienta que compila el núcleo.

**Se arreglaron los dos**, aunque hoy sólo el de prosa tenga una sub-regla. Dejar el defecto en la
mitad que no se estrenó es esperar a que lo encuentre otro — y este lote lleva ocho instancias de
exactamente eso.

## El marco se cazó solo, dos veces

**En cuanto la regla llegó a `CORE`**, el detector de `PT-081` la marcó por no declarar desde
cuándo rige. No una lista que alguien recordó mantener: el mecanismo funcionando.

**Y `audit` la contó como `PENDIENTE`** —122 → 123— hasta que le escribí su emisión. Que es como
descubrí que una constancia **malformada** y una **ausente** son hechos distintos con arreglos
distintos, y no debían compartir mensaje.

## Un caso mío atado a una cifra que crece

`PT-088` asertó `PENDIENTE 122`. Falló **dos tareas después**, al entrar `EXEC-R04a`.

El `no hacer` del `HANDOFF` ya lo advertía —*«atar una aserción a una cifra que CRECE fallará algún
día sin que eso signifique nada»*— y lo hice igual. Corregido a asertar el **hecho**: que las tres
reglas no sigan en `PENDIENTE`.

## Lo que no se verifica, y está declarado

**Que la autorización que una constancia cita existiera.** No es mecanizable desde el repositorio,
y es precisamente el límite que esta tarea escribe.

**Que la declaración se lea.** Está en `CORE.md`, que el agente carga; que la tenga en cuenta al
decidir no se comprueba. Es el mismo límite que `SUITE-R27` tiene desde que existe.

`AC-01`..`AC-04`, los cuatro.
