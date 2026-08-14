# PT-034 — El agente propio de cauce

> Tarea de la implementación abierta `EP-008` (`FDGE-R51`).

```yaml
---
id: PT-034
type: FEATURE
epic: EP-008
track: STANDARD
status: DRAFT
created: 2026-08-13
structural: yes
suite_version: 7.2.0
phase: 1
---
```

## 1. Qué se quiere   `[HUMANO]`

> «o hacer un agente propio de cauce **para que esté amarrado**»

## 2. Por qué hace falta además de la convención   `[AGENTE]`

Una convención se puede ignorar; es lo que ya pasó. Un **punto de entrada** no: si arrancar
significa consultar el tablero, no hay un paso que saltarse — no existe el paso.

Es la diferencia entre una regla escrita y una compuerta escrita en una herramienta, que es el
argumento con el que este marco justifica todo lo demás.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Arrancar el agente **es** consultar el tablero: no hay orden alternativo | ejecución real |
| AC-02 | Sin plataforma declarada degrada de forma **declarada**, no silenciosa (`SUITE-R38`) | selftest |
| AC-03 | Usa la definición de `PT-033`; no escribe la suya | selftest |
| AC-04 | El marco sigue siendo usable **sin** el agente | selftest |
| AC-05 | No automatiza ninguna compuerta; `G4` sigue humana (`EXEC-R04`) | selftest |

## 4. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: un agente arrancado con cauce no puede llegar a su primera decisión sin el
> estado del tablero delante.

## 5. Qué NO entra   `[AGENTE]`

- OUT: sustituir `CORE.md`. El marco debe seguir funcionando sin el agente (`AC-04`)
- OUT: que el agente asigne identificadores. El registro asigna (`SUITE-R08`)
- OUT: automatizar compuertas. Ninguna, en ningún modo

## 6. Estructural   `FDGE-R43`

`structural: yes` — cambia cómo se arranca. Exige grafo presente y no se resuelve `G2` con el
grafo ausente o `STALE`.

## 7. Firma

```
Firmado por lote: EP-008
```
