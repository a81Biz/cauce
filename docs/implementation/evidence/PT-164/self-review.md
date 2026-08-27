# `PT-164` · autorrevisión — `PHASE 6` Evidence

## Tres defectos del comando, y ninguno se veía leyendo

1. **Dejaba 23 citas atrás**: recorría `.md` y `.mjs` —«donde viven las reglas»— y `selftest.sh`
   **cita** reglas. Las citas viven **donde alguien las escribe**.
2. **Al arreglarlo borré la recursión.** El comando pasó de 21 archivos a **8**, ninguno de
   `tools/`, anunciando *«15 citas en 8 archivos»* con total normalidad. **Un comando que renombra
   la mitad es peor que uno que no renombra**: deja el árbol en un estado que nadie eligió.
3. **Un «defecto» que no lo era**: el caso acusaba de dejar 46 citas y eran `EXEC-R04a`, una
   subregla que el comando **no debe tocar**. El error estaba en mi aserción.

**Y `CE-003` en la primera ejecución.** `regla.mjs` toma como ruta *«el primer argumento que no
empiece por `--` y no parezca un ID»* — y eso era **`renombrar`**. El síntoma **mentía sobre la
causa**: decía «la regla no está definida» cuando lo que no existía era el directorio donde
buscaba. Corregido **declarando los subcomandos**, no ampliando la heurística.

**Lo que NO establece**: detectar una cita a un ID **equivocado pero real**. `LEX-R35` existe —sólo
que es otra— y eso no es mecanizable sin saber qué quiso decir quien la escribió.

## Lo medido

Batería: **1795 casos, cero rojos**. El detalle por criterio vive en
`changes/PT-164-*/traceability.md`, que es la matriz canónica (`FDGE-R15a`), y en las
paradas de la tarea. Aquí no se repite: `RULE-01`, un hecho tiene un solo sitio.
