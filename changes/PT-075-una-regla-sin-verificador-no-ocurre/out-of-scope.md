# PT-075 — Fuera de alcance   `PHASE 4` · `SUITE-R44`

| Qué queda fuera | Dónde va |
|:---|:---|
| Escribir verificadores para las otras 58 reglas de `TD-08` | `TD-08` |
| Corregir el denominador de `audit` | `PT-067` |
| Que `viabilidad` lea la marca de sesión correcta | `PT-068` `AC-07` · `PT-074` `AC-04` |
| Determinar quién abrió un pull request | `TD-14` |
| Que `avanzar` respete el `STATE_MISMATCH` que `siguiente` bloquea | `PT-077` |
| Cambiar los umbrales de `SAFE`/`MARGINAL`/`UNSAFE` | — |
| Medir el contexto disponible del modelo | — |

**La primera y la segunda** son deuda declarada y medida; esta tarea cubre **las dos reglas que
se incumplieron**, no el conjunto.

**La tercera** es el mismo síntoma —`viabilidad` lee `SESSION.json`, el huérfano— visto desde
otra tarea. Aquí se registra el veredicto **tal como la herramienta lo calcula hoy**, con su
base declarada en `medido_en`; cuando `PT-068` cierre, el veredicto se vuelve a registrar y el
campo `medido_en` deja constancia de contra qué se midió cada vez.

**La cuarta lleva su destino y no es un aplazamiento encubierto:** `TD-14` la declara **no
comprobable**, con el motivo. Es lo que `AC-06` exige en vez de fabricar un verificador que
diga «correcto» siempre.

**La quinta y la sexta** llevan `—` y no aplazan nada: los umbrales los fijó `PT-059` y se
derivan; medir el contexto el marco **no puede**, y `SIN EVALUAR` es la respuesta honesta
(decisión 4 del firmante).
