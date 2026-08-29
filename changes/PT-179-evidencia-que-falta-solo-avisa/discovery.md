# `PT-179` · `discovery.md` — dónde está el defecto, con archivo y línea

## 1. El defecto

```
docs/methodology/tools/verify-fdge.mjs:2584
```

```js
if (exigibleEn(gate, 'manifest.json')) fail('FDGE-R23', `…falta evidence/${pt}/manifest.json…`);
else warn('FDGE-R23', `${pt}: aún sin evidence/${pt}/manifest.json (normal antes de PHASE 6).`);
```

`exigibleEn(gate, …)` mira **la compuerta bajo la que se corre**, no **la fase de la tarea**. Sin
`--gate`, una tarea en `PHASE 7` sin manifest recibe un aviso que afirma *«normal antes de `PHASE 6`»*
— y `verify-fdge` devuelve **0 errores**.

## 2. Lo que hace que no sea teórico

El `SESSION_LOG` del lote que lo descubrió registra **tres** errores de evidencia reales: evidencia
escrita en `evidence/` en vez de `docs/implementation/evidence/`; `tests` y `evidence` como cadena
donde el esquema pide array; y un `coverage: "no aplica"` que hacía comparar texto contra texto.

> *«Los tres corregidos, y **los tres pasaron en verde** antes de corregirse: son la prueba de
> `PT-179`».*

## 3. La solución ya existe en el mismo archivo, diez líneas más arriba

```
docs/methodology/tools/verify-fdge.mjs:2213
```

```js
const exigible = (regla, desde, artefacto) => {
  if (faseDeclarada === null) return false;                 // no se sabe -> SIN EVALUAR
  if (faseDeclarada < desde) { warn(…); return false; }     // aun no toca -> aviso
  return true;                                              // toca -> error
};
```

Tres salidas, exactamente las que `RULE-02` pide. Su comentario lo explica:

> *«Una compuerta que se pone roja sobre comportamiento correcto enseña a saltársela.»*

**Y ya se usa**: `FDGE-R42` (`discovery.md`, desde `PHASE 2`) y `FDGE-R15` (`traceability.md`, desde
`PHASE 4`). **`FDGE-R23` no lo usa.**

## 4. El alcance real: son tres, no una

| Regla | Artefacto | Desde | Qué hacía |
|:---|:---|:---:|:---|
| `FDGE-R23` | `manifest.json` | 6 | Sólo miraba la compuerta |
| `FDGE-R25` | `self-review.md` | 6 | Miraba `afterPhase6` — **un proxy** |
| `FDGE-R29` | `HISTORY.log` | 8 | Sólo miraba la compuerta, en otra función |

**`FDGE-R25` merece nombre propio.** Usaba `afterPhase6`, que se define así:

```js
const afterPhase6 = manifest !== null && manifest !== undefined;   // :2493
```

Deduce la fase **de que exista el manifest**. Es `CE-001` —un proxy en lugar del hecho— y falla
justo en el caso peor: una tarea en `PHASE 7` **sin ninguno de los dos** se escapa entera, porque el
proxy que debía delatarla también falta.

## 5. Por qué `FDGE-R29` estaba fuera de alcance y deja de estarlo

Vive en `checkHistory()`, otra función, y `exigible()` no está en su ámbito. Se resuelve pasándole
la fase — dos líneas de llamada. Se incluye porque es **el mismo defecto**, y arreglar dos de tres
dejaría la tercera diciendo *«se escribe en `PHASE 8`»* a una tarea que ya declara estar en 8.

## 6. Lo que NO está roto

- **`exigibleEn(gate, …)`.** Bajo `--gate G4` exige lo correcto. No se sustituye: se **suma**, para
  que la exigencia valga también cuando no hay compuerta de por medio.
- **El aviso.** Antes de `PHASE 6` el manifest **no** tiene que existir, y decirlo está bien. Lo que
  faltaba era distinguir «aún no toca» de «ya tocaba».
