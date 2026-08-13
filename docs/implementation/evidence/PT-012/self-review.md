# PT-012 — Self-Review   `PHASE 6` · `FDGE-R25`

## Antes y después, sobre el proyecto legado

```
antes   1 acción pendiente:  «actualizar suite_version en el CLAUDE.md»

ahora   7, detectadas sobre SU estado:
        el bloque ESTADO · escribirlo al cerrar cada fase · declarar phase en EP-009 y
        EP-014 · la plataforma como opción · qué llega nuevo · las excepciones firmadas ·
        el CLAUDE.md
```

`selftest` 256 → **266** casos.

## Lo que un revisor debería atacar

**1 · La lista de «qué llega nuevo» está escrita a mano.** Nombra `tracker`,
`revisar-secretos`, `comparar-marco`, `verify-patrones`, `version`, `patrones`, `FIDE/` y
`TAREA.md`. **Es un hecho copiado** (`RULE-01`): si mañana llega una herramienta más, esta
lista se queda atrás en silencio. Se podría derivar comparando el paquete con el destino
—`comparar-marco` ya hace algo parecido— y no lo hice. **Es la deuda más clara de este PT**, y
está en el out-of-scope enumerada en vez de en un párrafo.

**2 · Los mensajes son largos.** Cada acción pendiente explica **por qué**, y el informe ocupa
pantalla y media. Lo defiendo —quien lo lee está decidiendo si migrar, y `RULE-07` dice que la
salida se escribe para quien decide— pero un informe que no se lee entero no sirve, y este
está en el límite.

**3 · El umbral es `lt('5.0.0')`, no `4.12`.** Un proyecto en 4.5 recibe el mismo tramo. Es
correcto, porque todo lo que pide se introdujo en 5.0.0 o después, pero el nombre de la tarea
dice «desde 4.12» y el código dice «desde cualquier 4.x».

**4 · Un aserto mío estaba mal y lo dijo el caso.** Comprobaba que sin plataforma no se
mencionara `SUITE-R42`; sí se menciona, explicando qué activaría declararla. Corregido a
comprobar que no aparezca la **exigencia**.

## Lo que NO he verificado

**La migración de verdad.** El informe dice qué falta; que ejecutarlo entero deje ese proyecto
en verde no se ha comprobado, y no puede comprobarse sin migrarlo — que está en el out-of-scope
del lote.

SELF_REVIEW_COMPLETE
