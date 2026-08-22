# Estrategia — `PT-105`

## La decisión

**A-1 · Un peldaño más en la escalera que ya existe.**

`estadoDeFase` es el **único** sitio que decide un estado por fase. `PT-099` lo dejó escrito al
crearlo: *extiende `estadoTerminalDe` en vez de añadir un segundo sitio que escriba `status`; un
segundo sería la avería de `SUITE-R38` cometida una tarea después de arreglarla*.

Se respeta: el peldaño nuevo va **dentro** de la misma función.

### Alternativas descartadas

| | Por qué no |
|:---|:---|
| **Escribir `DONE` en `avanzar`, fuera de `estadoDeFase`** | segundo sitio que escribe `status` — lo que `PT-099` prohibió por escrito |
| **Relajar `FDGE-R34`** | la regla está bien: `SUITE-R46` exige apuntar el estado terminal **antes** del merge |
| **Que también los `BUG` pasen a `DONE`** | `FDGE-R26` y `LEX-R08` dicen que se **detiene**, y cerrarlo es humano (`SUITE-R06b`) |
| **Escribirlo al entrar en `PHASE 9`** | `PHASE 9` **es** `G4`: el estado tiene que estar antes de llegar |

## Dónde se escribe, y por qué ahí

Al **entrar en la fase siguiente a Validación**. Ese es el momento en que el hecho ocurre: `G3`
quedó firmada, y `DONE` es lo que esa firma implica.

La fase se identifica **por su nombre**, no por un `7` suelto — misma atadura que `PT-099` dejó
para su peldaño, y hay un caso que la comprueba: si alguien renumera las fases, un literal se
apagaría en silencio.

## Los dos negativos son la tarea

El caso feliz es una línea. Lo que hay que probar es que **no rompe** dos reglas deliberadas:

1. Un `BUG` **no** pasa a `DONE` (`FDGE-R26`, `LEX-R08`, `SUITE-R06b`).
2. Un estado **ya terminal** no se toca (`FDGE-R53`: la tarea declara cómo termina).

## Y se dice

Como hace el peldaño del `BUG`. Un estado que cambia en silencio es el que luego nadie sabe quién
puso — y este es justo el que `G4` comprueba.

## Termina cuando

Un no-`BUG` llega a `DONE` por comando al cerrar Validación, un `BUG` sigue deteniéndose, un
estado terminal no se toca, y la batería falla sin el arreglo.
