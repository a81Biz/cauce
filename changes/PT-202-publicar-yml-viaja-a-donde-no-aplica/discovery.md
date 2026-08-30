# `PT-202` · `discovery.md` — el intake se equivocaba en el mecanismo, y el defecto es peor

## 1. `publicar.yml` **no viaja**. Medido

```
$ npm pack --dry-run
  archivos en el paquete: 61
  .github:                 0
  workflows:               0
  docs/methodology:       56
```

```json
// package.json · files
["bin", "!bin/graphify-out", "docs/methodology", "!docs/methodology/.claude",
 "README.md", "LICENSE", "NOTICE"]
```

Y tampoco lo copia nadie:

```
$ grep -n "workflows|\.github|publicar\.yml" bin/cauce.mjs plan-layout.mjs migrate.mjs
(sin coincidencias)
```

**El intake decía «`publicar.yml` viaja dentro del paquete, igual que `tools/`». Es falso.** Se
corrige aquí en vez de arreglar un mecanismo que no existe — `RULE-06` por el lado que más cuesta:
no dar por cierto lo que no se ha comprobado, ni siquiera cuando lo dice el propio intake.

## 2. Lo que **sí** llega, y es lo que el firmante vio

`docs/methodology/` **entero** viaja: 56 archivos. Y ahí dentro, la documentación **habla de
`publicar.yml` como si el destino lo tuviera**:

```
LEXICON.md:1107        «…es la corrida que SELLA, y la que corre `publicar.yml`.
                        `verificacion.yml` salta lo sellado»
CASOS-DE-USO.md:283    E2 · Publicar una versión
                        | Recorrido | `publicar.yml`, manual, solo desde la rama por defecto |
```

Un proyecto que instala cauce recibe un **caso de uso** —`E2 · Publicar una versión`— cuyo recorrido
es un workflow que **no tiene**, para publicar un paquete que **no es suyo**.

## 3. Por qué eso es peor que un archivo de más

Un archivo sobrante se ve y se borra. **Una documentación que describe un recorrido inexistente no
se ve**: quien la lee busca el workflow, no lo encuentra, y no sabe si le falta a él o si el
documento miente.

Y `verificacion.yml` **tampoco viaja**, aunque el intake dice —correctamente— que *«sí tiene sentido
en el destino»*. Así que el destino recibe:

| | Viaja | ¿Tiene sentido allí? |
|:---|:---|:---|
| `docs/methodology/` (56 archivos) | **Sí** | Sí |
| `bin/cauce.mjs` | **Sí** | Sí |
| `verificacion.yml` | **No** | **Sí** — y no lo tiene |
| `publicar.yml` | **No** | No — y la documentación dice que sí |

**El destino se queda sin la compuerta que sí necesita, y con la documentación de una que no.**
Las dos mitades del mismo hueco.

## 4. El corolario del intake sigue siendo el correcto

> *«la instalación no declara qué parte del marco es para el destino y qué parte es sólo para la
> fuente»*

Eso es exacto, y lo que cambia es dónde se ve: no en un archivo que sobra, sino en **documentación
que no distingue** y en **una compuerta que falta**.

## 5. Lo que esto NO es

**No es un defecto de empaquetado.** `package.json` hace lo correcto: no manda `.github/`. Si lo
mandara, sobrescribiría los workflows del destino, que es peor.

## 6. Lo que NO se toca   `SUITE-R26`

- **`publicar.yml` no se borra**: aquí hace falta, y es donde `SUITE-R06g` reserva la publicación.
- **No se empieza a enviar `.github/`**: sobrescribir los workflows de un proyecto ajeno no es
  instalar, es pisar.
- **No se resuelve el reparto fuente/destino para todo el marco**: sólo se **nombra** y se arregla
  su caso, que es lo que el intake ya declaraba en `§4`.
