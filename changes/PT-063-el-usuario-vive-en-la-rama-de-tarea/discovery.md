# PT-063 — Descubrimiento   `PHASE 2`

> Medido el 2026-08-18.

## 1. El formato de rama **no se comprueba**

`FDGE-R19` declara la topología en tres niveles y fija la rama efímera como `<type>/PT-NNN-slug`.
Buscando quién lo verifica:

```js
// verify-fdge.mjs · lo único que mira la rama
if (fase >= 5 && !terminal && !alloc.branch) {  fail('FDGE-R19', '…no declara rama…')  }
else if (fase >= 5 && alloc.branch)          {  ok('FDGE-R19', `rama «${alloc.branch}» declarada.`) }
```

**Comprueba que exista, no cómo se llama.** Ninguna herramienta parsea el formato: ni
`verify-fdge`, ni `tracker`, ni `verify-suite`.

## 2. Lo que eso significa para el cambio

El intake del lote declaró esta tarea como el `MAJOR` que **rompe compatibilidad**. Medido, es
menos disruptivo de lo que parecía:

| | |
|:---|:---|
| Ramas declaradas en el registro | **22**, todas de **dos** niveles |
| Ramas vivas en el remoto | 29 |
| Comprobaciones que se romperían | **ninguna** |

Cambiar `FDGE-R19` es un cambio de **texto normativo**: dice cómo hay que llamar a la rama nueva.
Nada mecánico deja de funcionar, y las 22 ramas de dos niveles siguen pasando la verificación
exactamente igual.

**Sigue siendo `MAJOR`** —`SUITE-R19`: cambia el texto de una regla `HARD` vinculante y los
proyectos instalados tienen que enterarse— pero la migración es **leer**, no ejecutar nada.

## 3. Y eso abre la pregunta de verdad

Si nada comprueba el formato, **¿debe comprobarse ahora?**

Añadir una comprobación estricta rompería `AC-04`: las 22 ramas existentes son de dos niveles y
fallarían todas. Y renombrarlas está fuera de alcance —romperían los PR abiertos sobre ellas—.

No añadir ninguna deja la regla como estaba: un texto que nadie aplica, que es exactamente el
defecto que `FDGE-R19` documenta de sí misma —«el marco mandaba crear la rama desde la primera
versión, **ningún verificador la miraba**, y 46 tareas seguidas se implementaron sobre la rama de
integración sin que nada lo dijera»—.

## 4. Lo que ya existe y sirve

`PT-061` dejó `personaLocal`, que resuelve el **nombre canónico** de quien trabaja. `ramaDe` ya lo
usa para la rama derivada `cauce/<usuario>`, y normaliza igual: minúsculas, sin acentos, guiones.

El mismo normalizador vale para la rama de tarea: `Alberto Martínez` → `alberto-martinez`.

## 5. `trabajo` y `G4`, que no se tocan

La decisión 3 del firmante es explícita y esta fase la confirma contra lo que hay:

```
trabajo         UNA rama de integración · 29 ramas remotas y ninguna «trabajo/<algo>»
G4              UNA por lote · EXEC-R03 · verify-fdge --gate G4 lo exige sobre el PR del lote
```

Nada de esto cambia. Lo único que cambia es **cómo se llama la rama efímera**.

## 6. Lo que esto obliga

1. `FDGE-R19` dice el formato nuevo: `<type>/<usuario>/PT-NNN-slug`.
2. La rama nueva la propone la herramienta, con el **nombre canónico** de `PT-061`.
3. Una comprobación que **avise** —no que falle— cuando una rama no lleve usuario: las 22
   existentes tienen que seguir valiendo (`AC-04`), y una regla sin nada que la mire es lo que
   `FDGE-R19` documenta como su propia causa.
4. `trabajo` y `G4` **no se tocan**, y hay que comprobarlo para que se vea que no se tocaron.
5. Guía de migración en el `CHANGELOG` al cerrar el lote: **leer**, no ejecutar.
