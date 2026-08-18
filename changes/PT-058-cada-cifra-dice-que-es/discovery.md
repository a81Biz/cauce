# PT-058 — Descubrimiento   `PHASE 2`

> Medido contra este repositorio el 2026-08-18.

## 1. El vocabulario ya existe. Sin declarar.

`SIN EVALUAR` aparece **50 veces** en **13 archivos** de la suite — seis documentos normativos y
siete herramientas:

```
CHANGELOG.md          9      tools/selftest.sh        8
tools/verify-fdge.mjs 7      RULES.md                 5
FDGE-Prompts.md       3      tools/revisar-secretos.mjs 3
PHASES.md             2      MANUAL.md                2
tools/tracker.mjs     2      tools/audit.mjs          2
CASOS-DE-USO.md       1      tools/migrate.mjs        1
tools/build-core.mjs  1
```

Y en `LEXICON.md` aparece **cero** veces.

```
grep -c "SIN EVALUAR"  LEXICON.md   →  0
grep -c "MEDIDO"       LEXICON.md   →  0
grep -c "ESTIMADO"     LEXICON.md   →  0
```

**Es exactamente lo que `LEX-R21` prohíbe**: un término de paso introducido fuera de `LEXICON`,
usado por cinco herramientas distintas y por `RULES.md`, sin contrato y sin nadie que lo defina.
El marco lleva ocho lotes usando una palabra que no ha declarado.

Este descubrimiento cambia lo que la tarea tiene que hacer: no introduce vocabulario nuevo,
**regulariza el que ya se usa** y añade los dos que faltan.

## 2. Por qué `verify-suite` no lo vio

`verify-suite` comprueba **vocabulario derogado** (`LEX-R20`): busca los términos de la v3 y falla
si aparecen. Lo que no comprueba —porque nadie se lo pidió— es lo contrario: **un término que se
usa como si fuera canónico sin estar declarado**.

Las dos comprobaciones son distintas y solo una existía. La lista de derogados es cerrada y se
escribe a mano; la de «usados sin declarar» habría que derivarla, y ahí está el trabajo real de
`AC-02`.

## 3. Cómo se usa hoy: como prosa

Los 50 usos son **texto en mensajes**:

```js
// audit.mjs
console.log('  ejecutadas por una compuerta   SIN EVALUAR — no se pudo leer quién invoca las');
? 'SIN EVALUAR' : `${COBERTURA.ejecutada.length}/${TOTAL_REGLAS}`

// revisar-secretos.mjs
? ' · la historia SIN EVALUAR: el clon es superficial y solo ve un commit'
```

Funciona para un humano que lee la salida, y **no es comprobable**: nada impide escribir una cifra
sin decir qué es, porque no hay estructura donde decirlo. `AC-04` —una cifra sin naturaleza
declarada **falla**— no se puede cumplir sobre prosa.

## 4. Las cifras que ya existen, y qué son de verdad

`PT-057` dejó la primera fuente de cifras del presupuesto. Clasificadas:

| Cifra | Qué es | Por qué |
|:---|:---|:---|
| `commits`, `archivos`, `lineas` de una tarea | **`MEDIDO`** | Se cuentan de git. Se pueden volver a contar |
| `casos` (cuántas tareas hay en el grupo) | **`MEDIDO`** | Se cuentan del registro |
| La **mediana** del grupo | **`ESTIMADO`** | Describe lo que *suele* costar. Nadie ha medido «tu» tarea |
| El coste de una tarea **sin commit propio** | **`SIN EVALUAR`** | 8 de 54. No costaron cero: no se puede saber |
| Un grupo con menos de `MINIMO_REFERENCIA` | **`SIN EVALUAR`** | `costeDe` ya devuelve `null` con motivo |
| El contexto restante del modelo | **`SIN EVALUAR`** | El marco no puede medirlo (decisión 4) |

**La mediana es el caso interesante.** Está calculada sobre datos medidos, y aun así **no es una
medición**: es una referencia de un grupo aplicada a una tarea que nadie ha medido. Si esa
distinción se pierde, el presupuesto de `PT-059` decidirá sobre una estimación creyendo que tiene
un dato — que es literalmente el `estimated_used: 67` que `LEX-R26` dejó fuera por criterio.

## 5. Lo que `AC-03` tiene que impedir, con nombre

Hoy no hay ninguna operación que sume presupuesto, así que **no hay todavía un sitio donde
`SIN EVALUAR` pueda convertirse en cero**. Pero `PT-059` va a construirlo, y ahí el riesgo es
concreto:

```
disponible = total - gastado
```

Si `gastado` es `SIN EVALUAR` y se trata como `0`, `disponible` sale **máximo**: el presupuesto
parece holgado precisamente cuando no se sabe nada. El defecto no es que dé error — es que **da
verde**.

La defensa no puede ser «acordarse»: tiene que ser que una cifra `SIN EVALUAR` **no se pueda
operar** sin decidir explícitamente qué hacer con ella.

## 6. Lo que esto obliga

1. Las tres naturalezas van a `LEXICON` **como vocabulario cerrado** (`AC-02`, `AC-05`), y eso
   regulariza 50 usos que ya existen.
2. Hace falta una **estructura** —no una convención de redacción— donde una cifra lleve su
   naturaleza (`AC-01`), o `AC-04` es incomprobable.
3. `SIN EVALUAR` tiene que ser **inoperable por accidente** (`AC-03`), no solo «distinto de cero».
4. `verify-suite` tiene que poder comprobar que no aparece una cuarta naturaleza (`AC-02`).
