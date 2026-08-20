# PT-084 — Descubrimiento   `PHASE 2`

## La cadena, con archivo y línea

[tracker.mjs](docs/methodology/tools/tracker.mjs), en `avanzar`:

```js
if (nota === null || !nota.trim()) throw new Error('avanzar exige --nota con contenido…');
if (!a.issue)             throw new Error(`${id} no tiene issue: la nota no tendria donde ir…`);
if (!adaptador?.comentar) throw new Error('sin plataforma con la que comentar, la nota no tiene donde ir…');
```

Tres eslabones. Y `FDGE-R52` hace de `avanzar` **la única forma sancionada** de cambiar de fase —
el `HANDOFF` lo tiene en su `no hacer`: *«avanzar de fase a mano editando `REGISTRY.phase`: existe
`tracker avanzar`, que hace los CINCO actos o no hace ninguno»*.

**Resultado: un proyecto sin tablero no avanza ni una fase.**

## Lo que el marco promete, en tres sitios

| Dónde | Qué dice |
|:---|:---|
| `SUITE-R22` | declara **soportado** el equipo de una sola persona asistida por IA |
| `migrate` | «**OPCIONAL** — declarar plataforma de trabajo… **Sin ella no cambia nada**» |
| `CLAUDE.md` de un destino | puede no declararla; nada obliga |

## Cómo apareció

`PT-072` **no declaró plataforma a propósito**. Declararla habría hecho que todo fluyera y habría
ocultado el único hueco crítico de aquella prueba — un proyecto de prueba configurado para que
salga bien no prueba nada.

Y `PT-019` lo confirmó por otro camino: el informe de `migrate` sobre el legado real presenta la
plataforma como la decisión humana n.º 3, «opcional». Un legado que migre siguiendo ese informe y
decida no declararla **se queda sin poder mover una tarea**.

**Dos pruebas independientes llegando al mismo defecto** es la señal más fuerte que ha dado el lote.

## Un segundo punto que sólo aparece ejecutando

Al quitar la guarda, `avanzar` reventó con:

```
Cannot read properties of undefined (reading 'etiquetasDeIssue')
```

El espejo de etiquetas —acto 5 de los cinco— también asume `adaptador` presente. **Eran dos
puntos, no uno**, y el segundo no se veía leyendo la cadena de guardas: se vio ejecutándolo en el
proyecto sin plataforma.

## Conclusión

El defecto no es que la plataforma sea útil —lo es— sino que **el marco dice tres veces que es
opcional y el código dice que no**. Una de las dos afirmaciones tiene que ceder.

La que cede es el código, porque `SUITE-R22` es una promesa del marco y no un detalle: hacer la
plataforma obligatoria sería la salida fácil y dejaría fuera al equipo de una persona, que es
justo el caso que el marco declara soportado.

**Dónde vive la nota sin tablero** es lo que había que decidir, y el candidato estaba a la vista:
un ledger append-only en el repositorio, que es donde ya viven los hechos que no tienen plataforma
(`SUITE-R09`).
