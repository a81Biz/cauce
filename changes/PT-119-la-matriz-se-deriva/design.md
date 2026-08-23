# Diseño — `PT-119`   `PHASE 4`

> La propuesta completa. Es lo que `G2` resuelve.

---

## 1 · Qué deriva de dónde

| Columna | Fuente | Cómo |
|:---|:---|:---|
| clase · qué es | `LEXICON` §4.4 | las filas `\| \`CE-nnn\` \| nombre \| enunciado \|` |
| veces | `EVENTOS.jsonl` | registros con esa clase y polaridad ≠ `MENCION` |
| ordinal declarado | `EVENTOS.jsonl` | el máximo de los que la propia entrada escribió |
| primera · última | `EVENTOS.jsonl` | mínimo y máximo de sus fechas |
| tareas | `EVENTOS.jsonl` | los identificadores distintos |
| regla dueña | `RULES.md` · `LEXICON.md` | la regla que **cita** la clase en su propio texto |
| ¿puede fallar? | los `fail()`/`warn()` **reales** | `regla.mjs` · `fallosPosibles` |
| entradas recorridas | la **cabecera** de `EVENTOS.jsonl` | no se recuenta (`SUITE-R38`) |

**Ninguna cifra se transcribe.** La única que no se calcula aquí —«entradas recorridas»— se lee
del generador que la midió, y si no viene se dice `SIN EVALUAR`.

## 2 · «Tiene verificador» no es «la regla existe»

Es que **alguna herramienta emita por ella**. Una regla sin emisión es una obligación que no puede
fallar, y hacerlo visible es el punto entero de la columna:

```
sin dueño                          ninguna regla la reclama
NO: la regla existe y nada emite   hay regla y no puede fallar   ← el caso de SUITE-R59
`ID` falla / `ID` avisa            hay regla y emite
```

## 3 · Dos formas de definir una regla

```
| `SUITE-R59` | HARD | …texto… |            fila de tabla
`SUITE-R14` · **(CHECK)** …texto…           suelta, hasta la primera línea en blanco
```

Las dos son legítimas y las dos se leen. Y **dos documentos propietarios**: `RULES.md` para
`SUITE`/`FDGE`/`FND`/…, `LEXICON.md` para las `LEX-R` (`LEX-R23`).

## 4 · Tres desenlaces

```
r.filas + r.texto      se leyeron las fuentes
r.sinEvaluar = [...]   NO se pudo leer alguna — no se escribe archivo, y se dice cuál
```

Un `EVENTOS.jsonl` con una línea rota **invalida el archivo entero**: no se salta la línea. Saltarla
produciría una matriz con cifras más bajas que parecerían ciertas.

## 5 · Reproducible, para que `--check` signifique algo

Sin fecha de generación. `npm run matriz:check` compara el archivo con una regeneración, y entra
en `npm run verify` junto a `core:check`. Un `.md` derivado desincronizado **falla**.

## 6 · Lo que se propone tocar en `RULES.md`

Diez reglas ganan una frase que **declara la clase que gobiernan**. No cambia ninguna obligación:
añade una afirmación contrastable, y es lo que hace derivable la columna «regla dueña».
