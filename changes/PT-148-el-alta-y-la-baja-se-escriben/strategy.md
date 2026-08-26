# PT-148 · `strategy.md` — `PHASE 3` Strategy

## 1. Objetivo

Que alguien que no participó en `EP-022` pueda **dar de alta y de baja un componente sin leer el
código**, y que la obligación esté escrita con una regla que pueda fallar.

## 2. Dónde va cada cosa, y no es discutible

`E4` del propio catálogo lo dice, y es la regla que este lote tiene que cumplir sobre sí mismo:

> *«Las reglas van a `RULES.md`, los nombres a `LEXICON.md`, las compuertas a
> `EXECUTION-MODES.md`. Ningún otro documento enuncia obligaciones: las **cita** por ID.»*

```
LEXICON          el VOCABULARIO del contrato: sus campos y que significa cada uno
RULES.md         LA OBLIGACION, con ID estable, severidad y propietario unico
CASOS-DE-USO.md  el PROCEDIMIENTO: dos filas que CITAN la regla, sin enunciarla
CORE.md          regenerado (SUITE-R16)
```

## 3. La regla nace `CHECK`, y hay que ganárselo

`RULES.md` es tajante:

> *«Marcar `CHECK` una regla que ningún script verifica es una promesa falsa: si quieres exigirla,
> escribe el chequeo.»*

**Media comprobación ya existe** y la escribió este lote: `verify-patrones` exige que el contrato
esté completo y falla al romperlo, con quince aserciones probadas en `PT-144`, `PT-150`, `PT-145`
y `PT-146`.

**La otra media no.** Que **ninguna herramienta nombre un componente literalmente** es cierto hoy
porque `PT-145`..`PT-147` lo dejaron así, y **nada lo impide mañana**. Sin eso, la regla sería
`CHECK` sobre una promesa a medias — y este lote acaba de medir cuatro veces qué pasa con las
promesas sin comprobación.

**Se escribe la comprobación que falta**: un barrido sobre `tools/` que falle si un nombre o
prefijo de componente aparece como literal fuera de `patrones.mjs`.

## 4. Alternativas evaluadas

| Alternativa | Por qué se rechaza |
|:---|:---|
| **La regla nace `HARD`, sin chequeo** | Sería una obligación que nadie comprueba, sobre un mecanismo que este lote acaba de construir para que se compruebe. La contradicción es demasiado visible. |
| **Escribir sólo las filas del catálogo, sin regla** | El catálogo **cita** obligaciones, no las enuncia (`LEX-R22`, `E4`). Sin regla, la fila citaría un ID que no existe. |
| **Poner el vocabulario en `RULES.md`** | Los nombres van a `LEXICON` (`LEX-R21`). Es la misma frontera que el lote respeta en todo lo demás. |
| **Un barrido que liste palabras prohibidas** | Perseguir el idioma. El barrido deriva los nombres **del contrato**: si mañana hay un séptimo componente, su nombre entra solo. |

## 5. Riesgos

| Riesgo | Mitigación |
|:---|:---|
| **El barrido da falsos positivos** —comentarios que citan un componente legítimamente— | Se excluye lo que no es código ejecutable, y **se declara qué se excluye**. Un barrido que caza comentarios se desactiva a la primera |
| El barrido no caza nada y pasa por bueno | `RC-04`: meter un literal a propósito **tiene que hacerlo fallar** |
| `CORE.md` cambia más de lo esperado | `RC-01`: el `diff` se lee, no se supone |
| El vocabulario nuevo colisiona | `verify-suite` rechaza nombres duplicados y vocabulario derogado |

## 6. Autorrevisión

```
Contradicciones con el intake:  ninguna.
Dependencias faltantes:         ninguna. PT-144..PT-147 estan cerradas y su mecanismo probado.
RULE-nn violadas:               ninguna. LEX-R21 y LEX-R22 son las que gobiernan donde va cada
                                cosa, y §2 las sigue.
AC no cubiertos:                ninguno.
Alcance que crecio:             el barrido de literales. NO estaba en el intake y es lo que
                                permite que la regla nazca CHECK en vez de HARD. Sin el, la
                                tarea entregaria una obligacion sin comprobar — que es
                                exactamente lo que este lote existe para quitar.
```
