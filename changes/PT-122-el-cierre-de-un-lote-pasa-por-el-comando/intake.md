# PT-122 — El cierre de un lote pasa por el comando, no por la mano

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-122
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

> Que publicar el cierre de un lote no dependa de que alguien escriba un comentario a mano.

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `tracker` publica el comentario de cierre de un lote, con `MARCA_AGENTE`, y es la única forma sancionada de hacerlo | un caso que comprueba la marca en el comentario publicado |
| AC-02 | El comentario **deriva** lo que afirma en vez de escribirlo: versión, tag y commit salen del árbol | el texto de `EP-019` los acertó, pero escritos a mano; derivar es lo que hace que acertar no dependa de la suerte |
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

- **Medido el 2026-08-22**: el comentario «Integrado en main · suite 12.0.0 · tag v12.0.0» se escribió con `gh issue comment` en diecisiete issues, salió **sin marca**, y `verify-fdge` lo contó como comentario humano sin responder en los diecisiete. Ninguno lo era.
- **Corrección del 2026-08-22**: este intake afirmó además que ese comentario mentía sobre el tag. **No mentía**: `v12.0.0` existe y apunta a `5b184af`. El error fue mío al medir —`git tag -l | tail -5` ordena lexicográficamente— y queda retirado. El defecto real es **la marca que falta**, no el contenido.
