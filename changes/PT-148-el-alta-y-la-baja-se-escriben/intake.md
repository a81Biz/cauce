# PT-148 — el alta y la baja de un componente quedan escritas, y con regla

> Tarea dentro de la implementación abierta `EP-022` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-148
type: CHORE
epic: EP-022
track: STANDARD
status: DRAFT
phase: 4
created: 2026-08-24
structural: no
suite_version: 13.1.0
origin: DIRECT
---
```

## 1. Qué se quiere   `[HUMANO]`

Después de `PT-144`..`PT-147` el mecanismo existe. **Nada lo dice.**

Hoy no hay ningún procedimiento escrito para añadir o retirar un componente: se buscó en toda la
metodología y no hay una sola coincidencia. Los seis componentes actuales entraron cada uno a su
manera, y la única baja que existe —`FIDE`, que el `INSTALL` no copia (`FIDE-R01`)— está
implementada dos veces a mano y explicada en un comentario de código.

Esta tarea escribe lo que el lote construyó:

```
LEXICON.md        el contrato de componente como VOCABULARIO: qué campos tiene y qué
                  significa cada uno. LEXICON manda sobre los nombres (LEX-R21).
RULES.md          la regla que obliga: un componente se declara en el contrato, y ninguna
                  herramienta lo nombra. Con ID, severidad y (CHECK) si hay script que falla.
CASOS-DE-USO.md   dos filas nuevas en «E · Publicar y mantener»: dar de alta un componente
                  y darlo de baja. Y el HUECO que este catálogo tiene declarado hoy en
                  silencio: nadie puede saber, leyéndolo, que un componente se puede añadir.
CORE.md           regenerado. No se edita a mano (SUITE-R16).
```

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | `LEXICON` declara el contrato de componente y sus campos, y es su documento propietario | `verify-suite` sin errores de vocabulario |
| AC-02 | `RULES.md` tiene la regla nueva con ID estable, severidad y propietario único | `regla.mjs <ID>` la resuelve · `verify-suite` no la ve duplicada |
| AC-03 | Si la regla se marca `CHECK`, **existe el script que puede fallar** (`SUITE-R38`) | se ejecuta y falla al romperla a propósito |
| AC-04 | `CASOS-DE-USO.md` tiene la fila de alta y la de baja, con Entrada · Recorrido · Fin · Humano | lectura contra el formato del catálogo |
| AC-05 | `CORE.md` y `CORE-PTSA.md` regenerados con `build-core`, no editados | `build-core --check` en verde |
| AC-06 | `npm run verify` sin errores | ejecución |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: alguien que no participó en este lote puede leer `CASOS-DE-USO.md`, encontrar
> la fila «dar de alta un componente», seguirla, y acabar con el componente declarado — sin abrir
> ninguna herramienta.

## 4. Qué NO entra   `[AGENTE]`

- OUT: declarar `DICTAMEN`. Sigue siendo `EP-023`.
- OUT: reescribir `FIDE-R01`. La baja de `FIDE` ya está declarada; lo que cambia es de dónde sale
  el dato, no la regla.
- OUT: documentar cómo se escribe un componente —sus fases, sus prompts, su especificación—. Esto
  documenta el **alta en el marco**, no cómo se diseña un componente.
- OUT: tocar las cuatro herramientas. Ya están hechas cuando esta tarea empieza.

## 5. Firma

```
Firmado por lote: EP-022
```

---

## Observaciones del agente   `INTAKE-R07`

- **Va la quinta y no la primera, a propósito.** `SUITE-R01` pide evidencia, no plan: documentar
  el procedimiento antes de construirlo describiría el mecanismo **planeado**, y el planeado y el
  construido divergen — que es el defecto de origen de toda la v3.
- **`AC-03` es el criterio que más fácil se incumple sin notarlo.** `RULES.md` declara que marcar
  `CHECK` una regla que ningún script verifica **es una promesa falsa**. Si el chequeo no llega a
  tiempo, la regla sale `HARD`, no `CHECK`.
- **Esta tarea toca `docs/methodology/` de lleno** — `SUITE-R06(e)` — igual que las cuatro
  anteriores. Se dice aquí porque es la única que toca documentos normativos y no herramientas, y
  es donde la tentación de «ya que estamos» es mayor.
