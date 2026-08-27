# PT-160 — nada comprueba que los `AC` de `traceability.md` sean los del intake

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera**.

```yaml
---
id: PT-160
type: BUG
epic: EP-024
track: STANDARD
status: DEFERRED
phase: 8
created: 2026-08-25
structural: no
suite_version: 13.1.0
origen_parada: PT-147
---
```

## 1. Comportamiento esperado   `[HUMANO]`

`FDGE-R15` es explícita sobre cuál es la lista canónica de criterios:

> *«Ésta es la lista con la que trabaja el resto de la suite: `traceability.md`, `manifest.json` y
> los casos QA citan estos `AC-nn` **y ningún otro**.»*

Lo esperado es que la trazabilidad **no pueda** citar unos `AC` distintos de los del intake.

## 2. Comportamiento observado

`verify-fdge` contrasta la trazabilidad **consigo misma** —que no haya `AC` huérfanos ni `TS` sin
`AC`— y **no contra el `intake.md`**.

Medido en `PT-147` del lote anterior: el intake declaraba **siete** criterios, `PHASE 2` los
reagrupó en **cuatro**, y con esos cuatro se escribieron `traceability.md` y `manifest.json`.
**`verify-fdge` pasó en verde**: los cuatro eran coherentes entre sí.

## 3. Por qué importa

Es `CE-008` —un hecho, varios nombres— sobre el objeto que el marco usa para **decir qué se
verificó**. Una trazabilidad que cita criterios que el intake no declara no traza nada: afirma
haber comprobado una lista que nadie firmó.

Y el intake **sí está firmado** (`INTAKE-R06`). La trazabilidad no.

## 4. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | Un `AC` en `traceability.md` que **no esté en el intake** hace fallar `verify-fdge` | caso con un `AC` inventado |
| AC-02 | Un `AC` del intake **ausente** de la trazabilidad hace fallar | caso con uno omitido |
| AC-03 | El **enunciado** también se contrasta, no sólo el identificador | caso con el mismo `AC-nn` y otro texto |
| AC-04 | Lo mismo para `manifest.json` | caso equivalente |
| AC-05 | **Lo anterior no se retrofecha** (`RIGE_DESDE`) | caso con `suite_version` previa |
| AC-06 | Un PT con **intake ligero de lote** —que hereda la severidad pero **no** los `AC`— sigue funcionando | caso con `FDGE-R51` |

**`AC-03` es el que hace la comprobación real.** Contrastar sólo los identificadores dejaría pasar
un `AC-02` cuyo texto no tiene nada que ver con el firmado — que es la mitad de lo que pasó en
`PT-147`.

**`AC-06` es el riesgo de romper algo**: `FDGE-R51` permite un intake ligero dentro de un lote
firmado. Hay que comprobar qué declara de `AC` y no exigirle lo que no tiene.

## 5. Cómo termina   `FDGE-R53`

> Termina cuando: una trazabilidad cuyos `AC` no sean exactamente los del intake —en
> identificador y en enunciado— hace fallar `verify-fdge`.

## 6. Qué NO entra   `[AGENTE]`

- OUT: revisar las trazabilidades históricas. `RIGE_DESDE`: lo que se exige, se exige a lo vivo.
- OUT: cambiar `FDGE-R15`. La regla ya dice lo correcto; lo que falta es el chequeo.
- OUT: los casos QA. `QA-R19` los cita también, y este paquete no tiene interfaz.

## 7. Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **Lo cometí yo, en `PT-147`, dentro del lote que existe para quitar esta clase.** No lo cazó
  ninguna herramienta: lo vi al releer el intake para escribir la evidencia. Queda escrito porque
  es la evidencia de que el hueco es real y no teórico.
- **`FDGE-R15` está bien escrita y aun así falló.** Dice exactamente lo que debe pasar; lo que no
  hay es un script que lo compruebe. Es la diferencia que `RULES.md` marca entre `HARD` y `CHECK`,
  y este es un caso donde una regla `HARD` correcta no impidió nada.
- **Si el chequeo no llega a tiempo, la regla se queda `HARD`**: marcar `CHECK` lo que ningún
  script verifica es una promesa falsa.
