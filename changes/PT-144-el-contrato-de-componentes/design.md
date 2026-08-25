# PT-144 · `design.md` — `PHASE 4` Proposal

> Las decisiones y **por qué esta y no otra**. Antes de `G2`: cero líneas de código, cero ramas
> (`FDGE-R13`).

## 1. Dos tablas, no una

`PHASE 3` §2 encontró que los catorce sitios no consultan un solo hecho, sino dos que hoy están
mezclados:

```
COMPONENTE           lo que tiene fases, triggers, directorio y puede no instalarse.
                     Son SEIS: FDGE · FQAGE · PTSA · Foundation · FPGE · FIDE

FAMILIA DE REGLAS    un prefijo de regla con un documento propietario.
                     Son DIEZ, y solo seis coinciden con un componente.
```

Las cuatro que **no** son componentes son `SUITE`, `LEX`, `EXEC` e `INTAKE`. Y no es una
invención de esta tarea: **`RULES.md` §«Dónde vive cada familia de reglas» ya declara esa tabla**,
con su documento propietario por familia. El contrato la lleva porque ya existe, no porque haga
falta un concepto nuevo.

**Esto explica la discrepancia entre `build-core:171` y `:183`, que era el enigma del lote:**

```
:171  familias cuyas reglas se recogen de la PROSA de RULES.md      7 entradas
      SUITE FND FDGE INTAKE QA FPGE FIDE
      faltan LEX, EXEC y PTSA porque sus reglas NO viven en RULES.md

:183  orden de EMISION de todos los prefijos                       10 entradas
      SUITE LEX EXEC FND FDGE INTAKE QA PTSA FPGE FIDE
```

No eran dos listas que «coincidían por costumbre»: eran **la misma tabla filtrada por un campo
que nadie había escrito**. Ese campo es `documento`, y `RULES.md` ya dice cuál es para cada una.

## 2. La forma

```
COMPONENTES   nombre · sigla · prefijo · directorio · obligatorio · triggers · fases · en_core
FAMILIAS      prefijo · documento · orden

prefijos()          derivada de FAMILIAS, en su orden       -> los 5 sitios de verify-suite
opcionales()        derivada de COMPONENTES.obligatorio     -> los 2 Set(['FIDE'])
familiasEnProsa()   FAMILIAS con documento === RULES.md     -> build-core:171
ordenDePrefijos()   FAMILIAS por orden                      -> build-core:183
triggers()          derivada de COMPONENTES.triggers        -> build-core:433
promptsDe()         derivada de COMPONENTES                 -> audit:192
fasesDe()           derivada de COMPONENTES.fases           -> audit:197
siglaDe()           derivada de COMPONENTES.sigla           -> audit:214, el ternario
```

Cada proyección **declara en su comentario a qué sitio sustituye**. Es lo que convierte esta
tarea en verificable: `PT-145`..`PT-147` no tienen que adivinar cuál usar.

## 3. Por qué `sigla` es un campo y no una regla

`audit.mjs:214` es hoy `comp === 'Foundation' ? 'FND' : comp`. La tentación es una función
`siglaDe(nombre)` con la excepción dentro — y sería **la misma excepción, escrita en otro sitio**.

Con `sigla` como campo, el caso irregular deja de ser irregular: `Foundation` tiene
`sigla: 'FND'` como `FDGE` tiene `sigla: 'FDGE'`. Y el siguiente componente cuya sigla no sea su
nombre —`FQAGE`, que en triggers y rutas se llama `QA` (`LEX-R03`)— **ya está cubierto sin tocar
nada**.

**Y hay un segundo caso, que no es un defecto de `audit` pero sí un requisito del contrato.**
`LEX-R03` declara que el componente se llama **`FQAGE`** en prosa normativa y **`QA`** en
triggers, rutas y nombres de archivo. `audit.mjs` no necesita ternario para él porque **usa la
sigla como clave** (`QA: 'QA/QA-Prompts.md'`), no el nombre normativo — el ternario existe solo
porque a `Foundation` lo llama por su nombre.

Es decir: `audit` mezcla hoy los dos vocabularios, sin equivocarse y sin declararlo. El contrato
lo separa —`nombre` y `sigla`— y **cada consumidor pide el que necesita**. Eso hace que `PT-147`
pueda quitar el ternario sin cambiar ninguna clave.

## 4. `fases` admite no saber

`PHASE 3` §5.1 lo midió: `LEXICON` §3 declara el rango de cinco componentes y **no tiene apartado
para `FPGE`**.

```
fases: [0, 10]        FDGE        LEXICON §3.1
fases: [1, 7]         FQAGE       LEXICON §3.2
fases: [0, 14]        PTSA        LEXICON §3.3
fases: [0, 6]         Foundation  LEXICON §3.4
fases: [1, 5]         FIDE        LEXICON §3.5
fases: SIN_EVALUAR    FPGE        LEXICON no lo declara — RULE-06
```

`SIN_EVALUAR` **ya existe** en `patrones.mjs` y tiene su semántica definida. No se inventa un
valor nuevo: se usa el que el módulo ya tiene para «no lo sé», que es exactamente lo que
`RULE-06` pide y lo que distingue este campo de un cero.

## 5. Lo que se rechazó, y por qué importa la tercera

| Rechazado | Motivo |
|:---|:---|
| Un `Set` de nombres | No sostiene sigla, fases ni opcionales |
| Un `.json` de datos | Pierde el comentario de contrato, que en este módulo es la mitad del valor |
| **Parsear `LEXICON.md` en runtime** | **`RULE-02`**: un parseo degradado devuelve lista vacía y **todo pasa en verde**. Sustituiría catorce literales por un punto de fallo silencioso |
| Objeto plano y que cada herramienta filtre | Mueve el literal y deja la decisión — §1 |

La tercera es la que parecía más correcta (`LEXICON` manda sobre el dato, `LEX-R21`) y es la más
peligrosa. **El contrato cita de dónde sale cada valor en su comentario; no lo parsea.** Un
verificador no puede depender de leer prosa para saber qué tiene que verificar.

## 6. Cómo falla si se rompe

`RULE-02` exige que el fallo sea distinguible del éxito. Las aserciones de `verify-patrones.mjs`
siguen el precedente de `selloDe` (`:60-68`) y fallan citando `SUITE-R38`:

```
sin los seis componentes            -> falla: cuenta esperada
un campo obligatorio ausente        -> falla: nombra el componente y el campo
una sigla que no case su prefijo    -> falla: Foundation/FND es el caso que lo prueba
una familia sin documento           -> falla
orden con huecos o repetido         -> falla
fases que no sean par ni SIN_EVALUAR-> falla
```

Sin `RC-04` —romper un campo a propósito y ver que falla— el contrato se cumpliría hoy y
divergiría mañana, que es literalmente el defecto que la tarea quita.

## 7. Rama propuesta — **no se crea aquí** (`FDGE-R13`)

```
chore/alberto-martinez/PT-144-el-contrato-de-componentes
```
