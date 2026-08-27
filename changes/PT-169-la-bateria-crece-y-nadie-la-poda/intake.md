# `PT-169` — la batería sólo crece, y nadie la poda

> Tarea dentro de la implementación abierta `EP-024` (`FDGE-R51`). Es la **ligera**: la firma, el
> veredicto de `G1` y la severidad los hereda del lote (`INTAKE-R08`).

```yaml
---
id: PT-169
type: CHORE
epic: EP-024
track: STANDARD
status: DONE
phase: 8
created: 2026-08-26
structural: no
suite_version: 13.2.0
origin: DIRECT
---
```

## 1. Qué se quiere   `[HUMANO]`

Dicho por el firmante, dos veces y con el problema real delante:

> *«hay que hacer algo con la batería para quitar los elementos que se van superando, hay cosas
> que seguro ya se quitaron o se están duplicando»*
>
> *«ésa tarea o debemos meter como una nueva regla de negocio para mantener un orden en la batería
> que se debe de cumplir, ya sea cada N tiempo o cada X cosa, que se revise y purgue la batería
> para que no pase lo de hacerla y se tarde 20 minutos en mandar el error de uno solo»*

**Las dos cosas, y en ese orden.** Una poda sin regla se deshace sola: la batería volverá a crecer
igual que creció, porque cada tarea añade los suyos y ninguna retira los de nadie.

## 2. Qué pasa, medido

| | |
|:---|:---|
| `selftest.sh` | **8250 líneas** · **48 bloques** por tarea · **133 funciones** de fixture |
| Casos | **1749** |
| Tiempo | **~10 min** en CI · **~15-20 min** en local |
| Copias del árbol completo | **10** |
| Arranques de `node` | uno **por caso**, no uno por herramienta |

**Y el coste no son los casos.** Es que cada caso **reconstruye un fixture y reinvoca la
herramienta** para asertar **un** patrón. Dos casos que miran dos cadenas de la **misma** salida
la generan **dos veces**. Ahí está el orden de magnitud, no en el número de aserciones.

## 3. Los tres patrones de caso muerto, y sólo dos se delatan solos

`EP-022` encontró los tres **sin buscarlos**:

```
SUPERADO    el hecho que fijaba cambió por diseño    → se pone en ROJO, y se ve
INVERTIDO   sólo pasa mientras existe el defecto     → se pone en ROJO al arreglarlo
HUECO       perdió su premisa y no prueba nada       → SIGUE EN VERDE, y no se ve
```

- **Superado** — `PT-156` retiró **dos** de `PT-147` que clavaban que `FPGE` saliera `SIN EVALUAR`.
- **Invertido** — `PT-156` reescribió **tres** que afirmaban cobertura buscando la línea del
  **hueco**: pasaban porque el componente **fallaba**.
- **Hueco** — `PT-149` reencuadró uno de `PT-144` cuyo `sed` mutaba un texto **que ya no existía**:
  el fixture no cambiaba nada y el caso decía `✓`.

**El tercero es el peligroso**, porque no hay nada que lo delate. `PT-167` persigue el segundo. El
primero y el tercero, y la duplicación, no tienen dueño.

## 4. Criterios de aceptación   `[AGENTE]`

| AC | Criterio | Cómo se comprueba |
|:---|:---|:---|
| `AC-01` | Se mide el tiempo de la batería **antes** y **después**, y se publica la cifra | dos ejecuciones cronometradas |
| `AC-02` | Un fixture cuya mutación **no cambia el archivo** se caza | caso que introduce una mutación vacía y espera rojo |
| `AC-04` | Los casos retirados se cuentan **por patrón** —`superado`, `invertido`, `hueco`— y ninguno se borra sin decir por qué | la tabla de la evidencia |
| `AC-05` | **Existe la regla**, en `RULES.md`, con ID, severidad y disparador declarado | `regla.mjs <ID>` la resuelve |
| `AC-06` | La regla **puede fallar**: hay un script que la comprueba, o se declara `HARD` y se dice por qué no es `CHECK` (`SUITE-R38`) | el caso de la regla |
| `AC-07` | Ningún caso vivo cambia de veredicto por la poda | la batería completa, en verde, con el mismo conjunto de hechos comprobados |

