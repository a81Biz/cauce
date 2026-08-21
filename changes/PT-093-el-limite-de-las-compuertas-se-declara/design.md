# PT-093 — Diseño   `PHASE 4`

## `EXEC-R04`: una tabla de dos columnas

```
| Lo que el marco garantiza                     | Lo que no puede garantizar        |
| PR y CI en verde, sin excepcion ni para       | Que UNA PERSONA ejecutara el      |
| quien administra el repositorio               | merge. El agente tiene las mismas |
|                                               | credenciales                      |
| Constancia CON NOMBRE, exigida por            | Que la autorizacion que cita      |
| verify-fdge en cada avance de la principal    | EXISTIERA. La escribe el agente   |
| Ni force push ni borrado: el rastro no        | —                                 |
| se puede retirar                              |                                   |
```

**Dos columnas y no un párrafo**, porque lo que hace útil a esta declaración es que las dos listas
se lean a la vez. Un texto corrido invita a quedarse con la primera mitad.

Y la frase que impide el malentendido más probable: **`0` revisores aprobadores no es un descuido
de configuración**. Es la única opción viable para el caso que `SUITE-R22` declara soportado.

## `EXEC-R04a`: la forma, con ID propio

`PT-088` fijó la forma **de hecho** al escribir `RE_CONSTANCIA`. Lo que faltaba era escribirla
donde alguien la lea:

```
## <YYYY-MM-DD> · …G4 | VoBo | autorizad…
   …con un nombre de «firmantes» en el cuerpo
```

`LEX-R24` admite sub-IDs para **cláusulas** de una regla, y esto lo es: sin `EXEC-R04` no habría
constancia que formatear.

## La distinción que el ID propio permite

```js
if (rigeGlobal('EXEC-R04a')) {
  for (const b of bloques) {
    … if (lista.some((n) => b.includes(n))) continue;
    fail('EXEC-R04a', `…anuncia una autorización y no lleva ningún nombre de «firmantes»…`);
  }
}
```

```
sin constancia         ->  EXEC-R04   ·  se arregla ESCRIBIENDO la entrada
constancia sin nombre  ->  EXEC-R04a  ·  se arregla ANADIENDO el nombre
```

**Dos hechos distintos con arreglos distintos no comparten emisión.** Es lo mismo que `PT-091` hizo
con «no existe» frente a «desviada», y lo mismo que `PT-058` fijó para `null` frente a cero.

## El defecto de `build-core`, que no buscaba nadie

```js
// antes
const RE_PROSE_HEAD = /^`([A-Z]+-[RP]\d+)`\s*·\s*(.*)$/;
const m = line.match(/^\|\s*`([A-Z]+-[RP]\d+)`\s*\|\s*(HARD|SOFT|CHECK)\s*\|…/);
// ahora
…[A-Z]+-[RP]\d+[a-z]?…      en los DOS
```

`reglasDelMarco` en `patrones.mjs` ya aceptaba `[a-z]?`. **Dos lectores del mismo hecho,
divergentes**, y el resultado era silencioso: la regla contaba como existente (225) y no llegaba a
`CORE.md`, que es lo único que el agente carga.

Se arreglaron los dos aunque sólo el de prosa tuviera una sub-regla. **Dejar el defecto en la
mitad que no se estrenó es esperar a que lo encuentre otro** — y este lote lleva ocho instancias
de exactamente eso.
