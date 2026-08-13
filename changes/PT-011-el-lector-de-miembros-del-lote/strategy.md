# PT-011 — Estrategia   `PHASE 3`

## Solución

La del proyecto legado, tal cual, porque está probada contra 127 asignaciones reales:

```
miembros = identificadores en FILAS DE TABLA
si no hay ninguna fila reconocible → barrido completo (respaldo)
```

El respaldo no es adorno: hay intakes de lote escritos antes de que existiera la plantilla con
tabla, y sin él dejarían de comprobarse en silencio — cambiar un fallo ruidoso por uno mudo.

## Alternativas evaluadas

**A · Exigir que el intake declare sus miembros en un bloque propio.** Más explícito.
**Rechazada:** rompe todos los intakes de lote existentes, en este repositorio y en los
destinos, para resolver algo que la tabla ya resuelve.

**B · Ignorar los PT que no existan en `changes/`.** Quitaría el `INTAKE-R09` falso.
**Rechazada:** también silenciaría el caso real que esa comprobación busca — un lote que lista
una tarea que nadie creó.

**C · Puerta de versión, para que la regla no se cobre sobre trabajo cerrado.** Es la otra mitad
de lo que se discutió al principio de la sesión. **Fuera de alcance a propósito:** es una
decisión normativa —¿puede una regla nueva exigir cumplimiento retroactivo?— y con el parser
arreglado los 14 errores desaparecen igualmente. Se declara aquí para que no vuelva a perderse.

## Regresión

| Qué | Riesgo | Mitigación |
|:---|:---|:---|
| Un lote deja de comprobar a un miembro real | **Alto si ocurre** | Caso inverso: el PT de la tabla sigue exigiendo su firma |
| Intakes de lote sin tabla | Medio | Respaldo al barrido completo, con su caso |
| Los 251 casos | Bajo | Batería completa |

## Criterios de éxito

Los cinco `AC`. El que manda es `AC-04`: el proyecto legado baja de 16 errores a 2, medido de
verdad contra su repositorio.
