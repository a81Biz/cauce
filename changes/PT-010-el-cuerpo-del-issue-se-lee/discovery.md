# PT-010 — Discovery   `PHASE 2` · análisis `2-B`

## Qué falla, literal

El cuerpo del issue #9, el de la implementación `EP-002`:

```
**EP** · severidad — · sin implementación

Intake, criterios de aceptación y evidencia: [`changes/EP-002-…/`](changes/EP-002-…/)
```

## Dos defectos en cuatro líneas

**1 · «sin implementación» sobre la implementación.** El generador compone un solo texto para
tarea y para lote: `${a.epic ? 'implementación '+a.epic : 'sin implementación'}`. Un `EP` no
tiene campo `epic` —**es** la implementación— así que cae en la rama del `else` y se niega a sí
mismo. También imprime `severidad —` para un `EP`, que no lleva severidad por diseño.

**2 · El enlace es relativo.** En un archivo del repositorio, `[x](changes/…)` resuelve. En el
**cuerpo de un issue**, no: GitHub lo resuelve contra la raíz del sitio del repositorio, y da
`github.com/a81Biz/cauce/changes/…`, que no existe.

## Cómo se descubrió

**Mirándolo.** «estoy viendo en los issue que no hay nada de la EP-002». Y era literal: lo
único que había era un enlace roto.

Ninguna comprobación lo habría detectado. No hay nada en el marco que compruebe que un enlace
resuelve —haría falta red en una compuerta— ni que un texto no se contradice. Es el segundo
defecto de la sesión que encuentra una persona leyendo, después del de `SUITE-R35`.

## Impacto

`EP-002` puso el **estado** en la plataforma dando por hecho que el contenido se alcanzaba
desde el issue. No se alcanzaba: el tablero decía en qué fase estaba cada cosa y no permitía
llegar a ninguna. Severidad `S2` — deja inservible lo que el lote anterior acababa de construir.

## Lo que queda por determinar — `PHASE 3`

**Contra qué rama apunta el enlace.** La rama de trabajo desaparece en muchos proyectos tras el
merge; la rama por defecto no tiene el contenido hasta que el merge ocurre. Hay que elegir y
declarar el coste.

## Conclusión

Dos defectos confirmados, los dos en la función que compone el cuerpo. La corrección es
componerlo distinguiendo lote de tarea y enlazando con una URL absoluta — y si no se puede
derivar, no inventarla.

Confianzas: RootCause 100 % · Architecture 90 % · Solution 80 %.
