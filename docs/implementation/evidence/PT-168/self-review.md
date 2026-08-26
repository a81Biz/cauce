# `PT-168` · autorrevisión — `PHASE 6` Evidence

## 1. Lo medido

| Qué | Antes | Ahora |
|:---|---:|---:|
| Cobertura de clase `fase` | **52** | **52** |
| Componente sin fases documentadas | **cubierto** | **HUECO** |
| Huecos reales en el árbol | 0 | **0** |
| `selftest` | 1760 | **1765** |

## 2. La cifra no bajó, y hay que decirlo igual

`AC-03` pedía *«si baja, baja y se dice»*. **No bajó.** Las 52 son las mismas y **ya no significan
lo mismo**: antes salían de que el **número** apareciera en el documento, ahora de la **sección del
componente**.

Los seis reales estaban bien documentados, así que aciertan igual. **La cifra publicada era
correcta por casualidad**, y lo que cambió no es cuánto se cubre sino que la cobertura **pueda
fallar**.

`PT-149` lo había medido: `audit` acertaba seis veces y falló la séptima —un componente con
**cero** menciones, declarado cubierto—. Como sólo había seis componentes, nadie podía verlo sin
dar de alta un séptimo.

## 3. Tres errores míos, y los tres son la misma familia

**3.1 · «96 de 96 son falso positivo».** La primera medición decía eso y **era mentira**: el regex
de mi propio script se había degradado —`\s` llegó a disco como `s`— y falló **tres veces en tres
capas**: heredoc de bash, `python -c`, `python` con raw string. `SUITE-R59`, duodécima medida aquí.

Lo cazó **imprimir `re.source`** y ver `^FDGEs+`, no leer el código. Se arregló **quitando el
regex**. Y estuve a punto de escribir en la evidencia que la cobertura era 0 % — lo impidió que la
cifra fuera *demasiado* redonda: 96 de 96 obliga a comprobar el instrumento antes que el hallazgo.

**3.2 · Acoté también el archivo propio del componente**, y produjo **46 huecos falsos**.
`FDGE-Prompts.md` es entero de FDGE: no tiene un `## FDGE` dentro. **El mismo error que estaba
arreglando, cometido al arreglarlo** — mirar donde no toca y mirar de menos son el mismo defecto
con el signo cambiado.

**3.3 · Leí sólo un formato**, y produjo **6 huecos falsos**. `PHASES.md` escribe `PHASE 0 CARGA`
en `PTSA` y `1 FRESHNESS` en `FPGE`; las dos son una fase con su nombre, y la compacta es la
convención de estos bloques densos.

## 4. El defecto original, en miniatura, dentro de la sección correcta

`FPGE PHASE 1` pasaba **incluso con el ámbito acotado**, porque su sección cita *«Entrega a FDGE
`PHASE 1` (Intake)»* — la fase de **otro** componente. Seis de siete salían huecas y la séptima
acertaba por accidente.

## 5. Lo que NO establece

- Que las **otras** dimensiones de `audit` —reglas, triggers, artefactos— no tengan el mismo
  patrón. **No está medido**, y suponerlo sería el mismo error.
- Que un proyecto destino no vea **huecos nuevos**. Los verá si su documentación no tiene sección
  por componente — y ése es el resultado correcto: estaban ahí y no se veían.
