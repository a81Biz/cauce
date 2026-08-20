# PT-089 — Descubrimiento   `PHASE 2`

## Dónde está, con archivo y línea

[verify-fdge.mjs:1341-1348](docs/methodology/tools/verify-fdge.mjs):

```js
const divergencia = (campo, aqui, alla, cual) => {
  if (aqui === undefined || aqui === null || alla === undefined || alla === null) return;
  if (String(aqui) === String(alla)) return;
  const m = `${pt}: «${campo}» divergente — el registro dice «${alla}» y ${cual} «${aqui}». `
    + 'Se usa el del intake (PT-004: es lo que el PT dice de sí mismo), y por eso se dice: un '
    + 'YAML que se queda atrás apaga comprobaciones sin que nada avise.';
  if (gate === 'G4') fail('SUITE-R35', m); else warn('SUITE-R35', m);
};
```

**El propio mensaje declara el riesgo** y la herramienta sigue avisando. Sólo en `G4` falla.

## La medición, y no da lo que yo esperaba

```
status divergente con estado TERMINAL en el registro:  6
status divergente entre estados NO terminales       :  0
phase divergente en tareas ya terminales            : 22
```

**Las seis divergencias de `status` son todas de la clase peligrosa. Cero benignas.**

```
PT-055: registro INTEGRATED · YAML REOPENED
PT-066: registro INTEGRATED · YAML READY
PT-068: registro INTEGRATED · YAML READY
PT-074: registro INTEGRATED · YAML READY
PT-075: registro INTEGRATED · YAML READY
PT-076: registro INTEGRATED · YAML READY
```

Eso cambia el diseño. **El aviso estaba calibrado para una mezcla que no existe:** no hay
divergencias legítimas entre estados vivos que el aviso proteja. Todas las que hay son un archivo
que se quedó atrás.

## Por qué esto no es «subir la severidad»

`PT-004` decidió que **manda el YAML** —es lo que el PT dice de sí mismo—, y esa precedencia es
correcta y no se toca. Lo que falla es la consecuencia:

```
registro INTEGRATED · YAML READY   ->  se usa READY
                                   ->  «fase >= 2» no se cumple
                                   ->  las comprobaciones de fases posteriores NO SE EJECUTAN
```

Es literalmente lo que el comentario de `PT-044` describe cuatro líneas más arriba: *«cuatro
tareas de `EP-011` declararon `phase: 1` con el registro en 9, y con eso `fase >= 2` nunca se
cumplía y `FDGE-R52` no llegaba a ejecutarse. Un verificador que da verde POR NO HABER MIRADO»*.

**El defecto que `PT-044` documentó sigue vivo**: se le puso un aviso, y un aviso no impide que las
comprobaciones se apaguen.

## `phase` es otra cosa, y hay que separarlas

**22 divergencias de `phase` en tareas ya terminales.** Una tarea `INTEGRATED` con `phase: 9` en
su YAML no apaga nada: las comprobaciones de fase ya no aplican a algo terminal.

Convertirlas en error pondría 22 fallos sobre trabajo cerrado, que es el error de `EXEC-R04` en
`PT-088`. **`phase` sigue siendo aviso.**

## Lo que este descubrimiento cambia respecto del intake

| | Intake decía | Medido |
|:---|:---|:---|
| El criterio | «terminal en el registro y no terminal en el YAML: error» | **Correcto**, y además cubre **las seis** que existen |
| Alcance | implícitamente `status` y `phase` | **Sólo `status`.** `phase` en terminal no apaga nada, y serían 22 fallos sobre trabajo cerrado |
| `AC-03` | «`avanzar` escribe las dos fuentes» | **Ya lo hace** — los cinco actos. Las seis son históricas: tareas integradas antes de que `avanzar` existiera o a mano |
| `AC-06` | «bajar de 65 avisos» | Hoy son **24** entre `phase`, `status` y `estado`. Al arreglar las seis quedan 18, todas `phase` o índice |

**`AC-03` no requiere trabajo y hay que decirlo**, en vez de escribir código para un problema
resuelto. Lo que sí requiere trabajo es que **`avanzar` no pueda dejar una terminal sin sincronizar**
— y eso es el mismo acto atómico, aplicado al cierre.
