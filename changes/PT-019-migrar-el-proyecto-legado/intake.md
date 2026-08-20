# PT-019 — El legado: uno sintético y uno real, no destructivo

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-019
type: CHORE
epic: EP-017
track: STANDARD
status: INTEGRATED
phase: 9
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Comprobar que CUALQUIER proyecto legado se puede migrar. Con los dos: un proyecto sintético creado para provocar los casos que Foundation debe detectar, y el proyecto real de Mercados Energéticos. La prueba debe ser NO DESTRUCTIVA: sobre copia o sin `--apply`.»

## 2. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El sintético provoca los casos que Foundation debe detectar | documentación que contradice el código, código fuera de `src/`, módulos huérfanos, configuración dispersa |
| AC-02 | Foundation los detecta y los declara | aparecen como divergencias en su `00-Baseline`, no como silencio |
| AC-03 | El proyecto real se usa sin tocarlo | sobre copia, o `migrate` sin `--apply`. Ninguna escritura en el original |
| AC-04 | Cada hueco queda anotado con su fase y su síntoma | igual que `PT-072`: es la entrada de `PT-073` |
| AC-05 | Si el proyecto real no está accesible, se hace sólo con el sintético y se DICE | no se inventa la mitad que falta: lleva `DEFERRED` desde 2026-08-13 porque depende de otro repositorio |

## 3. Cómo termina   `FDGE-R53`

> Termina cuando: Foundation ha corrido sobre un legado sintético y sobre el real de forma no destructiva, y los huecos encontrados están escritos con su fase — o está declarado por qué el real no pudo usarse.

## 4. Qué NO entra   `[AGENTE]`

- OUT: Migrar de verdad el proyecto de Mercados Energéticos: es un CASO DE PRUEBA, no un destino. Su migración se cierra cuando el firmante vaya a trabajar ahí.
- OUT: Arreglar los huecos que aparezcan: se anotan y se deciden después.
- OUT: El adaptador de Azure (`PT-025`), salvo que el proyecto de prueba lo use de verdad.

## 5. Firma

```
Firmado por lote: EP-017
```
