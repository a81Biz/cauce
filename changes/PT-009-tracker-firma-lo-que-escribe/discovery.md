# PT-009 — Discovery   `PHASE 2` · análisis `2-B`

## Qué falla

```
✗ SUITE-R43  PT-008: hay un comentario sin responder en el issue #12
```

El comentario es el que `tracker cerrar` escribió al cerrar el issue tras el merge. No lleva
marca de procedencia, así que la regla lo cuenta como humano.

## Dónde

`tracker.mjs`, en `cerrar()`: el mensaje se compone en línea, dentro de la llamada al
adaptador. **Es el único sitio donde `tracker` escribe un comentario** — `abrir` escribe el
cuerpo del issue, que no es un comentario y no entra en `SUITE-R43`.

## Por qué — causa raíz

`PT-008` definió la marca y la aplicó **donde el agente escribe a mano**, no donde escribe la
herramienta. La marca vive en `tracker.mjs` y el propio `tracker` no la usa.

Es una omisión de una línea, y su interés no está en la línea: **la regla se cazó a sí misma en
la primera ejecución posterior a su creación**. Nadie fue a buscar el defecto; apareció al
cerrar los issues tras el merge.

## Impacto

`verify-fdge --all` en rojo mientras haya un PT con issue cerrado por la herramienta. Bloquea
`G4` de cualquier lote futuro. Severidad `S2`: hay workaround —responder a mano— y no hay nada
caído.

## Lo que NO se va a hacer

Excluir el mensaje de cierre de la comprobación. Sería relajar la regla para que deje de
detectar un defecto real, que es el patrón que este marco persigue. Se arregla quien escribe.

## Conclusión

Defecto confirmado, de una línea, con causa raíz clara. La corrección es que el mensaje de
cierre lleve la marca, y que eso lo garantice un caso — no la memoria de quien lo escribió.

Confianzas: RootCause 100 % · Architecture 95 % · Solution 95 %.
