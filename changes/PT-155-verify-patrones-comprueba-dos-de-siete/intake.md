# `PT-155` — siete patrones críticos vivían fuera del contrato

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera** (`INTAKE-R08`).

```yaml
---
id: PT-155
type: CHORE
epic: EP-024
track: STANDARD
status: INTEGRATED
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Qué pasa

`SUITE-R38` dice que un patrón crítico vive en **un solo sitio** y **viaja con su contrato** —
`para`, `casa`, `noCasa`. En `patrones.mjs`, el archivo **del** contrato, había **siete** regex de
primer nivel sin nada de eso:

```
RE_FILA_SELLO · RE_LINEAS · RE_DEF_TABLA · RE_DEF_PROSA
RE_NO_VERIFICABLE · RE_ANUNCIA · RE_ESPERA
```

`verify-patrones` no los tocaba. Un escape degradado en cualquiera **no lo cazaba nadie**.

## 2. Por qué importa: no eran menos críticos, eran menos visibles

`SUITE-R59` lleva **doce** roturas medidas en este repositorio. Las que cazó una comprobación
fueron las que estaban **en `PATRONES`** —viajan con sus ejemplos—; las de fuera salieron **por
casualidad**: mirando bytes con `cat -A`, o viendo reventar el arranque.

Y **tres de los siete se escribieron durante `EP-024`**, en `PT-163` y `PT-149`.

## 3. Criterios de aceptación

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| `AC-01` | **Ningún** regex de primer nivel queda fuera de `PATRONES` | barrido sobre el propio archivo |
| `AC-02` | Cada uno lleva `para`, `casa` y `noCasa` | `verify-patrones`, que ya lo exige |
| `AC-03` | La cifra de patrones y de comprobaciones **sube y se publica** | antes y después |
| `AC-04` | Un patrón degradado **falla** | fixture: se rompe uno y la prueba lo caza |

## 4. Cómo termina   `FDGE-R53`

> Termina cuando: `patrones.mjs` no tiene ningún regex de primer nivel sin contrato, y romper
> cualquiera de ellos **hace fallar** `verify-patrones`.

## 5. Qué NO entra

- **OUT**: los regex **dentro de funciones**. Son locales a su uso y no viajan; meterlos al
  contrato sería declarar patrón todo lo que casa algo.
- **OUT**: las otras herramientas. `patrones.mjs` es el archivo del contrato — si ahí hay patrones
  sueltos, en las demás los habrá y es otra medición.

## Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-04` es el que decide si esto sirve.** Meter siete entradas a un objeto no prueba nada;
  que **romper una** ponga la prueba en rojo, sí.

- **Uno de los casos negativos es un defecto vivo, y se deja escrito.** `ANUNCIA_AUTORIZACION`
  lleva `'Autorizacion expresa de excepcion'` en `noCasa` **porque no casa**: al patrón le falta la
  `d` de `autorizad`. Es `PT-170`. Dejarlo ahí no lo aprueba — lo **fija**: cuando se decida
  reconocer la constancia por su forma, ese caso tendrá que **moverse a `casa`**, y el cambio será
  visible en vez de silencioso.
