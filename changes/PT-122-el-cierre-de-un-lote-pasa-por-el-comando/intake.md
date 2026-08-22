# PT-122 — El cierre de un lote pasa por el comando, no por la mano

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-122
type: BUG
epic: EP-020
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-22
structural: no
suite_version: 12.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que publicar el cierre de un lote no dependa de que alguien escriba un comentario a mano.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker` publica el comentario de cierre de un lote, con `MARCA_AGENTE`, y es la única forma sancionada de hacerlo | un caso que comprueba la marca en el comentario publicado |
| AC-02 | El comentario NO afirma nada que no pueda derivar: si no hay tag, no dice que lo hay | el texto de EP-019 afirmaba «tag v12.0.0» y el último del repositorio era v9.0.0 |
| AC-03 | Los diecisiete comentarios ya escritos NO se editan: la nota marcada que los referencia ya está publicada y se conserva | SUITE-R09 |
| AC-04 | `SUITE-R43` distingue «comentario humano» de «comentario del agente sin marca» o declara `SIN EVALUAR` | hoy no puede, y por eso contó diecisiete fantasma |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: un cierre de lote publicado sin la marca del agente es imposible de producir con las herramientas del marco.

## 4. Qué NO entra   `[AGENTE]`

- OUT: editar los comentarios históricos sin marca (SUITE-R09)
- OUT: impedir que una persona comente. La marca distingue procedencia; no restringe a nadie

## 5. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **Medido el 2026-08-22**: el comentario «Integrado en main · suite 12.0.0 · tag v12.0.0» se escribió con `gh issue comment` en diecisiete issues, salió sin marca, y `verify-fdge` lo contó como comentario humano sin responder en los diecisiete. Ninguno lo era, y el tag que afirmaba no existía.
