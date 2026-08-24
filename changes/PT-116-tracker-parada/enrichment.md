# `PT-116` — Enriquecimiento   `PHASE 2-E`

## E-1 · Lo que ya existe, y hay que reusar

`avanzar` publica su nota de reanclaje y **ya resolvió todo lo difícil**:

```
tracker.mjs:3105   el cuerpo, con MARCA_AGENTE
tracker.mjs:3107   si hay plataforma  ->  adaptador.comentar(issue, cuerpo)
tracker.mjs:3112   si no              ->  TRANSICIONES.log, append-only (PT-084)
```

Y el orden de actos: **lo irreversible el último**, con respaldo de todo lo anterior.

**Reusar esto no es comodidad: es `SUITE-R38`.** Escribir una segunda forma de publicar en la
tarea sería una segunda representación del mismo hecho, y ya sabemos cómo acaba — `PT-132` acaba
de arreglar dos comandos del mismo archivo con contratos opuestos.

## E-2 · Lo que NO debe reusar: la forma del texto

`contarNotas` cuenta con `RE_NOTA = /PHASE\s*\d+\s*(?:→|->|a)\s*\d+/`. Una parada que **no** sea
transición no puede casar ese patrón: inflaría el recuento de `FDGE-R52` y una tarea parecería
tener reanclajes que no tuvo.

**`LEX-R30` lo declara y aquí hay que respetarlo mecánicamente.**

## E-3 · El texto largo va a un archivo

`SUITE-R59` lo dice sin ambigüedad: *«un texto largo se escribe a un archivo, nunca por la línea
de comandos»*. Una explicación de parada son párrafos.

Y esta sesión lo ha demostrado **cinco veces**: cinco roturas de escapado, todas por construir
texto dentro del literal de otro lenguaje.

## E-4 · Las listas cerradas necesitan comparación, no sólo constante

`PT-124` acaba de medir qué pasa cuando una lista vive escrita a mano: `TIPOS_DE_ITEM` decía una
cosa y `LEXICON` otra, y el mensaje de error **atribuía a `LEXICON` lo que no decía**.

Las dos listas de la parada —seis motivos, cinco desenlaces— tienen que **derivar de un sitio y
compararse con `LEXICON` §8.5**, o repiten el defecto en un mes.

## E-5 · Sin plataforma tiene que funcionar igual

`PT-084` lo midió: `avanzar` exigía plataforma y un proyecto sin ella **no podía avanzar ni una
fase**, mientras `SUITE-R22` declaraba soportado el equipo de una sola persona. *«La salida fácil
era hacerla obligatoria. Rompe una promesa del marco.»*

La parada hereda esa lección: **`TRANSICIONES.log` cuando no hay tablero.**

---

## Qué establece, y qué no

**ESTABLECE:** que el medio existe y hay que reusarlo, que la forma del texto debe evitar
`RE_NOTA`, que el texto va por archivo, que las listas necesitan comparación, y que sin plataforma
debe funcionar.

**NO ESTABLECE:** la firma del comando ni qué hace cuando el desenlace abre trabajo. Es `PHASE 3`.
