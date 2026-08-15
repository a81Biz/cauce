# PT-023 — Estrategia   `PHASE 3`

## Objetivo

Cerrar el hueco que existe —`FDGE-Prompts.md` sin el vocabulario cerrado ni la reciprocidad— y
decir con la medida en la mano **qué de esto es mecanizable y qué no**.

## Caminos evaluados

| Camino | Por qué no |
|:---|:---|
| Un verificador que falle cuando un `spec-changes.md` declara un documento que el PT no tocó | **La medida lo descarta:** 3 de 4 candidatos no eran defectos. Un control con 75 % de falsos positivos no se lee; se silencia. Y las dos causas —trabajo bajo commit del lote, declaración cumplida por otro PT— no se afinan: son la forma de trabajar |
| Exigir que el commit de un PT lleve su identificador | Cambia `FDGE-R19` para hacer posible un control que no aporta. La cola mueve al perro |
| Comparar el **contenido** declarado contra el documento | Una fila dice «Igual, en el texto copiable». Contrastar eso exige entender qué es «igual»: no es mecanizable, y fingir que lo es sería el verde por omisión que este marco persigue |
| Reportarlo como aviso permanente | 4 avisos que en su mayoría no son defectos, en cada ejecución, para siempre. Es ruido con firma |
| **Corregir el caso y declarar el límite** | Es lo que hay: un defecto concreto que se cierra con su caso, y una regla general que **no** tiene comprobación honesta y se dice por qué |

## Solución

**Dos partes, y la segunda es tan importante como la primera.**

### 1 · El texto copiable dice lo que la regla dice

`FDGE-Prompts.md:183` pasa de describir la intención a enunciar la forma: la columna es vocabulario
cerrado —`—` o un identificador, nada más— y la cita es recíproca, con los tres casos que
`SUITE-R44` distingue. Desaparece **«normalmente»**.

`SUITE-R20` manda que el texto sea copiable **tal cual**. Un texto copiable que describe la regla
con más holgura que la regla produce, copia a copia, exactamente lo que `SUITE-R44` prohíbe.

### 2 · El caso que impide perderlo otra vez

`selftest.sh` comprueba que `FDGE-Prompts.md` lleva las dos cosas, y que **no** vuelve a decir
«normalmente» donde la regla no admite matices. Es un caso sobre el contenido de un documento, no
sobre la regla general — y esa distinción es el resultado de la medida, no una comodidad.

## Lo que se declara NO mecanizable, y por qué

**Que una declaración de `spec-changes.md` se haya cumplido no es verificable mecánicamente.**
No es una limitación de esta tarea: es una propiedad de la declaración. Medido:

```
110 filas · 4 candidatos · 3 falsos positivos · 1 defecto real
```

Las dos causas de falso positivo son estructurales:

1. El trabajo de un PT puede entrar bajo un commit del **lote** — `PT-037` y `PT-039` no tienen
   un solo commit que los nombre.
2. Una declaración puede cumplirla **otro PT**, y sigue cumplida — `PT-022` hizo lo que `PT-018`
   declaró, cuatro días y un lote después, sin saberlo.

Lo único que ya está limpio —que el documento nombrado **exista**— da 0 de 110. Escribir ese
verificador sería añadir una casilla que nunca ha estado en rojo.

**`SUITE-R26` dice que una HARD aspira a comprobación mecánica.** Aquí la aspiración se resuelve
diciendo que no la hay y **por qué**, con la cifra delante. `RULE-06` en su forma más literal: no
se sabe, y decirlo vale más que un control que se equivoca tres de cada cuatro veces.

## Análisis de regresión   `FDGE-R12`

| Qué puede romperse | Comprobación |
|:---|:---|
| `verify-suite` sobre `FDGE-Prompts.md` | `*-Prompts` da texto copiable y **no** enuncia obligaciones nuevas: el texto **cita** `SUITE-R44`, no la deroga ni la amplía |
| El resto de `FDGE-Prompts.md` | Solo cambia el párrafo de `SUITE-R44` |
| `CORE.md` | `FDGE-Prompts.md` no entra en `CORE`; `core:check` lo confirma |
| El caso nuevo | Comprobación inversa: quitar «recíproca» del documento debe ponerlo rojo |

## Criterios de éxito, derivados de los AC

- `AC-01` → las 110 filas contrastadas · hecho en `PHASE 2`
- `AC-02` → los 4 candidatos enumerados con veredicto individual, no una cifra
- `AC-03` → `FDGE-Prompts.md` corregido, con caso
- `AC-04` → el límite dicho con la medida que lo sostiene

## Autorrevisión

El riesgo de esta tarea era **cerrarla escribiendo un verificador** para poder decir que la
regla ya se comprueba. La medida lo impidió: se ejecutó antes de decidir, y dio 75 % de falsos
positivos. Sin esa cifra, el verificador se habría escrito y se habría sentido como progreso.

Contradicciones: ninguna. `AC` sin cubrir: ninguno.

**Lo que no resuelve:** que `PT-018` declarara tres cambios y ejecutara uno sin que nada lo
notara durante dos meses. Eso no se arregla aquí, y tampoco con un verificador — se arregla
mirando, que es lo que esta tarea es.
