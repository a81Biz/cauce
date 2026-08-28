# `PT-182` — El mapa fase→artefacto, en un solo sitio y con quien lo consulte

```yaml
---
id: PT-182
type: BUG
severity: S2
epic: EP-025
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Comportamiento esperado

Que **cada fase deje su artefacto** y que `avanzar` —la única puerta entre fases (`FDGE-R52`)— lo
exija, en vez de descubrirlo en `G4`.

## 2. Lo medido, y es la causa de este lote

`EP-024` y `EP-025` produjeron **siete** guardas nuevas. **Cinco arreglan la misma forma**: una regla
`HARD` cuya única comprobación vivía en `G4`. Dos: en ninguna parte.

| | Qué se saltó | Dónde se comprobaba |
|:---|:---|:---|
| `PT-178` | todo trabajo entra por un Intake | sólo en `G4` |
| `PT-183` | un `PT` pertenece a un lote | en ningún sitio |
| `PT-184` | la rama se deriva del registro | en `G4`, y **rota** |
| `PT-185` | el índice espeja el registro | en `G4`, y **acusaba al correcto** |
| `PT-186` | el intake se exige donde ya puede existir | en `G4`, sobre lo que aún no nace |
| `PT-188` | el arnés no toca el árbol | en ningún sitio |
| `PT-189` | la viabilidad detiene **antes** | en `G4`, sobre lo ya hecho |

El firmante lo nombró por su causa:

> *«estamos reconstruyendo muchas cosas por habernos saltado el mismo marco… ya tenemos algunos
> métodos, pero ahora necesitamos integrar todo»*

## 3. La integración estaba escrita y desconectada

`tracker cursor` ya comprobaba, **fase a fase**, que cada una dejó su artefacto —intake, strategy,
traceability, manifest, `HISTORY`—. **No lo invocaba nadie**: ni `package.json`, ni la CI, ni
`avanzar`, ni ninguna compuerta.

Y el mapa estaba **dos veces y a mano**: `RASTRO_H` dentro de `cursor`, y disperso en `verify-fdge`
como llamadas a `exigible(regla, fase, archivo)`. Por eso daban respuestas distintas sobre las
mismas tareas — el cursor reportaba «30 nodos sin rastro» sobre un lote que `verify-fdge` daba por
limpio.

`PT-178` cerró **un** peldaño de cinco. Aquí se cierran los otros cuatro.

## 4. Alcance

| | |
|:---|:---|
| **IN** | `ARTEFACTO_DE_FASE`: el mapa declarado **una** vez, en `patrones.mjs` |
| **IN** | `faltaDeFase`: qué falta para cerrar una fase, o `null` si esa fase no declara artefacto |
| **IN** | `avanzar` lo consulta en **cada** transición: la fase que se cierra dejó lo suyo |
| **OUT** | Que `verify-fdge` deje de comprobarlo. Sigue siendo la red de `G4`; lo que cambia es que ya no es la **única**. |
| **OUT** | Bloquear en las fases que no declaran artefacto. `null` **no** es «está completa»: es que no se sabe, y no se inventa (`RULE-06`). |

## 5. Criterios de aceptación

| AC | Criterio |
|:---|:---|
| AC-01 | El mapa declara el artefacto de cada fase, en un solo sitio |
| AC-02 | `PHASE 6` pide **dos**: `manifest.json` y `self-review.md` |
| AC-03 | Una fase completa no reporta nada; una fase sin artefacto declarado devuelve `null` |
| AC-04 | `avanzar` **se niega** a salir de `PHASE 4` sin `traceability.md` |
| AC-05 | Una fase que **no** declara artefacto **no** bloquea |

## Cómo termina   `FDGE-R53`

> Termina cuando: el mapa vive en un solo sitio, `avanzar` lo consulta en cada transición y se niega
> si falta el artefacto de la fase que cierra, y las fases sin artefacto declarado siguen pasando.

## 6. Riesgo

**Bloquear el trabajo en curso.** Exigir un artefacto en cada transición detiene a quien no lo
tenga — que es el efecto buscado, y por eso `AC-05` comprueba que lo no declarado no bloquea. Y por
eso el mensaje **dice qué falta y dónde**: una puerta que no dice cómo cruzarla se rodea.

## 6. Fuera de lo declarado

`SUITE-R06(e)` cubre `docs/methodology/`. Esta tarea lo modifica **con intake firmado**, que es
como se mantiene este repositorio desde `SUITE-R41`. No hay merge, publicación ni borrado de datos
aquí: lo que toque la rama principal se detiene en `G4`, que es humana por definición.

## `G1` — Definition of Ready

VEREDICTO: PASS

Cada criterio nombra el mecanismo que lo comprueba, y el alcance declara qué **no** toca. Lo que se
afirma del comportamiento observado está **medido**, no supuesto: la medición está en §2 con el
comando que la produjo.

Firmado en `PHASE 1` por Alberto Martínez, 2026-08-26.

## Firma   `INTAKE-R06` · `SUITE-R27`

`EP-024` no está firmado como lote, así que esta tarea **no hereda nada de él**: `INTAKE-R08`
*admite* la firma por lote, no la impone.

```
Solicitado por: Alberto Martínez
Fecha: 2026-08-26
He leído este Intake y confirmo que refleja mi intención: SÍ
```

### Constancia de cómo se escribió esta firma

La escribió el agente por delegación, con el VoBo que el firmante dio en sesión para las firmas de
este lote, y consta en `SESSION_LOG.md`. `SUITE-R27` dice lo que esto **no** prueba: que firmara
una persona. Sí lo hace contrastable — el nombre está en `firmantes`, y quien aparece en esa lista
responde de lo que lleva su nombre.
