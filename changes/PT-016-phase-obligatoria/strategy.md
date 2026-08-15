# PT-016 — Estrategia   `PHASE 3`

## Objetivo

Que un `PT` vivo sin `phase` **falle**, en vez de desactivar en silencio todas las exigencias por
fase.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Dejarlo en `SIN EVALUAR` | Es lo que hay, y es la vía de escape: no declarar el campo sale gratis y apaga cinco comprobaciones |
| Derivar `phase` de los artefactos presentes | Adivinar la fase desde los archivos es exactamente lo que `RULE-06` prohíbe, y `PT-004` ya lo rechazó |
| Exigirlo a **todo**, incluidos los `EP` | Un lote no tiene fase de PT. Exigírsela obliga a inventar un dato, que es el defecto con otro signo |
| Exigirlo también a lo ya integrado | Pedir la fase a `PT-001`…`PT-004` es pedir que se invente. Tercera vez en este lote que aparece esta frontera |
| **Exigirlo a todo `PT` vivo, con migración declarada** | Es la decisión del firmante, y es donde el campo decide algo |

## Solución

```
1 · SUITE-R08 amplia: toda allocation de tipo PT viva declara «phase». Falta ⇒ ERROR,
      no SIN EVALUAR. Un EP no la declara: su ciclo no tiene fases de tarea
2 · las CINCO plantillas de INTAKE/templates/ la traen, con su valor inicial
3 · migrate la enumera ya —tramo de 5.0.0— y ahora la migracion DICE que desde
      esta version deja de ser un aviso
4 · CHANGELOG con guia de migracion. MAJOR: un proyecto instalado con PTs vivos
      sin phase pasa de verde a rojo, y eso se avisa antes de que ocurra
```

## Por qué la regla es `SUITE-R08` y no una nueva

`SUITE-R08` ya es la dueña del registro —*«todo ID se obtiene de `REGISTRY.json`»*— y `phase` es
un campo de la allocation. Una regla nueva para un campo del mismo objeto sería la fragmentación
que `LEX-R23` evita. `LEX-R22` manda citar, no duplicar.

## La frontera «vivo», por tercera vez

`PT-044` acotó `FDGE-R52` a lo no terminado. `PT-047` acotó la rama igual. Esta hace lo mismo con
`phase`. **Son tres reglas distintas resolviendo la misma pregunta por separado**, y eso es lo que
`SUITE-R38` llama un patrón crítico copiado: hoy las tres definen su propia lista de estados
terminales.

Se unifica en **una** constante exportada, `ESTADOS_TERMINALES`, con su contrato. No es refactor
de paso: es que la cuarta copia divergiría, y este marco tiene cicatrices exactamente de eso.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| Los 10 intakes sin `phase` de este repositorio | 6 son `EP` (exentos) y 4 están `INTEGRATED` (exentos). **Cero errores nuevos aquí**, y se ejecuta para comprobarlo |
| `verify-fdge --all` en un proyecto instalado | Es lo que rompe **a propósito**. La guía de migración lo dice |
| Las tres listas de estados terminales que hoy divergen | Se unifican; caso propio de que las tres se comportan igual |
| `migrate` sobre el legado real | Ya enumera `EP-009` y `EP-014` sin fase. Se ejecuta y se mira que siga diciéndolo |
| Un `EP` al que alguien le ponga `phase` | No falla: declararla de más no es un defecto, solo no se exige |

## Criterios de éxito, derivados de los AC

- `AC-01` → un `PT` vivo sin `phase` da error, no aviso
- `AC-02` → las cinco plantillas la traen
- `AC-03` → la migración lo enumera antes de que rompa
- `AC-04` → `CHANGELOG` con guía y `MAJOR`

## Autorrevisión

Contradicciones: ninguna con `RULE-06` —no se adivina nada, se exige que se declare— ni con
`PT-004`, cuya precedencia no se toca. `AC` sin cubrir: ninguno.

**Lo que no logra, y hay que decirlo:** que el campo sea **cierto**. `PT-044` hace que mentir se
vea; esto hace que faltar cueste. Ninguna de las dos hace que alguien lo mantenga al día.
