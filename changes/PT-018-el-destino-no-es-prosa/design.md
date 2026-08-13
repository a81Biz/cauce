# PT-018 — Diseño   `PHASE 4` · `FDGE-R21`

## El defecto

`SUITE-R44` nació en `PT-013` con dos agujeros que yo mismo declaré en su self-review. Los dos
salen de lo mismo: **la columna «Dónde va» admitía prosa libre**, y con prosa libre la
comprobación tiene que adivinar dos cosas que no son adivinables.

```
1 · ¿esta fila aplaza trabajo?      → lista de palabras. Se me escapó «posteriores» en plural.
2 · ¿el sitio al que apunta sirve?  → PT-012 citaba a PT-013, que no iba a hacer ese trabajo.
```

El usuario lo dijo mejor que la self-review: *no es un problema de código, son temas de
redacción, y no puede ser que el sistema no pueda cuadrarlos*.

## Lo que no se hace

**No se mejora el detector.** Ampliar la lista de palabras es perseguir el idioma español: cada
sinónimo nuevo es un agujero nuevo, y el que falte no se ve hasta que algo ya se perdió.

## Lo que se hace: quitar la prosa

El destino deja de ser texto y pasa a ser **vocabulario cerrado** — dos formas, ninguna más:

| Escrito | Significa | Se comprueba |
|:---|:---|:---|
| `—` | esta fila no aplaza nada: queda fuera y punto | nada que comprobar |
| `PT-NNN` · `EP-NNN` | aplaza, y **ahí** vuelve | que el identificador exista y sirva |

Cualquier otra cosa —una frase, una celda vacía, «pendiente»— **falla**. No se interpreta.

Es exactamente lo que `PTSA-R77` ya exige de la matriz de auditoría, y que el marco no se
exigía a sí mismo: sin celda en blanco y sin campo libre donde deba haber un identificador.

## Y la cita tiene que ser recíproca

Que exista un identificador no basta: `PT-012` citaba a `PT-013` y `PT-013` no iba a hacer ese
trabajo. El destino tiene que **reconocer el origen**:

```
hermano del mismo epic          → vale en cualquier estado (el lote responde de sus filas)
el propio epic                  → SOLO si ya está CLOSED
                                  «lo hará este lote» es la promesa que falló
cualquier otro identificador    → debe ser DEFERRED y su `origin` mencionar este PT
```

La reciprocidad es lo que convierte una cita en una asignación. Sin ella, «dónde va» es una
esperanza escrita en la casilla de al lado.

## Lo que sigue sin ser comprobable, y se declara

Que el PT citado **cubra de verdad** lo aplazado. La reciprocidad prueba que alguien lo
reconoció como suyo; no prueba que lo haga bien. Eso lo lee una persona en `G3`, y así queda
dicho aquí (`RULE-06`).
