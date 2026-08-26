# PT-149 — la prueba mecánica: alta y baja sin tocar una herramienta

> Tarea dentro de la implementación abierta `EP-022` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-149
type: CHORE
epic: EP-022
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-24
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Qué se quiere   `[HUMANO]`

Es la tarea que **cierra el lote**, y la única que puede demostrar su criterio de éxito.

Después de `PT-148` el marco **dice** que un componente se declara y no se escribe a mano. Decirlo
no es tenerlo: el propio `CASOS-DE-USO.md` distingue entre un caso descrito y un caso
**ejecutado**, y registra que fue ejecutar el marco —no leerlo— lo que encontró los dos `S1` de
`PT-072`.

Esta tarea añade a `selftest.sh` un caso que:

```
1. da de ALTA un componente de prueba en el contrato — solo el contrato
2. comprueba que las cuatro herramientas lo ven:
     verify-suite   sus reglas se recogen y se contrastan (no pasan en verde por invisibles)
     build-core     aparece en CORE.md con sus reglas y sus triggers
     audit          aparece en la cobertura con su rango de fases
     comparar-marco si se declara opcional y falta su directorio, no es enlace roto
3. da de BAJA el componente
4. comprueba que el árbol queda EXACTAMENTE como estaba — byte a byte
```

El paso 4 es el que convierte esto en una prueba y no en una demostración: **restable** significa
que la baja no deja residuo, y eso solo se sabe comparando.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El caso da de alta un componente tocando **únicamente** el contrato | el diff del alta: un solo archivo |
| AC-02 | Las cuatro herramientas lo reconocen, cada una con su comprobación propia | las cuatro aserciones del paso 2 |
| AC-03 | **Una regla del componente de prueba mal citada FALLA** `verify-suite` | se rompe a propósito y el verificador la caza |
| AC-04 | La baja deja el árbol idéntico al de partida | `git status` limpio y `build-core --check` en verde tras la baja |
| AC-05 | El caso corre dentro de `npm run verify`, no aparte | ejecución de la batería completa |
| AC-06 | El componente de prueba **no queda declarado** al terminar la batería, ni siquiera si falla a mitad | el `trap` de limpieza, probado interrumpiendo el caso |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: `npm run verify` da de alta un componente, comprueba que las cuatro
> herramientas lo ven, lo da de baja, y deja el árbol byte a byte como estaba — y falla si
> cualquiera de esos cuatro pasos no ocurre.

## 4. Qué NO entra   `[AGENTE]`

- OUT: usar `DICTAMEN` como componente de prueba. El fixture es un componente **ficticio y
  desechable**; declarar el real aquí afirmaría que existe (`EP-023` lo construye).
- OUT: probar que el componente de prueba *funciona* — no tiene fases, ni prompts, ni
  especificación. Se prueba el **alta y la baja**, no el componente.
- OUT: ejecución concurrente de la batería. `EXEC-R08`, y el `HANDOFF` ya registra que dos
  baterías a la vez sobre el mismo árbol dieron «HAY FALLOS» sin un solo caso rojo visible.

## 5. Firma

```
Firmado por lote: EP-022
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-03` es el corazón del lote, no `AC-02`.** Que la herramienta *vea* el componente es
  fácil de aparentar; que **falle** cuando algo está mal es lo que distingue una comprobación de
  un adorno. Sin `AC-03`, esta prueba podría pasar con las cuatro herramientas ignorando el
  componente en silencio — exactamente el defecto que el lote existe para quitar.

- **`AC-06` nace de un aviso que ya está escrito.** El `HANDOFF` advierte de no editar
  `selftest.sh` mientras corre, porque bash lo lee por desplazamiento de bytes y parte los
  heredoc. Un caso que escribe y borra una declaración durante la batería está cerca de ese
  filo: la limpieza tiene que ser un `trap`, no la última línea del caso.

- **Riesgo declarado: la prueba puede quedar en tautología.** Si el fixture se declara con los
  mismos valores que el contrato ya usa para un componente real, las cuatro aserciones podrían
  pasar por parecido en vez de por mecanismo. El fixture tiene que tener **prefijo, sigla y
  nombre distintos entre sí** — que es justo el caso irregular de `Foundation → FND` que
  `PT-147` convierte en campo.
