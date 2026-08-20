# PT-075 — Una regla sin verificador no ocurre

> Plantilla de **tarea dentro de una implementación abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-017` (`INTAKE-R08`).

```yaml
---
id: PT-075
type: BUG
epic: EP-017
track: STANDARD
status: READY
phase: 9
created: 2026-08-19
structural: no
suite_version: 9.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> «llevas dos reglas que no quieres seguir y no hay nada que te lo exija, debemos entonces
> empezar por ahí, por aumentar la exigencia para que lo sigas igual que el resto, mete
> ésto como un PT y que se resuelva antes que todo»

## 2. Las dos, con su medida

No es una impresión. Las dos se midieron en la sesión en que se abrió esta tarea, y en las
dos el agente incumplió **sin que nada lo señalara**.

### `A` · La compuerta de viabilidad no la abre ninguna fase

```
$ grep -c viabilidad CORE.md PHASES.md verify-fdge.mjs
CORE.md:0   PHASES.md:0   verify-fdge.mjs:0
```

`PT-059` la escribió como compuerta: `AC-02` «en `MARGINAL` no se inician operaciones
grandes: solo lo atómico», `AC-03` «en `UNSAFE` no se ejecuta». `BLOCKED_BY_CONTEXT` está
en `LEXICON` y en el conjunto `VIVOS` de `verify-fdge`. Pero **ninguna fase la invoca**, así
que la compuerta no se cumple ni se incumple: no ocurre.

El agente abrió `EP-017` con diez tareas sin consultarla. Al ejecutarla después, `PT-072` y
`PT-019` —las dos pruebas, el corazón del lote— salen **`MARGINAL`**.

### `B` · «El agente no abre el PR ni lo fusiona» no lo comprueba nadie

`SUITE-R42` dice literalmente: *«El agente no abre el PR ni lo fusiona — comprueba que
exista. Abrirlo es una acción que se describe (`EXEC-R07`)»*. Lo que `verify-fdge`
comprueba es **sólo que el PR exista** ([verify-fdge.mjs:1345-1353](../../docs/methodology/tools/verify-fdge.mjs#L1345-L1353)):
las cuatro emisiones son `no hay pull request abierto`, `no se pudo comprobar` y `el merge
se propone sobre un PR abierto`. **Ninguna mira quién lo abrió, ni si el agente empujó.**

El agente empujó `trabajo` dos veces como acto fuera de fase. Ninguna comprobación lo vio;
lo vio el firmante.

## 3. Por qué esto va primero

Las dos pertenecen al mismo conjunto que `TD-08` cuenta: **60 reglas sin verificador, 51 de
ellas `HARD`** — y 41 más que ni siquiera entran en el denominador (`PT-067`). Mientras el
cumplimiento de una regla dependa de que el agente se acuerde, la regla es una
recomendación con formato de norma.

Es el patrón que el propio marco tiene documentado tres veces: `FDGE-R19` —«el marco
mandaba crear la rama desde la primera versión, ningún verificador la miraba, y 46 tareas
seguidas se implementaron sobre la rama de integración»—, `EXEC-R14` en vigor desde
`PT-043` sin que nada lo dijera, y ahora estas dos.

## 4. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | La consulta de viabilidad tiene una fase que la invoca **y** algo que falla si no se invocó | caso en `selftest` que cae si la fase deja de nombrarla |
| AC-02 | El veredicto de viabilidad queda **registrado** por tarea, no sólo impreso | `verify-fdge` lo puede leer y lo exige desde la compuerta que se decida |
| AC-03 | Un acto del agente hacia la plataforma que ninguna fase prescribe **se detecta** | `verify-fdge` distingue un PR abierto por el agente de uno abierto por una persona, o declara por escrito que no puede y por qué |
| AC-04 | Las dos reglas dejan de estar en la lista de las que nada ejecuta | `audit --sin-verificar` ya no las incluye, con el denominador corregido de `PT-067` |
| AC-05 | La comprobación inversa está hecha | revertido cada arreglo, el caso correspondiente **cae** |
| AC-06 | No se inventa una comprobación que no puede funcionar | si algo no es comprobable desde el repositorio, se declara como `TD-08` hace, en vez de escribir un verificador con falsos positivos (`PT-023`: 75 %) |

**`AC-06` es la contención.** `PT-023` midió que un verificador equivocado tres de cada
cuatro veces es peor que ninguno: se silencia y ocupa el sitio del que haría falta. Si `B`
no se puede comprobar desde aquí, la respuesta correcta es escribirlo, no fabricarlo.

## 5. Cómo termina   `FDGE-R53`

> Termina cuando: las dos reglas tienen algo que falla cuando se incumplen, o está escrito
> por qué una de ellas no se puede comprobar desde el repositorio — y en los dos casos la
> comprobación inversa está ejecutada.

## 6. Qué NO entra   `[AGENTE]`

- OUT: escribir verificadores para las otras 58 reglas de `TD-08`. Esta tarea cubre **las dos que se incumplieron y se midieron**, no la deuda entera.
- OUT: corregir el denominador de `audit` — es `PT-067`, y `AC-04` depende de él.
- OUT: que `viabilidad` lea la marca de sesión correcta — es `AC-07` de `PT-068` y `AC-04` de `PT-074`.
- OUT: cambiar `SUITE-R42` ni `PT-059`. Las dos reglas están bien escritas; lo que falta es que algo las ejecute.

## 7. Firma

```
Firmado por lote: EP-017
```
