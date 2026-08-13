# PT-002 — Self-Review   `PHASE 6` · `FDGE-R25`

## Lo que cambió

`audit` deriva de `package.json`, los workflows y `bin/cauce.mjs` **qué herramientas ejecuta
alguna compuerta**, clasifica cada regla en tres estados y publica el número con su
denominador. La frase final deja de ser absoluta.

## Antes y después, sobre el mismo árbol

```
antes    Cobertura completa: sin huecos.

ahora    Cobertura mecánica de las reglas   (SUITE-R26 · aspira, no exige)
           ejecutadas por una compuerta   91 / 167     · HARD 69 / 134
           citadas sin compuerta que las corra   7   → --sin-compuerta las enumera
           sin verificador                69         → --sin-verificar las enumera  (HARD 59)

         Auditoría sin huecos en los elementos auditados. Cobertura mecánica: 91/167.
```

Las 7 de la franja del medio, enumeradas: `SUITE-R19` `FND-R21` `FND-R26` `FND-R28`
`FDGE-R39` `QA-R10` `FIDE-R04`. Todas de instalación o migración — la franja donde vivió
`SUITE-R35` tres versiones enteras.

## Lo que un revisor debería atacar

**1 · «Citada» sigue siendo que el identificador aparezca en el texto de la herramienta.** Un
`SUITE-R11` mencionado en un comentario cuenta igual que uno comprobado. Por eso salen 91 y no
las 85 de mi medición manual, que exigía además que la cita estuviera en una comprobación.
Afinarlo pedía interpretar código, y una heurística peor que la actual habría sido un cambio
sin mejora. **La cifra es un límite superior, y eso no está dicho en la salida.** Es lo más
discutible de este PT.

**2 · La derivación es por nombre de archivo.** Si un workflow menciona `audit.mjs` en un
comentario sin ejecutarlo, cuenta. Mismo sesgo que el punto 1, en la otra fuente.

**3 · Cambié la frase final y rompí dos casos existentes.** Los casos greppeaban `sin huecos`
y mi primera versión escribía `Sin huecos` con mayúscula. Lo arreglé conservando el literal en
minúscula en vez de reescribir los asertos: cambiar el aserto para que encaje con la salida
nueva es como se pierde la señal que ese aserto daba. Está en el código, comentado.

**4 · `--sin-verificar` imprime 69 identificadores en una línea.** Legible para pegar en un
issue, incómodo en un terminal estrecho.

## Lo que NO he verificado

- **Un proyecto destino real.** El caso `SIN EVALUAR` se prueba con una copia de la suite sin
  repositorio alrededor, no con un proyecto instalado de verdad.
- **Que las 69 sin verificador sean irreductibles.** No lo son todas: la cifra dice cuántas
  hay, no cuáles merecen script. Convertirlas es trabajo posterior, una por una, y está en el
  out-of-scope.

## Lo que se rompería si esto estuviera mal

Que la cifra se derivara mal y saliera 0 o el total sin que nadie lo notara. Es lo que cubre
el caso `las ejecutadas ni 0 ni el total`, que exige que esté **estrictamente** entre ambos —
sin él, contar cero o contarlo todo habría pasado los otros seis.

SELF_REVIEW_COMPLETE
