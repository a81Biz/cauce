# PT-093 — Descubrimiento   `PHASE 2`

## Lo observado, a la API

```
main      required_pull_request_reviews: sí · revisores aprobadores: 0
          required_status_checks: ["marco"] · enforce_admins: true
          allow_force_pushes: false · allow_deletions: false
trabajo   required_pull_request_reviews: no · status: ["marco"] · enforce_admins: true
```

## Lo que el marco dice, y lo que hace

| Regla | Qué dice | Quién la emite |
|:---|:---|:---|
| `EXEC-R04` | *«`G4` es humana en los tres modos, sin excepción»* | **ninguno**, hasta `PT-088` |
| `SUITE-R06` | el merge a la principal es siempre humano | `verify-fdge`, exigiendo un nombre en `HISTORY.log` |
| `SUITE-R27` | qué prueba una firma, y qué no | `verify-fdge` · `verify-suite` |

**`PT-088` escribió el verificador de `EXEC-R04`.** Comprueba que cada merge a la rama por defecto
tenga constancia con un nombre de `firmantes`. Y su propio mensaje declara el límite:

```
NO prueba que la autorización fuera real (SUITE-R27, H-009).
```

## El límite ya está declarado para las firmas — y con esta franqueza

`RULES.md`, `SUITE-R27`:

> Una firma es una **declaración de responsabilidad**, no una prueba criptográfica: el agente
> escribe el archivo y podría escribir cualquier nombre. […] Lo que el marco garantiza es que
> **hay un nombre concreto asociado a cada decisión irreversible** y que ese nombre estaba
> autorizado; lo que no puede garantizar es la voluntad detrás.

**`EXEC-R04` no dice nada de esto**, y es donde la consecuencia es irreversible.

## Los tres hechos que hacen falta para decidir

**1 · `0` revisores es la única configuración viable.** `SUITE-R22` declara soportado el equipo de
una persona, y nadie puede aprobar su propio PR. Subirlo a `1` haría el flujo imposible, no más
seguro.

**2 · Lo que sí existe es real y no es poco.** `enforce_admins: true` significa que ni el dueño
puede saltarse el PR ni la CI. `allow_force_pushes: false` y `allow_deletions: false` cierran las
dos formas de borrar el rastro. Y desde `PT-088`, un merge sin constancia **falla**.

**3 · Lo que no existe es una prevención.** Nada impide mecánicamente que el agente ejecute
`gh pr merge`. Esta sesión lo ilustra **dos veces**: la `G4` de `EP-017` y la firma del intake de
`EP-018` las escribió el agente citando la instrucción del firmante. Las dos son contrastables.
Ninguna es una prueba.

## Por qué construir la prevención no es la salida

| Camino | Por qué no |
|:---|:---|
| Exigir un revisor aprobador | Imposible para el equipo de una persona (`SUITE-R22`) |
| Retirar credenciales de `gh` al agente | Rompe el espejo (`SUITE-R35`), única defensa contra la divergencia registro↔tablero |
| Firma criptográfica del firmante | El agente ejecuta en la misma máquina donde estaría la clave. Mueve el problema, no lo cierra |
| Un segundo agente que apruebe | Dos agentes con las mismas credenciales no son dos personas |

**Todas mueven el problema.** Y `SUITE-R27` ya resolvió el mismo dilema para las firmas con la
respuesta honesta: declarar qué se garantiza y qué no.

## Lo que este descubrimiento cambia respecto del intake

| | Intake decía | Medido |
|:---|:---|:---|
| `AC-03` | «un merge sin constancia se detecta a posteriori — lo escribe `PT-088`» | **Ya está hecho.** `PT-088` lo entregó, con su límite en el mensaje |
| `AC-01` | «`EXEC-R04` declara su límite» | Es lo que falta, y el texto de `SUITE-R27` es el modelo literal |
| `AC-02` | «la constancia tiene forma fija» | **`PT-088` la fijó de hecho**: `## <fecha> · …G4|VoBo|autorizad…` con un nombre de `firmantes` en el cuerpo. Falta **escribirla** donde alguien la lea |
| `AC-04` | «la decisión del firmante queda registrada» | Sigue siendo el criterio real, y es lo único que esta tarea no puede hacer sola |
