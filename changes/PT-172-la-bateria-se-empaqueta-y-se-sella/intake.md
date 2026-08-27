# `PT-172` — la batería se empaqueta y se sella: CI sólo corre lo que puede haber cambiado

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera** (`INTAKE-R08`).

```yaml
---
id: PT-172
type: CHORE
epic: EP-024
track: STANDARD
status: DEFERRED
phase: 1
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Qué se quiere   `[HUMANO]`

Dicho por el firmante:

> *«empaquetar tareas dentro de la batería y cada "algo" se cierra el paquete… así cada CI "lee"
> sólo los paquetes abiertos. Es una forma de certificar lo que ya se hizo»*

Y con una razón de peso: la batería tarda **26 minutos**, hay **diez tareas** por delante en este
lote, y cada una la paga.

## 2. Lo que ya existe, y no hay que construir

| Pieza | Qué hace |
|:---|:---|
| `sec "…"` · **45** secciones | la batería **ya está empaquetada** |
| `--afectados` (`PT-086`) | deriva qué secciones ejercitan lo que cambió |
| `seccionesAfectadas()` | la selección, en el contrato |
| `selloDe` · `SELLO.md` · `SUITE-R57` | el marco **ya sabe sellar** |

Medido, la selección funciona: cambiar `audit.mjs` activa **14 de 45**; `tracker.mjs`, **21**.

## 3. El filo, medido

**`--afectados` no sigue el grafo de importación.** Una sección declara las herramientas que
**nombra**; si una importa otra, el cambio **no se propaga**.

```
cambiar patrones.mjs   activa hoy              15 de 45
                       deberia activar         43 de 45
                       se saltarian sin mirar  28 secciones
```

`patrones.mjs` lo importan **nueve** herramientas, es el archivo del contrato, y **este lote lo ha
modificado en seis tareas**. Sellar sobre la selección de hoy certificaría en verde 28 secciones
que nadie volvió a mirar — `CE-005`, *verde por no haber mirado*.

## 4. Lo que el sello debe afirmar

```
MALO   «este paquete paso la ultima vez, asumimos que sigue pasando»
BUENO  «nada de lo que este paquete depende ha cambiado desde que paso»
```

El segundo **no asume: comprueba**. Es lo que `selloDe` ya hace con `CORE.md` —hashea el cuerpo y
detecta cualquier retoque— aplicado a un paquete en vez de a un archivo.

## 5. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| `AC-01` | La selección sigue el **cierre transitivo** de importaciones | cambiar `patrones.mjs` activa **43**, no 15 |
| `AC-02` | Un paquete se sella con el **hash de sus entradas**, no a mano | fixture: mismo árbol → sellado; entrada tocada → abierto |
| `AC-03` | Un paquete sellado se **dice**, y es distinguible de «pasó» y de «se saltó» | tres estados en la salida |
| `AC-04` | Si el cierre **no se puede calcular**, el paquete **corre** | `RULE-06`: no saber no es permiso |
| `AC-05` | Se mide el tiempo con y sin sellos, y se publica | dos corridas cronometradas |
| `AC-06` | **Ningún caso vivo cambia de veredicto**: el universo no encoge | `1795` antes y después |

## 6. Cómo termina   `FDGE-R53`

> Termina cuando: cambiar `patrones.mjs` activa las 43 secciones que dependen de él, un paquete
> cuyas entradas no han cambiado se **declara sellado** en vez de correr, tocar una de sus entradas
> lo **abre solo**, y el universo de casos sigue siendo el mismo.

## 7. Qué NO entra   `[AGENTE]`

- **OUT**: sellar a mano. Un sello que alguien pone porque «eso ya funcionaba» es la firma de un
  verde que nadie comprobó. **El sello se deriva o no existe.**
- **OUT**: que CI use los sellos. Primero se demuestran en local; cambiar lo que CI ejecuta sin
  eso sería apagar la única compuerta que hoy mira todo.
- **OUT**: paralelizar. Otra vía, otra tarea, y `PT-169` ya declaró por qué no es ésta.

## Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-01` es prerrequisito de todo lo demás, no un criterio más.** Sellar sobre una selección que
  se salta 28 secciones no es una optimización: es una **certificación falsa**, y sería el defecto
  más grave que este marco podría producir — uno que **firma** lo que no comprobó.

- **`AC-06` es el que puede hacerla fracasar.** `PT-169` intentó bajar el suelo reutilizando un
  esqueleto, el universo pasó de 1749 a 1730 casos, y se revirtió. Un caso que desaparece ha
  cambiado de veredicto por la puerta de atrás — y aquí el riesgo es el mismo, multiplicado.

- **`AC-03` no es cosmético.** Si la salida no distingue `sellado` de `pasó`, la cifra de cobertura
  vuelve a mentir — que es lo que `PT-168` acaba de arreglar por otro lado, y `PT-151` por otro.
