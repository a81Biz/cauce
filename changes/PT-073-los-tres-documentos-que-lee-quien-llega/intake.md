# PT-073 — Los tres documentos que lee quien llega

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-073
type: CHORE
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 10created: 2026-08-19
structural: no
suite_version: 10.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Que `MANUAL.md`, `CASOS-DE-USO.md` y el `README.md` estén al día y completos, **derivados de lo que las dos pruebas necesitaron**. `CASOS-DE-USO` declara todavía como hueco «varios agentes trabajando a la vez», que cerró `EP-016`: el catálogo describe un marco de la 8.0.0.»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Cada hueco anotado en `PT-072` y `PT-019` tiene su línea | la trazabilidad es hueco → línea del documento, no «se revisó» |
| AC-02 | Los huecos declarados en `CASOS-DE-USO` corresponden a la 9.0.0 | «varios agentes a la vez» deja de figurar como hueco; los que sigan abiertos se declaran con su motivo |
| AC-03 | El `README` describe lo que un instalador se encuentra hoy | la primera página de npm no promete nada que las dos pruebas no hayan hecho |
| AC-04 | Ninguna cifra escrita a mano que ya se derive | es el defecto `D4`/`D5` del primer Foundation, y volvería igual |
| AC-05 | El `MANUAL` lleva de cero al primer trabajo cerrado con los pasos que la prueba usó | no con los que creíamos que haría falta |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: los tres documentos describen la 9.0.0, cada hueco de las dos pruebas tiene su línea, y no queda ningún hueco declarado que `EP-016` ya cerrara.

## 4. Qué NO entra   `[AGENTE]`

- OUT: Reescribir los documentos de `docs/methodology/` que no sean estos tres.
- OUT: Publicar la `9.0.0`: es posterior y es del firmante.
- OUT: El paquete de `enterprise-documentation`: lo cerró Foundation el 2026-08-19.

## 5. Firma

```
Firmado por lote: EP-017
```
