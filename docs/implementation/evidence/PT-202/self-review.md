# `PT-202` · self-review

## El intake se equivocaba de mecanismo, y medirlo lo cambió todo

Decía que `publicar.yml` **viaja dentro del paquete, igual que `tools/`**. Medido:

```
npm pack --dry-run  →  61 archivos · .github: 0
package.json.files  →  ["bin", "!bin/graphify-out", "docs/methodology",
                        "!docs/methodology/.claude", "README.md", "LICENSE", "NOTICE"]
grep "workflows|.github" bin/cauce.mjs plan-layout.mjs migrate.mjs  →  sin coincidencias
```

**No viaja.** Se corrige en `discovery.md` en vez de arreglar un mecanismo que no existe — `RULE-06`
por el lado que más cuesta: no dar por cierto lo que no se ha comprobado, ni siquiera cuando lo
dice el propio intake.

## Lo que sí llega, y es peor

`docs/methodology/` viaja **entero** —56 archivos— y dentro la documentación hablaba de
`publicar.yml` **como si el destino lo tuviera**. `CASOS-DE-USO.md` le daba un caso de uso
completo, `E2 · Publicar una versión`, cuyo recorrido el destino **no tiene**, para publicar un
paquete que **no es suyo**.

**Un archivo sobrante se ve y se borra; una documentación que describe un recorrido inexistente no
se ve**: quien la lee busca el workflow, no lo encuentra, y no sabe si le falta a él o si el
documento miente.

## La comprobación encontró un tercer documento que yo no había visto

Escribí la corrección para `LEXICON.md` y `CASOS-DE-USO.md`. Al correr `verify-suite` apareció
**`CHANGELOG.md`**, que menciona **los dos** workflows al narrar la historia del marco.

Y su mención **es correcta** — es un ledger que cuenta lo que pasó. Lo que faltaba es que quien lo
lea **en un proyecto destino** sepa que esos workflows no existen ahí. Se declara **una vez** en su
cabecera, que es una **adición** y no una edición de sus entradas (`SUITE-R09`).

**Ésa es la prueba de que `TS-04` hacía falta**: la corrección a mano se habría quedado en dos de
tres.

## La lista se **deriva**, y su caso lo fija

Un artefacto es **de la fuente** cuando está en el repositorio y **no** en `package.json.files`.
Escribirla a mano la haría divergir del árbol —`CE-010`, que este lote ya ha pagado dos veces— y
por eso hay un caso que planta un workflow **nuevo** y comprueba que entra **sin tocar ninguna
lista**.

## `TS-01` ya se cumplía, y el caso sigue haciendo falta

Que el paquete no lleve workflows **es cierto hoy**. Sin el caso, nada impide «arreglar» el
problema imaginario **añadiendo** `.github/` al paquete — que **sobrescribiría** los workflows del
destino, y eso no es instalar, es pisar. El caso fija **el cero de lo prohibido**, que es lo único
que un caso puede fijar (`HANDOFF -18`).

## Tres correcciones a mis propios casos

1. **El fixture necesitaba la suite entera.** Con sólo los `.md` de raíz, `verify-suite` emitía
   trece enlaces rotos y **truncaba** el informe —«… y 13 más»—, así que el hallazgo real no se
   veía: el caso medía el truncado en vez de la comprobación.
2. **`npm pack` no responde desde el arnés.** Se mide **el hecho del que el empaquetado depende**
   —que `.github` no esté en `files`— en vez de invocar un gestor que no es del arnés: una
   comprobación que depende de él falla por razones que no son la suya.
3. **`head -1` cortaba antes del nombre.** El workflow va en la **segunda** línea del hallazgo.

Y una cuarta, de escapado: la barra invertida se degradó al pasar por la sustitución —`CE-002`— y
se resolvió partiendo por el separador sin literal.

## Lo que NO se hace, y consta   `SUITE-R26`

- **`verificacion.yml` no se le da al destino**, y **sí le serviría**. Es la otra mitad del hueco y
  de otro tamaño: enviar `.github/` sobrescribiría lo suyo, y un workflow es específico de la
  plataforma, que `SUITE-R35` declara parametrizable. Hacerlo bien es **una plantilla que el
  destino adapta**, con su fase en `INSTALL.md`. **Se nombra, no se hace.**
- **`package.json` no se toca.** No manda `.github/`, y eso está bien.
- **`publicar.yml` no se borra**: aquí hace falta, es donde `SUITE-R06g` reserva la publicación.
- **No se resuelve el reparto fuente/destino de todo el marco**: sólo se nombra y se arregla su
  caso, que es lo que el intake ya prometía.

## Sin bloqueadores
