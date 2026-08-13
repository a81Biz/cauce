# PT-002 — Contexto   `PHASE 2` · análisis `2-B`

## Documentación consultada   `FDGE-R07`

| Fuente | Qué aportó |
|:---|:---|
| `RULES.md` §`SUITE-R26` | «Toda regla HARD **aspira** a comprobación mecánica» — aspira, no exige. Es la regla que `audit` dice comprobar |
| `RULES.md` §`SUITE-R11` | «Ningún score es válido sin cobertura y freshness declaradas junto al número» — el criterio que el marco aplica a los demás |
| `CORE-PTSA.md` §`PTSA-R77` `PTSA-R78` | Matriz de cobertura: toda celda lleva valor, `coverage = evaluadas / universo`, y `NO_EVALUADA` no es un aprobado |
| [11-Conventions.md](../../docs/enterprise-documentation/11-Conventions.md) | `RULE-02` un fallo distinguible del éxito · `RULE-06` lo no comprobable se declara · `RULE-07` la salida dice qué hacer |
| `changes/PT-001-*/` y `changes/PT-004-*/` | Los dos defectos hermanos ya cerrados. `audit` no vio ninguno de los dos |

## Estado del grafo   `FDGE-R43` · `FDGE-R08`

`FRESH`, alcance `bin`, no cubre `tools/` (`TD-01`). Sustituido por enumeración directa, que
sobre 15 herramientas sin dependencias externas es exhaustiva. Declarado, no omitido.

## La medición, tomada hoy

```
RULES.md          167 reglas · 134 HARD

  85  con verificador que ALGUNA compuerta ejecuta        (64 HARD)
   8  cuyo unico verificador no lo ejecuta ninguna        SUITE-R19 SUITE-R21
      compuerta — todas de instalacion o migracion,       FND-R21 FND-R26 FND-R28
      invocadas por procedimiento en su momento           FDGE-R39 QA-R10 FIDE-R04
  74  sin ningun verificador                              (63 HARD)

audit.mjs         «Cubiertos: 572 · Cobertura completa: sin huecos»
```

**Se remidió después de `PT-001`**, no se copiaron los números del intake: cablear el espejo
movió tres reglas de columna. Un dato de hace dos horas ya no era cierto, que es exactamente
lo que `RULE-01` dice de copiar hechos.

## Qué mide hoy `audit`

[`audit.mjs:378-392`](../../docs/methodology/tools/audit.mjs). Agrupa las reglas por prefijo
de componente, cuenta cuántas aparecen citadas en el texto de las herramientas, y **solo
declara un hueco si un componente tiene cero**. Con 1 verificada de 20, el componente pasa.

El comentario de la función dice por qué nació así: la auditoría adversaria de la 5.2.0
encontró `QA` 0/19 y `FPGE` 0/10 —dos componentes enteros sin ninguna comprobación— y esto se
escribió para cazar ese caso. **Lo caza.** Lo que no hace es lo que su informe afirma.

## Restricciones

`RULE-02` un fallo distinguible del éxito · `RULE-04` cero dependencias · `RULE-05` un
verificador no escribe · `RULE-06` lo no comprobable se declara · `RULE-07` la salida dice qué
hacer · `SUITE-R26` sigue diciendo «aspira»: este PT **no** convierte la cobertura en umbral.

## Confianzas declaradas   `FDGE-R09`

| Eje | Valor | Sustento |
|:---|:---|:---|
| Root Cause | **95 %** | La condición está en una línea y el efecto se reproduce ejecutando `audit` |
| Architecture | **90 %** | `audit` no tiene consumidores más allá de `npm run audit` y el paso de CI |
| Solution | **80 %** | Queda abierto **qué cuenta como «tiene verificador»**: hoy es que el ID aparezca en el texto de una herramienta, y eso incluye menciones en comentarios |

Ninguna bajo el 70 %.
