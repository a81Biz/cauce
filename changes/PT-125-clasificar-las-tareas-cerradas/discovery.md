# Descubrimiento — `PT-125`   `PHASE 2`

> Qué se midió, con qué comando, y qué salió.

---

## 1 · El material, medido hoy

```
$ grep -c '^## ' docs/implementation/HISTORY.log      →  162 entradas
$ grep -c '^## ' docs/implementation/INCIDENTS.log    →    1 entrada
```

**163, no 131.** Y siete de esas 162 son entradas `## G4 — …`: registros de compuerta, no de
tarea. Un borrador que exigía el formato `## <ID> — <título>` se las dejaba fuera; el generador
que se publica cuenta **encabezados**, que es la definición que se puede reproducir. El intake dijo 131 porque se escribió el 2026-08-22 y el ledger ha crecido con
`EP-020`. La cifra del criterio es la del día en que se escribió; la del trabajo es la del día en
que se hace, y se declara la diferencia en vez de arrastrar la vieja (`CE-010`).

## 2 · Cuántas afirman recurrencia

```
$ (extracción por marcas: «otra vez», «N veces», «se repite», «la instancia», «mismo defecto»…)
89 de 162 entradas contienen al menos una afirmación de recurrencia
```

El intake dijo 113 de 131. La diferencia es de **criterio de extracción**, no de contenido: aquel
contó de otra forma. Aquí se dice cuál se usó, porque una cifra sin su definición es una cifra que
no se puede reproducir.

## 3 · El primer intento de clasificar salió inflado, y se midió

Un matcher con frases amplias —`a mano`, `diverg`, `encabezado`— dio:

```
CE-006  43        CE-008  41        CE-013  11        CE-009  17
```

Cuarenta y tres «actos fuera del comando» en un ledger de 162 entradas es una cifra que **no
puede ser cierta**. La causa: `a mano` aparece en cualquier frase que explique por qué algo se
automatizó. Un recuento inflado es exactamente lo que `PT-119` iría a contar después.

Apretado a frases **autodescriptivas** —las que el propio ledger usa para nombrar su patrón—:

```
50 entradas se autodescriben  ·  70 señales  ·  109 no nombran ninguna clase
```

## 4 · Y de esas 70, catorce eran menciones y no instancias

Revisadas **una a una**, leyendo la cita:

| Entrada | Clase detectada | Qué dice en realidad |
|:---|:---|:---|
| `PT-127` | `CE-006` | *«**No** es el acto fuera del comando»* |
| `PT-112` | `CE-002` | *«primera aplicación espontánea de `SUITE-R59`»* — cumplimiento |
| `EP-012` | `CE-014` | *«en vez de retrofechadas»* — la clase **evitada** |
| `PT-105` | `CE-014` | *«su estado intermedio **NO** se retrofecha»* |
| `PT-118` | `CE-016` | declara lo que **no** hizo para no incurrir en ella |
| …y nueve más | | |

**Nombrar una clase no es ser una instancia de ella.** Contarlas todas habría inflado la matriz
con recurrencias que no ocurrieron — que es `CE-001` otra vez: tomar la mención por el hecho,
dentro de la tarea que existe para contar hechos.

## 5 · El resultado

```
entradas recorridas                              163
INSTANCIAS clasificadas                           56
MENCIONES (nombran la clase sin incurrir)         14
afirman recurrencia y NO nombran la forma         40
registros totales en EVENTOS.jsonl               182
```

**Las diecisiete clases tienen al menos una instancia.** Ninguna quedó vacía, lo que significa que
la semilla de `PT-118` no inventó ninguna categoría.

## 6 · El ordinal que la propia cita declara

Veintiséis registros llevan un número escrito por la entrada: *«SÉPTIMA ROTURA DE ESCAPADO»*,
*«instancia doce»*, *«tres veces»*. Se **deriva de la cita**, no se cuenta:

| Clase | Mayor ordinal declarado | Dónde |
|:---|--:|:---|
| `CE-001` el proxy en lugar del hecho | **12** | `PT-131` · «instancia doce» |
| `CE-004` probar donde trabajo | **9** | `PT-082` · «novena» |
| `CE-002` rotura de escapado | 7 | `PT-104` |
| `CE-003` un argumento por la detección de `ROOT` | 7 | `PT-064` |
| `CE-007` existe la herramienta y nada la echa en falta | 7 | `PT-114` |
| `CE-015` el cierre destapa más que el reparto | 6 | `EP-018` |

## 7 · La diferencia de denominador, declarada

`EP-020` §2.1 contó **ocurrencias** —27 roturas de escapado—. `EVENTOS.jsonl` cuenta **entradas
que nombran la clase** —6—. Son denominadores distintos y los dos son correctos; mezclarlos daría
una matriz que dice una cosa y significa otra. Va escrito en la cabecera del propio archivo, para
que `PT-119` no tenga que adivinarlo.

## 8 · El límite de acceso, sin cambios

Cinco `INC` de `EP-019` viven en el `INCIDENTS.log` de otro proyecto que **no está en esta
máquina**. Se declaran ausentes, no se inventan. El `INCIDENTS.log` local tiene **una** entrada, y
está recorrida.

---

## Conclusión

**Las diecisiete clases que `PT-118` declaró tienen instancia en el ledger.** Ninguna quedó
vacía, así que la semilla no inventó ninguna categoría — que era el riesgo real de una taxonomía
escrita antes de clasificar.

**Lo que se repite, con el número que el propio ledger declara:**

| Clase | Mayor ordinal declarado | Regla | Verificador |
|:---|--:|:---|:---|
| `CE-001` el proxy en lugar del hecho | **12** | — | `SUJETOS`, al 3 % |
| `CE-004` probar donde trabajo, no donde se decide | **9** *(10 con `PT-118`)* | — | **ninguno** |
| `CE-002` rotura de escapado | 7 | `SUITE-R59` | `audit` |
| `CE-003` un argumento por la detección de `ROOT` | 7 | — | **ninguno** |
| `CE-007` existe la herramienta y nada la echa en falta | 7 | — | **ninguno** |
| `CE-015` el cierre destapa más que el reparto | 6 | — | **ninguno** |

**Las dos que más se repiten no tienen regla con verificador.** `CE-001` llega a doce instancias
declaradas y lo único que la vigila es un registro de sujetos con cobertura del 3 %; `CE-004`
llega a nueve —diez contando la que produjo la corrida de `PT-118`— y no la vigila nada.

**Y hay un hueco que no se puede cerrar leyendo:** **40 entradas afirman que algo se repite y no
dicen qué**. No se fuerzan: clasificarlas exigiría reinterpretarlas, y eso inventaría justo la
recurrencia que la matriz va a contar. Quedan con su cita, disponibles para quien quiera decidir.

**Qué habilita esto.** `PT-119` puede derivar `MATRIZ.md` de un archivo con denominador declarado.
`PT-126` puede aplicar un umbral —clase con recuento ≥ 3 sin regla con verificador— y hoy ese
umbral seleccionaría `CE-001`, `CE-003`, `CE-004`, `CE-013`, `CE-015` y `CE-016`. Seis candidatos
que salen de la evidencia y no de la impresión de nadie.
