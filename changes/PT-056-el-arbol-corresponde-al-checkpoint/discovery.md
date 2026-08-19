# PT-056 — Descubrimiento   `PHASE 2` · `2-B`

## Lo que el checkpoint declara hoy, y qué de eso sirve

```
pt · type · epic · status · phase · fase     del registro       no dicen nada del arbol
rama                                          de git            CONTRASTABLE
sha · sha_corto                               de git            CONTRASTABLE
sucio · archivos                              de git            NO contrastables — ver abajo
compuerta · produce · siguiente               derivados          no dicen nada del arbol
generado                                      de git
```

**Solo dos campos pueden sostener una correspondencia: `sha` y `rama`.** Los demás describen la
tarea, no el árbol.

## Por qué `archivos` y `sucio` NO pueden ser criterio

Medido en este mismo repositorio, mientras se escribía este documento:

```
checkpoint.sha        87710a9        HEAD ahora   87710a9     CORRESPONDEN
checkpoint.archivos   3 archivos     ahora        5 archivos  YA NO
```

**Trabajar cambia la lista sin parar.** El `sha` sigue siendo el mismo —no se ha commiteado nada—
y la lista ya divergió en el tiempo que se tardó en escribir tres párrafos.

Si la lista fuera criterio, **la discrepancia sería el estado normal** y el aviso se ignoraría
desde el primer día. Es exactamente lo que `AC-03` protege.

## La cadena que hay que verificar, y dónde se rompe

```
CHECKPOINT          declara sha y rama
     ↓
commit SHA          existe y es alcanzable          ← ya lo comprueba PT-052 (LEX-R26)
     ↓
arbol esperado      el arbol de ESE commit
     ↓
arbol real          el HEAD actual + los cambios sin commitear
```

`PT-052` cerró el primer eslabón. **El segundo está abierto**: nada compara el árbol esperado con
el real.

Y el hueco no es teórico. Medido en `EP-014`:

```
commits por tarea    PT-049: 7   PT-050: 6   PT-051: 4   PT-052: 6   PT-053: 10   PT-054: 5
```

**Cada commit deja el checkpoint desfasado hasta que `avanzar` lo reescribe**, y `avanzar` solo
corre en las transiciones de fase — de las que hay nueve por tarea frente a **hasta diez commits**.
La ventana en la que el checkpoint apunta a un `sha` que ya no es `HEAD` es **el estado habitual
entre transiciones**.

## Las tres discrepancias posibles, y cuál es cada una

| Qué difiere | Qué significa | Es discrepancia |
|:---|:---|:---|
| `HEAD` ≠ `sha` declarado | El árbol avanzó (o retrocedió) desde el checkpoint | **Sí** |
| rama actual ≠ `rama` declarada | Se está en otra tarea, o se cambió de rama | **Sí** |
| árbol sucio | Hay trabajo sin commitear | **No**: es lo normal |
| lista de archivos distinta | Se editó algo más desde el checkpoint | **No**: cambia sin parar |

**Las dos primeras son las que importan y son baratas de comprobar.** Las dos últimas describen
progreso, no divergencia.

## Lo que NO es el defecto

No es que `PT-052` hiciera mal su trabajo: **declaró explícitamente** que la correspondencia no
estaba ahí y que era de este lote, en `LEX-R26` y en el comentario de `verify-fdge.mjs:438`. Lo que
falta es lo que aquella tarea dejó dicho que faltaba.

Y no es que el checkpoint se desfase entre transiciones. **Eso es correcto**: es una foto, no un
espejo. Lo que falta es que, al **retomar**, alguien compare la foto con lo que hay.
