# `PT-204` · self-review

## El entregable era una decisión, y está tomada

**Sí hace falta un lote, y no es el que parecía.** No «verificar las 91»: **`EP-029` juzga las 123
sin juzgar y verifica las que sobrevivan al juicio siendo además frecuentes.**

## Lo que la medición cambió, y es lo importante

`PENDIENTE` decía *«deuda, no límite»* y **mezclaba dos hechos con arreglos distintos**:

```
PENDIENTE  123  = DEUDA 0 + SIN_JUZGAR 123
  DEUDA          0   juzgada mecanizable y sin verificador — falta ESCRIBIRLO
  SIN_JUZGAR   123   NADIE HA MIRADO si se puede verificar o no
```

**Cero deuda real y 123 sin juzgar.** El número que llevaba lotes publicándose no decía cuánto
trabajo hay: decía **cuánto hay más lo que nadie ha pensado**. Es `RULE-02`, la misma forma que
`PT-198` y `PT-203` corrigieron en otras herramientas esta semana.

**Juzgar no es verificar**, y ahí está el cambio de tamaño: decidir que `FIDE-R03` no es
mecanizable porque describe una conversación cuesta **un párrafo con motivo y firma**; escribir su
verificador cuesta **una tarea**. Separarlos convierte una deuda de 123 tareas en 123 juicios más
un lote de verificación **sobre las que sobrevivan**.

## El criterio de ranking: frecuencia, no severidad

| Familia | Sin verificador | ¿Se ejercita **aquí**? |
|:---|---:|:---|
| `FDGE` | 24 | **Sí, cada tarea de cada lote** |
| `SUITE` · `EXEC` · `INTAKE` | 31 | **Sí** |
| `FND` · `LEX` | 20 | Parcialmente |
| `QA` · `FIDE` · `FPGE` | 16 | **Casi nunca** — son de destino |

Una regla `HARD` de `FIDE` —que corre una vez, al incubar— **no cuesta lo mismo** que una de
`FDGE`, que gobierna cada tarea. Y la evidencia está en esta misma épica: **cinco lecciones nuevas
en el `HANDOFF`, `-30` a `-34`, todas de reglas `FDGE`/`SUITE` que existían y que incumplí porque
nada las ejecutaba.**

## `AC-03` es lo único que cambia comportamiento, y es a propósito

**La cobertura no puede bajar en silencio.** Se compara con el hito anterior y **se dice**, en las
dos direcciones. **No bloquea**: bloquear obligaría a escribir el verificador **antes** de poder
añadir la regla, y eso es exactamente la regresión que el firmante descartó.

Sin `AC-03`, esta tarea sería **una `INVESTIGATION` que documenta que nadie hace nada, sin hacer
nada** — que es el defecto que denuncia.

## Dos errores míos, y los dos de la familia del lote

1. **Conté mal.** La expectativa decía `3=1+2` y son `2=1+1`: tres reglas, una emitida. `chkl` lo
   dijo **en voz alta**, que es lo que `PT-181` compró.
2. **Un caso pasaba por vacío.** «…y NO bloquea» daba verde porque la salida estaba **vacía** — al
   fixture le faltaban `package.json` y los workflows, y `audit` decía `SIN EVALUAR` **con razón**
   (`RULE-06`: no asume ni 0 ni el total). Añadida su pareja, que exige que el aviso **exista**.

## Lo que NO se hace, y es la mayor parte   `SUITE-R26`

- **No se escribe ningún verificador.** Eso es `EP-029`, si el firmante lo admite.
- **No se declara `NO_VERIFICABLE` ninguna regla.** Son 6 de 244, y cada declaración lleva motivo y
  firma: decidir por 123 sería **inventar 123 juicios**.
- **No se retira `SUITE-R26` ni su «aspira, no exige».** Puede que siga siendo la correcta; lo que
  esta tarea hace es que **su puerta se vea** y cuánto pasa por ella.
- **No se juzga hacia atrás** ninguna regla anterior a su comprobación (`CE-014`).
- **`AC-03` avisa, no bloquea.** Y eso no es tibieza: es la única forma de no reintroducir la
  regresión descartada.

## Sin bloqueadores
