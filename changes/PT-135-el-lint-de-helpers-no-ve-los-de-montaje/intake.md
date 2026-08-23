# PT-135 — El lint de helpers sólo mira los usados como comando de un caso

> Tarea dentro de la implementación abierta `EP-020` (`FDGE-R51`). Es la **ligera**: la firma,
> el veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-135
type: BUG
epic: EP-020
track: STANDARD
status: READY
phase: 1
created: 2026-08-23
structural: no
suite_version: 13.0.0
---
```

## 1. Qué se quiere   `[HUMANO]`

> Que un caso no pueda pasar en verde porque su montaje **nunca llegó a correr**.

## 2. Cómo apareció

Corriendo la batería completa de `PT-118`. Dos líneas en la salida, entre 1483 casos verdes:

```
selftest.sh: line 2402: git_fixture: command not found
selftest.sh: line 2404: con_phase: command not found
```

`git_fixture` se define en la línea **4803**; `con_phase`, en la **6397**. Se usan en la **2402**.
El caso que va detrás —`«el aviso dice en que compuerta se convierte en error»`, de `PT-109`— sale
**verde**: su fixture no tiene git inicializado y su allocation no tiene `phase: 8`, y aun así
pasa. Pasa por la razón equivocada, o por ninguna.

Es `CE-005` —**verde por no haber mirado**— con el agravante de que existe un lint escrito
exactamente para esto.

## 3. Por qué el lint no lo ve

`lint_helpers` busca el uso así:

```sh
uso=$(grep -nE "^(chk|chkno)[[:space:]].*[[:space:]]$h([[:space:]]|\$)" "$f" | head -1 ...)
```

Sólo reconoce un helper cuando es **el comando de un caso**. `git_fixture` y `con_phase` se
invocan como **líneas de montaje sueltas**, antes del `chk`. La forma que el lint reconoce y la
forma en que fallan son distintas, así que el lint no puede verlo **por construcción** — no es
que se le escapara.

Y su lista de helpers está **escrita a mano**: `TR TRR RG2 V PL PLNO trlib trlibno inversa`. Ni
`git_fixture` ni `con_phase` ni `mlib` ni `build_fixture` ni `mk_qa` están en ella.

## 4. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| AC-01 | El lint detecta un helper usado como **línea de montaje**, no sólo como comando de un caso | hoy `git_fixture` en la 2402 y definido en la 4803 no se detecta |
| AC-02 | La lista de helpers se **deriva** del archivo, no se escribe a mano | hoy son nueve escritos a mano y hay al menos catorce definidos |
| AC-03 | Los usos anteriores a la definición que existen HOY quedan **enumerados**, y arreglados o declarados uno a uno | `RULE-06`: se dice el número, no se promete la limpieza |
| AC-04 | Un `command not found` en la salida de la batería **no** convive con un `OK` | es la forma exacta del falso verde: 1483 verdes y dos comandos que no existen |
| AC-05 | El caso de `PT-109` afectado se comprueba con su montaje **corriendo**, y sigue pasando — o se dice que no | no se da por bueno lo que pasó sin fixture |

## 5. Cómo termina   `FDGE-R53`

> Termina cuando: un helper invocado antes de definirse hace ruido en la batería, sea cual sea la
> forma en que se invoque.

## 6. Qué NO entra   `[AGENTE]`

- OUT: reordenar la batería entera por criterio estético. Se mueve lo que el lint señale
- OUT: convertir el lint en error duro en la misma tarea que lo amplía — primero se enumera lo
  que hay, y sólo entonces se decide si bloquea (`SUITE-R09`)
- OUT: `set -e` en la batería: cambiaría el comportamiento de 1483 casos de golpe

## 7. Firma

```
Firmado por lote: EP-020
```

---

## Observaciones del agente   `INTAKE-R07`

- **El lint lleva su propia historia escrita encima**: *«me pasó DOS veces en este lote: TRR en
  `PT-076` y RG2 en `PT-066`»*. Se construyó contra la forma en que falló entonces, y esa forma
  era «helper como comando de un caso». La tercera vez falló por la otra forma.
- **Ninguna de las dos veces anteriores lo encontró un verificador**: las encontró el agente
  tropezando. Ésta la encontró la salida de la batería, y sólo porque había un `HAY FALLOS` que
  obligó a mirar línea por línea.
- **Y hay un segundo hallazgo pegado**: `chk "los helpers usados antes se enumeran"` acepta el
  patrón `"helper\|ninguno"`, que casa **con las dos** respuestas posibles. Ese caso no puede
  fallar. Entra en `AC-04` porque es la misma avería.
