# PT-093 — El limite de las compuertas se declara como ya se declara el de las firmas

> Plantilla de **tarea dentro de una implementacion abierta** (`FDGE-R51`).
> La firma, el veredicto de `G1` y la severidad los hereda de `EP-018` (`INTAKE-R08`).

```yaml
---
id: PT-093
type: CHORE
epic: EP-018
track: STANDARD
status: DRAFT
phase: 1
created: 2026-08-20
structural: no
suite_version: 10.0.0
severity: S2
---
```

## 1. Que se quiere   `[HUMANO]`

Origen: [`H-009`](../../PTSA/Findings/H-009.md) · `D1` · **MEDIA** · tipo `INVESTIGATION`.

## 2. Lo observado

```
main      required_pull_request_reviews: si · revisores aprobadores: 0
          required_status_checks: ["marco"] · enforce_admins: true
          allow_force_pushes: false · allow_deletions: false
trabajo   required_pull_request_reviews: no · status: ["marco"] · enforce_admins: true
```

```
EXEC-R04   G4 es humana en los tres modos  ->  ningun verificador la emite con su nombre
SUITE-R06  ->  verify-fdge exige en HISTORY.log el nombre de quien integro
```

## 3. Lo que esto significa, sin adorno

| Existe | No existe |
|:---|:---|
| Hace falta un PR y CI en verde, sin excepcion ni para el dueno | Una segunda persona que apruebe |
| Queda el nombre de quien integro en `HISTORY.log`, y `verify-fdge` lo exige | Algo que impida al agente ejecutar `gh pr merge` |

**`0` revisores es la unica configuracion viable** para el equipo de una persona que `SUITE-R22`
declara soportado: nadie aprueba su propio PR. No es un descuido de configuracion.

## 4. Por que es un hallazgo aunque el diseno sea correcto

`SUITE-R27` ya declara este limite **para las firmas**:

> «No prueba que firmara una persona —el agente escribe el archivo— pero si convierte la firma en
> una afirmacion contrastable.»

Y **no lo declara para las compuertas**, que es donde la consecuencia es irreversible.

Esta misma sesion lo ilustra dos veces: la `G4` de `EP-016` y la firma del intake de `EP-018` las
escribio el agente citando la instruccion del firmante. Las dos son contrastables. Ninguna es una
prueba.

## 5. Criterios de aceptacion

| | Criterio |
|:---|:---|
| `AC-01` | `EXEC-R04` declara su limite con la misma franqueza que `SUITE-R27`: que garantiza y que no |
| `AC-02` | La constancia de autorizacion tiene **forma fija** —donde va, que campos lleva— y no queda a criterio de cada sesion |
| `AC-03` | Un merge a la rama por defecto **sin** su constancia se detecta a posteriori (lo escribe `PT-088` `AC-04`) |
| `AC-04` | La decision del firmante sobre si se pretende algo mas fuerte queda **registrada**, sea cual sea |

**`AC-04` es el criterio real.** Los otros tres dependen de el, y por eso esta tarea devuelve la
pelota a una persona a mitad — declarado en `EP-018` §8.

## 6. Que NO entra

```
OUT: exigir un revisor aprobador en main. Haria imposible el flujo del equipo de una persona
     que SUITE-R22 declara soportado.
OUT: retirar credenciales de gh al agente. Rompe el espejo (SUITE-R35), que es la unica forma
     de que el registro y el tablero no divergan.
```
## Condicion de cierre   `FDGE-R53`

Termina cuando: la decision del firmante sobre `EXEC-R04` esta registrada —sea cual sea—, `EXEC-R04` declara que garantiza y que no, y la constancia de autorizacion tiene forma fija.

## Firma

```
Firmado por lote: EP-018
```