## 5. La regla — qué debe decidir, no cómo   `AC-05`

**No está decidido y es lo que hay que decidir en `PHASE 3`**, con los datos delante:

- **Disparador.** «Cada N tiempo» envejece mal: una fecha en un documento no la mira nadie. «Cada
  X cosa» es contrastable — *al cerrar un lote*, *al superar N casos*, *cuando la batería pase de
  M minutos*. La cifra se elige **midiendo**, no eligiéndola bonita.
- **Qué obliga exactamente.** Revisar no es purgar. La regla debe decir qué se **entrega**: una
  cuenta por patrón, o una lista de candidatos, o el árbol ya podado.
- **Qué NO puede exigir.** Que un caso sea *útil* no es mecanizable (`SUITE-R26`). Que un fixture
  **no mute nada** sí lo es. La regla se escribe sobre lo segundo.

## 6. Cómo termina   `FDGE-R53`

> Termina cuando: la batería está podada con su cuenta por patrón publicada, el tiempo medido
> antes y después, existe la regla que obliga a repetirlo con un disparador contrastable, y un
> fixture que no muta nada **falla**.

## 7. Qué NO entra   `[AGENTE]`

- **OUT**: reescribir el arnés. Se poda y se ordena; rehacerlo es otro trabajo y otra medición.
- **OUT**: paralelizar la batería. Es una vía legítima para el tiempo y **no es ésta**: primero se
  quita lo que sobra y se deja de reinvocar de más; repartir el trabajo que no debería existir es
  esconderlo.
- **OUT**: tocar los casos de `PT-167` —los invertidos—. Esa tarea corre **después**, sobre el
  árbol ya podado.

## Firma

```
Firmado por lote: EP-024
```

---

## Observaciones del agente   `INTAKE-R07`

- **`AC-02` es el corazón, no `AC-04`.** Contar lo retirado es un informe; que un fixture hueco
  **falle** es lo que impide que vuelva a haberlos. Sin `AC-02`, esta tarea limpia una vez y el
  problema regresa con la siguiente tanda de casos.

- **`AC-07` es el que puede hacerla fracasar.** Una poda que cambia el conjunto de hechos
  comprobados no es una poda: es una amputación. La batería tiene que salir en verde **y** seguir
  cazando lo mismo — y eso no lo demuestra que esté verde, porque un caso retirado de más también
  sale verde. Es el mismo argumento con el que `PT-149` exigió que perder un componente **siguiera
  siendo rojo**.

- **Riesgo declarado: la regla puede nacer inaplicable.** Si el disparador es «cada lote», este
  mismo lote la incumple el día que se escriba. Si es «cada N casos», hay que fijar N sin datos de
  cuántos casos son *sanos*. La decisión va en `PHASE 3` **con la medición ya hecha**, no antes.


---

## Revisión 1 — 2026-08-26 · `AC-03` sale del alcance

> Append-only una vez firmado (`SUITE-R09`).

**Qué cambia.** `AC-03` —*«dos casos con el mismo patrón sobre la misma invocación se declaran»*—
**deja de ser criterio de esta tarea** y pasa a `out-of-scope`, con destino `PT-167`.

**Por qué.** Detectarlo exige comparar patrón esperado **e** invocación entre 1752 casos, y hacerlo
sin el barrido de `PT-167` produce una lista que mezcla duplicados reales con casos que
**deliberadamente** miran la misma salida desde dos ángulos — `PT-149` tiene tres, y son lo que
impide que su corrección sea un apagado disfrazado.

**Y no se deja como `AC` marcado «no cumplido».** `FDGE-R15` lo rechazó como *Orphan Criterion*, y
tiene razón: un criterio sin escenario es un criterio que nadie comprueba, y anotarlo como
incumplido lo deja igual de huérfano mientras aparenta rigor. **O es criterio y tiene prueba, o no
es criterio de esta tarea.**

**Qué NO cambia.** El trabajo entregado: la regla, su comprobación y el acotado de `--solo` están
completos. Esta revisión **quita** una promesa, no un resultado.
