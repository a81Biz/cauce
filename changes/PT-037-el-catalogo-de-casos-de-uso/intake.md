# PT-037 — El catálogo de casos de uso

> Tarea de la implementación abierta `EP-010` (`FDGE-R51`).

```yaml
---
id: PT-037
type: FEATURE
epic: EP-010
track: STANDARD
status: INTEGRATED
created: 2026-08-13
structural: no
suite_version: 7.4.0
phase: 10
---
```

## 1. Qué se quiere   `[HUMANO]`

> «Una épica dedicada íntegramente a **todos los casos de uso que puedan existir** y a la
> resolución de cada uno»

## 2. Por qué va antes del manual   `[AGENTE]`

Escribir sin la lista produce un manual que cubre **lo que se me ocurrió**, y eso es exactamente
lo que hay hoy repartido en cuatro archivos. La lista es el contrato de cobertura: un caso que no
esté en ella es un hueco **declarado**, no un silencio.

## 3. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Cada caso da entrada, recorrido, fin y qué es humano | selftest |
| AC-02 | Cubre las tres formas de empezar: idea, código existente, legado | selftest |
| AC-03 | Cubre el arranque de sesión y los tres modos | selftest |
| AC-04 | Los huecos están **declarados**, no callados | selftest |
| AC-05 | Cita reglas por ID y no define ninguna (`SUITE-R21`, `LEX-R22`) | selftest |

## 4. Cómo termina   `[AGENTE]` — obligatorio   `FDGE-R53`

> Termina cuando: existe una lista de casos con su ruta, y lo que no cubre está escrito como
> hueco.

## 5. Qué NO entra   `[AGENTE]`

- OUT: escribir el manual. Es `PT-038`
- OUT: documentar casos que el marco no soporta. Si falta soporte, es otro `PT`

## 6. Firma

```
Firmado por lote: EP-010
```
