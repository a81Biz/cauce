# PT-061 — Estrategia   `PHASE 3`

## Lo que se construye

`REGISTRY.json` gana **`personas`**, y una función pura que responde de quién es un autor de git:

```json
"personas": [
  { "nombre": "Alberto Martínez",
    "git": [
      { "nombre": "Alberto Martínez", "correo": "alberto@a81.biz" },
      { "nombre": "a81Biz",           "correo": "albe.mtz@gmail.com" },
      { "nombre": "Alberto Martínez", "correo": "albe.mtz@gmail.com" }
    ] }
]
```

```
tracker personas          quién está declarado, y qué autores de git no lo están
personaDe(autor, tabla)   pura · la persona, o null con el motivo
```

## Las cuatro decisiones

### 1. La tabla va al **registro**, no a `CLAUDE.md`

`CLAUDE.md` es **parametrización, no autoridad** (`SUITE-R00`). Esta tabla la leen las herramientas
para derivar ramas y cifras, así que vive donde vive lo que las herramientas leen: `REGISTRY.json`,
que además es lo que **asigna** (`SUITE-R08`).

### 2. `firmantes:` **no se toca**, y no se duplica

Dos listas de personas es el patrón que este marco existe para eliminar. Pero **no son la misma
lista**:

| | Qué responde | Dónde vive |
|:---|:---|:---|
| `firmantes:` | quién **puede firmar** — gobierno, decisión humana | `CLAUDE.md` |
| `personas` | quién **es quién** — identidad, dato derivable | `REGISTRY.json` |

Un becario puede tener identidad y no poder firmar. Lo que **no** puede pasar es que alguien firme
sin existir, y eso es lo que `AC-04` comprueba: **todo firmante existe como persona**. La
comprobación va en una dirección sola, y esa asimetría es la que impide que se conviertan en dos
copias del mismo hecho.

### 3. `personaDe` devuelve `null` con motivo, no un parecido

Tercera vez que el lote anterior tomó esta decisión, y aquí es más peligrosa: atribuir por
**parecido** —mismo apellido, mismo dominio del correo— convertiría una duda en un dato, y las
cuatro tareas siguientes construirían sobre él sin que sus casos lo notaran.

`AC-03`: un autor no declarado **se reporta**. Y `tracker personas` lo enseña sin que haya que
preguntarle.

### 4. `ramaDe` deja de leer `git config` a pelo

Hoy `PT-054` toma `git config user.name`. Pasa a resolver **la persona** y usar su **nombre
canónico**, para que la misma persona tenga la misma rama desde cualquier máquina.

**Compatibilidad:** sin `personas` declaradas, `ramaDe` se comporta **exactamente como hoy**. Un
proyecto de una persona no tiene que declarar nada.

## Cómo se declara la tabla

**No se genera sola.** Un comando que mirase los autores y agrupase por parecido haría justo lo que
la decisión 3 prohíbe. Lo que sí se hace es **enseñar lo que falta**:

```
$ tracker personas

  Alberto Martínez
    Alberto Martínez <alberto@a81.biz>        218 commits
    a81Biz <albe.mtz@gmail.com>                 9 commits

  SIN DECLARAR (1 autor, 1 commit)
    Alberto Martínez <albe.mtz@gmail.com>       1 commit
    → si es de una persona ya declarada, añádelo a su lista «git»
```

La herramienta **encuentra** y **propone dónde mirar**; quién es quién lo dice una persona.

## Lo que NO se hace

**No se reescribe la historia.** 228 commits para unificar tres nombres es `SUITE-R06f`, y la tabla
lo resuelve sin tocar nada.

**No hay permisos.** Esto dice quién es, no qué puede. `SUITE-R27` ya declara que `firmantes:` no
prueba que firmara una persona; esto tampoco lo prueba y no debe fingirlo.

**No se usa todavía para el coste ni la sesión.** Eso es `PT-064` y `PT-065`. Aquí solo `ramaDe`,
porque es el único consumidor que ya existe.

## El riesgo

Que la tabla se quede vieja. Alguien cambia de máquina, aparece una identidad nueva, y las cifras
de `PT-064` empiezan a dejarse trabajo fuera **en silencio**.

La defensa es que `tracker personas` enseñe los no declarados **siempre**, no bajo una bandera — y
que sea barato mirarlo. Lo que no se puede defender es que alguien mire: eso se declara.
