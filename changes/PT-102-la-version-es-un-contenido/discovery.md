# Descubrimiento — `PT-102`

## Lo medido, no lo supuesto

```
$ node docs/methodology/tools/version.mjs
version — vigente segun el CHANGELOG: 11.0.0
Todo declara 11.0.0.

$ grep -rn "suite_version:" docs/methodology --include=*.md
  MANUAL.md:72                7.4.0
  README.md:690               5.2.0
  Suite-CLAUDE-Template:49    5.2.0
  INTAKE/templates/TAREA:22   X.Y.Z    <- plantilla, correcta
$ grep -n "suite_version" CLAUDE.md
  CLAUDE.md:208              10.0.0
```

**Cuatro muertas y una plantilla legítima.** La herramienta afirmaba lo contrario.

## Por qué no las veía

`version.mjs:61` llevaba su propio patrón:

```
const RE_DECLARA = /(Suite version:\s*\*\*)([\d.]+)(\*\*)/g;
```

Una forma. La otra —el campo `yaml`— no existía para ella.

## Lo que el grafo enseñó y el grep no

```
quien depende de patrones.mjs
   68  tracker.mjs      42  verify-fdge      10  verify-suite
    6  audit             3  build-core        2  migrate
    2  version.mjs   <- la herramienta cuyo trabajo ES reconocer una forma escrita
```

`version.mjs` era la que **menos** compartía, y la única con un patrón crítico en local. Este
repositorio tiene un sitio para los patrones y un contrato para ellos: `casa` y `noCasa`. El de
la versión estaba fuera de los dos.

## Y el contrato cazó un defecto en el propio arreglo

Al escribir los ejemplos del patrón nuevo, uno de los `casa` **falló**: el documento que viaja
declara la versión dentro de una cita —`> Suite version: **11.0.0** · Referencia: …`— y el
ancla no admitía el `>`. Corregido antes de tocar nada.

Un patrón local no puede hacer eso: no tiene ejemplos contra los que fallar.

## Lo que este descubrimiento NO establece

- Cuántas formas más existen. Se conocen dos.
- Si algún proyecto destino usa una tercera. No se han inspeccionado proyectos ajenos.
