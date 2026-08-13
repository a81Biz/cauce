# PT-011 — Discovery   `PHASE 2` · análisis `2-B`

## Qué falla

`verify-fdge.mjs:640` lee los miembros de un lote barriendo **todo el texto** de su intake:

```js
const pts = [...txt.matchAll(/PT-\d+/g)].map((m) => m[0]);
```

Cualquier identificador citado en prosa pasa a ser miembro del lote y se le exige la línea
`Firmado por lote: EP-NNN`. Sobre un PT cerrado hace semanas, eso es un fallo que nadie puede
arreglar sin reescribir un intake firmado.

## El coste real, y no es el error

Obliga a escribir los intakes de lote **sin referencias cruzadas** — sin «el método que ya
funcionó en `PT-006`», sin «el error que `PT-013` cometió». Es decir: obliga a renunciar
justo a lo que da trazabilidad, para que una comprobación no se confunda.

Lo sufrí en esta misma sesión: al escribir el intake de `EP-001` **no pude citar** los
identificadores de las tareas del lote siguiente, y lo dejé anotado en sus observaciones.

## Dónde estaba la corrección

**En el proyecto legado**, commit `760f790`. Lee los miembros de las **filas de tabla** y
conserva el barrido completo como respaldo para los intakes escritos antes del cambio.

Y el `CHANGELOG` de cauce **4.13.0 la declara traída**:

> «`INTAKE-R08` · Los miembros de un lote se leían de todo el texto… Ahora una mención en prosa
> es una mención y una fila de tabla es un miembro»

No lo estaba. De las cuatro correcciones de aquella tanda, tres llegaron —`RE_SIGNED_BY`,
`RE_FIRMA_NOMBRE`, `RE_VALOR_FIRMADA`, esta última incluso mejorada— y esta se quedó en el
texto.

## Por qué eso es peor que no haberla mencionado

Un `CHANGELOG` que afirma una corrección **cierra la pregunta**. Nadie vuelve a mirar. Es la
misma clase de defecto que `PT-002` corrigió en `audit` —un verde que describe una comprobación
que no ocurre— aplicada al documento que la gente lee para saber qué cambió.

## Impacto medido   2026-08-13

`verify-fdge` de cauce 6.0.1 contra el proyecto legado: **16 errores**, de los cuales

```
13  INTAKE-R08  falsos, todos por prosa
 1  INTAKE-R09  «lista PT-088 y no existe» — PT-088 se cita en una frase que explica
                por qué se soltó ese identificador
```

**14 de 16.** Los otros dos son la migración misma (`SUITE-R33`, `SUITE-R16`, `SUITE-R17`).

## Conclusión

Defecto confirmado, con la corrección ya escrita y probada en otro repositorio. Se trae, se
declara de dónde viene, y se corrige la afirmación del `CHANGELOG` en vez de dejarla.

Confianzas: RootCause 100 % · Architecture 95 % · Solution 95 %.
