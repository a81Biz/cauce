# `PT-167` · `design.md` — `PHASE 4`

## 1. `identificadoresDeHueco(textos, valores)`

Lee el **segundo** argumento de `gap(clase, ELEM, falta)` — el **identificador** del hueco, no su
prosa— y lo **instancia** con los valores que `COMPONENTES` declara:

```
`${comp} PHASE ${n}`  ×  [FDGE, FQAGE, PTSA, Foundation, FPGE, FIDE, …]
  →  «FDGE PHASE», «FIDE PHASE», «Foundation PHASE», …
`${comp} fases`       →  «FPGE fases», …
```

**32 cadenas** que la herramienta emite **sólo cuando algo falta**.

## 2. `casosInvertidos(arnes, identificadores)`

Un `chk` cuyo patrón esperado **contiene** una de esas cadenas está afirmando un hueco. Devuelve
línea, nombre del caso, patrón y qué identificador casó — **no un booleano**: quien lo lea tiene
que poder ir al caso sin buscarlo.

## 3. Sale por `warn`, no por `gap`

`audit` emite `SUITE-R61` con la lista. **Candidato, no defecto** — y el nombre `warn` no es libre:
`regla.mjs` deriva quién comprueba una regla buscando `fail(` y `warn(`.

## 4. Los ocho casos, y por qué son ocho

```
4  cazan los conocidos      FIDE PHASE · FPGE PHASE · Foundation PHASE · FPGE fases
3  NO cazan los legitimos   «no puede perder ninguno» · «ninguna puede desaparecer» · «EN SU ORDEN»
1  el arbol real            cero casos invertidos
```

**Los tres del medio son el freno.** Sin ellos, un barrido que cazara todo pasaría los cuatro
primeros y mataría los casos de `PT-149` que prueban que el contrato **no puede encoger**.

## 5. Lo que este diseño NO resuelve

- **Que un caso invertido con otra forma se escape.** El barrido conoce las cadenas que `gap()`
  emite hoy; una comprobación que reporte de otra manera queda fuera. Se dice (`SUITE-R26`).
- **Que un candidato sea de verdad un defecto.** Eso lo decide quien mire.
