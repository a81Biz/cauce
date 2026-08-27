# `PT-164` · `traceability.md` — `FDGE-R15`

| AC | Criterio | TS | Test | Evidencia | Caso QA | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| AC-01 | Un **comando** renumera y mueve **todas** sus citas | TS-01 · TS-06 | `selftest` · `quedan 0` | `evidence/PT-164/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-02 | Se **niega** si el ID destino ya existe | TS-03 | `selftest` · `YA ESTA DEFINIDA` | `evidence/PT-164/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-03 | **Dice qué va a tocar** y sólo escribe con `--aplicar` | TS-01 · TS-02 | `selftest` ×2 | `evidence/PT-164/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-04 | Renumerar no cambia el número de reglas de `CORE.md` | TS-06 | `build-core` | `evidence/PT-164/salidas/bateria.out` | n/a | `CUMPLIDO` |
| AC-05 | Lo que **no** se puede detectar se declara | TS-08 | `chk` sobre el texto del comando | `evidence/PT-164/salidas/bateria.out` | n/a | `CUMPLIDO` |

**`AC-02` evita que la herramienta cause el defecto que arregla.** Renumerar sobre un ID ocupado es
exactamente lo que hizo `PT-148`, y un comando que lo permitiera lo haría **más rápido y en más
sitios**.

**`AC-05` es la mitad honesta.** `verify-suite` comprueba que una regla citada **exista**;
`LEX-R35` existe — sólo que es otra. **Una cita al ID equivocado-pero-real pasa en verde**, y eso
**no es mecanizable** sin saber qué quiso decir quien la escribió. Se dice en vez de fingirlo.

## Controles de regresión

| RC | Qué preserva | Test | Estado |
|:---|:---|:---|:---|
| RC-01 | **No arrastra las subreglas**: `EXEC-R04a` es otra regla | TS-07 · `subreglas SI` | `CUMPLIDO` |
| RC-02 | Se niega a cambiar de familia | TS-04 | `CUMPLIDO` |
| RC-03 | Se niega a mover una regla que no existe | TS-05 | `CUMPLIDO` |

**`RC-01` no clava la cifra**: comprueba que las subreglas **siguen ahí**, no cuántas — una cuenta
clavada envejece con la primera regla nueva.

## Tres defectos que encontraron los casos, y ninguno se veía leyendo

1. **Dejaba 23 citas atrás**: recorría `.md` y `.mjs` —«donde viven las reglas»— y `selftest.sh`
   **cita** reglas. Las citas viven **donde alguien las escribe**.
2. **Al arreglarlo, borré la recursión.** El comando pasó de 21 archivos a **8**, ninguno de
   `tools/`. Lo dijo el caso, no la lectura: el mensaje decía «15 citas en 8 archivos» con total
   normalidad. **Un comando que renombra la mitad es peor que uno que no renombra.**
3. **Un «defecto» que no lo era**: el caso acusaba de dejar 46 citas, y eran `EXEC-R04a`. El error
   estaba en mi aserción, que contaba con `grep -o` y casaba **dentro** de la subregla.

## Y `CE-003` en la primera ejecución

`regla.mjs` toma como ruta *«el primer argumento que no empiece por `--` y no parezca un ID»* — y
eso era **`renombrar`**. El síntoma **mentía sobre la causa**: decía «la regla no está definida»
cuando lo que no existía era el directorio donde buscaba.

Corregido **declarando los subcomandos**, no ampliando la heurística: una lista de exclusiones por
forma crece cada vez que se añade una palabra; una de subcomandos crece cuando se añade un
subcomando.
