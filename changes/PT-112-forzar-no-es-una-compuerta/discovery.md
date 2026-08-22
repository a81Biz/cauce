# Descubrimiento — `PT-112`

```
bin/cauce.mjs:43    const FORZAR = resto.includes('--forzar');
bin/cauce.mjs:143   if (!d.nueva && (d.difieren.length || d.soloDestino.length) && !FORZAR)
```

**Dos usos, y el segundo es todo el defecto**: con el flag, la guarda entera desaparece.

## Lo que la guarda dice, y que el flag se lleva por delante

> *«Sobrescribir puede revertir correcciones que ese proyecto hizo bajo sus propios `PT`: **ha
> estado a punto de pasar**. Un archivo que difiere no dice por sí solo quién tiene razón.
> Decidirlo es humano (`SUITE-R31`).»*

El aviso es exacto. El flag lo apaga **sin dejar constancia de que alguien lo leyó**.

## Lo que NO se pudo medir

`INC-007` e `INC-013` viven en el `INCIDENTS.log` de la calculadora, que no está en esta máquina
—mismo `find` que `PT-109` dejó escrito—. Se declaran.
