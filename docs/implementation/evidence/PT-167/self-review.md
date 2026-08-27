# `PT-167` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Criterio probado | Falsos positivos |
|:---|---:|
| La **explicación** del hueco —tercer argumento de `gap()`— | **30** |
| El **esqueleto** del identificador | **9** |
| El identificador **instanciado** con los valores del contrato | **0** |

`PHASE` aparece en media metodología. **`FIDE PHASE` no aparece en ningún documento**: sólo lo
emite `audit`, y sólo cuando algo falta.

| | |
|:---|:---|
| Identificadores derivados | **32** |
| Casos invertidos en el árbol hoy | **0** |
| `selftest` | 1752 → **1765** |

## 2. El criterio que sirve no es el que primero parece

Los dos criterios descartados **habrían cazado los cuatro conocidos** — y también los **tres
legítimos** de `PT-149`, que asertan sobre mensajes de `fail()` y son lo **contrario** de un
defecto: son lo que impide que la corrección de `PT-149` fuera un apagado disfrazado.

Un barrido con 30 falsos positivos no es un barrido peor: **es uno que se desactiva en la primera
corrida**, y un verificador desactivado es peor que ninguno (`SUITE-R60`).

## 3. Los cuatro conocidos entran como fixture, y hay que decir por qué

`PT-156` los reescribió, así que el árbol da **cero**. Un barrido que no caza nada **es
indistinguible de uno roto** — la trampa que `PT-095` documentó con su inversa en cero. Las cuatro
cadenas se prueban directamente contra los identificadores derivados.

## 4. Dos errores míos

**4.1 · Un caso que no podía pasar.** Escribí `chk … "SUITE-R61" … | grep -c '…'`: espera una
cadena de la salida de un `grep -c`, que devuelve **un número**. Salió en rojo en su primera
corrida — que es lo que un caso mal escrito debe hacer. Es el patrón `hueco` por el otro lado: **no
finge probar, es que no puede**, y la diferencia entre los dos es que el hueco sale **verde**.

**4.2 · Edité `audit.mjs` con la batería corriendo.** Dos rojos que eran una **foto movida**: la
corrida midió `audit` en un estado intermedio. Comprobado después: *«Auditoría sin huecos»*,
`EXIT=0`. La línea `3` del `no hacer` se amplió — **no es sólo `selftest.sh`, es cualquier
herramienta que los casos invoquen**, y `audit` la ejecutan cincuenta.

## 5. Lo que NO establece

- Que no exista un caso invertido con **otra forma**. El barrido conoce lo que `gap()` emite hoy.
- Que un candidato sea de verdad un defecto. Eso es de **intención**, y se declara.
