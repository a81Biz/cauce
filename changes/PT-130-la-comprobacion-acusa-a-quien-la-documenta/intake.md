# PT-130 — Una comprobacion cuyo alcance es todo el texto acusa a quien describe el hecho

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-130
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 1
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que describir un hecho en un artefacto no haga fallar la comprobación que vigila ese hecho.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `contradiceElRegistro` ancla su lectura al hecho que evalúa —qué tarea está EN CURSO— y no a cualquier identificador que aparezca en la línea | hoy escanea la línea `tarea:` entera y trata todo `PT-NNN`/`EP-NNN` citado como «afirmado vivo» |
| AC-02 | Citar una allocation cerrada **para decir que está cerrada** no produce un error | una línea `tarea:` que menciona `EP-019` diciendo que está `CLOSED` no puede fallar `SUITE-R34` |
| AC-03 | La comprobación declara **qué hecho establece** y qué no, en el registro de sujetos de `PT-087` | `SUJETOS` la cubre; hoy la cobertura de ese registro es del 3 % |
| AC-04 | Las otras comprobaciones de alcance «todo el archivo» se **enumeran**, aunque no se arreglen aquí | `RULE-06`: se declara lo medido, no se promete lo no medido |
| AC-05 | Ninguna corrección consiste en **evitar la palabra** en la prosa: se arregla el alcance de la lectura, no el texto que la dispara | la inversa: el texto que hoy falla sigue escrito igual y deja de fallar |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: describir un hecho en el artefacto que lo registra deja de ser motivo de rojo.

## 4. Qué NO entra   `[AGENTE]`

- OUT: reescribir los textos que hoy disparan el falso positivo para esquivarlo — sería documentar la limitación en vez de quitarla
- OUT: arreglar todas las comprobaciones de alcance amplio. Se arregla la medida y se **enumeran** las demás
- OUT: cambiar qué establece `SUITE-R34`. El hecho que vigila es correcto; lo que falla es cómo lo lee

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Es la instancia once de una clase que el ledger ya contaba y la matriz no tenía.** `PT-057` la numeró: «**SEXTA** vez del patrón *"la aserción casa con el texto de al lado"*». `PT-060` la séptima. `EP-018` la vio **tres veces en una hora**, «las tres por describir el defecto», y escribió la frase exacta: *«una comprobación cuyo alcance es "todo el archivo" **acusa a quien la documenta**»*.
- **`PT-087` cerró UNA instancia, no la clase.** Aquella fue `SUITE-R27` —«buscaba una frase en TODO el archivo, no la firma en su bloque»—; el mecanismo que construyó, el registro de `SUJETOS`, cubre hoy el **3 %** de las reglas. La clase siguió abierta y volvió a caer.
- **Cómo apareció hoy**: se escribió en el bloque `ESTADO` que los diez commits del cierre citaban `EP-019` **estando `CLOSED`** —para registrar el defecto de `PT-127`— y `SUITE-R34` lo leyó como «`tarea:` afirma que `EP-019` sigue en curso». Rojo en `verify-fdge`, por describir un hecho cierto en el artefacto que existe para registrarlo.
- **El arreglo NO es esquivar la palabra.** El bloque `no hacer` del `HANDOFF` ya advierte de citar identificadores en prosa; seguir esquivándolos es documentar la limitación en vez de quitarla, que es justo lo que `PT-084` rechazó hacer con la plataforma opcional.
