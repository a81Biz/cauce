# PT-048 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

El cuerpo de un issue **no enlaza a un directorio que no existe**: dice qué hay. Los issues #26 y
#25 dejaron de apuntar a un 404, y con directorio el enlace queda idéntico.

```
selftest   485 → 491 casos
```

## Lo que solo se vio ejecutando

**1 · Un caso que no se ejecutaba.** Escribí `trlibno` dando por hecho que existía; bash lo trató
como orden no encontrada y **el arnés no se puso rojo**: el contador subió de 485 a 489 en vez de
490. Esa única cifra fue todo el aviso. Un caso que no corre es peor que no tenerlo — ocupa el
sitio del que sí comprobaría. Está definido, con su porqué al lado.

**2 · El arreglo dejaba una nota sin sentido.** El cuerpo decía «sin artefactos todavía» y justo
debajo «el enlace apunta a…». Lo vi **mirando el issue publicado**, no leyendo el diff.

## Lo que un revisor debería atacar

**1 · `=== false` es frágil de leer.** Es deliberado —un `undefined` no es un «no existe»— pero
alguien que lo simplifique a `!hayDirectorio` apaga el enlace en **todos** los cuerpos. El caso
`E5` lo protege; la sintaxis, no.

**2 · El defecto se estaba enmascarando mientras se arreglaba.** Las diez `DEFERRED` que apuntaban
a un 404 por la mañana eran dos al llegar aquí: `EP-013` activó ocho y les creó el directorio. Si
el lote hubiera empezado por esta tarea, el defecto habría sido cinco veces más visible.

## Lo que NO he verificado

Que alguien lea esos issues. Es lo de siempre.

## Checklist

- [x] `AC` verificados con evidencia en disco · sin huérfanos en `traceability.md`
- [x] El código hace lo que dice `design.md` · delta registrado
- [x] Sin regresiones: `selftest` 491/491 · `verify-suite` · `verify-fdge --all`
- [x] Commits atómicos · sin restos de depuración · `out-of-scope.md` intacto
- [x] Sin problemas de seguridad evidentes (`FDGE-R45`)
- [x] Contrato público: `cuerpoDeIssue` sigue siendo pura y exportada
- [x] Rama propia creada en `PHASE 5` y declarada en el registro (`FDGE-R19`)

SELF_REVIEW_COMPLETE
