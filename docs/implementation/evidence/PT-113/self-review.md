# `PT-113` — Autorrevisión   `PHASE 6`

## Qué corrige

La `12.0.0` está publicada en npm y su entrada del `CHANGELOG` **no nombra `SUITE-R59` ni
`LEX-R08`**. npm no se despublica: la única vía es una versión. Iba a ser la `12.0.1`; después de
que `PT-115` llevara el lote a `13.0.0`, es esta.

## El reanclaje, y por qué no es un detalle administrativo

`R-1` del intake. La `12.0.1` **se revirtió** —`1837c22`— porque el trabajo se había hecho **sin
allocation**, que es lo que `§12` del propio intake ya registraba. `AC-06` decae con el reanclaje:
fue escrito para un `PATCH` y exigía *«diff vacío fuera del `CHANGELOG`»*. En un `MAJOR` que trae
`FDGE-R55` y cuatro herramientas tocadas, eso sería exigir lo contrario de lo que el lote hace.

**Un criterio que ya no puede evaluarse no se marca cumplido**: se declara caído con su motivo
(`RULE-06`). Marcarlo verde habría sido más cómodo y habría dejado en la evidencia una afirmación
que nadie podría contrastar.

## `AC-03` estaría en verde aunque no hubiera hecho nada

El intake lo previó como hipótesis en `O-2`. Con el árbol en `13.0.0` **ya ha ocurrido**:

```
reglasNuevasFueraDeLaGuia filtra por IGUALDAD con la versión vigente
    SUITE-R59 rige desde 12.0.0 · el árbol declara 13.0.0
    -> no se contrasta contra ninguna entrada
    -> «sellar» reporta la guía en verde
```

**La compuerta que existe para cazar esta omisión está verde sobre el defecto vivo que la
motivó.** Lo que sostiene el criterio de verdad es `AC-01`, que se deriva del documento leyendo la
entrada. Se declara aquí en vez de apuntarse un verde vacío, y su arreglo es `PT-120`.

Es la misma familia que apareció cuatro veces en `PT-117`: **una comprobación que no se ejecuta
sobre lo que dice vigilar**. Quinta instancia, y la primera en una compuerta de versión.

## `LEX-R08` no se presenta como nueva

Existe desde hace versiones; lo que empieza en la `12.0.0` es que **se compruebe**. Su fila en
`RIGE_DESDE` es lo que impide que los `BUG` cerrados antes salgan en rojo sin salida. Escribirla
como regla nueva habría sido más limpio de leer y falso.

## La cifra

La cabecera decía «Doce tareas»; el registro tiene **diecisiete**. `H-007` otra vez (`PT-091`).
Se corrige, pero **no se deriva**: una entrada en prosa no se genera. Lo contrastable va a
`PT-120`, y decirlo es la diferencia entre `AC-02` cumplido con su límite declarado y `AC-02`
cumplido con el hueco callado.

## Lo que esta tarea no cierra

- **El hueco de `sellar`** — `PT-120`. Tiene ahora una instancia medida en vez de una hipótesis.
- **La `12.0.0` de npm sigue como está.** No se puede cambiar, y se dice.
