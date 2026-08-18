# PT-017 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

La lista de «qué llega nuevo» se **deriva** restando los dos directorios. Sobre el proyecto legado
real, la escrita a mano decía **6**; la derivada dice **7 — e incluye `regla.mjs`**, que faltaba.

```
selftest   491 → 495 casos
```

## Lo que solo se vio ejecutando

**El caso anterior asertaba la constante.** `chk "4.12 ⇒ enumera lo que llega" "revisar-secretos"`
pasaba porque esa palabra estaba en el texto fijo. Al derivar, el fixture tiene **todas** las
herramientas, la resta da vacío y el caso se puso rojo — **con razón**. Se reescribió quitando dos
del destino para que la resta tenga algo que decir.

Es un caso que probaba que un texto contenía una palabra, no que la herramienta hiciera su
trabajo. Solo se vio al cambiar lo que había debajo.

## El acoplamiento que declaré antes de tocarlo

El `PORQUE` de `PT-043` reconoce esta acción por la frase **`lo que llega nuevo`**. Si el texto la
pierde, la fila cae en el `RULE-06` por defecto y el conductor deja de explicarla. Está anotado en
el código, junto al texto, y tiene su caso — porque es la clase de rotura que ocurre al reescribir
un mensaje sin saber que alguien lo lee.

## Lo que un revisor debería atacar

**1 · Compara presencia, no contenido.** Una herramienta que existe en los dos lados pero cambió
no aparece. Eso es `comparar-marco`, que ya existe; está en `out-of-scope` con su motivo.

**2 · El filtro es `.mjs` y `.sh`.** Si mañana una herramienta llega con otra extensión, no la ve.
Es una lista, y las listas se quedan cortas — segunda vez que lo escribo en este lote.

**3 · Los documentos de `FIDE/` y las plantillas siguen nombrados como bloque**, no por archivo.
Mismo defecto, mismo arreglo posible; se dejó fuera para no ampliar sin medir.

## Lo que NO he verificado

Que la lista derivada se lea. Es lo de siempre, y en este caso con un agravante que ya está en
`discovery.md`: **quien la lee es quien menos puede detectar que está incompleta.** Por eso
importaba que no lo estuviera.

## Checklist

- [x] `AC` verificados con evidencia · sin huérfanos en `traceability.md`
- [x] Código conforme a `design.md` · delta registrado
- [x] Sin regresiones: `selftest` 495/495 · `verify-suite` · `verify-fdge --all`
- [x] Commits atómicos · sin restos de depuración · `out-of-scope.md` intacto
- [x] `FDGE-R45` · contrato público de `migrate` intacto: misma interfaz, mismos códigos
- [x] Rama propia creada en `PHASE 5` y declarada en el registro

SELF_REVIEW_COMPLETE
