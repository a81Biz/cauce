# `PT-193` · self-review

## Lo que se sostiene

- **`AC` verificados: 2, ninguno huérfano.** `AC-01` con cuatro casos ejecutables; `AC-02` con
  `grep`, sin caso y con el motivo declarado (`FDGE-R15`, `SUITE-R26`).
- **Ninguna conducta cambia.** Los dos fixtures escriben bajo `$WORK/` **exactamente los mismos
  bytes**; lo único que cambia es cómo el fuente los construye. Ésa es la afirmación entera de esta
  tarea, y es lo que `AC-01` comprueba.
- **Precedente aplicado, no inventado.** `PT-015` resolvió esto mismo con la clave de ejemplo de
  AWS (`selftest.sh:821`) y dejó el porqué escrito en `:817`. Se usa su técnica y se le cita.
- **Convenciones** (`11-Conventions.md`): sin `debug`, sin restos.

## El cambio de especificación, y por qué no se disimuló

Ejecutar la comprobación de `AC-02` devolvió **1**, no `0`. El mismo valor estaba **dos** veces: la
segunda en el fixture de `FDGE-R45` (`:1369`), anterior a `PT-190`, con su huella firmada desde el
`2026-08-13`.

Eso dejaba mi propio intake diciendo dos cosas incompatibles: `AC-02` pedía que el fuente no
contuviera el literal, y §4 declaraba fuera de alcance «los demás fixtures». Con la segunda
aparición en pie, **`AC-02` era inalcanzable**.

**Se consideró acotar `AC-02` a `_sec190` y se descartó.** Habría sido estrechar el criterio hasta
el resultado ya obtenido — la forma exacta de conseguir que una comprobación no pueda fallar. El
criterio se escribió para que el fuente no lleve la contraseña, y llevarla en otra línea la lleva
igual.

`G2` ya estaba resuelta cuando esto apareció, así que el cambio va en `spec-changes.md` con su
razonamiento, y el intake queda **tachado y corregido, no reescrito**: lo que decía sigue legible.

## Y su segundo efecto, que también se declara

Partir el fixture de `FDGE-R45` mete su caso —`secreto en el intake ⇒ falla`— en el alcance.
`AC-01` pasa de tres casos a cuatro. **Tocar un fixture y no mirar su caso es la regresión que
`AC-01` existe para descartar**, así que se añade en vez de dejarlo fuera.

## Lo que NO se arregla, y consta

- **El commit `fb10d3de` es inmutable.** Su huella `397f02076a3e` queda firmada en
  `SECRETOS-EXCEPCIONES.md` y **seguirá apareciendo en cada revisión**: firmar no es silenciar.
  Esta tarea impide que vuelva a entrar; no borra lo que ya entró.
- **El alcance de la exención sigue igual.** Que `cauce:senuelos` exima el árbol y no el escaneo de
  historia es un defecto propio, con su riesgo propio —ampliar mal una exención de seguridad hace
  que un secreto **real** deje de bloquear— y es **`PT-194`** (`EP-026`). No se toca de paso al
  cerrar un lote.
- **Los demás valores.** La clave de ejemplo de AWS ya está partida desde `PT-015`; los `JWT`
  siguen como estaban, con sus huellas firmadas. No entran por este cambio.

## Sin credenciales en la evidencia   `FDGE-R45`

`grep.txt` **no cita el valor**: el patrón se ensambla en el comando, igual que en el fixture.
Citarlo habría devuelto el literal al repositorio y a la historia — repitiendo el defecto dentro de
su propio arreglo, que es un error que ya cometí una vez en esta sesión (`PT-191`, la ruta relativa
del recibo). `SECRETOS-EXCEPCIONES.md` se aplica esa misma regla a sí mismo: «se describen; no se
reproducen».

## Sin bloqueadores
