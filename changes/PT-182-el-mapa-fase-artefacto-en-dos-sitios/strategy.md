# `PT-182` · `strategy.md` — `PHASE 3`

## Esta tarea la escogió el propio lote, contando

`EP-024` y `EP-025` produjeron **siete guardas nuevas**. No se eligieron por tema: se clasificaron
después, y **cinco tienen la misma forma**.

| Tarea | Regla que protege | Dónde vivía su comprobación |
|:---|:---|:---|
| `PT-178` | todo trabajo entra por un Intake | **solo en `G4`** |
| `PT-183` | un `PT` pertenece a un lote | **en ningún sitio** |
| `PT-184` | la rama se deriva del registro | en `G4`, y **rota** |
| `PT-185` | el índice espeja el registro | en `G4`, y **acusaba al correcto** |
| `PT-186` | el intake se exige donde puede existir | en `G4`, sobre lo que aún no nace |
| `PT-188` | el arnés no toca el árbol real | **en ningún sitio** |
| `PT-189` | la viabilidad detiene **antes** | en `G4`, sobre lo ya hecho |

Cinco de siete son **la misma causa**: una regla `HARD` cuya única comprobación vive en la compuerta
final. `G4` llega cuando el trabajo ya está hecho, así que su rojo no previene: **factura**.

El firmante lo nombró por su causa, no por sus síntomas:

> *«estamos reconstruyendo muchas cosas por habernos saltado el mismo marco… ya tenemos algunos
> métodos, pero ahora necesitamos integrar todo.»*

## Lo que faltaba no era una guarda más: era conectar la que ya existía

`tracker cursor` **ya comprobaba**, fase a fase, que cada una dejó su artefacto. Y **no lo invocaba
nadie**: ni `package.json`, ni la CI, ni `avanzar`, ni ninguna compuerta.

Por eso el cursor reportaba «30 nodos sin rastro» sobre un lote que `verify-fdge` daba por limpio:
las dos herramientas miraban el mismo hecho y **ninguna de las dos mandaba**.

Peor: el mapa fase→artefacto estaba escrito **dos veces y a mano**. `RULE-01` invertida — un hecho,
dos casas, y las dos podían divergir sin que nada lo dijera.

## La regla: qué se decidió y con qué dato

| Decisión | Alternativa descartada | Por qué |
|:---|:---|:---|
| El mapa se declara **una vez** en `patrones.mjs` | dejarlo en las dos herramientas, sincronizado | Es exactamente el defecto que la `v3` cometió cuatro veces y costó ocho defectos críticos |
| `avanzar` lo consulta en **cada** transición | solo al salir de `PHASE 1`, como `PT-178` | `PT-178` cerró **un** peldaño de cinco. Un guardia en el primer escalón no protege los otros cuatro |
| La fase que **se cierra** debe haber dejado lo suyo | exigir el artefacto de la fase a la que se entra | La fase que entra aún no ha trabajado. Exigirle su artefacto es `PT-186` otra vez |
| Una fase sin artefacto declarado devuelve `null` | tratarla como completa | `null` **no** es «está bien»: es que no se sabe. `RULE-06` — lo que no se puede comprobar se declara no evaluable, no se aprueba |

## Por qué esto cierra la pinza y no solo tapa un caso

Las cinco tareas de arriba dejan de ser **hallazgos de `G4`** y pasan a ser **imposibles**: la
transición no ocurre si su artefacto no está. La diferencia no es de severidad, es de momento —
prevenir cuesta una fase, facturar cuesta el lote.

Y es universal por construcción: el mapa viaja dentro del paquete, así que **todo destino ya
instalado** lo hereda al migrar, sin declarar nada.

## Riesgo aceptado

Una tarea legítima puede quedar detenida por un artefacto que existe con otro nombre. Se acepta:
el bloqueo es **visible y nombra la ruta que falta**, que es lo contrario del fallo que esta tarea
corrige — una regla que no se comprueba en ninguna parte y nadie echa de menos.
