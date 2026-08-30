# `PT-202` · `strategy.md`

## La decisión

**La frontera fuente/destino se declara, y la documentación que viaja deja de describir recorridos
que el destino no tiene.**

Tres piezas, en orden de lo que cuestan:

| | Qué | Dónde |
|:---|:---|:---|
| 1 | **Declarar la frontera** en un solo sitio: qué es del destino, qué es sólo de la fuente | `LEXICON.md` §del paquete, junto a `LEX-R25` |
| 2 | **`E2 · Publicar una versión` se marca como caso de la FUENTE** | `CASOS-DE-USO.md` |
| 3 | **Una comprobación** que impida que esto se vuelva a escribir sin darse cuenta | `verify-suite` |

## Por qué `LEX-R25` es el sitio, y no uno nuevo

Ya existe y ya dice **la mitad**:

> `LEX-R25` · `CORE.md`, `CORE-PTSA.md`, `PHASES.md`, `tools/` y los directorios `templates/`
> forman parte del paquete instalable.

Dice qué **viaja**. No dice qué de lo que viaja **aplica al destino**, que es otra cosa: los 56
archivos de `docs/methodology/` viajan **enteros**, y dentro llevan casos de uso que sólo tienen
sentido en el repositorio que produce el paquete. Se completa ahí, no se duplica al lado
(`SUITE-R38`).

## La comprobación, y por qué hace falta

Sin ella esto es una corrección de texto que se deshace sola: el próximo documento que mencione
`publicar.yml` volverá a describirlo como algo que el destino tiene. **Y no es hipotético — es lo
que ya pasó dos veces**, en `LEXICON.md:1107` y `CASOS-DE-USO.md:283`.

`verify-suite` comprueba que **un documento que viaja no describa un artefacto de la fuente sin
marcarlo como tal**. La lista de artefactos de fuente es **derivada**, no escrita a mano: son los
que están en `.github/workflows/` y **no** en `package.json.files`.

Derivarla importa: una lista escrita a mano diverge del árbol, que es `CE-010`, y este lote ya lo
ha pagado.

## `verificacion.yml` es la otra mitad, y NO se arregla aquí

El destino **no recibe** `verificacion.yml`, y el intake dice —con razón— que *«sí tiene sentido en
el destino»*. Pero dárselo es otra decisión y de otro tamaño:

- Enviar `.github/` **sobrescribiría** los workflows del proyecto destino. Eso no es instalar: es
  pisar.
- Un workflow de CI es específico de la plataforma —GitHub Actions, Azure Pipelines— y `SUITE-R35`
  declara que la plataforma es parametrizable.
- Hacerlo bien es **una plantilla que el destino adapta**, con su fase en `INSTALL.md`.

**Se nombra y se declara como no cubierto** (`SUITE-R26`), que es lo que el intake ya prometía en su
`§4`: *«no resuelve el reparto fuente/destino para todo el marco: sólo lo nombra y arregla su caso»*.

## Lo que se descarta

| | Por qué no |
|:---|:---|
| Empaquetar `.github/` | Sobrescribe los workflows del destino. El `package.json` de hoy hace lo correcto |
| Borrar `publicar.yml` | Aquí hace falta: es donde `SUITE-R06g` reserva la publicación |
| Quitar las menciones y ya está | Se deshace solo. Ya pasó dos veces sin que nada lo dijera |
| Hacerlo condicional al repositorio | Arregla un mecanismo que **no existe**: el archivo no viaja |

## Alcance, y su límite declarado   `SUITE-R26`

**Dentro:** la frontera declarada, las dos menciones marcadas, y la comprobación que lo sostiene.

**Fuera, y consta:**
- **Dar `verificacion.yml` al destino.** Nombrado arriba, con su motivo y su tamaño.
- **El reparto fuente/destino de todo el marco.** Se nombra; resolverlo entero es otro trabajo.
- **No se cambia `package.json`.** No manda `.github/`, y eso está bien.
