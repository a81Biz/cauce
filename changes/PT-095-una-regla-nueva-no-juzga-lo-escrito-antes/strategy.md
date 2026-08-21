# PT-095 — Estrategia   `PHASE 3`

## Tres arreglos, y cada uno cierra una clase

| Clase | Arreglo | Por qué así |
|:---|:---|:---|
| Falsos positivos | **Excluir la espera** del detector | Vocabulario corto y cerrado. Afinar el positivo movería el problema |
| Entradas anteriores a la regla | **Frontera derivada del tag** | `RIGE_DESDE` ya dice qué versión la trajo; el tag dice cuándo |
| Malformadas posteriores | **Una entrada `CORRIGE`** las supera | `HISTORY.log` ya lo resuelve así desde `PT-046`. No es vocabulario nuevo |

## Por qué la frontera sale del tag y no de una fecha escrita

`SUITE-R40` lleva persiguiendo esto desde que un verificador guardaba su propia copia del número de
versión y se quedó una versión por detrás **siendo él la autoridad**.

`RIGE_DESDE['EXEC-R04a']` da `[11,0,0]`; el tag `v11.0.0` da la fecha. Ninguna de las dos se
escribe a mano aquí.

**Sin tag no hay frontera, y entonces la regla no alcanza a nada** — y se dice. No poder situar el
límite no es no tenerlo (`RULE-06`).

## Por qué la granularidad es de día, y qué cuesta

Lo preciso sería situar cada bloque en el commit que lo introdujo y ver si es antecesor del tag.
Son `git log -S` por bloque sobre **doscientos** bloques.

La frontera por día basta y **su límite se declara**: lo escrito el mismo día del sello escapa.
Se prefiere ese error al contrario —juzgar hacia atrás—, que es el que dejaba `main` rojo sin
arreglo posible.

## Lo que este `PT` NO puede hacer para arreglarse

**Editar las cinco entradas históricas.** `SUITE-R09` lo prohíbe, y este `PT` existe precisamente
porque dos reglas se hicieron imposibles entre sí: saltarse una para arreglar la otra sería la
misma enfermedad con otro nombre.

## Orden

```
1  medir si es latente o causado por el merge     -> latente, sobre 338a728
2  los casos, y verlos en ROJO
3  los tres arreglos
4  la inversa: deshacer cada uno y ver caer los suyos
```
