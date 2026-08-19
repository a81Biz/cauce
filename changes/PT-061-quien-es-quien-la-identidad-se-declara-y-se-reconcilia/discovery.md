# PT-061 — Descubrimiento   `PHASE 2`

> Medido contra este repositorio el 2026-08-18.

## 1. Tres identidades para una persona

```
218 commits   Alberto Martínez   <alberto@a81.biz>
  9 commits   a81Biz             <albe.mtz@gmail.com>
  1 commit    Alberto Martínez   <albe.mtz@gmail.com>
```

Un nombre distinto, dos correos distintos, **una sola persona**. Y esto es un repositorio de un
equipo de uno: el desorden no viene de trabajar con más gente, viene de **cambiar de máquina o de
configuración**.

Ninguna de las tres combinaciones es «la mala». Las tres son commits reales de trabajo real.

## 2. Lo que el marco sabe hoy de las personas, y dónde

| Dónde | Qué guarda | Quién lo escribe |
|:---|:---|:---|
| `CLAUDE.md` · `firmantes:` | **Un nombre**: `Alberto Martínez` | A mano · `SUITE-R27` |
| `git config user.name` | `Alberto Martínez` — en **esta** máquina | La configuración local |
| El autor de cada commit | Las tres combinaciones de arriba | Git, al commitear |
| `REGISTRY.json` | **Nada.** No hay personas | — |

**Tres sitios que hablan de la misma persona y ninguno enlaza con otro.** `firmantes:` conoce un
nombre y no sabe qué correos son suyos; `git config` da lo que tenga la máquina; el registro —que
es el que **asigna** (`SUITE-R08`)— no sabe que existen personas.

## 3. Quién usa esto hoy, y qué le pasa

**`ramaDe(usuario)` (`PT-054`)** toma `git config user.name` y normaliza a
`cauce/alberto-martinez`. Desde la máquina que dio los 9 commits de `a81Biz` habría producido
`cauce/a81biz` — **otra rama**, para la misma persona, sin que nada lo notara.

**`verify-fdge` contrasta las firmas** contra `firmantes:` (`SUITE-R27`). Funciona porque la firma
se escribe a mano con el nombre canónico; no toca los autores de git, así que las tres identidades
le son invisibles.

**Y nada más.** Ese es el hallazgo tranquilizador: la identidad **casi no se usa** todavía. `PT-064`
y `PT-065` van a usarla mucho, y por eso hay que arreglarla antes.

## 4. Lo que se puede reconciliar sin tocar la historia

Reescribir 228 commits para unificar tres autores es `SUITE-R06f` —historia reescrita— y no hace
falta. Lo que hace falta es una **tabla**:

```
persona ──┬── nombre canónico       de aquí sale su rama (PT-054)
          ├── identidades de git    los pares (nombre, correo) que son suyos
          └── rango de IDs          lo pondrá PT-062
```

Con eso, «de quién es este commit» se responde mirando su autor en la tabla. Y lo que **no** esté
en la tabla se **reporta** (`AC-03`), que es lo único honesto: atribuir por parecido —mismo
apellido, mismo dominio— convertiría una duda en un dato.

## 5. Dónde va la tabla, y por qué no en `CLAUDE.md`

`firmantes:` vive en `CLAUDE.md`, que `SUITE-R00` declara **parametrización, no autoridad**. La
tabla de personas la van a **leer las herramientas** para derivar cifras y ramas, así que va donde
vive lo que las herramientas leen: **`REGISTRY.json`**.

Eso abre un riesgo que `AC-04` tiene que cerrar: dos listas de personas —`firmantes:` y el
registro— es exactamente el patrón que este marco existe para eliminar. La respuesta no es
duplicar ni sustituir: **`firmantes:` sigue diciendo quién puede firmar** —es una decisión de
gobierno, humana y de `CLAUDE.md`— y el registro dice **quién es quién**. Lo que no puede pasar es
que un firmante no exista como persona, y eso sí se comprueba.

## 6. Lo que esto obliga

1. `REGISTRY.json` gana `personas[]`: nombre canónico e identidades de git.
2. `personaDe(autor)` responde con una persona declarada, o **`null` y el motivo** — el mismo
   patrón de tres estados que `EP-015` usó cuatro veces.
3. `ramaDe` deja de leer `git config` a pelo: pasa por la tabla.
4. `verify-suite` comprueba que todo firmante existe como persona.
5. Y las tres identidades de este repositorio quedan reconciliadas **en la tabla**, sin tocar un
   solo commit.
