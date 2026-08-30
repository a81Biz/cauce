# `PT-202` · `test-scenarios.md`

## `TS-01` — una instalación limpia no recibe el workflow de publicación   → `AC-01`

```
DADO   lo que npm empaqueta de verdad
CUANDO se listan sus archivos
ENTONCES no hay ninguno de .github/
```

**Ya se cumple hoy**, y el caso lo fija. El intake creía lo contrario y la medición lo desmintió:
`npm pack` da 61 archivos y **cero** de `.github/`. Sin este caso, nada impide que alguien «arregle»
el problema imaginario **añadiendo** `.github/` al paquete — que sobrescribiría los workflows del
destino, y eso no es instalar, es pisar.

## `TS-02` — este repositorio sigue pudiendo publicar   → `AC-02`

```
DADO   .github/workflows/publicar.yml
CUANDO se comprueba que existe y que publica desde la rama por defecto
ENTONCES sigue ahi, intacto
```

**Es el que impide arreglarlo rompiendo la publicación**, y el intake ya lo declaraba así.

## `TS-03` — la frontera fuente/destino está **declarada**   → `AC-03`

```
DADO   LEXICON.md
CUANDO se busca que parte del marco es solo de la FUENTE
ENTONCES lo dice, junto a LEX-R25, que ya declara que viaja
```

## `TS-04` — y un documento que viaja no describe un recorrido de la fuente sin marcarlo   → `AC-03`

```
DADO   los documentos que van dentro del paquete
CUANDO uno menciona un artefacto que NO viaja —publicar.yml—
ENTONCES verify-suite exige que este marcado como de la FUENTE
```

**Sin `TS-04`, `TS-03` es una corrección de texto que se deshace sola.** Y no es hipotético: ya
pasó **dos veces** —`LEXICON.md:1107` y `CASOS-DE-USO.md:283`— sin que nada lo dijera.

## `TS-05` — y la lista de lo que es «de la fuente» se **deriva**   → `AC-03`

```
DADO   un artefacto nuevo en .github/workflows que no este en package.json.files
CUANDO corre verify-suite
ENTONCES entra en la comprobacion sin que nadie lo anada a mano
```

Una lista escrita a mano diverge del árbol — `CE-010`, que este lote ya ha pagado dos veces.

## Lo que NO se cubre, y consta   `SUITE-R26`

- **`verificacion.yml` no se le da al destino.** Es la otra mitad del hueco y es de otro tamaño:
  enviar `.github/` sobrescribiría lo suyo, y un workflow es específico de la plataforma, que
  `SUITE-R35` declara parametrizable. Hacerlo bien es **una plantilla que el destino adapta**, con
  su fase en `INSTALL.md`. Se **nombra**, no se hace.
- **El reparto fuente/destino de todo el marco.** Sólo se nombra y se arregla su caso — que es lo
  que el intake ya prometía en su `§4`.
- **`package.json` no se toca.** No manda `.github/`, y eso está bien.
