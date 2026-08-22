# Descubrimiento — `PT-109`

## Las cinco reglas que cambian de severidad

```
verify-fdge.mjs
  1598  SUITE-R35   gate === 'G4' ? fail : warn
  1670  FDGE-R19    gate === 'G4' ? fail : warn
  1703  FDGE-R52    gate === 'G4' ? fail : warn
  1500  FDGE-R54    gate === 'G2' ? fail : warn
```

Medidas con `grep` sobre `gate ===`. **Una escrita de otra forma no aparecería** — declarado.

## `FPGE-R01`, antes y después

```
ANTES    /^.*\b(R-\d+)\b.*$/gm          cualquier linea que lo nombre
DESPUES  /^\s*\|\s*`?(R-\d+)`?\s*\|.*$/gm  la FILA de la tabla
```

## Lo que no se pudo medir

`INC-003`, `INC-005` e `INC-014` viven en el `INCIDENTS.log` de la calculadora.

```
$ find /c/DevOps/Desarrollos -maxdepth 3 -name "INCIDENTS.log" -not -path "*/cauce/*"
(sin resultados)
```

**No están en esta máquina.** Se declaran.
