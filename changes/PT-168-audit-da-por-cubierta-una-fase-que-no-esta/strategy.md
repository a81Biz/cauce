# `PT-168` · `strategy.md` — `PHASE 3`

## No hay que inventar el dato: hay que dejar de mirar donde no toca

`PHASES.md` tiene **encabezado por componente** —`## FDGE`, `## PTSA`, `## FPGE`…— y `CORE.md`
tiene la **línea compacta por sigla**. Las dos son acotables. La corrección es **restar alcance**,
no añadir información.

## Lo que la medición cambió del diagnóstico

Al principio parecía que la cobertura era masivamente falsa. Medido: `PHASES.md` **sí** documenta
las fases de los seis, así que las coberturas **aciertan hoy**.

**Y eso es lo grave, no lo tranquilizador.** El contraste acertaba **por casualidad** y falló la
séptima vez —`Zeta`, sin una mención en ninguno de los dos documentos, declarado cubierto—. Una
comprobación que no puede fallar no es débil: **no es una comprobación**.

## Alternativa descartada

**Reescribir la sección `## FPGE` de `PHASES.md`** para que use `PHASE n` como `PTSA`. Habría
hecho innecesario reconocer el formato compacto — y habría sido **arreglar el documento para que
encaje con el lector**, que es lo contrario de leer lo que hay. `CORE.md` usa el mismo formato
compacto por diseño.
